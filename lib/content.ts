// Content layer — Phase 1 implementation backed by local data files.
// To migrate to Directus in Phase 2, replace only this file's function bodies.
// The interface (function signatures and return types) must not change.

import type { Product, Reseller, NewsPost } from "@/lib/types";
import { products } from "@/data/products";
import { resellers } from "@/data/resellers";
import { newsPosts } from "@/data/news";

export async function getProducts(): Promise<Product[]> {
  return products.filter((p) => p.status === "published");
}

export async function getProduct(slug: string): Promise<Product | null> {
  return products.find((p) => p.slug === slug && p.status === "published") ?? null;
}

export async function getProductSlugs(): Promise<string[]> {
  return products.filter((p) => p.status === "published").map((p) => p.slug);
}

export async function getResellers(): Promise<Reseller[]> {
  return resellers.filter((r) => r.status === "active");
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
  return newsPosts
    .filter((n) => n.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNewsPost(slug: string): Promise<NewsPost | null> {
  return newsPosts.find((n) => n.slug === slug && n.status === "published") ?? null;
}
