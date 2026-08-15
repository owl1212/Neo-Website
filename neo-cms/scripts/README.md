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
4. Grants the **Public** policy read access to `gallery_files`' junction
   collection — the table Directus auto-created when the M2M field was
   set up (e.g. `products_files`), discovered dynamically via
   `/relations` rather than assumed, since it's whatever name you (or
   Directus's suggested default) gave it. This is a *third*, separate
   permission from both `products` and `directus_files` — without it,
   `gallery_files` doesn't come back as `null` or `[]`, it's just absent
   from the response entirely, even once `directus_files` is readable.
5. Creates a "Products" folder in the Directus file library, for
   organization.
6. For each product in `../data/products.ts`, uploads its hero image,
   gallery images, and spec sheet PDF from `public/` to Directus, then
   links the resulting file(s) to that product's new fields.

Safe to re-run — a product already carrying `hero_image_file` is assumed
already migrated and skipped. Files are deduped by local path within a
run, so an image used as both a hero and a gallery entry only uploads
once.

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

Not yet confirmed clean end-to-end after those fixes — re-run and paste
back the output. Also worth checking in the Admin UI: do
`hero_image_file`/`spec_sheet_pdf_file` actually render as file pickers
(not plain text/uuid inputs)? If not, the field's `interface` meta needs
a manual tweak in Settings > Data Model, but the underlying file
relation and uploaded data are unaffected either way.
