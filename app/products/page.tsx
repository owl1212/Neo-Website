import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/content";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse the full NEO range — 6 devices built for Zambian life. Verified specs, no pricing.",
};

const rangeColors: Record<string, { bg: string; text: string; border: string }> = {
  Fusion: { bg: "from-[#FF6D29]/25 to-[#FF6D29]/5", text: "text-[#FF6D29]", border: "border-[rgba(255,109,41,0.2)]" },
  Lite: { bg: "from-[#6b9fff]/25 to-[#6b9fff]/5", text: "text-[#6b9fff]", border: "border-[rgba(107,159,255,0.2)]" },
  Pulse: { bg: "from-[#a855f7]/25 to-[#a855f7]/5", text: "text-[#a855f7]", border: "border-[rgba(168,85,247,0.2)]" },
  Tab: { bg: "from-[#22d3ee]/25 to-[#22d3ee]/5", text: "text-[#22d3ee]", border: "border-[rgba(34,211,238,0.2)]" },
};

function ProductCard({ product }: { product: Product }) {
  const colors = rangeColors[product.range ?? "Fusion"] ?? rangeColors.Fusion;
  const displaySpec = product.specGroups.find((g) => g.label === "Display")?.specs[0]?.value;
  const batterySpec = product.specGroups.find((g) => g.label === "Battery")?.specs[0]?.value;
  const cameraSpec = product.specGroups.find((g) => g.label === "Camera")?.specs[0]?.value;
  const ramSpec = product.specGroups.find((g) => g.label === "Performance")?.specs.find((s) => s.label === "RAM")?.value;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group card-glass rounded-[20px] overflow-hidden hover:border-[rgba(255,109,41,0.35)] transition-all duration-300 flex flex-col`}
    >
      {/* Image area */}
      <div
        className={`h-64 bg-gradient-to-br ${colors.bg} flex items-center justify-center relative overflow-hidden`}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 70% at 50% 30%, rgba(255,255,255,0.05) 0%, transparent 70%)",
          }}
        />
        {/* Range badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${colors.text} border ${colors.border} bg-[#0d0b0c]/60 backdrop-blur-sm`}>
          {product.range}
        </div>
        {/* Arrow */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0d0b0c]/60 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </div>
        {/* Device name watermark */}
        <span className="text-5xl font-extrabold text-white/8 select-none group-hover:text-white/12 transition-colors text-center px-4">
          {product.name}
        </span>
        {/* Camera notch detail */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/15" />
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-2xl font-bold text-white mb-1">{product.name}</h3>
          {product.tagline && <p className="text-sm text-[#7a7178]">{product.tagline}</p>}
        </div>

        {/* Key specs */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-white/5">
          {[
            { label: "Display", value: displaySpec },
            { label: "Battery", value: batterySpec },
            { label: "Camera", value: cameraSpec?.split(",")[0] },
            { label: "RAM", value: ramSpec },
          ].filter((s) => s.value).map((spec) => (
            <div key={spec.label} className="bg-white/[0.03] rounded-lg p-2.5">
              <p className="text-[10px] font-semibold tracking-wide uppercase text-[#7a7178] mb-0.5">{spec.label}</p>
              <p className="text-xs text-white font-medium leading-tight">{spec.value}</p>
            </div>
          ))}
        </div>

        <div className={`mt-4 flex items-center gap-2 text-sm font-semibold ${colors.text}`}>
          View full specs
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default async function ProductsPage() {
  const products = await getProducts();
  const ranges = ["Fusion", "Lite", "Pulse", "Tab"] as const;

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,109,41,0.18) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <div className="section-label mx-auto w-fit mb-6">The Full Range</div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4">
            Every device. Every need.
          </h1>
          <p className="text-lg text-[#bababa] max-w-xl mx-auto">
            Six smartphones and tablets built for Zambian life. Tap any device for verified
            specs and a downloadable spec sheet.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        {/* Range filter tabs (display only — all show) */}
        <div className="flex flex-wrap gap-2 mb-10">
          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-[#FF6D29] text-white">All</span>
          {ranges.map((r) => (
            <span key={r} className={`px-4 py-2 rounded-full text-sm font-semibold border ${rangeColors[r].border} ${rangeColors[r].text} opacity-60`}>
              {r}
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>

        {/* Reseller hook */}
        <div className="mt-16 card-glass rounded-[20px] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#FF6D29] mb-2">For resellers</p>
            <h3 className="text-xl font-bold text-white mb-1">Interested in stocking these devices?</h3>
            <p className="text-sm text-[#7a7178]">Apply to become an official NEO reseller — free, fast, and open to all businesses.</p>
          </div>
          <Link href="/become-a-reseller" className="btn-neo shrink-0">
            Become a Reseller
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
