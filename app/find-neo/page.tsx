import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getResellersByProvince } from "@/lib/content";

export const metadata: Metadata = {
  title: "Find NEO",
  description: "Find an authorised NEO reseller near you. Listed by province and town across Zambia.",
};

export default async function FindNeoPage() {
  const byProvince = await getResellersByProvince();
  const provinces = Object.keys(byProvince).sort();

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="relative min-h-[480px] sm:min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,109,41,0.15) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 w-full">
          <div className="max-w-xl">
            <div className="section-label mb-6">Store Locator</div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
              Find a NEO
              <br />
              <span className="text-gradient">reseller near you.</span>
            </h1>
            <p className="text-lg text-[#bababa] leading-relaxed">
              {"Zambia's"} brand, available across the country. Browse authorised NEO stockists
              by province below.
            </p>
          </div>
        </div>
        <div className="hidden lg:block absolute w-[525px] h-[595px] pointer-events-none" style={{ right: "260px", bottom: "70px" }}>
          <Image
            src="/images/Locate Reseller.png"
            alt="Find a NEO Reseller"
            fill
            className="object-contain object-bottom"
            priority
            sizes="1500px"
          />
        </div>
      </div>

      {/* Province list [LIGHT] */}
      <section className="bg-[#FAF7F4]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="space-y-8">
            {provinces.map((province) => {
              const resellers = byProvince[province];
              return (
                <div key={province}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF6D29]" />
                      <h2 className="text-xl font-extrabold text-[#1a1518]">{province}</h2>
                    </div>
                    <div className="flex-1 h-px bg-black/10" />
                    <span className="text-xs text-[#7a7178]">
                      {resellers.length} {resellers.length === 1 ? "location" : "locations"}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resellers.map((reseller) => (
                        <div
                          key={reseller.id}
                          className="card-light rounded-[14px] p-5 hover:border-[rgba(255,109,41,0.3)] transition-all duration-200"
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h3 className="font-bold text-[#1a1518] text-sm leading-tight">{reseller.name}</h3>
                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-[#FF6D29] bg-[rgba(255,109,41,0.08)] px-2 py-0.5 rounded-full">
                              <span className="w-1 h-1 rounded-full bg-[#FF6D29]" />
                              Active
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-start gap-2 text-xs text-[#7a7178]">
                              <svg className="w-3 h-3 shrink-0 mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                              </svg>
                              <span>{reseller.address ?? reseller.town}</span>
                            </div>
                            {reseller.phone && (
                              <div className="flex items-center gap-2 text-xs text-[#7a7178]">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <a href={`tel:${reseller.phone.replace(/\s/g, "")}`} className="hover:text-[#FF6D29] transition-colors">
                                  {reseller.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reseller hook [DARK] */}
      <section className="bg-[#0d0b0c]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="card-glass rounded-[20px] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#FF6D29] mb-2">Not near you?</p>
              <h3 className="text-xl font-bold text-white mb-1">{"Don't"} see a reseller in your area?</h3>
              <p className="text-sm text-[#7a7178]">
                The NEO network is growing. Apply to become a reseller and bring NEO to your town.
              </p>
            </div>
            <Link href="/become-a-reseller" className="btn-neo shrink-0">
              Become a Reseller
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
