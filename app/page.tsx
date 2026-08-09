import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/content";
import { ProductSlider } from "@/components/ProductSlider";

// ─── Why NEO — reseller-facing value props ───────────────────────────────────
const whyNeo = [
  {
    title: "Verified Specs",
    desc: "Every spec confirmed and published. No marketing spin — what you see is what your customers get.",
  },
  {
    title: "Sell-Through Toolkit",
    desc: "Downloadable spec sheets and approved imagery for every device. Equip your team to sell in minutes.",
  },
  {
    title: "Local Warranty",
    desc: "All repairs handled by certified technicians in Zambia. No overseas delays, no excuses.",
  },
  {
    title: "Zambian Brand Story",
    desc: "Customers buy into a brand that belongs to them. That story sells itself.",
  },
];

// ─── Homepage ────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          § 1  HERO — full-screen, brand statement + dual CTA
          ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col">

        {/* Full-bleed background: laptop photo */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-laptop-2.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          {/* Dark overlay so text stays legible — heavier on the left, lighter on right */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                "linear-gradient(to right, rgba(13,11,12,0.92) 0%, rgba(13,11,12,0.65) 55%, rgba(13,11,12,0.35) 100%)",
                "linear-gradient(to top, rgba(13,11,12,0.9) 0%, transparent 40%)",
              ].join(", "),
            }}
          />
          {/* Subtle orange tint in the upper-right */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 60% at 80% 30%, rgba(255,109,41,0.12) 0%, transparent 65%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative flex-1 max-w-7xl mx-auto w-full px-5 sm:px-8 flex flex-col justify-center pt-28 pb-20">

          {/* Copy — left-aligned, max half-width on large screens */}
          <div className="flex flex-col justify-center max-w-xl">

            {/* Eyebrow */}
            <div className="section-label mb-8 w-fit">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6D29]" />
              {"Zambia's First Laptop Brand"}
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl xl:text-[76px] font-extrabold leading-[1.02] tracking-tight text-white mb-8">
              Built For You.
              <br />
              <span className="text-gradient">Proudly Zambian.</span>
            </h1>

            {/* Sub-line */}
            <p className="text-lg sm:text-xl text-[#bababa] leading-relaxed max-w-md mb-12">
              NEO is {"Zambia's"} own technology brand — laptops, monitors, and tablets
              designed and built for the people who use them every day.
            </p>

            {/* Dual CTA */}
            <div className="flex flex-wrap gap-4">
              <Link href="/find-neo" className="btn-neo text-base py-4 px-8">
                Find a Reseller
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
              <Link href="/become-a-reseller" className="btn-ghost text-base py-4 px-8">
                Become a Reseller
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="relative pb-10 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-10 bg-gradient-to-b from-[#FF6D29] to-transparent" />
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          § 2  THE STORY — "Zambia's First"
          ══════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#0a0809] relative overflow-hidden">
        {/* Zambian chitenge pattern — left vertical cultural accent */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-28 pointer-events-none overflow-hidden opacity-20">
          <img src="/images/zambian-pattern.png" alt="" aria-hidden className="h-full w-auto object-cover object-center" />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 50% 60% at 0% 50%, rgba(69,48,39,0.3) 0%, transparent 60%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Text */}
            <div>
              <div className="section-label mb-8">{"Zambia's First"}</div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-8">
                A laptop brand
                <br />
                built by Zambians,
                <br />
                <span className="text-gradient">for Zambians.</span>
              </h2>
              <div className="space-y-5 text-[#bababa] leading-relaxed">
                <p>
                  For years, Zambians have had to choose between expensive imported devices
                  and cheap hardware built with no understanding of local needs — our power
                  infrastructure, our climate, our budgets, our ambitions.
                </p>
                <p>
                  NEO changes that. {"Zambia's"} first laptop brand, designed from the ground up
                  for the people who actually use these machines every day. Real specs.
                  Local warranty. A brand that belongs to you.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                {[
                  { val: "Zambian", label: "Owned brand" },
                  { val: "Local", label: "Warranty & support" },
                  { val: "6", label: "Devices in range" },
                  { val: "100%", label: "Verified specs" },
                ].map((s) => (
                  <div key={s.label} className="card-glass rounded-xl p-5">
                    <p className="text-2xl font-extrabold text-[#FF6D29]">{s.val}</p>
                    <p className="text-xs text-[#7a7178] mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual — large NEO logo watermark */}
            <div className="relative hidden lg:flex items-center justify-center h-96">
              <div
                className="absolute w-96 h-96 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,109,41,0.1) 0%, transparent 70%)", filter: "blur(40px)" }}
              />
              <img
                src="/images/neo-logo.png"
                alt=""
                aria-hidden
                className="relative w-72 h-72 opacity-[0.12] select-none"
              />
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          § 3  PRODUCTS — the full range
          ══════════════════════════════════════════════════════ */}
      <section className="py-28 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,109,41,0.1) 0%, transparent 55%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <div className="section-label mb-4">The Range</div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                Every device.
                <br />
                Every need.
              </h2>
            </div>
            <Link href="/products" className="btn-ghost self-start sm:self-auto shrink-0">
              View all specs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>

          <ProductSlider products={products} />
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          § 4  WHY NEO — for resellers
          ══════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#0a0809] relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-16">
            <div className="section-label mx-auto w-fit mb-4">For Resellers</div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
              Stock a brand people
              <br />
              already believe in.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyNeo.map((item, i) => (
              <div key={item.title} className="card-glass rounded-[16px] p-6 hover:border-[rgba(255,109,41,0.3)] transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-[rgba(255,109,41,0.1)] flex items-center justify-center text-sm font-extrabold text-[#FF6D29] mb-5 group-hover:bg-[rgba(255,109,41,0.2)] transition-colors">
                  0{i + 1}
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[#7a7178] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          § 5  RESELLER CTA — conversion moment
          ══════════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden">
        {/* Large background glow from below */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 100% 120% at 50% 110%, rgba(255,109,41,0.2) 0%, transparent 55%)" }}
        />

        {/* Decorative large NEO watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          <span
            className="text-[200px] sm:text-[300px] font-extrabold leading-none select-none"
            style={{
              background: "linear-gradient(to bottom, rgba(255,109,41,0.04) 0%, transparent 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            NEO
          </span>
        </div>

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="section-label mx-auto w-fit mb-6">Partner programme</div>

          <h2 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-6">
            Bring {"Zambia's"}
            <br />
            <span className="text-gradient">brand to your store.</span>
          </h2>

          <p className="text-lg text-[#bababa] max-w-xl mx-auto mb-12">
            Join the growing network of NEO resellers across Zambia. Free application.
            Competitive margins. A brand your customers already want.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link href="/become-a-reseller" className="btn-neo text-base py-4 px-10">
              Apply — {"It's"} Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
            <Link href="/find-neo" className="btn-ghost text-base py-4 px-10">
              Find a reseller near you
            </Link>
          </div>

          {/* Proof row */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[#7a7178]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6D29]" />
              Free application
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6D29]" />
              Local warranty support
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6D29]" />
              Spec sheets included
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6D29]" />
              Zambian brand
            </span>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          § 6  TESTIMONIAL — social proof
          ══════════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-[rgba(255,109,41,0.1)] bg-[#0a0809]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <svg className="w-8 h-8 text-[#FF6D29] mx-auto mb-8 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-xl sm:text-2xl font-semibold text-white leading-relaxed mb-8">
            &ldquo;Stocking NEO was the best decision for my shop. Customers ask for them
            by name. The spec sheets alone save me ten minutes every sale.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[rgba(255,109,41,0.15)] flex items-center justify-center text-[#FF6D29] font-bold">
              M
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Mwansa T.</p>
              <p className="text-xs text-[#7a7178]">Reseller — Kitwe, Copperbelt</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
