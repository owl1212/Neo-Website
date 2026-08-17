#!/usr/bin/env node
"use strict";

/**
 * One-time migration: move product assets from hand-typed JSON path
 * fields (hero_image, gallery, spec_sheet_pdf — plain strings like
 * "/images/fusion-a5-hero.png") onto native Directus File fields, so
 * every future product just gets a file uploaded through the Admin UI
 * instead of someone typing a path that has to match public/ exactly.
 *
 * This is additive, not destructive: it creates NEW fields
 * (hero_image_file, gallery_files, spec_sheet_pdf_file) and leaves the
 * old JSON fields untouched. Once you've verified the site works against
 * the new fields, delete the 3 old ones yourself via Settings > Data
 * Model (one click each) and, if you want the clean names back, rename
 * the new fields through the same UI.
 *
 * Prerequisite (must be done manually first — see neo-cms/scripts/README.md):
 *   Create a "Many Files (M2M)" field named gallery_files on products via
 *   Settings > Data Model > products > Create Field. Directus's raw
 *   relations API for M2M-files is fragile enough that scripting it isn't
 *   worth the risk of leaving your schema half-configured; the UI does it
 *   correctly in ~10 seconds.
 *
 * What this script does, in order:
 *   1. Creates hero_image_file / spec_sheet_pdf_file (single-file fields)
 *      if they don't already exist.
 *   2. Confirms gallery_files exists (exits with instructions if not).
 *   3. Grants the Public policy read access to directus_files (id, title,
 *      description, type, filename_download) — a separate permission
 *      from reading `products` itself. Without it, Directus can't expand
 *      a file relation for an unauthenticated request and silently
 *      collapses it to the bare file id, dropping the alt text. Skipped
 *      (existence-check only, no PATCH) if a read permission already
 *      exists for this collection — PATCH /permissions has turned out to
 *      be restricted from the API on this instance, so a permission set
 *      up by hand in the Admin UI is left alone rather than fought over.
 *   4. Same as step 3, for gallery_files' junction collection
 *      (auto-created by Directus when the M2M field was set up, e.g.
 *      products_files — discovered dynamically via /relations, not
 *      assumed). Without this, gallery_files comes back missing from the
 *      response entirely.
 *   5. Creates a "Products" folder in the Directus file library.
 *   6. For each product in ../../data/products.ts, uploads and links
 *      whichever of hero image / gallery / spec sheet PDF it's still
 *      missing — checked independently per field, not as one
 *      all-or-nothing "already migrated" flag. That matters in practice:
 *      gallery_files got rebuilt from scratch after an earlier bug (see
 *      rebuild-gallery-files-field.js), so a product can have
 *      hero_image_file set but zero gallery images linked, and this
 *      still needs to fill in just the gallery for it.
 *
 * Usage:
 *   DIRECTUS_ADMIN_EMAIL=you@example.com \
 *   DIRECTUS_ADMIN_PASSWORD=your-password \
 *   node scripts/migrate-product-files.js
 *
 * Optional env vars:
 *   DIRECTUS_URL (default http://localhost:8055)
 *
 * Requires Node 18+ (uses global fetch, FormData, Blob). No npm deps.
 * Safe to re-run: hero image / gallery / spec sheet are each checked and
 * uploaded independently, so a partially-migrated product only gets the
 * missing piece(s) filled in, not re-uploaded from scratch. Uploads are
 * deduped within a single run by local file path — but only within that
 * run; a file uploaded in an earlier run (e.g. a hero image) isn't in
 * this run's cache, so if that same local file also appears in the
 * gallery and hero was already linked (so gallery is uploaded on its
 * own this time), it'll upload as a second, separate Directus file
 * rather than reusing the earlier one. Harmless duplication, not a
 * correctness issue — worth a manual cleanup in the file library later
 * if it bothers you, not worth the complexity of fixing here.
 */

const fs = require("fs");
const path = require("path");

const DIRECTUS_URL = (process.env.DIRECTUS_URL || "http://localhost:8055").replace(/\/+$/, "");
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Missing DIRECTUS_ADMIN_EMAIL / DIRECTUS_ADMIN_PASSWORD env vars.");
  process.exit(1);
}

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const PUBLIC_DIR = path.join(__dirname, "..", "..", "public");

// ---------------------------------------------------------------------------
// Same TS-array loader as the other scripts in this folder.
// ---------------------------------------------------------------------------
function loadTsArrayExport(filePath, exportName) {
  // Strip a leading UTF-8 BOM first — Node's readFileSync("utf8") keeps it
  // as a literal U+FEFF character, which shifts "import" off the start of
  // the line and makes the regex below miss it entirely, leaving a real
  // `import` statement in the CommonJS eval below ("Cannot use import
  // statement outside a module"). Some Windows editors add this on save.
  const raw = fs.readFileSync(filePath, "utf8");
  const src = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const withoutImports = src.replace(/^import[^\n]*\n/gm, "");

  const typedExport = new RegExp(`export const ${exportName}\\s*:[^=]+=`);
  const bareExport = new RegExp(`export const ${exportName}\\s*=`);
  const pattern = typedExport.test(withoutImports) ? typedExport : bareExport;
  if (!pattern.test(withoutImports)) {
    throw new Error(`Could not find "export const ${exportName} = ..." in ${filePath}`);
  }

  const asCommonJs = withoutImports.replace(pattern, "module.exports =");
  const mod = { exports: {} };
  new Function("module", "exports", asCommonJs)(mod, mod.exports);
  return mod.exports;
}

// ---------------------------------------------------------------------------
// Directus REST helpers
// ---------------------------------------------------------------------------
let accessToken = null;

function withQuery(endpoint, params) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value === undefined) continue;
    qs.set(key, typeof value === "string" ? value : JSON.stringify(value));
  }
  const s = qs.toString();
  return s ? `${endpoint}?${s}` : endpoint;
}

async function rawRequest(method, endpoint, body) {
  const res = await fetch(`${DIRECTUS_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  return { status: res.status, ok: res.ok, json };
}

async function directus(method, endpoint, body) {
  const { ok, status, json } = await rawRequest(method, endpoint, body);
  if (!ok) {
    const message = json?.errors?.map((e) => e.message).join("; ") || `HTTP ${status}`;
    throw new Error(`${method} ${endpoint} -> ${status}: ${message}`);
  }
  return json;
}

async function login() {
  const { data } = await directus("POST", "/auth/login", {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  accessToken = data.access_token;
  console.log(`Authenticated as ${ADMIN_EMAIL}`);
}

async function fieldExists(collection, field) {
  const { status } = await rawRequest("GET", `/fields/${collection}/${field}`);
  return status === 200;
}

// ---------------------------------------------------------------------------
// Public read permission on directus_files — a *separate* grant from
// reading `products` itself. Without it, Directus can't expand a file
// relation into { id, title, description } for an unauthenticated
// request and silently collapses it to the bare foreign-key string
// instead — which is exactly what produced "assets/undefined" the first
// time this ran (lib/content.ts's mapper now tolerates that shape too,
// but the point of this field is the title/description alt text, which
// only comes through with this permission in place).
//
// Same Policy-discovery approach as setup-directus.js — see that file
// for why: Directus 10.10+ replaced role-based permissions with
// Policies, and there's no fixed id for the Public one.
// ---------------------------------------------------------------------------
async function findPublicPolicyId() {
  const { data } = await directus(
    "GET",
    withQuery("/access", {
      filter: { role: { _null: true }, user: { _null: true } },
      limit: 1,
      fields: "policy",
    })
  );
  const row = data[0];
  if (!row) {
    throw new Error(
      "Could not find a Public access policy (a directus_access row with role=null and user=null). " +
        "Every Directus instance ships with one by default — if it's been deleted, recreate it via " +
        "Settings > Access Policies > Public in the Admin UI first."
    );
  }
  return typeof row.policy === "object" ? row.policy.id : row.policy;
}

async function findPermission(policyId, collection, action) {
  const { data } = await directus(
    "GET",
    withQuery("/permissions", {
      filter: { policy: { _eq: policyId }, collection: { _eq: collection }, action: { _eq: action } },
      limit: 1,
    })
  );
  return data[0] || null;
}

async function ensurePublicFilesReadPermission(policyId) {
  // Existence-check only, same as ensureSingleFileField/ensureProductsFolder
  // below — doesn't attempt to reconcile an existing row's exact
  // fields/filter. PATCH /permissions has turned out to be restricted from
  // the API on this instance, so once a permission row exists (however it
  // got there — including set up by hand in the Admin UI), leave it alone.
  const existing = await findPermission(policyId, "directus_files", "read");
  if (existing) {
    console.log('  public read permission for "directus_files" already exists, skipping');
    return;
  }
  await directus("POST", "/permissions", {
    policy: policyId,
    collection: "directus_files",
    action: "read",
    permissions: {}, // no row filter — every uploaded file is meant to be publicly viewable anyway (that's what /assets/{id} already does unauthenticated)
    fields: ["id", "title", "description", "type", "filename_download"],
  });
  console.log('  created public read permission for "directus_files"');
}

// gallery_files (M2M) reads through a junction collection (e.g.
// products_files) that Directus auto-created when the field was set up
// in the Admin UI — that junction is itself a distinct collection with
// its own permissions, separate from both `products` and
// `directus_files`. Without read access to it, gallery_files comes back
// missing from the response entirely (not null, not [] — just absent),
// even though hero_image_file/spec_sheet_pdf_file work fine once
// directus_files is granted. Discovered dynamically via /relations
// rather than assumed to be "products_files", in case it was named
// differently when created.
async function findGalleryJunctionCollection() {
  // /relations is a Directus *system* endpoint, not a generic
  // /items/{collection} route — it doesn't go through the same
  // query-filtering pipeline. Confirmed the hard way: both a top-level
  // `filter[one_collection]` and a `filter[meta][one_collection]` shape
  // silently returned the exact same unfiltered list (data[0] landing on
  // "directus_revisions" both times) — the `filter` param just isn't
  // applied on this endpoint. Fetching everything and searching
  // client-side instead, where there's no ambiguity about what's
  // actually being matched.
  const { data } = await directus("GET", "/relations");
  const row = data.find(
    (r) => r.meta?.one_collection === "products" && r.meta?.one_field === "gallery_files"
  );
  if (!row) {
    throw new Error(
      "Could not find the junction collection for products.gallery_files via /relations. " +
        "Confirm the gallery_files M2M field was created correctly in Settings > Data Model."
    );
  }
  return row.collection;
}

async function ensurePublicJunctionReadPermission(policyId, collection) {
  // Same existence-check-only idempotency as ensurePublicFilesReadPermission
  // above — see that comment for why this doesn't PATCH an existing row.
  const existing = await findPermission(policyId, collection, "read");
  if (existing) {
    console.log(`  public read permission for "${collection}" already exists, skipping`);
    return;
  }
  await directus("POST", "/permissions", {
    policy: policyId,
    collection,
    action: "read",
    permissions: {},
    fields: ["*"],
  });
  console.log(`  created public read permission for "${collection}"`);
}

// ---------------------------------------------------------------------------
// Schema — single-file fields only. gallery_files (M2M) is created
// manually via the Admin UI; see the file header comment.
// ---------------------------------------------------------------------------
async function ensureSingleFileField(field, interfaceName) {
  if (await fieldExists("products", field)) {
    console.log(`  field "${field}" already exists, skipping creation`);
    return;
  }
  await directus("POST", "/fields/products", {
    field,
    type: "uuid",
    meta: { interface: interfaceName, special: ["file"] },
    schema: { is_nullable: true },
  });
  await directus("POST", "/relations", {
    collection: "products",
    field,
    related_collection: "directus_files",
    meta: {},
  });
  console.log(`  created file field "${field}"`);
  console.log(
    `  (if it doesn't render as a file picker in the Admin UI, open Settings > Data Model > ` +
      `products > ${field} and set its interface manually — the underlying relation will work either way)`
  );
}

// ---------------------------------------------------------------------------
// File uploads
// ---------------------------------------------------------------------------
const MIME_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".pdf": "application/pdf",
};

async function ensureProductsFolder() {
  const { data } = await directus(
    "GET",
    withQuery("/folders", { filter: { name: { _eq: "Products" } }, limit: 1 })
  );
  if (data[0]) return data[0].id;

  const created = await directus("POST", "/folders", { name: "Products" });
  return created.data.id;
}

// Keyed by absolute local path so the same file (e.g. reused as both a
// product's hero image and a gallery entry) is only uploaded once per run.
const uploadedByPath = new Map();

async function uploadFile(localPath, title, folderId) {
  if (uploadedByPath.has(localPath)) return uploadedByPath.get(localPath);

  if (!fs.existsSync(localPath)) {
    throw new Error(`local file not found: ${localPath}`);
  }

  const buffer = fs.readFileSync(localPath);
  const filename = path.basename(localPath);
  const ext = path.extname(filename).toLowerCase();
  const type = MIME_TYPES[ext] || "application/octet-stream";

  const form = new FormData();
  form.append("folder", folderId);
  form.append("title", title);
  form.append("file", new Blob([buffer], { type }), filename);

  const res = await fetch(`${DIRECTUS_URL}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) {
    const message = json?.errors?.map((e) => e.message).join("; ") || `HTTP ${res.status}`;
    throw new Error(`upload ${filename} -> ${message}`);
  }

  const fileId = json.data.id;
  uploadedByPath.set(localPath, fileId);
  console.log(`    uploaded ${filename} -> ${fileId}`);
  return fileId;
}

function localPathFor(publicSrc) {
  // publicSrc is e.g. "/images/fusion-a5-hero.png" — strip the leading
  // slash and resolve against public/.
  return path.join(PUBLIC_DIR, publicSrc.replace(/^\/+/, ""));
}

// ---------------------------------------------------------------------------
// Per-product migration
// ---------------------------------------------------------------------------
async function findProductBySlug(slug) {
  const { data } = await directus(
    "GET",
    withQuery("/items/products", {
      filter: { slug: { _eq: slug } },
      limit: 1,
      // gallery_files.id (not bare gallery_files) so an empty M2M comes
      // back as [] we can .length-check, rather than being omitted.
      fields: "id,slug,name,hero_image_file,gallery_files.id,spec_sheet_pdf_file",
    })
  );
  return data[0] || null;
}

async function migrateProduct(p, folderId) {
  const existing = await findProductBySlug(p.slug);
  if (!existing) {
    console.log(`  ${p.slug}: not found in Directus, skipping`);
    return;
  }

  // Checked per-field, not as one all-or-nothing "already migrated" flag —
  // gallery_files was rebuilt from scratch after the self-relation bug, so
  // a product can easily have hero_image_file set but zero gallery links.
  const needsHero = !existing.hero_image_file;
  const needsGallery = !existing.gallery_files || existing.gallery_files.length === 0;
  const needsSpecSheet = !existing.spec_sheet_pdf_file && !!p.specSheetPdf?.src;

  if (!needsHero && !needsGallery && !needsSpecSheet) {
    console.log(`  ${p.slug}: already fully migrated, skipping`);
    return;
  }

  console.log(`  ${p.slug}:`);
  const patch = {};

  if (needsHero) {
    patch.hero_image_file = await uploadFile(localPathFor(p.heroImage.src), p.heroImage.alt || p.name, folderId);
  } else {
    console.log("    hero image already linked, skipping");
  }

  if (needsGallery) {
    const galleryFileIds = [];
    for (const img of p.gallery ?? []) {
      galleryFileIds.push(await uploadFile(localPathFor(img.src), img.alt || p.name, folderId));
    }
    patch.gallery_files = galleryFileIds.map((id) => ({ directus_files_id: id }));
  } else {
    console.log("    gallery already linked, skipping");
  }

  if (needsSpecSheet) {
    patch.spec_sheet_pdf_file = await uploadFile(
      localPathFor(p.specSheetPdf.src),
      `${p.name} Spec Sheet`,
      folderId
    );
  } else if (existing.spec_sheet_pdf_file) {
    console.log("    spec sheet already linked, skipping");
  }

  await directus("PATCH", `/items/products/${existing.id}`, patch);
  const linked = [];
  if (patch.hero_image_file) linked.push("hero image");
  if (patch.gallery_files) linked.push(`${patch.gallery_files.length} gallery image(s)`);
  if (patch.spec_sheet_pdf_file) linked.push("spec sheet");
  console.log(`    linked: ${linked.join(", ")}`);
}

// ---------------------------------------------------------------------------
async function main() {
  await login();

  console.log("\n--- Ensuring single-file fields ---");
  await ensureSingleFileField("hero_image_file", "file-image");
  await ensureSingleFileField("spec_sheet_pdf_file", "file");

  console.log("\n--- Checking gallery_files ---");
  if (!(await fieldExists("products", "gallery_files"))) {
    console.error(
      '\ngallery_files field not found. Create it manually first: Settings > Data Model > ' +
        'products > Create Field > "Many Files (M2M)", field key "gallery_files". ' +
        "See neo-cms/scripts/README.md. Then re-run this script."
    );
    process.exit(1);
  }
  console.log("  gallery_files exists, continuing");

  console.log("\n--- Granting public read on directus_files ---");
  const publicPolicyId = await findPublicPolicyId();
  console.log(`  found Public policy: ${publicPolicyId}`);
  await ensurePublicFilesReadPermission(publicPolicyId);

  console.log("\n--- Granting public read on the gallery_files junction ---");
  const junctionCollection = await findGalleryJunctionCollection();
  console.log(`  junction collection: ${junctionCollection}`);
  await ensurePublicJunctionReadPermission(publicPolicyId, junctionCollection);

  console.log("\n--- Ensuring Products folder ---");
  const folderId = await ensureProductsFolder();
  console.log(`  folder id: ${folderId}`);

  console.log("\n--- Migrating products ---");
  const products = loadTsArrayExport(path.join(DATA_DIR, "products.ts"), "products");
  for (const p of products) {
    await migrateProduct(p, folderId);
  }

  console.log("\nDone. lib/content.ts needs to be pointed at the new fields separately.");
}

main().catch((err) => {
  console.error("\nMigration failed:", err.message);
  process.exit(1);
});
