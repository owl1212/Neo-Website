"use client";

import { useState } from "react";
import Image from "next/image";
import type { NeoImage } from "@/lib/types";

type VideoHeroProps = {
  videoId: string | null; // YouTube video id, not a URL
  fallbackImage: NeoImage;
};

// Full-bleed hero background: embeds the given YouTube video (muted,
// looped, autoplaying, cropped via the same scale(1.5) trick used
// elsewhere), falling back to a static image when there's no video id at
// all, or the iframe fires onError. Note that's best-effort — cross-origin
// embeds don't reliably surface content-level failures (e.g. a since-
// deleted video), only network-level ones — but it still covers the "no
// video id mapped for this product" case, which previously rendered a
// bare gradient strip instead of a real hero.
export function VideoHero({ videoId, fallbackImage }: VideoHeroProps) {
  const [videoFailed, setVideoFailed] = useState(false);

  if (!videoId || videoFailed) {
    return (
      <Image
        src={fallbackImage.src}
        alt={fallbackImage.alt}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
      allow="autoplay; fullscreen"
      onError={() => setVideoFailed(true)}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ transform: "scale(1.5)", border: "none" }}
    />
  );
}
