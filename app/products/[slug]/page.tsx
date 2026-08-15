import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProductSlugs, getProducts } from "@/lib/content";
import { ProductImage } from "@/components/ProductImage";
import { ProductUseCases } from "@/components/ProductUseCases";
import { VideoHero } from "@/components/VideoHero";
import type { Product } from "@/lib/types";

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.tagline ?? `${product.name} — verified specs. NEO Zambia.`,
  };
}

const rangeAccents: Record<string, string> = {
  Fusion: "#FF6D29",
  Lite: "#6b9fff",
  Pulse: "#a855f7",
  Tab: "#22d3ee",
};

const rangeHeadlines: Record<string, string> = {
  Fusion: "Your whole office in one device.",
  Lite: "Everything you need. Nothing you don't.",
  Pulse: "Engineered for extreme performance.",
  Tab: "All-day power. Everywhere you go.",
};

const slugVideos: Record<string, string> = {
  "fusion-a5": "/videos/fusion-a5.mp4",
  "lite-14p": "/videos/lite-14p.mp4",
  "lite-14s": "/videos/lite-14s.mp4",
  "pulse-5": "/videos/pulse-5.mp4",
  "pulse-7": "/videos/pulse-7.mp4",
};

function getHighlightStats(product: Product) {
  const perf = product.specGroups.find((g) => g.label === "Performance");
  const display = product.specGroups.find((g) => g.label === "Display");
  const general = product.specGroups.find((g) => g.label === "General");
  const camera = product.specGroups.find((g) => g.label === "Camera");

  return [
    perf?.specs.find((s) => s.label === "Processor") ?? perf?.specs[0],
    perf?.specs.find((s) => s.label === "RAM"),
    perf?.specs.find((s) => s.label === "Storage"),
    general?.specs.find((s) => s.label === "Battery") ??
      camera?.specs.find((s) => s.label === "Rear Camera") ??
      display?.specs[0],
  ].filter(Boolean) as { label: string; value: string }[];
}

export default async function ProductDetailPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const [product, allProducts] = await Promise.all([getProduct(slug), getProducts()]);
  if (!product) notFound();

  const accent = rangeAccents[product.range ?? "Fusion"] ?? "#FF6D29";
  const headline = rangeHeadlines[product.range ?? "Fusion"] ?? "";
  const videoSrc = slugVideos[slug] ?? null;
  const highlightStats = getHighlightStats(product);
  const displayGroup = product.specGroups.find((g) => g.label === "Display");

  return (
    <div className="min-h-screen">

      {/* ══════════════════════════════════════════════════════
          § 1  HERO — full-screen video
          ══════════════════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden bg-[#0d0b0c]">
        <VideoHero
          videoSrc={videoSrc}
          fallbackImage={product.heroImage}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: "linear-gradient(to top, #0d0b0c 0%, transparent 100%)" }}
        />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-50">
          <div className="w-px h-10 bg-gradient-to-b from-[#FF6D29] to-transparent mx-auto" />
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          § 2  PRODUCT IDENTITY  [DARK]
          ══════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0d0b0c] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${accent}10 0%, transparent 60%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-10 pb-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[#7a7178] mb-12">
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>

          {/* Centred identity */}
          <div className="text-center mb-4">
            <span
              className="text-xs font-bold tracking-[0.3em] uppercase mb-4 block"
              style={{ color: accent }}
            >
              NEO {product.range}
            </span>
            <h1
              className="font-extrabold text-white leading-[1.0] tracking-tight mb-4"
              style={{ fontSize: "clamp(52px, 9vw, 120px)" }}
            >
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-lg sm:text-xl text-[#bababa] max-w-xl mx-auto leading-relaxed mb-8">
                {product.tagline}
              </p>
            )}
            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {product.specSheetPdf && (
                <a href={product.specSheetPdf.src} download className="btn-neo">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  {product.specSheetPdf.label}
                </a>
              )}
              <Link href="/become-a-reseller" className="btn-ghost">
                Stock this device
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Hero product image — large, full-width */}
          <div className="relative w-full" style={{ height: "clamp(320px, 55vw, 760px)" }}>
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden
            >
              <div
                className="rounded-full"
                style={{
                  width: "60%",
                  height: "60%",
                  background: `radial-gradient(circle, ${accent}30 0%, transparent 65%)`,
                  filter: "blur(80px)",
                }}
              />
            </div>
            <Image
              src={product.heroImage.src}
              alt={product.heroImage.alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>

        {/* Pricing note */}
        <div className="text-center py-5">
          <p className="text-xs text-[#5a5158] flex items-center justify-center gap-1.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            Pricing not listed — contact a reseller to purchase.
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>


      {/* ══════════════════════════════════════════════════════
          § 3  PERFORMANCE STATS  [DARK]
          ══════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0d0b0c] py-28 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 60% at 80% 50%, ${accent}08 0%, transparent 55%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-16">
            <div className="section-label mb-4">Performance</div>
            <h2 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6">
              {headline}
            </h2>
            {product.description && (
              <p className="text-lg text-[#bababa] leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Stat callouts */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-white/[0.07] rounded-2xl overflow-hidden">
            {highlightStats.map((spec, i) => (
              <div
                key={spec.label}
                className="p-6 sm:p-8 border-white/[0.07]"
                style={{
                  borderRight: i < highlightStats.length - 1 ? "1px solid rgba(255,255,255,0.07)" : undefined,
                  borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.07)" : undefined,
                }}
              >
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#5a5158] mb-3">
                  {spec.label}
                </p>
                <p
                  className="text-2xl sm:text-3xl font-extrabold leading-tight"
                  style={{ color: accent }}
                >
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          § 4  USE CASES  [LIGHT]
          ══════════════════════════════════════════════════════ */}
      <section className="bg-[#FAF7F4] py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto w-fit mb-4" style={{ borderColor: `${accent}30`, color: accent }}>
              Built for your life
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1a1518] leading-tight">
              What will you do with it?
            </h2>
          </div>

          <ProductUseCases range={product.range ?? "Lite"} />
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          § 5  DISPLAY SPOTLIGHT  [DARK]
          ══════════════════════════════════════════════════════ */}
      {displayGroup && (
        <section className="relative bg-[#0d0b0c] py-28 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 30% 50%, ${accent}08 0%, transparent 55%)`,
            }}
          />

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Text */}
              <div>
                <div className="section-label mb-4">Display</div>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
                  See every detail,
                  <br />
                  <span style={{ color: accent }}>exactly as intended.</span>
                </h2>
                <p className="text-[#bababa] leading-relaxed mb-10 max-w-md">
                  Every NEO device ships with a verified display spec — what we publish is exactly what you get.
                  No inflated numbers, no marketing brightness figures.
                </p>

                {/* Display specs list */}
                <div className="space-y-4">
                  {displayGroup.specs.map((spec) => (
                    <div key={spec.label} className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-4">
                      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#5a5158]">
                        {spec.label}
                      </span>
                      <span className="text-sm font-semibold text-white text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Big screen size callout */}
              <div className="text-center">
                <p
                  className="font-extrabold leading-none"
                  style={{ color: accent, fontSize: "clamp(80px, 18vw, 200px)" }}
                >
                  {displayGroup.specs[0]?.value.split(" ")[0]}
                </p>
                <p className="text-[#7a7178] text-sm font-semibold tracking-widest uppercase mt-2">
                  {displayGroup.specs[0]?.value.split(" ").slice(1).join(" ")}
                </p>
                {displayGroup.specs.find((s) => s.label === "Resolution") && (
                  <p className="text-[#5a5158] text-xs mt-4 font-medium">
                    {displayGroup.specs.find((s) => s.label === "Resolution")?.value}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════════════════════
          § 6  FULL SPECIFICATIONS  [LIGHT]
          ══════════════════════════════════════════════════════ */}
      <section className="bg-[#FAF7F4]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="section-label mb-3" style={{ borderColor: `${accent}30`, color: accent }}>
                Specifications
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1518]">Full spec sheet.</h2>
            </div>
            {product.specSheetPdf && (
              <a href={product.specSheetPdf.src} download className="btn-neo shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {product.specSheetPdf.label}
              </a>
            )}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {product.specGroups.map((group) => (
              <div key={group.label} className="card-light rounded-[16px] overflow-hidden">
                <div className="px-5 py-3 border-b border-black/5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                  <h3 className="font-bold text-[#1a1518] text-sm">{group.label}</h3>
                </div>
                <div className="divide-y divide-black/5">
                  {group.specs.map((spec) => (
                    <div key={spec.label} className="px-5 py-3.5 flex items-start justify-between gap-4">
                      <span className="text-xs text-[#9a9096] shrink-0">{spec.label}</span>
                      <span className="text-xs text-[#1a1518] text-right font-semibold leading-snug">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          § 7  BROWSE THE RANGE  [DARK]
          ══════════════════════════════════════════════════════ */}
      <section className="bg-[#0a0809] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-extrabold text-white">Browse the range</h2>
            <Link href="/products" className="text-sm text-[#7a7178] hover:text-white transition-colors flex items-center gap-1.5">
              View all
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
            <div className="flex gap-3 min-w-max sm:min-w-0 sm:grid sm:grid-cols-3 lg:grid-cols-6">
              {allProducts.map((p) => {
                const a = rangeAccents[p.range ?? "Fusion"] ?? "#FF6D29";
                const isCurrent = p.slug === slug;
                return (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="group flex flex-col rounded-[16px] overflow-hidden transition-all duration-200 w-44 sm:w-auto"
                    style={{
                      background: isCurrent ? `${a}10` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isCurrent ? `${a}40` : "rgba(255,255,255,0.06)"}`,
                    }}
                  >
                    <div
                      className="relative h-28 w-full"
                      style={{ background: `radial-gradient(ellipse 80% 70% at 50% 60%, ${a}15 0%, transparent 70%)` }}
                    >
                      <ProductImage src={p.heroImage.src} alt={p.heroImage.alt} accent={a} />
                    </div>
                    <div className="p-3">
                      <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: a }}>
                        {p.range}
                      </p>
                      <p className={`text-xs font-bold transition-colors ${isCurrent ? "text-white" : "text-[#bababa] group-hover:text-white"}`}>
                        {p.name}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          § 8  RESELLER CTA  [LIGHT]
          ══════════════════════════════════════════════════════ */}
      <section className="bg-[#FAF7F4]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div
            className="rounded-[20px] p-8 sm:p-12 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${accent}08 0%, #FFFFFF 60%)`,
              border: `1px solid ${accent}22`,
              boxShadow: "0 1px 4px rgba(26,21,24,0.06)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${accent}10 0%, transparent 70%)` }}
            />
            <div className="relative grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: accent }}>
                  Reseller opportunity
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1a1518] mb-3">
                  Interested in stocking the {product.name}?
                </h3>
                <p className="text-[#4a3f46] text-sm leading-relaxed">
                  Apply to become an official NEO reseller. Full range access, sell-through
                  materials, and guaranteed local warranty support.
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-3">
                <Link href="/become-a-reseller" className="btn-neo">
                  Apply to become a reseller
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
                <Link href="/find-neo" className="btn-ghost-dark">Find a reseller near you</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
