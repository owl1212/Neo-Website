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
// onError (e.g. the .mp4 is gitignored out of public/videos and missing on
// this checkout) — so a missing asset degrades to a real image instead of
// a blank box.
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
      onError={() => setVideoFailed(true)}
      className={className}
    />
  );
}
