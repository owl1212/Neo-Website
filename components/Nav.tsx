"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/become-a-reseller", label: "Become a Reseller" },
  { href: "/support", label: "Support & Warranty" },
  { href: "/find-neo", label: "Find NEO" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const el = menuRef.current;
    if (!el) return;

    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0d0b0c]/95 backdrop-blur-md border-b border-[rgba(255,109,41,0.12)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/images/neo-logo.png"
              alt="NEO"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="hidden sm:block text-[11px] font-medium tracking-widest text-[#7a7178] uppercase mt-0.5">
              Zambia
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  pathname.startsWith(link.href)
                    ? "text-[#FF6D29] bg-[rgba(255,109,41,0.1)]"
                    : "text-[#bababa] hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/become-a-reseller"
              className="hidden sm:inline-flex btn-neo text-sm py-3 px-5"
            >
              Partner With Us
            </Link>

            <button
              ref={toggleRef}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="lg:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5"
            >
              <span
                className={`block h-0.5 w-5 bg-white transition-all duration-200 ${
                  mobileOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white transition-all duration-200 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white transition-all duration-200 ${
                  mobileOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`lg:hidden fixed inset-0 z-40 bg-[#0d0b0c]/98 backdrop-blur-lg transition-opacity duration-200 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMobileOpen(false);
        }}
      >
        <div ref={menuRef} className="pt-24 px-6 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              className={`text-2xl font-semibold py-3 border-b border-white/5 transition-colors ${
                pathname.startsWith(link.href) ? "text-[#FF6D29]" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/become-a-reseller" className="btn-neo justify-center">
              Partner With Us
            </Link>
          </div>

          <div className="mt-8 flex flex-col gap-2 text-sm text-[#7a7178]">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/financing-community" className="hover:text-white transition-colors">Financing & Community</Link>
            <Link href="/news" className="hover:text-white transition-colors">News</Link>
          </div>
        </div>
      </div>
    </>
  );
}
