import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NEO — Built For You. Proudly Zambian.",
    template: "%s | NEO Zambia",
  },
  description:
    "NEO is Zambia's first laptop brand — built for the people. Discover our full range of laptops, tablets, and PCs, find a reseller near you, or become a NEO partner.",
  keywords: ["NEO", "Zambia", "laptop", "Zambian laptop brand", "reseller", "Fusion A5", "Lite", "Pulse", "Tab T606"],
  icons: {
    icon: "/images/neo-logo.png",
    shortcut: "/images/neo-logo.png",
    apple: "/images/neo-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_ZM",
    siteName: "NEO Zambia",
    title: "NEO — Built For You. Proudly Zambian.",
    description:
      "NEO is Zambia's first laptop brand built for the people. Explore our devices, find a reseller, or partner with us.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
