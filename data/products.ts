import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    slug: "fusion-a5",
    name: "Fusion A5",
    tagline: "Multi-Task on a Whole New Level",
    description: "One clean unit for a proper desk — a home office, a business counter, a reception desk. No tower to hide, no cable jungle, just a real Intel Core i5 doing the work: browsing, email, spreadsheets, video calls, all at once, comfortably.",
    range: "Fusion",
    heroImage: {
      src: "/images/fusion-a5-hero.png",
      alt: "NEO Fusion A5 All-in-One PC",
      type: "product",
    },
    gallery: [
      { src: "/images/fusion-a5-hero.png", alt: "NEO Fusion A5 front view", type: "product" },
      { src: "/images/fusion-a5-back.png", alt: "NEO Fusion A5 back view", type: "product" },
    ],
    specSheetPdf: { src: "/Specs/neo-fusion-a5.pdf", label: "Download Spec Sheet" },
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
    tagline: "P for Power & Portability",
    description: "The easy, no-fuss laptop. Light enough to carry all day, simple enough for a first-time laptop owner. Built for the basics done properly — browsing, typing, schoolwork.",
    range: "Lite",
    heroImage: {
      src: "/images/lite-14p-hero.png",
      alt: "NEO Lite 14P laptop",
      type: "product",
    },
    gallery: [
      { src: "/images/lite-14p-hero.png", alt: "NEO Lite 14P open front view", type: "product" },
    ],
    specSheetPdf: { src: "/Specs/neo-lite-14p.pdf", label: "Download Spec Sheet" },
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
          { label: "Color", value: "Silver" },
        ],
      },
    ],
  },
  {
    slug: "lite-14s",
    name: "Lite 14S",
    tagline: "Light Outside, Heavy Inside",
    description: "Same light, easy-to-carry body as the 14P, with double the memory and double the storage inside. Built for anyone juggling more files, tabs, and apps than a first-timer.",
    range: "Lite",
    heroImage: {
      src: "/images/lite-14s-hero.png",
      alt: "NEO Lite 14S laptop",
      type: "product",
    },
    gallery: [
      { src: "/images/lite-14s-hero.png", alt: "NEO Lite 14S open front view", type: "product" },
      { src: "/images/lite-14s-front.png", alt: "NEO Lite 14S angled view", type: "product" },
    ],
    specSheetPdf: { src: "/Specs/neo-lite-14s.pdf", label: "Download Spec Sheet" },
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
    tagline: "Engineered for Extreme Performance — The Confident Step Up",
    description: "Where NEO steps into serious territory. A genuinely modern Intel Core Ultra 5 processor and a bigger, sharper 15.6-inch screen — a real step up for anyone who's outgrown a basic laptop.",
    range: "Pulse",
    heroImage: {
      src: "/images/pulse-5-hero.png",
      alt: "NEO Pulse 5 laptop",
      type: "product",
    },
    gallery: [
      { src: "/images/pulse-5-hero.png", alt: "NEO Pulse 5 side view", type: "product" },
    ],
    specSheetPdf: { src: "/Specs/neo-pulse-5.pdf", label: "Download Spec Sheet" },
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
          { label: "Processor", value: "Intel Core Ultra 5" },
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
          { label: "OS", value: "Windows 11 Home" },
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
    tagline: "Engineered for Extreme Performance — Top of the Range",
    description: "The top of the NEO laptop range. Core Ultra 7 processor, 16GB of memory, and a full terabyte of storage — room and power for heavy multitasking, or simply the best NEO makes.",
    range: "Pulse",
    heroImage: {
      src: "/images/pulse-7-hero.png",
      alt: "NEO Pulse 7 laptop",
      type: "product",
    },
    gallery: [
      { src: "/images/pulse-7-hero.png", alt: "NEO Pulse 7 front view", type: "product" },
      { src: "/images/pulse-7-back.png", alt: "NEO Pulse 7 back view", type: "product" },
    ],
    specSheetPdf: { src: "/Specs/neo-pulse-7.pdf", label: "Download Spec Sheet" },
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
          { label: "Processor", value: "Intel Core Ultra 7" },
          { label: "RAM", value: "16 GB DDR4" },
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
          { label: "OS", value: "Windows 11 Home" },
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
    tagline: "Where Every Pixel Tells a Story",
    description: "The easy, everyday tablet for browsing, video, reading, and video calls. LTE means it's never stuck to WiFi, the 7000mAh battery is built to last a full day, and it ships with its own protective case — nothing extra to buy.",
    range: "Tab",
    heroImage: {
      src: "/images/tab-t606-front.png",
      alt: "NEO Tab T606 tablet",
      type: "product",
    },
    gallery: [
      { src: "/images/tab-t606-front.png", alt: "NEO Tab T606 front view", type: "product" },
      { src: "/images/tab-t606-hero.png", alt: "NEO Tab T606 angled view", type: "product" },
      { src: "/images/tab-t606-back.png", alt: "NEO Tab T606 back view", type: "product" },
    ],
    specSheetPdf: { src: "/Specs/neo-tab-t606.pdf", label: "Download Spec Sheet" },
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
          { label: "Processor", value: "Octa-Core processor" },
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
