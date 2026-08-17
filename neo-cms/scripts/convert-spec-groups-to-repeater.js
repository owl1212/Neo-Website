#!/usr/bin/env node
"use strict";

/**
 * Converts spec_groups from a raw-JSON code editor into a proper
 * Directus Repeater UI — a repeatable "Spec Group" block (Label + a
 * nested repeater of Specs, each with Label/Value) — so filling in
 * specs doesn't require typing JSON by hand.
 *
 * This is a metadata-only change. Directus's Repeater interface
 * ("list") is still backed by a plain `type: "json"` column — it just
 * changes which widget the Admin UI renders to edit it. spec_groups'
 * underlying storage, is_nullable, and required-ness are all untouched
 * (still required — see README.md on why hero_image/gallery/
 * spec_sheet_pdf were made optional but this one deliberately wasn't).
 *
 * No data migration needed or performed: the repeater's field template
 * below is deliberately shaped to match what's already stored —
 * [{ label, specs: [{ label, value }] }] — so every existing product's
 * spec data renders correctly the moment this runs.
 *
 * Usage:
 *   DIRECTUS_ADMIN_EMAIL=you@example.com \
 *   DIRECTUS_ADMIN_PASSWORD=your-password \
 *   node scripts/convert-spec-groups-to-repeater.js
 *
 * Safe to re-run — PATCHes meta.interface/meta.options unconditionally;
 * applying the same shape twice is a no-op.
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

// A Repeater's meta.options.fields entries are miniature field
// definitions, not real columns — this shape (field/name/type/meta) is
// what the Admin UI's own "Create Field > Repeater" flow writes.
function textField(field, name, width) {
  return {
    field,
    name,
    type: "string",
    meta: { interface: "input", width },
  };
}

const SPECS_SUBFIELDS = [textField("label", "Label", "half"), textField("value", "Value", "half")];

const SPEC_GROUPS_OPTIONS = {
  template: "{{label}}",
  addLabel: "Add Spec Group",
  fields: [
    textField("label", "Label", "full"),
    {
      field: "specs",
      name: "Specs",
      type: "json",
      meta: {
        interface: "list",
        width: "full",
        options: {
          template: "{{label}}: {{value}}",
          addLabel: "Add Spec",
          fields: SPECS_SUBFIELDS,
        },
      },
    },
  ],
};

async function main() {
  await login();

  console.log("\n--- Converting spec_groups to a Repeater field ---");
  await directus("PATCH", "/fields/products/spec_groups", {
    meta: {
      interface: "list",
      options: SPEC_GROUPS_OPTIONS,
    },
  });
  console.log('  "spec_groups": interface set to Repeater (Label + nested Specs repeater of Label/Value)');
  console.log("  storage type unchanged (still json, still required) — no data migration needed.");

  console.log("\nDone. Open a product in the Admin UI and confirm Spec Groups renders as repeatable cards.");
}

main().catch((err) => {
  console.error("\nFailed:", err.message);
  process.exit(1);
});
