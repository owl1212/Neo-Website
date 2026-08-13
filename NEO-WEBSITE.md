# NEO Website — Technical Documentation

## Overview

Brand and reseller-recruitment website for NEO, Zambia's first laptop brand. Built with Next.js 16 App Router, Tailwind CSS v4, and TypeScript. **No pricing is displayed anywhere** — the site is for brand awareness and reseller acquisition only.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 with `@theme` tokens |
| Language | TypeScript |
| Images | `next/image` (transparent PNGs, `fill` + `object-contain`) |
| Video | HTML5 `<video autoPlay muted loop playsInline>` — local MP4s |
| Fonts | Plus Jakarta Sans (Google Fonts) |
| Deployment | — (TBD) |

---

## Project Structure

```
neo-website/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Homepage
│   ├── products/
│   │   ├── page.tsx            # Products listing (all 6 devices)
│   │   └── [slug]/page.tsx     # Individual product detail
│   ├── about/page.tsx
│   ├── become-a-reseller/page.tsx
│   ├── financing-community/page.tsx
│   ├── find-neo/page.tsx
│   ├── support/page.tsx
│   ├── news/page.tsx
│   └── globals.css             # Tailwind config + design tokens + keyframes
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCarousel.tsx     # Homepage Apple Watch–style carousel
│   ├── ProductImage.tsx        # Reusable product image with glow
│   └── FadeIn.tsx              # Scroll-triggered animation wrapper
├── lib/
│   ├── content.ts              # ← CMS abstraction layer (all data access)
│   └── types.ts                # Shared TypeScript types
├── data/
│   ├── products.ts             # Product data (replace with CMS later)
│   ├── news.ts                 # News post data
│   └── resellers.ts            # Reseller directory data
└── public/
    ├── images/                 # Product PNGs + logo
    └── videos/                 # MP4 hero videos (per product)
```

---

## Content Layer

**All data flows through `lib/content.ts`.** Pages never import from `data/` directly. This is the CMS seam — to integrate a headless CMS, only this file changes.

```ts
// lib/content.ts exports:
getProducts()                   // → Product[]
getProduct(slug: string)        // → Product | null
getProductSlugs()               // → string[]
getResellers()                  // → Reseller[]
getResellersByProvince()        // → Record<string, Reseller[]>
getNewsPosts()                  // → NewsPost[]
getNewsPost(slug: string)       // → NewsPost | null
```

---

## Data Types

```ts
// lib/types.ts

Product {
  slug: string
  name: string
  tagline?: string
  description?: string
  range?: "Fusion" | "Lite" | "Pulse" | "Tab"
  heroImage: NeoImage
  gallery: NeoImage[]
  specGroups: SpecGroup[]
  specSheetPdf?: FileRef
  status: "published" | "draft"
}

NewsPost {
  slug, title, date, category, excerpt, cover, body, status
}

Reseller {
  id, name, province, town, address?, phone?, status
}
```

---

## Pages

### Homepage (`/`)
- **§1** Full-screen video hero — `public/videos/pulse-7.mp4` — no text overlay
- **§2** Brand statement — centered headline, tagline, dual CTA
- **§3** "Zambia's First" — NEO logo + brand story, stat block
- **§4** Products — `ProductCarousel` (3-panel, 2s auto-rotate, float animation)
- **§5** Why NEO — 4 reseller value-prop cards
- **§6** Partner CTA — full-width conversion section
- **§7** Testimonial

### Products (`/products`)
- Full-screen video hero — `public/videos/fusion-a5.mp4`
- 6 individual product sections, alternating left/right layout
- Each section: large product image (viewport height) + range label + name + tagline + description + key specs + CTA arrow

### Product Detail (`/products/[slug]`)
- Full-screen video hero per product (see `slugVideos` map in the file)
- Tab T606 has no video — uses gradient fallback
- Product info section: image + specs + download spec sheet + "Stock this device" CTA
- Full specifications table
- "Browse the range" mini-carousel
- Reseller hook

### Other Pages
| Page | Path | Notes |
|------|------|-------|
| About | `/about` | Brand story, 4 pillars, stats |
| Become a Reseller | `/become-a-reseller` | Application form (currently static `action="#"`) |
| Financing & Community | `/financing-community` | Digitize, HELSB, BongoHive, Zanaco, JETS |
| Find NEO | `/find-neo` | Reseller directory by province |
| Support | `/support` | Warranty info, FAQ accordion, contact form |
| News | `/news` | News post listing + detail |

---

## Design Tokens

Defined in `app/globals.css` under `@theme`:

```css
--color-neo-orange:     #FF6D29   /* Primary accent */
--color-neo-black:      #0d0b0c   /* Dark section background */
--color-neo-silver:     #bababa   /* Body text on dark */
--color-neo-muted:      #7a7178   /* Subdued text */
```

**Section alternating pattern:** Dark (`#0d0b0c`) → Light (`#FAF7F4`) → Dark → Light throughout every page.

### Range Accent Colours
| Range | Colour |
|-------|--------|
| Fusion | `#FF6D29` (orange) |
| Lite | `#6b9fff` (blue) |
| Pulse | `#a855f7` (purple) |
| Tab | `#22d3ee` (cyan) |

### CSS Utility Classes
```
.card-glass        Dark glassmorphism card (dark sections)
.card-light        Light card with border (light sections)
.btn-neo           Primary orange CTA button
.btn-ghost         Ghost button (dark background)
.btn-ghost-dark    Ghost button (light background)
.neo-input         Form input (dark)
.neo-input-light   Form input (light)
.section-label     Small eyebrow label with dot
.text-gradient     Orange gradient text
.neo-divider       Horizontal divider
```

---

## Animations

All keyframes defined in `app/globals.css`:

| Keyframe | Usage |
|----------|-------|
| `fadeInUp` | Above-fold entrance animations |
| `fadeIn` | General fade-in |
| `slideInLeft` | Left-to-right entrance |
| `pulseDot` | Animated indicator dot |
| `floatProduct` | Center carousel product hover float |

**`FadeIn` component** — scroll-triggered wrapper using `IntersectionObserver`. Props: `from` ("bottom" \| "left" \| "right" \| "none"), `delay` (ms), `className`.

**Delay utilities:** `.delay-100` through `.delay-600`

---

## Videos

Local MP4 files in `public/videos/`:

| File | Used on |
|------|---------|
| `pulse-7.mp4` | Homepage hero |
| `fusion-a5.mp4` | Products page hero |
| `fusion-a5.mp4` | Fusion A5 product detail |
| `lite-14p.mp4` | Lite 14P product detail |
| `lite-14s.mp4` | Lite 14S product detail |
| `pulse-5.mp4` | Pulse 5 product detail |
| `pulse-7.mp4` | Pulse 7 product detail |
| *(none)* | Tab T606 — gradient fallback |

> **Note:** Videos are large (~30 MB each). Consider migrating to YouTube unlisted embeds or a CDN before/after launch to reduce git repo size and improve load times.

---

## Product Range

| Product | Slug | Range | Key Spec |
|---------|------|-------|----------|
| Fusion A5 | `fusion-a5` | Fusion | 23.8" AIO, Intel Core i5, 8GB RAM |
| Lite 14P | `lite-14p` | Lite | 14" HD, Intel Core i3, 8GB RAM |
| Lite 14S | `lite-14s` | Lite | 14" HD, Intel Celeron, 4GB RAM |
| Pulse 5 | `pulse-5` | Pulse | 15.6" FHD, Intel Core i3, 8GB RAM |
| Pulse 7 | `pulse-7` | Pulse | 15.6" FHD, Intel Core i5 12th Gen, 8GB RAM |
| Tab T606 | `tab-t606` | Tab | 10.1" IPS, UniSOC T606, 4GB RAM, 4G LTE |

---

## Adding a New Product

1. Add a new entry to `data/products.ts` following the existing `Product` shape
2. Add hero image to `public/images/` (transparent PNG, web-safe filename)
3. Add spec sheet PDF to `public/specs/` (optional)
4. If a video exists, add it to `public/videos/` and register it in the `slugVideos` map in `app/products/[slug]/page.tsx`
5. The product automatically appears in the carousel, products page, and gets a detail page at `/products/[slug]`

---

## CMS Migration Path

The site is architected for a future CMS. Only `lib/content.ts` needs to change.

**Recommended: Sanity CMS**

1. `npm install next-sanity @sanity/image-url`
2. Run `npx sanity init` to scaffold the studio
3. Define schemas matching `Product`, `NewsPost`, `Reseller` types
4. Replace function bodies in `lib/content.ts` with Sanity GROQ queries
5. Add `revalidate` to pages or set up on-demand revalidation webhook

No page files change. The content layer handles everything.

---

## Forms

Both forms (`/become-a-reseller` and `/support#contact`) are currently static (`action="#"`). Before launch, wire them to a form backend:

- **Recommended:** [Formspree](https://formspree.io) or [Resend](https://resend.com) — minimal setup, no server needed
- Both forms include a honeypot field (`name="_honey"`) for basic spam protection

---

## Partnerships Pending

| Item | Status |
|------|--------|
| Digitize URL | Needed from client to add the financing link |
| Province reseller count | Body copy says "across the country" — confirm 9+ provinces covered |
| YouTube video IDs | After demo, replace local MP4s with YouTube unlisted embeds |

---

## Key Brand Rules (enforced in code)

- **No pricing anywhere** — the site is brand/reseller-recruitment only
- All specs are verified and published verbatim from the spec sheets
- Warranty language: "guaranteed warranty, fully serviced right here in Zambia — no shipping overseas, no long waits"
- Tagline hierarchy: "Built For You. Proudly Zambian." → "Empowering Digital Growth."
