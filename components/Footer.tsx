import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Products: [
    { href: "/products/fusion-a5", label: "Fusion A5" },
    { href: "/products/lite-14p", label: "Lite 14P" },
    { href: "/products/lite-14s", label: "Lite 14S" },
    { href: "/products/pulse-5", label: "Pulse 5" },
    { href: "/products/pulse-7", label: "Pulse 7" },
    { href: "/products/tab-t606", label: "Tab T606" },
  ],
  Partners: [
    { href: "/become-a-reseller", label: "Become a Reseller" },
    { href: "/find-neo", label: "Find a Reseller" },
    { href: "/financing-community", label: "Financing & Community" },
  ],
  Support: [
    { href: "/support", label: "Warranty & Support" },
    { href: "/support#faq", label: "Claims FAQ" },
    { href: "/support#contact", label: "Contact Us" },
  ],
  Company: [
    { href: "/about", label: "About NEO" },
    { href: "/news", label: "News" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0a0809] border-t border-[rgba(255,109,41,0.1)] mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Top */}
        <div className="py-10 md:py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <Image src="/images/neo-logo.png" alt="NEO" width={36} height={36} className="object-contain" />
              <span className="text-xl font-extrabold text-gradient">NEO</span>
            </Link>
            <p className="text-sm text-[#7a7178] leading-relaxed max-w-xs">
              Built For You. Proudly Zambian.
              <br />
              Empowering Digital Growth.
              <br />
              Laptops, tablets, and PCs designed for Zambia, by Zambians.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.facebook.com/share/1FdWkKfZi5/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-[#7a7178] hover:border-[#FF6D29] hover:text-[#FF6D29] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/neo-computing-solutions/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-[#7a7178] hover:border-[#FF6D29] hover:text-[#FF6D29] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[#7a7178] mb-4">
                {category}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#bababa] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="neo-divider" />
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7a7178]">
          <p>© {new Date().getFullYear()} NEO Zambia. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6D29]" />
            Built For You. Proudly Zambian.
          </p>
        </div>
      </div>
    </footer>
  );
}
