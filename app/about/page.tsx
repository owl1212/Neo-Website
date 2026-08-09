import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "NEO is Zambia's first laptop brand — built by Zambians, for Zambians. Learn our story and brand pillars.",
};

const pillars = [
  {
    title: "Built For You",
    desc: "Every decision — from processor choice to battery life to storage — is made with the Zambian user in mind. Not a hand-me-down spec list from a distant market.",
  },
  {
    title: "Proudly Zambian",
    desc: "NEO is Zambian-owned and Zambia-focused. The profits stay local. The partnerships are local. The ambition is deeply local.",
  },
  {
    title: "Affordable Access",
    desc: "Technology should not be a luxury. NEO prices its full range to fit real Zambian budgets, from the entry-level Pulse 5 to the feature-packed Fusion A5.",
  },
  {
    title: "Honest Specs",
    desc: "We publish verified specifications with no inflated numbers, no marketing spin, no hidden disappointments. What we say is what you get.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 60% 20%, rgba(255,109,41,0.2) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(69,48,39,0.3) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <div className="section-label mb-6">Our story</div>
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-8">
              <span className="text-gradient">Built For You.</span>
              <br />
              Proudly Zambian.
            </h1>
            <p className="text-xl text-[#bababa] leading-relaxed">
              NEO started with a simple question: why should Zambians buy their technology from
              brands that have never thought about them? We built NEO to change that.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        {/* Story section */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-6 text-[#bababa] leading-relaxed">
            <p>
              Zambia has one of the fastest-growing technology markets in sub-Saharan Africa.
              Yet for years, Zambians have had to choose between expensive imported devices
              and cheap hardware built with no understanding of local needs.
            </p>
            <p>
              NEO was founded to fill that gap. A Zambian-owned brand, designed from the ground up
              for Zambian users — the right performance for our everyday work, the right build
              for our conditions, the right price for our economy.
            </p>
            <p>
              We work with a growing network of Zambian resellers to get our devices into communities
              across all 10 provinces, and we partner with local organisations like BongoHive, Zanaco,
              HELSB and the JETS STEM programme to make sure technology is accessible to everyone.
            </p>
          </div>
          <div className="space-y-6 text-[#bababa] leading-relaxed">
            <p>
              Our commitment to transparency is built into the product. We publish verified
              specifications for every device — no marketing inflation, no hidden asterisks.
              When a reseller shows a customer our spec sheet, they can trust it completely.
            </p>
            <p>
              We handle warranty and servicing locally. We do not send devices overseas for repair.
              We invest in Zambian technicians and Zambian processes because that is what a Zambian
              brand should do.
            </p>
            <p>
              We are just getting started. Six devices. A growing reseller network. Partnerships
              that matter. And a brand that will only ever be built for you.
            </p>
          </div>
        </div>

        {/* Brand pillars */}
        <div className="mb-20">
          <div className="section-label mb-6">Brand pillars</div>
          <h2 className="text-3xl font-extrabold text-white mb-10">What we stand for.</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {pillars.map((pillar, i) => (
              <div key={pillar.title} className="card-glass rounded-[16px] p-8 hover:border-[rgba(255,109,41,0.3)] transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold text-[#FF6D29] bg-[rgba(255,109,41,0.1)] shrink-0 group-hover:bg-[rgba(255,109,41,0.2)] transition-colors"
                  >
                    0{i + 1}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white mb-2 text-lg">{pillar.title}</h3>
                    <p className="text-sm text-[#7a7178] leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-20">
          {[
            { val: "2024", label: "Year founded" },
            { val: "6", label: "Devices in range" },
            { val: "9+", label: "Provinces covered" },
            { val: "100%", label: "Zambian ownership" },
          ].map((s) => (
            <div key={s.label} className="card-glass rounded-[16px] p-6 text-center">
              <p className="text-3xl font-extrabold text-[#FF6D29] mb-1">{s.val}</p>
              <p className="text-sm text-[#7a7178]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="rounded-[20px] p-8 sm:p-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,109,41,0.12) 0%, rgba(13,11,12,0) 50%), rgba(26,21,24,0.8)",
            border: "1px solid rgba(255,109,41,0.2)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(255,109,41,0.12) 0%, transparent 60%)" }}
          />
          <div className="relative">
            <h3 className="text-3xl font-extrabold text-white mb-4">
              {"Be part of Zambia's tech story."}
            </h3>
            <p className="text-[#bababa] mb-8 max-w-md mx-auto">
              Become an official NEO reseller and bring {"Zambia's"} brand to your community.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/become-a-reseller" className="btn-neo">Apply to become a reseller</Link>
              <Link href="/products" className="btn-ghost">Explore the range</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
