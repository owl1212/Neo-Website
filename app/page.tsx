import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/content";
import { ProductCarousel } from "@/components/ProductCarousel";
import { FadeIn } from "@/components/FadeIn";

// ─── Why NEO — reseller-facing value props ───────────────────────────────────
const whyNeo = [
  {
    title: "Verified Specs",
    desc: "Every number on the sheet is real — what you show a customer is exactly what they get.",
  },
  {
    title: "Sell-Through Toolkit",
    desc: "Spec sheets and approved imagery for every device, so your team can sell with confidence in minutes.",
  },
  {
    title: "Local Warranty",
    desc: "Every device carries a guaranteed warranty, fully serviced right here in Zambia — no shipping overseas, no long waits.",
  },
  {
    title: "Zambian Brand Story",
    desc: "Customers aren't just buying a device, they're buying into a brand that's actually theirs. That story does half the selling for you.",
  },
];

// ─── Homepage ────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          § 1  HERO — full-screen video, no overlay text
          ══════════════════════════════════════════════════════ */}
      <section className="relative w-full aspect-video lg:aspect-auto lg:h-screen overflow-hidden">
        <video
          src="/videos/pulse-7.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/pulse-7-hero.png"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Bottom fade into the brand section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12 lg:h-40 pointer-events-none"
          style={{ background: "linear-gradient(to top, #0d0b0c 0%, transparent 100%)" }}
        />
        {/* Scroll cue — desktop only */}
        <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-50">
          <div className="w-px h-10 bg-gradient-to-b from-[#FF6D29] to-transparent" />
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          § 1b  BRAND STATEMENT — headline + dual CTA  [DARK]
          ══════════════════════════════════════════════════════ */}
      <section className="relative py-28 bg-[#0d0b0c]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 20% 50%, rgba(255,109,41,0.07) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 text-center flex flex-col items-center">
            <div className="section-label mb-8 w-fit animate-fade-in-up">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6D29]" />
              {"Zambia's First Laptop Brand"}
            </div>
            <h1 className="text-5xl sm:text-6xl xl:text-[76px] font-extrabold leading-[1.02] tracking-tight text-white mb-4 animate-fade-in-up delay-100">
              Built For You.
              <br />
              <span className="text-gradient">Proudly Zambian.</span>
            </h1>
            <p className="text-base font-semibold tracking-[0.15em] uppercase text-[#FF6D29] mb-8 animate-fade-in-up delay-200">
              Empowering Digital Growth.
            </p>
            <p className="text-lg sm:text-xl text-[#bababa] leading-relaxed max-w-xl mb-12 animate-fade-in-up delay-300">
              You know the feeling — a device that wasn&apos;t built with you in mind. NEO is different.
              Laptops, All-In-One PCs, and tablets engineered from the ground up for how Zambians
              actually work, learn, and live.
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up delay-400">
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
      </section>


      {/* ══════════════════════════════════════════════════════
          § 2  THE STORY — "Zambia's First"  [LIGHT]
          ══════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#FAF7F4] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 50% 60% at 100% 50%, rgba(255,109,41,0.07) 0%, transparent 60%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Logo — left column */}
            <FadeIn from="left" className="relative hidden lg:flex items-center justify-center h-96 order-none lg:order-first">
              <div
                className="absolute w-80 h-80 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,109,41,0.14) 0%, transparent 70%)", filter: "blur(60px)" }}
              />
              <Image
                src="/images/neo-logo.png"
                alt="NEO"
                width={340}
                height={340}
                className="relative object-contain drop-shadow-2xl"
              />
            </FadeIn>

            {/* Text (RIGHT on desktop) */}
            <FadeIn from="right" delay={100}>
              <div className="section-label mb-8">{"Zambia's First"}</div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1a1518] leading-tight mb-8">
                Genuinely Zambian.
                <br />
                <span className="text-gradient">Genuinely competitive.</span>
              </h2>
              <div className="space-y-5 text-[#4a3f46] leading-relaxed">
                <p>
                  For years, Zambians have had to choose between costly imports and hardware
                  that was never built with local life in mind — our climate, our ambitions.
                </p>
                <p>
                  NEO changes that. This is {"Zambia's"} first laptop brand: real specs, honest
                  engineering, and a range that holds its own against the bigger names.
                  Local warranty. Local support. A brand that&apos;s actually yours.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                {[
                  { val: "Zambian", label: "Owned brand" },
                  { val: "Local", label: "Warranty & support" },
                  { val: "6", label: "Devices in range" },
                  { val: "100%", label: "Verified specs" },
                ].map((s) => (
                  <div key={s.label} className="card-light rounded-xl p-5">
                    <p className="text-2xl font-extrabold text-[#FF6D29]">{s.val}</p>
                    <p className="text-xs text-[#7a7178] mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          § 3  PRODUCTS — Apple Watch–style selector
          ══════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,109,41,0.09) 0%, transparent 60%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          {/* Section header */}
          <FadeIn className="text-center mb-14">
            <div className="section-label mx-auto w-fit mb-4">The Range</div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              Six devices. Six kinds of people.
              <br />
              One brand behind all of them.
            </h2>
          </FadeIn>

          <ProductCarousel products={products} />

          <div className="text-center mt-10">
            <Link href="/products" className="btn-ghost">
              View all products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          § 4  WHY NEO — for resellers  [LIGHT]
          ══════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#FAF7F4] relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <FadeIn className="mb-16 max-w-xl">
            <div className="section-label mb-4">For Resellers</div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1a1518]">
              Stock a brand people
              <br />
              already ask for by name.
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyNeo.map((item, i) => (
              <FadeIn key={item.title} delay={i * 80}>
                <div className="card-light rounded-[16px] p-6 hover:border-[rgba(255,109,41,0.3)] transition-all duration-300 group h-full">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(255,109,41,0.1)] flex items-center justify-center text-sm font-extrabold text-[#FF6D29] mb-5 group-hover:bg-[rgba(255,109,41,0.15)] transition-colors">
                    0{i + 1}
                  </div>
                  <h3 className="font-bold text-[#1a1518] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#7a7178] leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
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
            <span className="text-gradient">brand to your shelf.</span>
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
          § 6  TESTIMONIAL — social proof  [LIGHT]
          ══════════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-[rgba(255,109,41,0.08)] bg-[#FAF7F4]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <svg className="w-8 h-8 text-[#FF6D29] mx-auto mb-8 opacity-40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-xl sm:text-2xl font-semibold text-[#1a1518] leading-relaxed mb-8">
            &ldquo;Stocking NEO was the best decision for my shop. Customers ask for them
            by name. The spec sheets alone save me ten minutes every sale.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[rgba(255,109,41,0.12)] flex items-center justify-center text-[#FF6D29] font-bold">
              M
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#1a1518]">Mwansa T.</p>
              <p className="text-xs text-[#7a7178]">Reseller — Kitwe, Copperbelt</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
