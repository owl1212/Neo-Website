"use client";

import { useState } from "react";
import Image from "next/image";
import type { NeoImage } from "@/lib/types";

type VideoHeroProps = {
  videoSrc: string | null;
  fallbackImage: NeoImage;
  className: string;
};

// Full-bleed hero background: plays videoSrc if given, but falls back to a
// static image when there's no video source at all, or the <video> fires
// onError — so a missing/failed asset degrades to a real image instead of
// a blank box. No `poster` attribute (deliberately dropped from every
// video hero — see 1.0's "Remove poster attribute from all video
// elements"/"Remove homepage hero video poster image"); onError remains
// as the fallback for a video that fails outright.
export function VideoHero({ videoSrc, fallbackImage, className }: VideoHeroProps) {
  const [videoFailed, setVideoFailed] = useState(false);

  if (!videoSrc || videoFailed) {
    return (
      <Image
        src={fallbackImage.src}
        alt={fallbackImage.alt}
        fill
        priority
        sizes="100vw"
        className={className}
      />
    );
  }

  return (
    <video
      src={videoSrc}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      onError={() => setVideoFailed(true)}
      className={className}
    />
  );
}
