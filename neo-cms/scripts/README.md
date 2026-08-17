# scripts/setup-directus.js

One-time setup for the Directus instance in `neo-cms/docker-compose.yml`.
No npm install needed — uses only `fs`/`path` and the global `fetch`
(Node 18+).

## What it does

1. Logs in as admin (`DIRECTUS_ADMIN_EMAIL` / `DIRECTUS_ADMIN_PASSWORD`).
2. Creates the `products`, `resellers`, and `news_posts` collections if
   they don't already exist, matching `lib/types.ts`.
3. Reads `../data/products.ts`, `../data/resellers.ts`, `../data/news.ts`
   directly (no need to convert them to JSON first) and upserts every
   record into the matching collection.
4. Grants the **Public** policy read access to each collection, filtered
   to the same status the site currently uses in `lib/content.ts`:
   `status = published` for products and news, `status = active` for
   resellers.

Safe to re-run — collections, items, and permissions are all upserted by
key (`slug` for products/news, `id` for resellers, `policy`+`collection`+`action`
for permissions), not blindly re-created.

### Public access = Policies, not a `role` field

Directus 10.10+ replaced role-based permissions with **Policies**:
`directus_permissions` has a `policy` column (not `role`), and a
`directus_access` junction table links policies to roles/users — public
(unauthenticated) access is whichever policy is linked via an access row
where both `role` and `user` are null. There's no fixed id for that
policy; every instance gets its own randomly-generated one, so the script
discovers it at runtime (`GET /access?filter[role][_null]=true&filter[user][_null]=true`)
rather than hardcoding anything. Confirmed against a live Directus
12.2.0 instance — an earlier version of this script assumed the pre-10.10
`role: null` shape on `directus_permissions` and failed with a 403
("You don't have permission to access field 'role' ... or it does not
exist") the first time it ran for real.

## Usage

```sh
docker compose up -d   # start Directus, if it isn't already running

DIRECTUS_URL=http://localhost:8055 \
DIRECTUS_ADMIN_EMAIL=you@example.com \
DIRECTUS_ADMIN_PASSWORD=your-password \
npm run setup
```

`DIRECTUS_URL` defaults to `http://localhost:8055` if omitted. The admin
credentials are whatever you actually log in with in the Admin UI —
`docker-compose.yml`'s `ADMIN_EMAIL`/`ADMIN_PASSWORD` are only applied by
Directus on a truly first-ever boot; if the setup wizard already ran
(e.g. you created the admin account through the UI), those env vars are
ignored and won't work here either.

## Verification status

Collection creation and data import (steps 1–3 above) have been run
against a real local Directus 12.2.0 instance and confirmed working —
all three collections created, all 23 records imported. The permissions
step (4) failed on that same run against the old `role`-based
assumption; it's since been rewritten against the Policy model described
above and against a confirmed-real error message, but has **not yet been
re-run against a live instance** — run it and check the console output
before trusting it fully.

# scripts/fix-product-image-paths.js

One-time fix for product `hero_image`/`gallery` paths left over from
before the v1.0 UI redesign renamed every product image from `.jpg` to
`.png`. `setup-directus.js` imported the old `.jpg` paths on first run;
this re-syncs just `hero_image` and `gallery` per product (matched by
`slug`) from the current `../data/products.ts`, which already has the
correct `.png` paths. Doesn't touch any other field, so it won't clobber
hand-edits made in the Directus admin UI elsewhere on the record.

Safe to re-run — skips products that are already correct, and skips (with
a log line, not an error) any slug that doesn't exist in Directus yet.

```sh
DIRECTUS_URL=http://localhost:8055 \
DIRECTUS_ADMIN_EMAIL=you@example.com \
DIRECTUS_ADMIN_PASSWORD=your-password \
npm run fix-image-paths
```

Not yet run against a live instance — same no-network constraint as
above, so paste back the console output after running it.

# scripts/migrate-product-files.js

Moves product assets off hand-typed JSON path fields (`hero_image`,
`gallery`, `spec_sheet_pdf` — plain strings that have to exactly match a
file in `public/`, which is exactly how the `.jpg`/`.png` mismatch above
happened) onto native Directus File fields, so adding a new product going
forward means uploading files through the Admin UI — nothing in the
codebase or scripts needs to change again.

**Additive, not destructive.** Creates new fields (`hero_image_file`,
`gallery_files`, `spec_sheet_pdf_file`) and leaves the old JSON fields
alone. Once the site's confirmed working against the new fields, delete
the 3 old ones yourself via Settings > Data Model (one click each) and,
if you want the clean names back, rename the new ones through the same
UI.

### Prerequisite — create the gallery field manually first

Directus's raw API for a "multiple files" (M2M) relation is a junction
collection plus two relations plus an alias field — fragile enough
end-to-end that scripting it isn't worth the risk of leaving the schema
half-configured on a live instance nobody can inspect remotely. The
Admin UI does it correctly in one step:

1. Settings > Data Model > **products**
2. Create Field > **Many Files (M2M)**
3. Field key: `gallery_files`
4. Accept the suggested junction collection name (e.g. `products_files`)
5. Save

The script checks for this field before doing anything else and exits
with these same instructions if it's missing.

### What the script does

1. Creates `hero_image_file` and `spec_sheet_pdf_file` (single-file
   fields) if they don't already exist — this part *is* scripted, since a
   plain single-file relation is a much simpler, more stable API call.
2. Confirms `gallery_files` exists (see above).
3. Grants the **Public** policy read access to `directus_files` (fields:
   `id`, `title`, `description`, `type`, `filename_download`). This is a
   *separate* permission from reading `products` — without it, Directus
   can't expand a file relation into `{ id, title, description }` for an
   unauthenticated request and silently collapses it to the bare file id
   instead, which is what produced `assets/undefined` in `lib/content.ts`
   the first time this ran (fixed there too, defensively, but the alt
   text only comes through with this permission actually granted).
   Existence-check only — if a read permission already exists for the
   collection (however it got there, including set up by hand in the
   Admin UI), it's left alone and skipped rather than PATCHed, since
   `PATCH /permissions` has turned out to be restricted from the API on
   this instance.
4. Grants the **Public** policy read access to `gallery_files`' junction
   collection — the table Directus auto-created when the M2M field was
   set up (e.g. `products_files`), discovered dynamically via
   `/relations` rather than assumed, since it's whatever name you (or
   Directus's suggested default) gave it. This is a *third*, separate
   permission from both `products` and `directus_files` — without it,
   `gallery_files` doesn't come back as `null` or `[]`, it's just absent
   from the response entirely, even once `directus_files` is readable.
   Same existence-check-only skip as step 3.
5. Creates a "Products" folder in the Directus file library, for
   organization.
6. For each product in `../data/products.ts`, uploads and links whichever
   of hero image / gallery / spec sheet PDF is still missing — checked
   **independently per field**, not as one all-or-nothing flag.

Safe to re-run — hero image / gallery / spec sheet are each checked and
uploaded independently, so a partially-migrated product only gets the
missing piece(s) filled in. Files are deduped by local path *within a
single run* (not across runs — see the incident below for why that
matters).

```sh
DIRECTUS_URL=http://localhost:8055 \
DIRECTUS_ADMIN_EMAIL=you@example.com \
DIRECTUS_ADMIN_PASSWORD=your-password \
npm run migrate-product-files
```

Run once against a live 12.2.0 instance: field creation, folder creation,
and the gallery_files check all confirmed working. That run then hit a
UTF-8 BOM in `data/products.ts` breaking `loadTsArrayExport` — fixed,
see below. Re-running after that surfaced two more issues, found by
querying the live instance directly (unauthenticated, matching what the
frontend actually does) rather than guessing from the error message
alone:

- The Public policy had no read access to `directus_files`, so
  `hero_image_file`/`spec_sheet_pdf_file` collapsed to a bare file id
  instead of expanding — the frontend got `assets/undefined`. Confirmed
  via `curl -sg "{DIRECTUS_URL}/items/products?filter[slug][_eq]=fusion-a5&fields=hero_image_file.id,hero_image_file.title"`
  returning the bare id with no nested object.
- Separately, `gallery_files` was missing from that same response
  entirely (not `null`, not `[]`) — its junction collection had no
  Public read permission either, confirmed via
  `curl -sg "{DIRECTUS_URL}/items/products_files"` returning a 403.
  Both are now granted as steps 3 and 4 above.

`data/products.ts`'s BOM: added by whatever editor last saved it. The
loader now strips a leading BOM before processing, in all three scripts
in this folder.

`hero_image_file`/`spec_sheet_pdf_file` confirmed working live end-to-end
after those two permission fixes — checked the actual rendered
`fusion-a5` page, real Directus asset UUIDs, no errors. `gallery_files`
fix not yet independently reconfirmed after being added (it was found
and fixed in the same pass) — worth a quick check next run.

### Incident: wrong permission granted to a system collection

Once `directus_files`/`products_files` permissions were set by hand
(`PATCH /permissions` turned out to be restricted from the API — see the
idempotency note in step 3/4 above) and `gallery_files` had been rebuilt
(see `rebuild-gallery-files-field.js`), a re-run of this script's
junction-discovery step (`findGalleryJunctionCollection`) resolved to
**`directus_revisions`** — a system collection holding the CMS's full
edit history — and granted the Public policy read access to it.

First diagnosis was wrong: assumed the fix was filtering on the wrong
field path (top-level `one_collection`/`one_field` instead of nested
`meta.one_collection`/`meta.one_field`) and shipped that without
verifying it. It re-ran and landed on `directus_revisions` again — same
wrong result from two differently-shaped filters is the tell that
neither was ever being applied. Actual root cause: **`/relations` is a
Directus system endpoint, not a generic `/items/{collection}` route, and
doesn't apply the `filter` query param at all** — every request, any
filter shape, silently returned the same full unfiltered list, and
`data[0]` was just whatever came first in it. Fixed properly this time
by fetching the full list unfiltered and searching client-side in JS
(`Array.prototype.find`), where there's no ambiguity about what's
actually matched. Same bug existed in two more places and is fixed in
all three: `diagnose-gallery-relations.js`'s two `/relations` queries,
and `rebuild-gallery-files-field.js`'s `verify()` step (that one
happened to still produce the right answer by luck — `directus_files_id`
and `products_id` aren't field names anything else in the system uses —
but was filtering on field name alone, not collection *and* field, so
it wasn't actually safe).

**If you're reading this because it happened to you too:** remove the
permission immediately via Settings > Access Policies > Public — find
`directus_revisions` under System Collections in the Permissions table
and click the X to delete that row entirely. No script for this one;
it's one click and shouldn't wait on anything else.

Separately, the same run skipped all 6 products as "already migrated"
because the check only looked at `hero_image_file` — true for all of
them from the first successful run, even though `gallery_files` had just
been rebuilt from scratch and none of them had a single gallery image
linked yet. Fixed: `migrateProduct` now checks hero image, gallery, and
spec sheet independently and only uploads/links whichever piece is
actually missing (see step 6 above).

# scripts/fix-product-schema.js

Two follow-up schema fixes surfaced once someone actually tried creating
a *new* product against the migrated schema:

1. `hero_image`, `gallery`, and `spec_sheet_pdf` (the old JSON fields)
   were still marked required from before the migration, even though
   nothing writes to them anymore — blocking save on any new product.
   Made optional. `spec_groups` is deliberately left alone: it's still
   the live, unmigrated field for product specs (`lib/content.ts` reads
   it directly), so it stays required and still needs filling in by
   hand for now.
2. `gallery_files` was created with Directus's generic "Many to Many"
   preset (`interface: "list-m2m"`) rather than the dedicated "Many
   Files (M2M)" preset (`interface: "files"`) — confirmed directly via
   `GET /fields/products/gallery_files`. The generic interface's
   "Create New" opens a blank item-creation form (for relating to an
   arbitrary collection), not a file upload/select dialog, which is
   what it needs since it relates to `directus_files` specifically.
   Switched to `interface: "files"` — doesn't touch the relation or any
   already-linked data, just which widget the Admin UI renders.

```sh
DIRECTUS_ADMIN_EMAIL=you@example.com \
DIRECTUS_ADMIN_PASSWORD=your-password \
npm run fix-product-schema
```

Run against a live instance: both fixes applied cleanly. The interface
switch to `"files"` did fix the blank-form problem, but saving a new
product with gallery images attached now hits a separate error — see
`diagnose-gallery-relations.js` below.

# scripts/diagnose-gallery-relations.js

Read-only. Saving a new product with `gallery_files` attached now fails
with:

```
[INTERNAL_SERVER_ERROR] select "id" from "products" where "id" = $1
limit $2 - invalid input syntax for type integer:
"fd14395a-6a10-408d-8474-fea13fd9b004"
```

That's Postgres being asked to look up a row in `products` (an integer
PK) using a `directus_files` UUID — meaning some relation on the
`gallery_files` junction collection points at the wrong target, most
likely from when `gallery_files` was created via the generic "Many to
Many" preset instead of "Many Files (M2M)" (see `fix-product-schema.js`
above — same root cause, different symptom). `hero_image_file`/
`spec_sheet_pdf_file` are confirmed unaffected (both single-file
relations, no junction involved).

This isn't something to guess-and-PATCH: a wrong fix against `/relations`
risks breaking the two file fields that already work. This script only
reads — `/fields/products/gallery_files`, the relation linking it to its
junction collection, every relation on that junction, and the junction's
actual column types — and prints all of it.

```sh
DIRECTUS_ADMIN_EMAIL=you@example.com \
DIRECTUS_ADMIN_PASSWORD=your-password \
npm run diagnose-gallery-relations
```

Run against a live instance — confirmed the exact diagnosis. `gallery_files`
reads through a junction collection called `products_products`, whose two
relations are `products_id -> products` and `related_products_id ->
products` — a **products-to-products self-relation**, not products-to-
files. `gallery_files` was never actually wired to `directus_files` at
all, despite the name. That's exactly why saving throws the error above:
Directus looks up a row in `products` using a file's UUID because it
genuinely believes gallery_files relates products to other products.
Also confirmed from the same dump: the field's `meta.special` was
`["m2m"]`, not `["files"]` — another marker that the generic "Many to
Many" preset was used, not "Many Files (M2M)". Fixed by
`rebuild-gallery-files-field.js` below.

# scripts/rebuild-gallery-files-field.js

Deletes the broken `gallery_files` field and its `products_products`
junction entirely, then recreates `gallery_files` as a genuine Many
Files (M2M) field: a fresh junction (`products_files`) with real FKs to
`products` (integer) and `directus_files` (uuid), wired up the way
Directus's own "Many Files (M2M)" preset does it (`type: alias`,
`special: ["files"]`, `interface: "files"`) — using the same
`POST /relations` payload shape already confirmed working on this
instance for `hero_image_file`/`spec_sheet_pdf_file`. Ends by
re-querying `/relations` on the new junction and asserting
`directus_files_id` actually points at `directus_files`, failing loudly
if not — the same check that caught the original bug, now automatic.

No data at risk: every save against the broken field failed inside a
transaction, so `products_products` never held a real row to lose.

```sh
DIRECTUS_ADMIN_EMAIL=you@example.com \
DIRECTUS_ADMIN_PASSWORD=your-password \
npm run rebuild-gallery-files-field
```

**After this succeeds, re-run `migrate-product-files.js`.** Its junction
permission step discovers the junction collection dynamically via
`/relations` (not hardcoded to `products_files`), so it'll find the new
one on its own, grant it Public read access, and upload/link gallery
images for every product — safe to re-run even for products whose hero
image already migrated, since that check is per-field.

Not yet run against a live instance.

# scripts/convert-spec-groups-to-repeater.js

`spec_groups` is still a raw-JSON code editor field — the last
non-technical-friendly gap in product editing now that images/PDF are
native File fields. This switches it to Directus's Repeater interface: a
repeatable "Spec Group" card (Label + a nested repeater of Specs, each
with Label/Value), no JSON typing required.

Metadata-only change — Repeater is still backed by a plain `type: "json"`
column, so `spec_groups`' storage, nullability, and required-ness are
untouched. The repeater's field template is deliberately shaped to match
what's already stored (`[{ label, specs: [{ label, value }] }]`), so
**no data migration is needed or performed** — existing product specs
render correctly the moment this runs. `lib/content.ts` needs no changes
either, for the same reason: the JSON shape on the wire doesn't change.

```sh
DIRECTUS_ADMIN_EMAIL=you@example.com \
DIRECTUS_ADMIN_PASSWORD=your-password \
npm run convert-spec-groups-to-repeater
```

Run against a live instance, completed without error. Not yet visually
confirmed in the Admin UI that Spec Groups actually renders as
repeatable cards rather than the raw-JSON editor — worth a quick look on
an existing product.
