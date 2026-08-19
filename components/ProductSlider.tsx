"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductImage } from "./ProductImage";
import type { Product } from "@/lib/types";

const rangeAccents: Record<string, string> = {
  Fusion: "#FF6D29",
  Lite: "#6b9fff",
  Pulse: "#a855f7",
  Tab: "#22d3ee",
};

export function ProductSlider({ products }: { products: Product[] }) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % products.length);
        setFading(false);
      }, 180);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, products.length]);

  function switchTo(i: number) {
    if (i === active) return;
    setPaused(true);
    setFading(true);
    setTimeout(() => {
      setActive(i);
      setFading(false);
    }, 180);
  }

  const product = products[active];
  const accent = rangeAccents[product.range ?? "Fusion"] ?? "#FF6D29";

  const keySpecs = [
    product.specGroups.find((g) => g.label === "Display")?.specs[0],
    product.specGroups.find((g) => g.label === "Performance")?.specs.find((s) => s.label === "Processor"),
    product.specGroups.find((g) => g.label === "Performance")?.specs.find((s) => s.label === "RAM"),
    product.specGroups.find((g) => g.label === "General")?.specs.find((s) => s.label === "OS"),
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Slide */}
      <div
        className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center"
        style={{ opacity: fading ? 0 : 1, transition: "opacity 0.18s ease" }}
      >
        {/* Image */}
        <div className="relative h-64 sm:h-80 lg:h-[440px]">
          {/* Ambient orange glow */}
          <div
            className="absolute inset-0 flex items-center justify-end pointer-events-none"
            aria-hidden
          >
            <div
              className="w-[480px] h-[480px] rounded-full"
              style={{
                background: `radial-gradient(circle, ${accent}30 0%, transparent 65%)`,
                filter: "blur(60px)",
                transform: "translateX(20%)",
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

        {/* Info */}
        <div>
          <span
            className="text-xs font-bold tracking-widest uppercase mb-3 block"
            style={{ color: accent }}
          >
            {product.range}
          </span>
          <h3 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
            {product.name}
          </h3>
          {product.tagline && (
            <p className="text-lg text-[#bababa] mb-8 leading-relaxed">{product.tagline}</p>
          )}

          {keySpecs.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-8">
              {keySpecs.map((spec) => (
                <div key={spec.label} className="bg-white/[0.04] rounded-xl p-4 border border-white/5">
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-[#9a9096] mb-1">
                    {spec.label}
                  </p>
                  <p className="text-sm font-semibold text-white leading-tight">{spec.value}</p>
                </div>
              ))}
            </div>
          )}

          <Link href={`/products/${product.slug}`} className="btn-neo">
            View full specs
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Switcher */}
      <div className="mt-10 -mx-5 px-5 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap pb-1">
          {products.map((p, i) => {
            const a = rangeAccents[p.range ?? "Fusion"] ?? "#FF6D29";
            const isActive = i === active;
            return (
              <button
                key={p.slug}
                onClick={() => switchTo(i)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0"
                style={{
                  background: isActive ? `${a}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isActive ? `${a}55` : "rgba(255,255,255,0.06)"}`,
                  color: isActive ? "#fff" : "#7a7178",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 transition-all duration-200"
                  style={{ background: isActive ? a : "rgba(255,255,255,0.2)" }}
                />
                {p.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
