import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProductSlugs, getProducts } from "@/lib/content";
import { ProductImage } from "@/components/ProductImage";

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

const rangeGrads: Record<string, string> = {
  Fusion: "from-[#FF6D29]/20 to-transparent",
  Lite: "from-[#6b9fff]/20 to-transparent",
  Pulse: "from-[#a855f7]/20 to-transparent",
  Tab: "from-[#22d3ee]/20 to-transparent",
};

export default async function ProductDetailPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const [product, allProducts] = await Promise.all([getProduct(slug), getProducts()]);
  if (!product) notFound();

  const accent = rangeAccents[product.range ?? "Fusion"] ?? "#FF6D29";
  const grad = rangeGrads[product.range ?? "Fusion"] ?? rangeGrads.Fusion;

  return (
    <div className="min-h-screen">

      {/* ══════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════ */}
      <section className="relative pt-16 pb-0 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: [
                `radial-gradient(ellipse 80% 60% at 60% 30%, ${accent}20 0%, transparent 65%)`,
                "radial-gradient(ellipse 60% 80% at 20% 80%, rgba(13,11,12,0.8) 0%, transparent 60%)",
                "#0d0b0c",
              ].join(", "),
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[#7a7178] mb-10 pt-4">
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center pb-16">

            {/* ── Product image ────────────────────────────────── */}
            <div className="relative h-64 sm:h-80 lg:h-[460px] order-1 lg:order-none">
              {/* Orange ambient glow behind the product */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                aria-hidden
              >
                <div
                  className="w-[520px] h-[520px] rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${accent}28 0%, transparent 65%)`,
                    filter: "blur(70px)",
                  }}
                />
              </div>
              <ProductImage
                src={product.heroImage.src}
                alt={product.heroImage.alt}
                accent={accent}
                priority
              />
            </div>

            {/* ── Info ─────────────────────────────────────────── */}
            <div>
              <span
                className="text-xs font-bold tracking-widest uppercase mb-3 block"
                style={{ color: accent }}
              >
                {product.range}
              </span>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-3 leading-tight">
                {product.name}
              </h1>
              {product.tagline && (
                <p className="text-xl text-[#bababa] mb-8 leading-relaxed">{product.tagline}</p>
              )}

              {/* Key highlights */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  product.specGroups.find((g) => g.label === "Display")?.specs[0],
                  product.specGroups.find((g) => g.label === "Performance")?.specs.find((s) => s.label === "Processor"),
                  product.specGroups.find((g) => g.label === "Performance")?.specs.find((s) => s.label === "RAM"),
                  product.specGroups.find((g) => g.label === "General")?.specs.find((s) => s.label === "OS"),
                ].filter(Boolean).map((spec) => spec && (
                  <div key={spec.label} className="bg-white/[0.05] rounded-xl p-4 border border-white/5">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-[#7a7178] mb-1">{spec.label}</p>
                    <p className="text-sm font-semibold text-white leading-tight">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
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

              <p className="mt-6 text-xs text-[#7a7178] flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
                Pricing not listed — contact a reseller to purchase.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom edge gradient fade */}
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(255,109,41,0.2)] to-transparent" />
      </section>


      {/* ══════════════════════════════════════════════════════
          FULL SPECS
          ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-white mb-10">Full Specifications</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {product.specGroups.map((group) => (
            <div key={group.label} className="card-glass rounded-[16px] overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                <h3 className="font-bold text-white text-sm">{group.label}</h3>
              </div>
              <div className="divide-y divide-white/5">
                {group.specs.map((spec) => (
                  <div key={spec.label} className="px-5 py-3 flex items-start justify-between gap-4">
                    <span className="text-xs text-[#7a7178] shrink-0">{spec.label}</span>
                    <span className="text-xs text-white text-right font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          BROWSE THE RANGE
          ══════════════════════════════════════════════════════ */}
      <section className="border-t border-white/5 bg-[#0a0809]">
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
                    {/* Mini image */}
                    <div className="relative h-28 w-full" style={{ background: `radial-gradient(ellipse 80% 70% at 50% 60%, ${a}15 0%, transparent 70%)` }}>
                      <ProductImage src={p.heroImage.src} alt={p.heroImage.alt} accent={a} />
                    </div>
                    <div className="p-3">
                      <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: a }}>{p.range}</p>
                      <p className={`text-xs font-bold ${isCurrent ? "text-white" : "text-[#bababa] group-hover:text-white"} transition-colors`}>
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
          RESELLER HOOK
          ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div
          className="rounded-[20px] p-8 sm:p-12 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${accent}12 0%, rgba(13,11,12,0) 60%), rgba(26,21,24,0.8)`,
            border: `1px solid ${accent}33`,
          }}
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accent}15 0%, transparent 70%)` }}
          />
          <div className="relative grid sm:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: accent }}>
                Reseller opportunity
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Interested in stocking the {product.name}?
              </h3>
              <p className="text-[#bababa] text-sm">
                Apply to become an official NEO reseller. You&apos;ll get access to the full range,
                sell-through materials, and local warranty support.
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-3">
              <Link href="/become-a-reseller" className="btn-neo">
                Apply to become a reseller
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
              <Link href="/find-neo" className="btn-ghost">Find a reseller near you</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
