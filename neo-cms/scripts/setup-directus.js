#!/usr/bin/env node
"use strict";

/**
 * One-time setup script for the neo-cms Directus instance.
 *
 * - Creates the products / resellers / news_posts collections (if missing)
 * - Imports the existing data/*.ts content into them
 * - Grants the Public policy read access, filtered to the same
 *   status/state used by lib/content.ts today (published / active)
 *
 * Usage:
 *   DIRECTUS_ADMIN_EMAIL=admin@neo.local \
 *   DIRECTUS_ADMIN_PASSWORD=Neo2026!Admin#Zm \
 *   node scripts/setup-directus.js
 *
 * Optional env vars:
 *   DIRECTUS_URL (default http://localhost:8055)
 *
 * Requires Node 18+ (uses global fetch). No npm dependencies.
 * Safe to re-run: collections, items, and permissions are all upserted.
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

// ---------------------------------------------------------------------------
// Loads one of the existing data/*.ts files as a plain JS value.
//
// These files are `import type {...} from "..."; export const NAME: T[] = [...]`
// — the array/object literals themselves are plain JS, only the import and
// the variable's type annotation are TS-only syntax. Stripping those two
// lines and evaluating the rest as CommonJS avoids pulling in a TS
// compiler for a one-time script.
// ---------------------------------------------------------------------------
function loadTsArrayExport(filePath, exportName) {
  const src = fs.readFileSync(filePath, "utf8");
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

async function collectionExists(name) {
  const { status } = await rawRequest("GET", `/collections/${name}`);
  return status === 200;
}

// ---------------------------------------------------------------------------
// Field builders
// ---------------------------------------------------------------------------
function autoIdField() {
  return {
    field: "id",
    type: "integer",
    meta: { hidden: true, interface: "input", readonly: true },
    schema: { is_primary_key: true, has_auto_increment: true },
  };
}

function stringIdField() {
  return {
    field: "id",
    type: "string",
    meta: { interface: "input", required: true, note: "Stable external id, e.g. r001" },
    schema: { is_primary_key: true, has_auto_increment: false, max_length: 64 },
  };
}

function stringField(field, { required = false, unique = false } = {}) {
  return {
    field,
    type: "string",
    meta: { interface: "input", required },
    schema: { is_nullable: !required, is_unique: unique },
  };
}

function textField(field, { required = false } = {}) {
  return {
    field,
    type: "text",
    meta: { interface: "input-multiline", required },
    schema: { is_nullable: !required },
  };
}

function jsonField(field, { nullable = true } = {}) {
  return {
    field,
    type: "json",
    meta: { interface: "input-code", options: { language: "json" }, required: !nullable },
    schema: { is_nullable: nullable },
  };
}

function floatField(field, { nullable = true } = {}) {
  return {
    field,
    type: "float",
    meta: { interface: "input", required: !nullable },
    schema: { is_nullable: nullable },
  };
}

function dateField(field, { required = false } = {}) {
  return {
    field,
    type: "date",
    meta: { interface: "datetime", required },
    schema: { is_nullable: !required },
  };
}

function statusField(defaultValue, choices) {
  return {
    field: "status",
    type: "string",
    meta: {
      interface: "select-dropdown",
      options: { choices: choices.map((value) => ({ text: value, value })) },
      required: true,
    },
    schema: { is_nullable: false, default_value: defaultValue },
  };
}

// ---------------------------------------------------------------------------
// Collection definitions — matches lib/types.ts
// ---------------------------------------------------------------------------
const COLLECTIONS = [
  {
    name: "products",
    meta: { icon: "devices" },
    fields: [
      autoIdField(),
      stringField("slug", { required: true, unique: true }),
      stringField("name", { required: true }),
      textField("tagline"),
      stringField("range"),
      jsonField("hero_image", { nullable: false }),
      jsonField("gallery", { nullable: false }),
      jsonField("spec_groups", { nullable: false }),
      jsonField("spec_sheet_pdf", { nullable: true }),
      statusField("draft", ["draft", "published"]),
    ],
  },
  {
    name: "resellers",
    meta: { icon: "storefront" },
    fields: [
      stringIdField(),
      stringField("name", { required: true }),
      stringField("province", { required: true }),
      stringField("town", { required: true }),
      textField("address"),
      stringField("phone"),
      floatField("lat"),
      floatField("lng"),
      statusField("pending", ["pending", "active"]),
    ],
  },
  {
    name: "news_posts",
    meta: { icon: "article" },
    fields: [
      autoIdField(),
      stringField("slug", { required: true, unique: true }),
      stringField("title", { required: true }),
      dateField("date", { required: true }),
      stringField("category"),
      textField("excerpt"),
      jsonField("cover", { nullable: true }),
      textField("body", { required: true }),
      statusField("draft", ["draft", "published"]),
    ],
  },
];

async function ensureCollection(def) {
  if (await collectionExists(def.name)) {
    console.log(`  collection "${def.name}" already exists, skipping creation`);
    return;
  }
  await directus("POST", "/collections", {
    collection: def.name,
    meta: def.meta,
    schema: { name: def.name },
    fields: def.fields,
  });
  console.log(`  created collection "${def.name}"`);
}

// ---------------------------------------------------------------------------
// Data import (upsert by key so the script is safe to re-run)
// ---------------------------------------------------------------------------
async function upsertItem(collection, keyField, keyValue, data) {
  const fieldsParam = keyField === "id" ? "id" : `id,${keyField}`;
  const { data: existing } = await directus(
    "GET",
    withQuery(`/items/${collection}`, {
      filter: { [keyField]: { _eq: keyValue } },
      limit: 1,
      fields: fieldsParam,
    })
  );

  if (existing.length > 0) {
    const pk = existing[0].id;
    const { id, ...patchData } = data; // never attempt to rewrite the primary key
    await directus("PATCH", `/items/${collection}/${pk}`, patchData);
    return "updated";
  }

  await directus("POST", `/items/${collection}`, data);
  return "created";
}

async function importProducts() {
  const products = loadTsArrayExport(path.join(DATA_DIR, "products.ts"), "products");
  for (const p of products) {
    const payload = {
      slug: p.slug,
      name: p.name,
      tagline: p.tagline ?? null,
      range: p.range ?? null,
      hero_image: p.heroImage ?? null,
      gallery: p.gallery ?? [],
      spec_groups: p.specGroups ?? [],
      spec_sheet_pdf: p.specSheetPdf ?? null,
      status: p.status,
    };
    const result = await upsertItem("products", "slug", p.slug, payload);
    console.log(`  products: ${p.slug} -> ${result}`);
  }
}

async function importResellers() {
  const resellers = loadTsArrayExport(path.join(DATA_DIR, "resellers.ts"), "resellers");
  for (const r of resellers) {
    const payload = {
      id: r.id,
      name: r.name,
      province: r.province,
      town: r.town,
      address: r.address ?? null,
      phone: r.phone ?? null,
      lat: r.lat ?? null,
      lng: r.lng ?? null,
      status: r.status,
    };
    const result = await upsertItem("resellers", "id", r.id, payload);
    console.log(`  resellers: ${r.id} -> ${result}`);
  }
}

async function importNews() {
  const newsPosts = loadTsArrayExport(path.join(DATA_DIR, "news.ts"), "newsPosts");
  for (const n of newsPosts) {
    const payload = {
      slug: n.slug,
      title: n.title,
      date: n.date,
      category: n.category,
      excerpt: n.excerpt ?? null,
      cover: n.cover ?? null,
      body: n.body,
      status: n.status,
    };
    const result = await upsertItem("news_posts", "slug", n.slug, payload);
    console.log(`  news_posts: ${n.slug} -> ${result}`);
  }
}

// ---------------------------------------------------------------------------
// Public read permissions — mirrors the status filters in lib/content.ts
//
// Directus 10.10+ (confirmed here against a live v12.2.0 instance) replaced
// role-based permissions with Policies: directus_permissions now has a
// `policy` column instead of `role`, and a `directus_access` junction table
// links policies to roles/users. Unauthenticated ("Public") access is
// whichever policy is linked via an access row where both `role` and `user`
// are null — there's no fixed/reserved id for it, a fresh instance gets its
// own randomly-generated policy id, so it has to be discovered at runtime
// rather than hardcoded.
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
  // `policy` comes back as a bare id, unless the caller also asked for
  // nested fields on it (we only asked for "policy"), in which case handle
  // both shapes defensively.
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

async function ensurePublicReadPermission(policyId, collection, statusField, statusValue) {
  const body = {
    policy: policyId,
    collection,
    action: "read",
    permissions: { [statusField]: { _eq: statusValue } },
    fields: ["*"],
  };

  const existing = await findPermission(policyId, collection, "read");
  if (existing) {
    await directus("PATCH", `/permissions/${existing.id}`, body);
    console.log(`  updated public read permission for "${collection}" (${statusField} = ${statusValue})`);
  } else {
    await directus("POST", "/permissions", body);
    console.log(`  created public read permission for "${collection}" (${statusField} = ${statusValue})`);
  }
}

// ---------------------------------------------------------------------------
async function main() {
  await login();

  console.log("\n--- Ensuring collections ---");
  for (const def of COLLECTIONS) await ensureCollection(def);

  console.log("\n--- Importing data ---");
  await importProducts();
  await importResellers();
  await importNews();

  console.log("\n--- Setting public read permissions ---");
  const publicPolicyId = await findPublicPolicyId();
  console.log(`  found Public policy: ${publicPolicyId}`);
  await ensurePublicReadPermission(publicPolicyId, "products", "status", "published");
  await ensurePublicReadPermission(publicPolicyId, "resellers", "status", "active");
  await ensurePublicReadPermission(publicPolicyId, "news_posts", "status", "published");

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("\nSetup failed:", err.message);
  process.exit(1);
});
