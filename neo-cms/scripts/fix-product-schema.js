#!/usr/bin/env node
"use strict";

/**
 * One-time post-migration schema cleanup for the products collection.
 *
 * 1. hero_image, gallery, and spec_sheet_pdf were defined as required
 *    fields back when they were the only way to set a product's
 *    images/PDF. Now that migrate-product-files.js moved that job onto
 *    hero_image_file/gallery_files/spec_sheet_pdf_file, the old fields
 *    are unused dead weight — but Directus still enforces "required" on
 *    them, which blocks saving any *new* product, since nothing fills
 *    them in anymore. This makes exactly those three fields optional.
 *
 *    spec_groups is deliberately left alone — it's still the live,
 *    unmigrated source for product specs (lib/content.ts reads it
 *    directly), not a leftover like the other three. Keep filling it in
 *    manually for each new product for now.
 *
 * 2. gallery_files was created using Directus's generic "Many to Many"
 *    field preset (interface: "list-m2m") instead of the dedicated
 *    "Many Files (M2M)" preset (interface: "files"). The generic one is
 *    built for relating to arbitrary collections, so its "Create New"
 *    button opens a blank item-creation form instead of an upload/
 *    select-from-library dialog — confirmed directly against this
 *    field's live metadata (GET /fields/products/gallery_files returned
 *    "interface": "list-m2m"). This switches it to "files", which is
 *    what the M2M relation to directus_files actually needs. Doesn't
 *    touch the relation or any data — purely which widget the Admin UI
 *    renders for this field.
 *
 * Usage:
 *   DIRECTUS_ADMIN_EMAIL=you@example.com \
 *   DIRECTUS_ADMIN_PASSWORD=your-password \
 *   node scripts/fix-product-schema.js
 *
 * Optional env vars:
 *   DIRECTUS_URL (default http://localhost:8055)
 *
 * Requires Node 18+ (uses global fetch). No npm dependencies.
 * Safe to re-run — checks current state before patching anything.
 */

const DIRECTUS_URL = (process.env.DIRECTUS_URL || "http://localhost:8055").replace(/\/+$/, "");
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Missing DIRECTUS_ADMIN_EMAIL / DIRECTUS_ADMIN_PASSWORD env vars.");
  process.exit(1);
}

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

// ---------------------------------------------------------------------------
const LEGACY_FIELDS = ["hero_image", "gallery", "spec_sheet_pdf"];

async function makeFieldOptional(field) {
  const { status, json } = await rawRequest("GET", `/fields/products/${field}`);
  if (status !== 200) {
    console.log(`  "${field}": not found, skipping`);
    return;
  }
  const current = json.data;
  if (current.meta?.required === false) {
    console.log(`  "${field}": already optional, skipping`);
    return;
  }
  await directus("PATCH", `/fields/products/${field}`, {
    meta: { required: false },
    schema: { is_nullable: true },
  });
  console.log(`  "${field}": made optional`);
}

// ---------------------------------------------------------------------------
async function fixGalleryFilesInterface() {
  const { status, json } = await rawRequest("GET", "/fields/products/gallery_files");
  if (status !== 200) {
    console.log('  "gallery_files": field not found, skipping');
    return;
  }
  const current = json.data;
  if (current.meta?.interface === "files") {
    console.log('  "gallery_files": interface already "files", skipping');
    return;
  }
  console.log(`  "gallery_files": interface is currently "${current.meta?.interface}" — switching to "files"`);
  await directus("PATCH", "/fields/products/gallery_files", {
    meta: { interface: "files" },
  });
  console.log('  "gallery_files": interface set to "files"');
}

// ---------------------------------------------------------------------------
async function main() {
  await login();

  console.log("\n--- Making legacy JSON fields optional ---");
  for (const field of LEGACY_FIELDS) {
    await makeFieldOptional(field);
  }
  console.log(
    "\n  (spec_groups deliberately left alone — still the live, unmigrated " +
      "source for product specs, not a leftover. Keep filling it in manually.)"
  );

  console.log("\n--- Fixing gallery_files interface ---");
  await fixGalleryFilesInterface();

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("\nFailed:", err.message);
  process.exit(1);
});
