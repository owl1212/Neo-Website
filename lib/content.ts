// Content layer — Phase 2 implementation backed by Directus.
// The interface (function signatures and return types) must not change.
//
// Directus wraps every response in { data: ... } and returns fields as
// they're named in the collection schema (snake_case for products' json
// fields) — mapProduct/mapReseller/mapNewsPost translate that back into
// the camelCase shape lib/types.ts expects, so components don't change.
//
// Network/HTTP failures are caught and logged, never thrown: callers get
// an empty array (list endpoints) or null (single-item endpoints), the
// same "nothing here" shape they already handle when a slug doesn't
// exist or a collection is empty.

import type { NeoImage, Product, Reseller, NewsPost } from "@/lib/types";

// Server-only — used for every Directus API call made from here (SSR/ISR,
// runs on the server) and for building heroImage/gallery URLs, which are
// always rendered through next/image. Its optimizer route fetches the
// original image server-side, so the browser never requests this host
// directly — it can stay an internal/localhost address in production.
const DIRECTUS_URL = (process.env.DIRECTUS_URL ?? "http://localhost:8055").replace(/\/+$/, "");

// NEXT_PUBLIC_ because specSheetPdf.src is rendered as a plain <a href>
// download link (app/products/[slug]/page.tsx) — the browser navigates to
// it directly, on the visitor's machine, so it must be the real public
// Directus URL, not whatever internal address the server uses to reach
// Directus. Falls back to DIRECTUS_URL for local dev, where they're the
// same host anyway.
const PUBLIC_DIRECTUS_URL = (process.env.NEXT_PUBLIC_DIRECTUS_URL ?? DIRECTUS_URL).replace(/\/+$/, "");

// CMS content doesn't need to be fetched fresh on every request — revalidate
// periodically instead (Next.js ISR-style ). Adjust down if edits need to
// show up faster than this.
const REVALIDATE_SECONDS = 60;

type DirectusResponse<T> = { data: T };

// A Directus File, deep-fetched only for the sub-fields we actually use.
// `title`/`description` double as alt text — set them in the Files
// library when uploading, no separate alt-text field needed.
type DirectusFileRef = {
  id: string;
  title: string | null;
  description: string | null;
};

// Directus only expands a relation into the requested nested object when
// the requester can read the *related* collection (directus_files) —
// that's a separate permission from reading `products` itself. Without
// it, the field still comes back, just collapsed to the bare foreign-key
// string instead of { id, title, description }. mapFileToImage below
// handles both shapes so a missing permission degrades to "no alt text"
// instead of a broken image.
type DirectusFileRelation = DirectusFileRef | string | null;

type DirectusGalleryLink = {
  sort: number | null;
  directus_files_id: DirectusFileRelation;
};

// hero_image_file / gallery_files / spec_sheet_pdf_file are native
// Directus File fields (see neo-cms/scripts/migrate-product-files.js) —
// asset URLs are built from the file id via assetUrl(), not stored as
// paths. The old hero_image/gallery/spec_sheet_pdf JSON fields still
// exist in Directus post-migration but are no longer read here.
type DirectusProduct = {
  slug: string;
  name: string;
  tagline: string | null;
  range: string | null;
  hero_image_file: DirectusFileRelation;
  gallery_files: DirectusGalleryLink[] | null;
  spec_groups: Product["specGroups"] | null;
  spec_sheet_pdf_file: DirectusFileRelation;
  status: Product["status"];
};

// Fields requested for both getProducts and getProduct — deep-fetches the
// nested file relations, since Directus only returns the raw id for a
// relation unless you ask for its sub-fields explicitly.
const PRODUCT_FIELDS =
  "*," +
  "hero_image_file.id,hero_image_file.title,hero_image_file.description," +
  "spec_sheet_pdf_file.id," +
  "gallery_files.sort,gallery_files.directus_files_id.id," +
  "gallery_files.directus_files_id.title,gallery_files.directus_files_id.description";

type DirectusReseller = {
  id: string;
  name: string;
  province: string;
  town: string;
  address: string | null;
  phone: string | null;
  lat: number | null;
  lng: number | null;
  status: Reseller["status"];
};

type DirectusNewsPost = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string | null;
  cover: NewsPost["cover"] | null;
  body: string;
  status: NewsPost["status"];
};

async function directusFetch<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${DIRECTUS_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.error(`[content] Directus ${path} -> ${res.status} ${res.statusText}`);
      return [];
    }
    const json = (await res.json()) as DirectusResponse<T[]>;
    return json.data ?? [];
  } catch (err) {
    console.error(`[content] Directus request failed: ${path}`, err);
    return [];
  }
}

function assetUrl(fileId: string): string {
  return `${DIRECTUS_URL}/assets/${fileId}`;
}

function publicAssetUrl(fileId: string): string {
  return `${PUBLIC_DIRECTUS_URL}/assets/${fileId}`;
}

function fileId(file: DirectusFileRelation): string | null {
  if (!file) return null;
  return typeof file === "string" ? file : file.id;
}

function mapFileToImage(file: DirectusFileRelation, altFallback: string): NeoImage | undefined {
  if (!file) return undefined;
  const id = typeof file === "string" ? file : file.id;
  const alt = typeof file === "string" ? altFallback : file.title ?? file.description ?? altFallback;
  return { src: assetUrl(id), alt };
}

function mapProduct(raw: DirectusProduct): Product {
  const gallery = [...(raw.gallery_files ?? [])]
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((link) => mapFileToImage(link.directus_files_id, raw.name))
    .filter((img): img is NeoImage => img !== undefined);

  return {
    slug: raw.slug,
    name: raw.name,
    tagline: raw.tagline ?? undefined,
    range: (raw.range as Product["range"]) ?? undefined,
    // hero_image_file is a required field going forward — null here means
    // this product hasn't been through migrate-product-files.js yet.
    heroImage: mapFileToImage(raw.hero_image_file, raw.name) ?? { src: "", alt: raw.name },
    gallery,
    specGroups: raw.spec_groups ?? [],
    // publicAssetUrl, not assetUrl — rendered as a raw <a href> download
    // link, fetched directly by the visitor's browser, not proxied
    // through next/image like heroImage/gallery are.
    specSheetPdf: fileId(raw.spec_sheet_pdf_file)
      ? { src: publicAssetUrl(fileId(raw.spec_sheet_pdf_file)!), label: "Download Spec Sheet" }
      : undefined,
    status: raw.status,
  };
}

function mapReseller(raw: DirectusReseller): Reseller {
  return {
    id: raw.id,
    name: raw.name,
    province: raw.province,
    town: raw.town,
    address: raw.address ?? undefined,
    phone: raw.phone ?? undefined,
    lat: raw.lat ?? undefined,
    lng: raw.lng ?? undefined,
    status: raw.status,
  };
}

function mapNewsPost(raw: DirectusNewsPost): NewsPost {
  return {
    slug: raw.slug,
    title: raw.title,
    date: raw.date,
    category: raw.category as NewsPost["category"],
    excerpt: raw.excerpt ?? undefined,
    cover: raw.cover ?? undefined,
    body: raw.body,
    status: raw.status,
  };
}

export async function getProducts(): Promise<Product[]> {
  const raw = await directusFetch<DirectusProduct>(
    `/items/products?filter[status][_eq]=published&fields=${encodeURIComponent(PRODUCT_FIELDS)}`
  );
  return raw.map(mapProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const raw = await directusFetch<DirectusProduct>(
    `/items/products?filter[slug][_eq]=${encodeURIComponent(slug)}&filter[status][_eq]=published&limit=1` +
      `&fields=${encodeURIComponent(PRODUCT_FIELDS)}`
  );
  return raw[0] ? mapProduct(raw[0]) : null;
}

export async function getProductSlugs(): Promise<string[]> {
  const raw = await directusFetch<Pick<DirectusProduct, "slug">>(
    "/items/products?filter[status][_eq]=published&fields=slug"
  );
  return raw.map((p) => p.slug);
}

export async function getResellers(): Promise<Reseller[]> {
  const raw = await directusFetch<DirectusReseller>("/items/resellers?filter[status][_eq]=active");
  return raw.map(mapReseller);
}

export async function getResellersByProvince(): Promise<Record<string, Reseller[]>> {
  const active = await getResellers();
  return active.reduce<Record<string, Reseller[]>>((acc, r) => {
    if (!acc[r.province]) acc[r.province] = [];
    acc[r.province].push(r);
    return acc;
  }, {});
}

export async function getNews(): Promise<NewsPost[]> {
  const raw = await directusFetch<DirectusNewsPost>(
    "/items/news_posts?filter[status][_eq]=published&sort=-date"
  );
  return raw.map(mapNewsPost);
}

export async function getNewsPost(slug: string): Promise<NewsPost | null> {
  const raw = await directusFetch<DirectusNewsPost>(
    `/items/news_posts?filter[slug][_eq]=${encodeURIComponent(slug)}&filter[status][_eq]=published&limit=1`
  );
  return raw[0] ? mapNewsPost(raw[0]) : null;
}
