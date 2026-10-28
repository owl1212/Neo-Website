"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { GOOGLE_TAG_IDS, trackPageView } from "@/lib/gtag";

export function GoogleTag() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // gtag('config') sends the initial page_view itself. App Router navigations
  // after that are client-side, so report each one explicitly — otherwise
  // Google Ads remarketing only ever sees the landing page.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackPageView(pathname);
  }, [pathname]);

  if (GOOGLE_TAG_IDS.length === 0) return null;

  const configCalls = GOOGLE_TAG_IDS.map((id) => `gtag('config', ${JSON.stringify(id)});`).join("\n");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_TAG_IDS[0])}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
${configCalls}`}
      </Script>
    </>
  );
}
