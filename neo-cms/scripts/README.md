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
4. Grants the **Public** role read access to each collection, filtered to
   the same status the site currently uses in `lib/content.ts`:
   `status = published` for products and news, `status = active` for
   resellers.

Safe to re-run — collections, items, and permissions are all upserted by
key (`slug` for products/news, `id` for resellers, `collection`+`action`
for permissions), not blindly re-created.

## Usage

```sh
docker compose up -d   # start Directus, if it isn't already running

DIRECTUS_URL=http://localhost:8055 \
DIRECTUS_ADMIN_EMAIL=admin@neo.local \
DIRECTUS_ADMIN_PASSWORD=Neo2026!Admin#Zm \
npm run setup
```

(`DIRECTUS_URL` defaults to `http://localhost:8055` if omitted — those are
the credentials already in `docker-compose.yml`'s `ADMIN_EMAIL`/`ADMIN_PASSWORD`.)

## Not tested against a live Directus

This was written without network access to pull the `directus/directus`
image, so it's never actually run against a real instance — only against
a mocked Directus API (collection creation, item upsert, and permission
upsert request/response shapes) and against the real `data/*.ts` files
for the loader. Run it once locally and skim the console output before
trusting it against anything that matters; if a Directus API detail
(field name, permission shape) has shifted between versions, that's the
most likely place for a mismatch.
