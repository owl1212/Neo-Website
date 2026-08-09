import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    slug: "fusion-a5",
    name: "Fusion A5",
    tagline: "Your workspace, elevated.",
    range: "Fusion",
    heroImage: {
      src: "/images/fusion-a5-hero.jpg",
      alt: "NEO Fusion A5 All-in-One PC",
      type: "product",
    },
    gallery: [
      { src: "/images/fusion-a5-hero.jpg", alt: "NEO Fusion A5 front view", type: "product" },
      { src: "/images/fusion-a5-back.jpg", alt: "NEO Fusion A5 back view", type: "product" },
    ],
    specSheetPdf: { src: "/specs/neo-fusion-a5-spec-sheet.pdf", label: "Download Spec Sheet" },
    status: "published",
    specGroups: [
      {
        label: "Display",
        specs: [
          { label: "Screen Size", value: '23.8" Full HD IPS' },
          { label: "Resolution", value: "1920 × 1080 px" },
          { label: "Panel Type", value: "IPS LCD" },
          { label: "Brightness", value: "250 nits" },
        ],
      },
      {
        label: "Performance",
        specs: [
          { label: "Processor", value: "Intel Core i5" },
          { label: "RAM", value: "8 GB DDR4" },
          { label: "Storage", value: "512 GB SSD" },
        ],
      },
      {
        label: "Connectivity",
        specs: [
          { label: "Wi-Fi", value: "802.11 a/b/g/n/ac (2.4 & 5 GHz)" },
          { label: "Bluetooth", value: "5.0" },
          { label: "USB", value: "USB 3.0 × 2, USB-C × 1" },
          { label: "Video Out", value: "HDMI 1.4" },
          { label: "Audio", value: "3.5 mm headphone jack, Built-in speakers" },
          { label: "Card Reader", value: "SD card reader" },
        ],
      },
      {
        label: "General",
        specs: [
          { label: "OS", value: "Windows 11 Pro" },
          { label: "Form Factor", value: "All-in-One Desktop" },
          { label: "Webcam", value: "Built-in HD webcam" },
          { label: "Keyboard / Mouse", value: "Wireless keyboard and mouse included" },
        ],
      },
    ],
  },
  {
    slug: "lite-14p",
    name: "Lite 14P",
    tagline: "All the essentials, nothing you don't need.",
    range: "Lite",
    heroImage: {
      src: "/images/lite-14p-hero.jpg",
      alt: "NEO Lite 14P laptop",
      type: "product",
    },
    gallery: [
      { src: "/images/lite-14p-front.jpg", alt: "NEO Lite 14P open front view", type: "product" },
      { src: "/images/lite-14p-back.jpg", alt: "NEO Lite 14P lid view", type: "product" },
    ],
    specSheetPdf: { src: "/specs/neo-lite-14p-spec-sheet.pdf", label: "Download Spec Sheet" },
    status: "published",
    specGroups: [
      {
        label: "Display",
        specs: [
          { label: "Screen Size", value: '14" HD' },
          { label: "Resolution", value: "1366 × 768 px" },
          { label: "Panel Type", value: "IPS LCD" },
          { label: "Finish", value: "Anti-glare" },
        ],
      },
      {
        label: "Performance",
        specs: [
          { label: "Processor", value: "Intel Core i3" },
          { label: "RAM", value: "8 GB DDR4" },
          { label: "Storage", value: "512 GB SSD" },
        ],
      },
      {
        label: "Connectivity",
        specs: [
          { label: "Wi-Fi", value: "802.11 a/b/g/n/ac (2.4 & 5 GHz)" },
          { label: "Bluetooth", value: "5.0" },
          { label: "USB", value: "USB 3.0 × 2, USB-C × 1" },
          { label: "Video Out", value: "HDMI" },
          { label: "Audio", value: "3.5 mm combo jack, Built-in speakers" },
          { label: "Card Reader", value: "SD card reader" },
        ],
      },
      {
        label: "General",
        specs: [
          { label: "OS", value: "Windows 11 Pro" },
          { label: "Battery", value: "Up to 8 hours" },
          { label: "Webcam", value: "Built-in HD webcam" },
          { label: "Color", value: "Silver" },
        ],
      },
    ],
  },
  {
    slug: "lite-14s",
    name: "Lite 14S",
    tagline: "Smart features, smarter price.",
    range: "Lite",
    heroImage: {
      src: "/images/lite-14s-hero.jpg",
      alt: "NEO Lite 14S laptop",
      type: "product",
    },
    gallery: [
      { src: "/images/lite-14s-front.jpg", alt: "NEO Lite 14S open front view", type: "product" },
    ],
    specSheetPdf: { src: "/specs/neo-lite-14s-spec-sheet.pdf", label: "Download Spec Sheet" },
    status: "published",
    specGroups: [
      {
        label: "Display",
        specs: [
          { label: "Screen Size", value: '14" HD' },
          { label: "Resolution", value: "1366 × 768 px" },
          { label: "Panel Type", value: "IPS LCD" },
          { label: "Finish", value: "Anti-glare" },
        ],
      },
      {
        label: "Performance",
        specs: [
          { label: "Processor", value: "Intel Celeron" },
          { label: "RAM", value: "4 GB DDR4" },
          { label: "Storage", value: "256 GB SSD" },
        ],
      },
      {
        label: "Connectivity",
        specs: [
          { label: "Wi-Fi", value: "802.11 a/b/g/n/ac (2.4 & 5 GHz)" },
          { label: "Bluetooth", value: "5.0" },
          { label: "USB", value: "USB 3.0 × 2, USB-C × 1" },
          { label: "Video Out", value: "HDMI" },
          { label: "Audio", value: "3.5 mm combo jack, Built-in speakers" },
          { label: "Card Reader", value: "SD card reader" },
        ],
      },
      {
        label: "General",
        specs: [
          { label: "OS", value: "Windows 11 Home" },
          { label: "Battery", value: "Up to 8 hours" },
          { label: "Webcam", value: "Built-in HD webcam" },
          { label: "Color", value: "Charcoal" },
        ],
      },
    ],
  },
  {
    slug: "pulse-5",
    name: "Pulse 5",
    tagline: "Power that moves with you.",
    range: "Pulse",
    heroImage: {
      src: "/images/pulse-5-hero.jpg",
      alt: "NEO Pulse 5 laptop",
      type: "product",
    },
    gallery: [
      { src: "/images/pulse-5-front.jpg", alt: "NEO Pulse 5 open front view", type: "product" },
    ],
    specSheetPdf: { src: "/specs/neo-pulse-5-spec-sheet.pdf", label: "Download Spec Sheet" },
    status: "published",
    specGroups: [
      {
        label: "Display",
        specs: [
          { label: "Screen Size", value: '15.6" Full HD' },
          { label: "Resolution", value: "1920 × 1080 px" },
          { label: "Panel Type", value: "IPS LCD" },
          { label: "Finish", value: "Anti-glare" },
        ],
      },
      {
        label: "Performance",
        specs: [
          { label: "Processor", value: "Intel Core i3" },
          { label: "RAM", value: "8 GB DDR4" },
          { label: "Storage", value: "512 GB SSD" },
        ],
      },
      {
        label: "Connectivity",
        specs: [
          { label: "Wi-Fi", value: "802.11 a/b/g/n/ac (2.4 & 5 GHz)" },
          { label: "Bluetooth", value: "5.0" },
          { label: "USB", value: "USB 3.0 × 2, USB-C × 1" },
          { label: "Video Out", value: "HDMI" },
          { label: "Audio", value: "3.5 mm combo jack, Built-in speakers" },
          { label: "Card Reader", value: "SD card reader" },
        ],
      },
      {
        label: "General",
        specs: [
          { label: "OS", value: "Windows 11 Pro" },
          { label: "Battery", value: "Up to 8 hours" },
          { label: "Webcam", value: "Built-in HD webcam" },
          { label: "Color", value: "Silver" },
        ],
      },
    ],
  },
  {
    slug: "pulse-7",
    name: "Pulse 7",
    tagline: "More screen. More power. More you.",
    range: "Pulse",
    heroImage: {
      src: "/images/pulse-7-hero.jpg",
      alt: "NEO Pulse 7 laptop",
      type: "product",
    },
    gallery: [
      { src: "/images/pulse-7-front.jpg", alt: "NEO Pulse 7 open front view", type: "product" },
      { src: "/images/pulse-7-back.jpg", alt: "NEO Pulse 7 lid view", type: "product" },
    ],
    specSheetPdf: { src: "/specs/neo-pulse-7-spec-sheet.pdf", label: "Download Spec Sheet" },
    status: "published",
    specGroups: [
      {
        label: "Display",
        specs: [
          { label: "Screen Size", value: '15.6" Full HD' },
          { label: "Resolution", value: "1920 × 1080 px" },
          { label: "Panel Type", value: "IPS LCD" },
          { label: "Finish", value: "Anti-glare" },
        ],
      },
      {
        label: "Performance",
        specs: [
          { label: "Processor", value: "Intel Core i5 (12th Gen)" },
          { label: "RAM", value: "8 GB DDR4" },
          { label: "Storage", value: "512 GB SSD" },
        ],
      },
      {
        label: "Connectivity",
        specs: [
          { label: "Wi-Fi", value: "802.11 a/b/g/n/ac (2.4 & 5 GHz)" },
          { label: "Bluetooth", value: "5.0" },
          { label: "USB", value: "USB 3.0 × 2, USB-C × 1" },
          { label: "Video Out", value: "HDMI" },
          { label: "Audio", value: "3.5 mm combo jack, Built-in speakers" },
          { label: "Card Reader", value: "SD card reader" },
        ],
      },
      {
        label: "General",
        specs: [
          { label: "OS", value: "Windows 11 Pro" },
          { label: "Battery", value: "Up to 8 hours" },
          { label: "Webcam", value: "Built-in HD webcam" },
          { label: "Color", value: "Silver" },
        ],
      },
    ],
  },
  {
    slug: "tab-t606",
    name: "Tab T606",
    tagline: "A bigger screen for a bigger life.",
    range: "Tab",
    heroImage: {
      src: "/images/tab-t606-hero.jpg",
      alt: "NEO Tab T606 tablet",
      type: "product",
    },
    gallery: [
      { src: "/images/tab-t606-front.jpg", alt: "NEO Tab T606 front view", type: "product" },
      { src: "/images/tab-t606-landscape.jpg", alt: "NEO Tab T606 in landscape", type: "lifestyle" },
    ],
    specSheetPdf: { src: "/specs/neo-tab-t606-spec-sheet.pdf", label: "Download Spec Sheet" },
    status: "published",
    specGroups: [
      {
        label: "Display",
        specs: [
          { label: "Screen Size", value: '10.1" IPS' },
          { label: "Resolution", value: "HD (1280 × 800 px)" },
          { label: "Panel Type", value: "IPS LCD" },
        ],
      },
      {
        label: "Performance",
        specs: [
          { label: "Processor", value: "UniSOC T606" },
          { label: "CPU", value: "Octa-core, up to 1.6 GHz" },
          { label: "RAM", value: "4 GB LPDDR4" },
          { label: "Storage", value: "128 GB" },
          { label: "Expandable", value: "Up to 1 TB (microSD)" },
        ],
      },
      {
        label: "Camera",
        specs: [
          { label: "Rear Camera", value: "13 MP, Auto-focus" },
          { label: "Front Camera", value: "5 MP" },
          { label: "Video", value: "1080p @ 30fps" },
        ],
      },
      {
        label: "Connectivity",
        specs: [
          { label: "Network", value: "4G LTE, Dual SIM" },
          { label: "Wi-Fi", value: "802.11 a/b/g/n/ac (2.4 & 5 GHz)" },
          { label: "Bluetooth", value: "5.0" },
          { label: "USB", value: "USB-C 2.0, OTG" },
          { label: "GPS", value: "GPS, AGPS, GLONASS" },
        ],
      },
      {
        label: "General",
        specs: [
          { label: "OS", value: "Android 13" },
          { label: "Battery", value: "7000 mAh — up to 12 hours video" },
          { label: "Security", value: "Fingerprint sensor" },
          { label: "SIM", value: "Dual Nano SIM + microSD" },
          { label: "Color", value: "Graphite Grey" },
        ],
      },
    ],
  },
];
