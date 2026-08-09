import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Financing & Community",
  description: "NEO financing options and community partnerships — making NEO devices more accessible across Zambia.",
};

const partners = [
  {
    name: "Digitize Zambia",
    category: "Financing",
    logo: "DZ",
    desc: "[Copy pending from NEO — Digitize Zambia partnership details and financing terms to be supplied.]",
    callout: "Flexible device financing for NEO customers through the Digitize Zambia initiative.",
    status: "copy-pending" as const,
  },
  {
    name: "HELSB",
    category: "Financing",
    logo: "HL",
    desc: "[Copy pending from NEO — HELSB financing programme details and eligibility to be supplied.]",
    callout: "Higher Education Loans and Scholarships Board financing available for qualifying NEO customers.",
    status: "copy-pending" as const,
  },
  {
    name: "BongoHive",
    category: "CSR — Technology & Innovation",
    logo: "BH",
    desc: "BongoHive is Zambia's leading technology and innovation hub. NEO partners with BongoHive to accelerate digital literacy and support the next generation of Zambian tech entrepreneurs.",
    callout: "Digital literacy, innovation, and startup support across Zambia.",
    status: "live" as const,
  },
  {
    name: "Zanaco",
    category: "CSR — Financial Inclusion",
    logo: "ZN",
    desc: "Zambia National Commercial Bank (Zanaco) and NEO are working together to broaden financial inclusion and make device ownership more accessible to Zambians across all income levels.",
    callout: "Partnering to remove financial barriers to technology access.",
    status: "live" as const,
  },
  {
    name: "JETS / STEM",
    category: "CSR — Education",
    logo: "JT",
    desc: "NEO sponsors the Junior Engineers, Technologists and Scientists (JETS) programme, providing NEO Tab T606 tablets to selected STEM students — empowering Zambia's future innovators with technology built for them.",
    callout: "Putting technology in the hands of Zambia's next generation.",
    status: "live" as const,
  },
];

export default function FinancingCommunityPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,109,41,0.15) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl">
            <div className="section-label mb-6">Financing & Community</div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
              More ways to get
              <br />
              <span className="text-gradient">into a NEO device.</span>
            </h1>
            <p className="text-lg text-[#bababa] leading-relaxed">
              We partner with financial institutions and community organisations to make NEO
              laptops, tablets, and PCs accessible to every Zambian — regardless of income or circumstance.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        {/* Financing section */}
        <div className="mb-16">
          <div className="section-label mb-6">Financing options</div>
          <h2 className="text-3xl font-extrabold text-white mb-10">
            {"Don't"} pay it all upfront.
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {partners.filter((p) => p.category === "Financing").map((partner) => (
              <div key={partner.name} className="card-glass rounded-[20px] overflow-hidden">
                <div className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(255,109,41,0.15)] flex items-center justify-center text-sm font-extrabold text-[#FF6D29] shrink-0">
                    {partner.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{partner.name}</h3>
                      {partner.status === "copy-pending" && (
                        <span className="text-[10px] font-semibold text-[#7a7178] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                          Details coming soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#7a7178] leading-relaxed">{partner.callout}</p>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-[#7a7178] italic leading-relaxed">{partner.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="neo-divider mb-16" />

        {/* CSR Partners */}
        <div>
          <div className="section-label mb-6">Community partnerships</div>
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Investing in {"Zambia's"} future.
          </h2>
          <p className="text-[#bababa] max-w-xl mb-10">
            NEO believes a truly Zambian brand must invest in Zambian communities. These
            partnerships reflect our commitment beyond the sale.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {partners.filter((p) => p.category !== "Financing").map((partner) => (
              <div key={partner.name} className="card-glass rounded-[20px] p-6 hover:border-[rgba(255,109,41,0.3)] transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(255,109,41,0.15)] flex items-center justify-center text-sm font-extrabold text-[#FF6D29] shrink-0">
                    {partner.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-0.5">{partner.name}</h3>
                    <p className="text-[11px] text-[#7a7178] uppercase tracking-wide font-semibold">
                      {partner.category.replace("CSR — ", "")}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[#7a7178] leading-relaxed">{partner.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#7a7178] text-sm mb-6">
            Interested in partnering with NEO? {"We'd"} love to hear from you.
          </p>
          <Link href="/support#contact" className="btn-neo">
            Get in touch
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
