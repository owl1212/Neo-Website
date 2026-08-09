"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  accent?: string;
  priority?: boolean;
  className?: string;
}

export function ProductImage({ src, alt, accent = "#FF6D29", priority = false, className = "" }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center rounded-2xl"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${accent}18 0%, transparent 70%)`,
        }}
      >
        <span className="text-5xl font-extrabold opacity-20 select-none" style={{ color: accent }}>
          NEO
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      onError={() => setErrored(true)}
      className={`object-contain ${className}`}
      style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.55))" }}
    />
  );
}
