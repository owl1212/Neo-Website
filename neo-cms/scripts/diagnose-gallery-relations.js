#!/usr/bin/env node
"use strict";

/**
 * Read-only diagnostic for the "invalid input syntax for type integer"
 * error when saving a product with gallery_files attached — the query
 * (`select id from products where id = $1 ... invalid input syntax for
 * type integer: "<file-uuid>"`) means something is looking up a row in
 * `products` using a directus_files UUID, which points at the junction
 * collection's relations being misconfigured (most likely: the
 * directus_files_id column's relation target got set to `products`
 * instead of `directus_files`, or the one_field/junction_field meta on
 * the products-side relation is swapped).
 *
 * This makes zero changes — it just dumps the actual relation config so
 * the fix can be a precise PATCH instead of a guess. Raw relation state
 * is exactly the kind of thing worth seeing before touching it: a wrong
 * PATCH here risks breaking hero_image_file/spec_sheet_pdf_file, which
 * are currently working fine.
 *
 * Usage:
 *   DIRECTUS_ADMIN_EMAIL=you@example.com \
 *   DIRECTUS_ADMIN_PASSWORD=your-password \
 *   node scripts/diagnose-gallery-relations.js
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
  console.log(`Authenticated as ${ADMIN_EMAIL}\n`);
}

function dump(label, value) {
  console.log(`--- ${label} ---`);
  console.log(JSON.stringify(value, null, 2));
  console.log("");
}

async function main() {
  await login();

  // 1. How products.gallery_files (the alias field) is wired up.
  const galleryField = await directus("GET", "/fields/products/gallery_files");
  dump("GET /fields/products/gallery_files", galleryField.data);

  // 2. The relation where the junction points back at products (this is
  //    where one_field/junction_field/sort_field live). /relations is a
  //    system endpoint, not a generic /items/{collection} route — it
  //    doesn't apply the `filter` query param at all (confirmed: neither
  //    a top-level nor a meta-nested filter shape actually filtered
  //    anything, both silently returned the full unfiltered list).
  //    Fetching everything and searching client-side instead.
  const allRelations = await directus("GET", "/relations");
  dump("GET /relations (full list, filtered client-side below)", allRelations.data);

  const productsRelation = allRelations.data.find(
    (r) => r.meta?.one_collection === "products" && r.meta?.one_field === "gallery_files"
  );
  dump("Matched relation (meta.one_collection=products, meta.one_field=gallery_files)", productsRelation);

  const junctionCollection = productsRelation?.collection;
  if (!junctionCollection) {
    console.log("Could not determine the junction collection from the relation above — stopping here.");
    return;
  }
  console.log(`Junction collection: "${junctionCollection}"\n`);

  // 3. Every relation where the junction is the "collection" side — there
  //    should be exactly two: one FK to products, one FK to directus_files.
  //    Same client-side filter as above — /relations doesn't apply the
  //    `filter` query param, so this reuses the already-fetched full list
  //    instead of sending another (equally ineffective) filtered request.
  const junctionRelations = allRelations.data.filter((r) => r.collection === junctionCollection);
  dump(`Relations where collection = "${junctionCollection}" (filtered client-side)`, junctionRelations);

  // 4. The junction's actual columns — types matter here (products_id
  //    should be integer, matching products.id; the files FK should be uuid).
  const junctionFields = await directus("GET", `/fields/${junctionCollection}`);
  dump(
    `GET /fields/${junctionCollection}`,
    junctionFields.data?.map((f) => ({ field: f.field, type: f.type, schema_type: f.schema?.data_type }))
  );

  console.log("Paste all of the above back — that's enough to write an exact fix.");
}

main().catch((err) => {
  console.error("\nDiagnostic failed:", err.message);
  process.exit(1);
});
