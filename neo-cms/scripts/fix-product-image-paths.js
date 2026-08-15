#!/usr/bin/env node
"use strict";

/**
 * One-time fix for the neo-cms Directus instance.
 *
 * The v1.0 UI redesign renamed every product image from .jpg to .png
 * (see public/images/), but Directus still holds whatever hero_image /
 * gallery paths were in data/products.ts at the time setup-directus.js
 * was first run — the old .jpg paths. This re-syncs just those two
 * fields, per product (matched by slug), from the current
 * ../../data/products.ts, which already has the correct .png paths.
 *
 * Deliberately narrow: only PATCHes hero_image/gallery. Doesn't touch
 * name/tagline/specGroups/status/etc, in case those have since been
 * hand-edited in the Directus admin UI.
 *
 * Usage:
 *   DIRECTUS_ADMIN_EMAIL=you@example.com \
 *   DIRECTUS_ADMIN_PASSWORD=your-password \
 *   node scripts/fix-product-image-paths.js
 *
 * Optional env vars:
 *   DIRECTUS_URL (default http://localhost:8055)
 *
 * Requires Node 18+ (uses global fetch). No npm dependencies.
 * Safe to re-run.
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

// Same TS-array loader as setup-directus.js — see that file for why this
// avoids pulling in a TS compiler for a one-time script.
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

async function findProductBySlug(slug) {
  const { data } = await directus(
    "GET",
    withQuery("/items/products", {
      filter: { slug: { _eq: slug } },
      limit: 1,
      fields: "id,slug,hero_image,gallery",
    })
  );
  return data[0] || null;
}

function sameImage(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function main() {
  await login();

  const products = loadTsArrayExport(path.join(DATA_DIR, "products.ts"), "products");

  console.log("\n--- Fixing product image paths ---");
  for (const p of products) {
    const existing = await findProductBySlug(p.slug);
    if (!existing) {
      console.log(`  ${p.slug}: not found in Directus, skipping (this script only fixes existing products)`);
      continue;
    }

    const heroImage = p.heroImage ?? null;
    const gallery = p.gallery ?? [];

    const heroChanged = !sameImage(existing.hero_image, heroImage);
    const galleryChanged = !sameImage(existing.gallery, gallery);

    if (!heroChanged && !galleryChanged) {
      console.log(`  ${p.slug}: already up to date`);
      continue;
    }

    const patch = {};
    if (heroChanged) patch.hero_image = heroImage;
    if (galleryChanged) patch.gallery = gallery;

    await directus("PATCH", `/items/products/${existing.id}`, patch);
    console.log(`  ${p.slug}: updated ${[heroChanged && "hero_image", galleryChanged && "gallery"].filter(Boolean).join(", ")}`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("\nFix failed:", err.message);
  process.exit(1);
});
