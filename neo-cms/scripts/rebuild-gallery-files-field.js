#!/usr/bin/env node
"use strict";

/**
 * Fixes gallery_files, which diagnose-gallery-relations.js confirmed was
 * created with Directus's generic "Many to Many" preset instead of the
 * dedicated "Many Files (M2M)" one: its junction (`products_products`)
 * relates products to itself (products_id -> products, related_
 * products_id -> products, meta.special was ["m2m"] not ["files"]), not
 * to directus_files at all. That's why saving gallery images produced
 * `select id from products ... invalid input syntax for type integer:
 * "<file-uuid>"` — Directus was looking up a product by a file's id.
 *
 * This deletes the broken field + junction entirely and recreates
 * gallery_files as a genuine Many Files (M2M) field: a fresh junction
 * (`products_files`) with real FKs to products (integer) and
 * directus_files (uuid), wired up the same way Directus's own preset
 * does it (type: alias, special: ["files"], interface: "files"). Uses
 * the same POST /relations payload shape already confirmed working on
 * this instance for hero_image_file/spec_sheet_pdf_file.
 *
 * Ends by re-querying /relations on the new junction and asserting
 * directus_files_id actually points at directus_files — the same check
 * that caught the original bug, now run automatically instead of by eye.
 *
 * No data at risk: every save against the broken field failed inside a
 * transaction, so products_products never held a real row.
 *
 * After this succeeds, re-run migrate-product-files.js — its junction-
 * permission step discovers the junction collection dynamically via
 * /relations (not hardcoded), so it'll find "products_files" on its own
 * and grant it Public read access, then re-upload/link gallery images
 * for every product (it's idempotent, so this is safe to do even for
 * products whose hero image is already migrated).
 *
 * Usage:
 *   DIRECTUS_ADMIN_EMAIL=you@example.com \
 *   DIRECTUS_ADMIN_PASSWORD=your-password \
 *   node scripts/rebuild-gallery-files-field.js
 *
 * Safe to re-run — every step checks current state before acting.
 */

const DIRECTUS_URL = (process.env.DIRECTUS_URL || "http://localhost:8055").replace(/\/+$/, "");
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Missing DIRECTUS_ADMIN_EMAIL / DIRECTUS_ADMIN_PASSWORD env vars.");
  process.exit(1);
}

const OLD_JUNCTION = "products_products";
const NEW_JUNCTION = "products_files";

let accessToken = null;

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

async function collectionExists(name) {
  const { status } = await rawRequest("GET", `/collections/${name}`);
  return status === 200;
}

async function fieldExists(collection, field) {
  const { status } = await rawRequest("GET", `/fields/${collection}/${field}`);
  return status === 200;
}

// ---------------------------------------------------------------------------
async function deleteBrokenSetup() {
  console.log("\n--- Removing the broken gallery_files setup ---");

  if (await fieldExists("products", "gallery_files")) {
    await directus("DELETE", "/fields/products/gallery_files");
    console.log('  deleted field "products.gallery_files"');
  } else {
    console.log('  "products.gallery_files" already gone, skipping');
  }

  if (await collectionExists(OLD_JUNCTION)) {
    await directus("DELETE", `/collections/${OLD_JUNCTION}`);
    console.log(`  deleted collection "${OLD_JUNCTION}"`);
  } else {
    console.log(`  "${OLD_JUNCTION}" already gone, skipping`);
  }
}

// ---------------------------------------------------------------------------
async function createJunctionCollection() {
  if (await collectionExists(NEW_JUNCTION)) {
    console.log(`  collection "${NEW_JUNCTION}" already exists, skipping creation`);
    return;
  }
  await directus("POST", "/collections", {
    collection: NEW_JUNCTION,
    meta: { hidden: true, icon: "import_export" },
    schema: { name: NEW_JUNCTION },
    fields: [
      {
        field: "id",
        type: "integer",
        meta: { hidden: true, interface: "input", readonly: true },
        schema: { is_primary_key: true, has_auto_increment: true },
      },
      // integer, matching products.id's type
      { field: "products_id", type: "integer", meta: { hidden: true }, schema: {} },
      // uuid, matching directus_files.id's type
      { field: "directus_files_id", type: "uuid", meta: { hidden: true }, schema: {} },
      { field: "sort", type: "integer", meta: { hidden: true }, schema: {} },
    ],
  });
  console.log(`  created collection "${NEW_JUNCTION}"`);
}

async function createRelations() {
  const { status } = await rawRequest("GET", `/relations/${NEW_JUNCTION}/products_id`);
  if (status === 200) {
    console.log(`  relation ${NEW_JUNCTION}.products_id already exists, skipping`);
  } else {
    await directus("POST", "/relations", {
      collection: NEW_JUNCTION,
      field: "products_id",
      related_collection: "products",
      meta: { one_field: "gallery_files", junction_field: "directus_files_id", sort_field: "sort" },
    });
    console.log(`  created relation ${NEW_JUNCTION}.products_id -> products (one_field: gallery_files)`);
  }

  const { status: filesStatus } = await rawRequest("GET", `/relations/${NEW_JUNCTION}/directus_files_id`);
  if (filesStatus === 200) {
    console.log(`  relation ${NEW_JUNCTION}.directus_files_id already exists, skipping`);
  } else {
    await directus("POST", "/relations", {
      collection: NEW_JUNCTION,
      field: "directus_files_id",
      related_collection: "directus_files",
      meta: { junction_field: "products_id" },
    });
    console.log(`  created relation ${NEW_JUNCTION}.directus_files_id -> directus_files`);
  }
}

async function createGalleryFilesField() {
  if (await fieldExists("products", "gallery_files")) {
    console.log('  field "products.gallery_files" already exists, skipping creation');
    return;
  }
  await directus("POST", "/fields/products", {
    field: "gallery_files",
    type: "alias",
    meta: { interface: "files", special: ["files"] },
    schema: null,
  });
  console.log('  created field "products.gallery_files" (type alias, interface files, special: ["files"])');
}

// ---------------------------------------------------------------------------
async function verify() {
  console.log("\n--- Verifying ---");
  // /relations is a system endpoint and doesn't apply the `filter` query
  // param (confirmed the hard way elsewhere — see diagnose-gallery-
  // relations.js/migrate-product-files.js) — fetch everything and filter
  // client-side by both collection and field, not field name alone.
  const { data } = await directus("GET", "/relations");

  const filesRelation = data.find((r) => r.collection === NEW_JUNCTION && r.field === "directus_files_id");
  const productsRelation = data.find((r) => r.collection === NEW_JUNCTION && r.field === "products_id");

  const filesOk = filesRelation?.related_collection === "directus_files";
  const productsOk =
    productsRelation?.related_collection === "products" && productsRelation?.meta?.one_field === "gallery_files";

  console.log(
    `  ${NEW_JUNCTION}.directus_files_id -> related_collection: "${filesRelation?.related_collection}" ` +
      (filesOk ? "OK" : "WRONG")
  );
  console.log(
    `  ${NEW_JUNCTION}.products_id -> related_collection: "${productsRelation?.related_collection}", ` +
      `one_field: "${productsRelation?.meta?.one_field}" ` +
      (productsOk ? "OK" : "WRONG")
  );

  if (!filesOk || !productsOk) {
    throw new Error(
      "Verification failed — relation config still isn't right. Don't use this field yet; paste this output back."
    );
  }
  console.log("\n  Verified: gallery_files correctly relates products to directus_files.");
}

// ---------------------------------------------------------------------------
async function main() {
  await login();

  await deleteBrokenSetup();

  console.log("\n--- Recreating gallery_files as a genuine Many Files (M2M) field ---");
  await createJunctionCollection();
  await createRelations();
  await createGalleryFilesField();

  await verify();

  console.log(
    "\nDone. Next: re-run migrate-product-files.js — it discovers the junction " +
      "collection dynamically (not hardcoded), so it'll find " +
      `"${NEW_JUNCTION}", grant it Public read access, and upload/link ` +
      "gallery images for every product."
  );
}

main().catch((err) => {
  console.error("\nFailed:", err.message);
  process.exit(1);
});
