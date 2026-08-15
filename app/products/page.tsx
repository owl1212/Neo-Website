import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/content";
import type { Product } from "@/lib/types";
import { FadeIn } from "@/components/FadeIn";
import { VideoHero } from "@/components/VideoHero";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse the full NEO range — 6 devices built for Zambian life. Verified specs, no pricing.",
};

const rangeAccents: Record<string, string> = {
  Fusion: "#FF6D29",
  Lite: "#6b9fff",
  Pulse: "#a855f7",
  Tab: "#22d3ee",
};

function getKeySpecs(product: Product) {
  return [
    product.specGroups.find((g) => g.label === "Display")?.specs[0],
    product.specGroups.find((g) => g.label === "Performance")?.specs.find((s) => s.label === "Processor"),
    product.specGroups.find((g) => g.label === "Performance")?.specs.find((s) => s.label === "RAM"),
    product.specGroups.find((g) => g.label === "General")?.specs.find(
      (s) => s.label === "OS" || s.label === "Battery"
    ),
  ].filter(Boolean) as { label: string; value: string }[];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          HERO — full-screen video, no overlay text
          ══════════════════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden bg-[#0d0b0c]">
        <VideoHero
          videoId="1Cir35FxcwY"
          fallbackImage={{ src: "/images/fusion-a5-hero.png", alt: "NEO Fusion A5 All-in-One PC" }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to top, #0d0b0c 0%, transparent 100%)" }}
        />
        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-px h-10 bg-gradient-to-b from-[#FF6D29] to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          RANGE INTRO — heading + subtitle  [DARK]
          ══════════════════════════════════════════════════════ */}
      <section className="relative py-20 bg-[#0d0b0c]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,109,41,0.10) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <FadeIn>
            <div className="section-label mx-auto w-fit mb-6">The Full Range</div>
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-6">
              Six products.
              <br />
              <span className="text-gradient">Three collections.</span>
            </h1>
            <p className="text-lg text-[#bababa] max-w-xl mx-auto">
              Every NEO device built and verified for Zambian life. Scroll to explore each one.
            </p>
          </FadeIn>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          PRODUCT SECTIONS — one per device, alternating layout
          ══════════════════════════════════════════════════════ */}
      {products.map((product, i) => {
        const accent = rangeAccents[product.range ?? "Fusion"] ?? "#FF6D29";
        const keySpecs = getKeySpecs(product);
        const imageLeft = i % 2 === 0;

        return (
          <section
            key={product.slug}
            className="relative bg-[#0d0b0c] border-t border-white/[0.04] overflow-hidden"
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 50% 70% at ${imageLeft ? "25%" : "75%"} 50%, ${accent}12 0%, transparent 55%)`,
              }}
            />

            <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
              <div
                className={`grid lg:grid-cols-2 items-center gap-0 ${
                  imageLeft ? "" : "lg:[&>*:first-child]:order-last"
                }`}
              >
                {/* Image column */}
                <div className={`relative w-full h-[60vw] lg:h-screen flex items-center justify-center`}>
                  {/* Glow blob */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    aria-hidden
                  >
                    <div
                      className="w-[80%] h-[80%] rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${accent}35 0%, transparent 65%)`,
                        filter: "blur(100px)",
                      }}
                    />
                  </div>
                  <Image
                    src={product.heroImage.src}
                    alt={product.heroImage.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                {/* Text column */}
                <FadeIn from={imageLeft ? "right" : "left"} className={`py-16 lg:py-24 ${imageLeft ? "lg:pl-16" : "lg:pr-16"}`}>
                  {/* Range label */}
                  <span
                    className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block"
                    style={{ color: accent }}
                  >
                    NEO {product.range}
                  </span>

                  {/* Product name */}
                  <h2 className="text-5xl sm:text-6xl xl:text-[72px] font-extrabold text-white leading-[1.0] tracking-tight mb-5">
                    {product.name}
                  </h2>

                  {/* Tagline + description */}
                  {product.tagline && (
                    <p className="text-lg sm:text-xl text-[#bababa] mb-3 leading-relaxed max-w-md">
                      {product.tagline}
                    </p>
                  )}
                  {product.description && (
                    <p className="text-sm text-[#7a7178] mb-10 leading-relaxed max-w-md">
                      {product.description}
                    </p>
                  )}

                  {/* Key specs */}
                  {keySpecs.length > 0 && (
                    <div className="space-y-3 mb-10 max-w-sm">
                      {keySpecs.map((spec) => (
                        <div
                          key={spec.label}
                          className="flex items-baseline gap-4 border-b border-white/[0.06] pb-3"
                        >
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#5a5158] w-20 shrink-0">
                            {spec.label}
                          </span>
                          <span className="text-sm font-semibold text-white leading-snug">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-3 group"
                  >
                    <span
                      className="text-sm font-bold tracking-wide"
                      style={{ color: accent }}
                    >
                      Explore {product.name}
                    </span>
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 group-hover:translate-x-1"
                      style={{
                        borderColor: `${accent}55`,
                        color: accent,
                      }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </span>
                  </Link>
                </FadeIn>
              </div>
            </div>
          </section>
        );
      })}


      {/* ══════════════════════════════════════════════════════
          RESELLER HOOK
          ══════════════════════════════════════════════════════ */}
      <section className="bg-[#0d0b0c] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div className="card-glass rounded-[20px] p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#FF6D29] mb-3">For Resellers</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
                Interested in stocking these devices?
              </h3>
              <p className="text-[#7a7178] leading-relaxed">
                Join the NEO reseller network. Free application, competitive margins, and
                full local warranty support — built for Zambian businesses.
              </p>
            </div>
            <Link href="/become-a-reseller" className="btn-neo text-base py-4 px-8 shrink-0">
              Become a Reseller
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
