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

import type { Product, Reseller, NewsPost } from "@/lib/types";

const DIRECTUS_URL = (process.env.DIRECTUS_URL ?? "http://localhost:8055").replace(/\/+$/, "");

// CMS content doesn't need to be fetched fresh on every request — revalidate
// periodically instead (Next.js ISR-style ). Adjust down if edits need to
// show up faster than this.
const REVALIDATE_SECONDS = 60;

type DirectusResponse<T> = { data: T };

type DirectusProduct = {
  slug: string;
  name: string;
  tagline: string | null;
  range: string | null;
  hero_image: Product["heroImage"] | null;
  gallery: Product["gallery"] | null;
  spec_groups: Product["specGroups"] | null;
  spec_sheet_pdf: Product["specSheetPdf"] | null;
  status: Product["status"];
};

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

function mapProduct(raw: DirectusProduct): Product {
  return {
    slug: raw.slug,
    name: raw.name,
    tagline: raw.tagline ?? undefined,
    range: (raw.range as Product["range"]) ?? undefined,
    heroImage: raw.hero_image as Product["heroImage"],
    gallery: raw.gallery ?? [],
    specGroups: raw.spec_groups ?? [],
    specSheetPdf: raw.spec_sheet_pdf ?? undefined,
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
  const raw = await directusFetch<DirectusProduct>("/items/products?filter[status][_eq]=published");
  return raw.map(mapProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const raw = await directusFetch<DirectusProduct>(
    `/items/products?filter[slug][_eq]=${encodeURIComponent(slug)}&filter[status][_eq]=published&limit=1`
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
