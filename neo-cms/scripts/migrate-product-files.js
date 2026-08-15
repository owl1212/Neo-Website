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
 *      collapses it to the bare file id, dropping the alt text.
 *   4. Grants the Public policy read access to gallery_files' junction
 *      collection (auto-created by Directus when the M2M field was set
 *      up, e.g. products_files — discovered dynamically via /relations,
 *      not assumed). Yet another separate permission; without it
 *      gallery_files comes back missing from the response entirely.
 *   5. Creates a "Products" folder in the Directus file library.
 *   6. For each product in ../../data/products.ts, uploads its hero
 *      image, gallery images, and spec sheet PDF from public/ to
 *      Directus, then links the resulting file(s) to that product's new
 *      fields.
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
 * Safe to re-run: a product already carrying a hero_image_file is
 * assumed already migrated and is skipped entirely. Uploads are deduped
 * within a single run by local file path, so a file used as both a
 * product's hero image and a gallery entry is only uploaded once.
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
  const body = {
    policy: policyId,
    collection: "directus_files",
    action: "read",
    permissions: {}, // no row filter — every uploaded file is meant to be publicly viewable anyway (that's what /assets/{id} already does unauthenticated)
    fields: ["id", "title", "description", "type", "filename_download"],
  };

  const existing = await findPermission(policyId, "directus_files", "read");
  if (existing) {
    await directus("PATCH", `/permissions/${existing.id}`, body);
    console.log('  updated public read permission for "directus_files"');
  } else {
    await directus("POST", "/permissions", body);
    console.log('  created public read permission for "directus_files"');
  }
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
  const { data } = await directus(
    "GET",
    withQuery("/relations", {
      filter: { one_collection: { _eq: "products" }, one_field: { _eq: "gallery_files" } },
      limit: 1,
    })
  );
  const row = data[0];
  if (!row) {
    throw new Error(
      "Could not find the junction collection for products.gallery_files via /relations. " +
        "Confirm the gallery_files M2M field was created correctly in Settings > Data Model."
    );
  }
  return row.collection;
}

async function ensurePublicJunctionReadPermission(policyId, collection) {
  const body = {
    policy: policyId,
    collection,
    action: "read",
    permissions: {},
    fields: ["*"],
  };

  const existing = await findPermission(policyId, collection, "read");
  if (existing) {
    await directus("PATCH", `/permissions/${existing.id}`, body);
    console.log(`  updated public read permission for "${collection}"`);
  } else {
    await directus("POST", "/permissions", body);
    console.log(`  created public read permission for "${collection}"`);
  }
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
      fields: "id,slug,name,hero_image_file",
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
  if (existing.hero_image_file) {
    console.log(`  ${p.slug}: already migrated, skipping`);
    return;
  }

  console.log(`  ${p.slug}:`);

  const heroFileId = await uploadFile(
    localPathFor(p.heroImage.src),
    p.heroImage.alt || p.name,
    folderId
  );

  const galleryFileIds = [];
  for (const img of p.gallery ?? []) {
    const id = await uploadFile(localPathFor(img.src), img.alt || p.name, folderId);
    galleryFileIds.push(id);
  }

  let specSheetFileId = null;
  if (p.specSheetPdf?.src) {
    specSheetFileId = await uploadFile(
      localPathFor(p.specSheetPdf.src),
      `${p.name} Spec Sheet`,
      folderId
    );
  }

  await directus("PATCH", `/items/products/${existing.id}`, {
    hero_image_file: heroFileId,
    gallery_files: galleryFileIds.map((id) => ({ directus_files_id: id })),
    ...(specSheetFileId ? { spec_sheet_pdf_file: specSheetFileId } : {}),
  });
  console.log(`    linked to product (hero + ${galleryFileIds.length} gallery image(s)${specSheetFileId ? " + spec sheet" : ""})`);
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
