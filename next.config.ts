import type { NextConfig } from "next";

// Product images/PDFs now live in Directus (see lib/content.ts), served
// from {DIRECTUS_URL}/assets/{file_id} — next/image only optimizes
// remote hosts it's explicitly told about. Derived from DIRECTUS_URL
// rather than hardcoded so this keeps working once DIRECTUS_URL points
// at a production Directus domain instead of localhost, as long as that
// env var is actually set at build time in that environment.
const directusUrl = new URL(process.env.DIRECTUS_URL ?? "http://localhost:8055");

// Next's image optimizer refuses to fetch from a host that resolves to a
// private/loopback IP by default (SSRF protection) — which is exactly
// what local dev needs, since Directus runs on localhost. Only lift that
// protection when DIRECTUS_URL is actually pointed at localhost, so it
// stays on once DIRECTUS_URL is a real production domain.
const isLocalDirectus = ["localhost", "127.0.0.1", "::1"].includes(directusUrl.hostname);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: directusUrl.protocol.replace(/:$/, "") as "http" | "https",
        hostname: directusUrl.hostname,
        port: directusUrl.port,
        pathname: "/assets/**",
      },
    ],
    ...(isLocalDirectus ? { dangerouslyAllowLocalIP: true } : {}),
  },
};

export default nextConfig;
