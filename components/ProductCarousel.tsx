"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

const rangeAccents: Record<string, string> = {
  Fusion: "#FF6D29",
  Lite: "#6b9fff",
  Pulse: "#a855f7",
  Tab: "#22d3ee",
};

export function ProductCarousel({ products }: { products: Product[] }) {
  const [center, setCenter] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const n = products.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => doNavigate("right"), 2000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, center, n]);

  function doNavigate(dir: "left" | "right") {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      setCenter((c) => (dir === "right" ? (c + 1) % n : (c - 1 + n) % n));
      setFading(false);
    }, 200);
  }

  function navigate(dir: "left" | "right") {
    setPaused(true);
    doNavigate(dir);
  }

  const prev = (center - 1 + n) % n;
  const next = (center + 1) % n;

  const slots = [
    { product: products[prev], role: "left" as const },
    { product: products[center], role: "center" as const },
    { product: products[next], role: "right" as const },
  ];

  const centerAccent = rangeAccents[products[center].range ?? "Fusion"] ?? "#FF6D29";

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) navigate(diff > 0 ? "right" : "left");
        touchStartX.current = null;
      }}
      className="flex flex-col items-center"
    >
      {/* Three-panel stage */}
      <div
        className="w-full grid grid-cols-[0.6fr_1.7fr_0.6fr] sm:grid-cols-[1fr_1.7fr_1fr] items-end gap-2 sm:gap-4"
        style={{ opacity: fading ? 0 : 1, transition: "opacity 0.2s ease" }}
      >
        {slots.map(({ product, role }) => {
          const accent = rangeAccents[product.range ?? "Fusion"] ?? "#FF6D29";
          const isCenter = role === "center";

          return (
            <div
              key={`${role}-${product.slug}`}
              className={`flex flex-col items-center transition-all duration-300 ${
                isCenter ? "" : "cursor-pointer opacity-40 hover:opacity-60"
              }`}
              onClick={
                !isCenter
                  ? () => navigate(role === "left" ? "left" : "right")
                  : undefined
              }
            >
              <div
                className={`relative w-full ${
                  isCenter
                    ? "h-[400px] sm:h-[560px] lg:h-[660px]"
                    : "h-[220px] sm:h-[310px] lg:h-[370px]"
                }`}
              >
                {isCenter && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    aria-hidden
                  >
                    <div
                      className="w-[260px] h-[260px] rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${accent}40 0%, transparent 65%)`,
                        filter: "blur(70px)",
                      }}
                    />
                  </div>
                )}
                <Image
                  src={product.heroImage.src}
                  alt={product.heroImage.alt}
                  fill
                  className={`object-contain ${product.range === "Tab" ? "scale-[0.7]" : ""}`}
                  style={isCenter ? { animation: "floatProduct 3.8s ease-in-out infinite" } : undefined}
                  sizes={
                    isCenter
                      ? "(max-width: 768px) 55vw, 40vw"
                      : "(max-width: 768px) 22vw, 18vw"
                  }
                />
              </div>

              <div className="text-center mt-4 mb-2">
                <p
                  className={`font-extrabold text-white leading-tight ${
                    isCenter ? "text-xl sm:text-2xl" : "hidden sm:block text-sm sm:text-base"
                  }`}
                >
                  {product.name}
                </p>
                {isCenter ? (
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.22em] uppercase mt-2"
                    style={{ color: accent }}
                  >
                    Explore
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                  </Link>
                ) : (
                  <p className="hidden sm:block text-[10px] font-bold tracking-[0.22em] uppercase text-[#5a5158] mt-2">
                    Explore
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrows + dots */}
      <div className="mt-10 flex items-center gap-5">
        <button
          onClick={() => navigate("left")}
          aria-label="Previous product"
          className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-[#7a7178] hover:border-[rgba(255,109,41,0.5)] hover:text-[#FF6D29] transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
          </svg>
        </button>

        <div className="flex gap-1.5">
          {products.map((_, i) => (
            <span
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === center ? "18px" : "6px",
                height: "6px",
                background: i === center ? centerAccent : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => navigate("right")}
          aria-label="Next product"
          className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-[#7a7178] hover:border-[rgba(255,109,41,0.5)] hover:text-[#FF6D29] transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </button>
      </div>

      <p className="mt-6 text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase text-[#5a5158] text-center">
        Find your style in three distinctive collections
      </p>
    </div>
  );
}
