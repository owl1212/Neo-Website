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
