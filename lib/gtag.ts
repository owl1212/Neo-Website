// Google tag (gtag.js) — Google Ads conversion/campaign tracking, plus GA4 if
// a G- ID is configured. Every ID is optional: with none set, the tag never
// loads and the helpers below are no-ops, so local dev stays clean.

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Comma-separated, e.g. "AW-123456789,G-ABC123XYZ". The first ID is the one
// the gtag.js script is loaded with; the rest are added via gtag('config').
export const GOOGLE_TAG_IDS = (process.env.NEXT_PUBLIC_GOOGLE_TAG_IDS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

// Google Ads conversion actions, each in "AW-123456789/AbCdEfGhIjK" form
// (Google Ads → Goals → Conversions → the action → Tag setup → "send_to").
export const CONVERSIONS = {
  contact: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_CONVERSION,
  resellerApplication: process.env.NEXT_PUBLIC_GOOGLE_ADS_RESELLER_CONVERSION,
} as const;

export type ConversionName = keyof typeof CONVERSIONS;

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag(...args);
}

export function trackPageView(path: string) {
  gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

// Fires the Google Ads conversion (if its send_to is configured) and a GA4
// generate_lead event, so the lead also shows up in Analytics when present.
export function trackConversion(name: ConversionName) {
  const sendTo = CONVERSIONS[name];
  if (sendTo) gtag("event", "conversion", { send_to: sendTo });
  gtag("event", "generate_lead", { lead_type: name });
}
