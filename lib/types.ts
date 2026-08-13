export type NeoImage = {
  src: string;
  alt: string;
  type?: "product" | "lifestyle";
};

export type FileRef = {
  src: string;
  label: string;
};

export type SpecItem = {
  label: string;
  value: string;
};

export type SpecGroup = {
  label: string;
  specs: SpecItem[];
};

export type Product = {
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  range?: "Fusion" | "Lite" | "Pulse" | "Tab";
  heroImage: NeoImage;
  gallery: NeoImage[];
  specGroups: SpecGroup[];
  specSheetPdf?: FileRef;
  status: "published" | "draft";
  // No price field — by design
};

export type Reseller = {
  id: string;
  name: string;
  province: string;
  town: string;
  address?: string;
  phone?: string;
  lat?: number;
  lng?: number;
  status: "active" | "pending";
};

export type NewsPost = {
  slug: string;
  title: string;
  date: string; // ISO
  category: "partnership" | "csr" | "event";
  excerpt?: string;
  cover?: NeoImage;
  body: string;
  status: "published" | "draft";
};
