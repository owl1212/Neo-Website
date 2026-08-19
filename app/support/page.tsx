import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Support & Warranty",
  description: "NEO warranty information, claims FAQ, and contact support — all handled locally in Zambia.",
};

const faqItems = [
  {
    q: "How long is the NEO warranty?",
    a: "All NEO devices carry a 12-month guaranteed warranty from the date of purchase, fully serviced right here in Zambia.",
  },
  {
    q: "Where do I go to make a warranty claim?",
    a: "Return the device to the authorised NEO reseller you purchased from. They will log the claim on your behalf and coordinate with our service team.",
  },
  {
    q: "How long does a warranty repair take?",
    a: "Most repairs are completed within 5–10 business days depending on the fault. All servicing is handled locally in Zambia — no overseas shipping required.",
  },
  {
    q: "What is covered under warranty?",
    a: "Manufacturing defects, hardware faults, and component failures under normal use. The warranty does not cover physical damage (drops, liquid), unauthorised modifications, or normal wear and tear.",
  },
  {
    q: "What do I need to make a claim?",
    a: "Bring your device, proof of purchase (receipt or reseller invoice), and valid identification to the reseller. Do not factory reset before the technician has diagnosed the fault.",
  },
  {
    q: "Can I get a replacement device while mine is being repaired?",
    a: "Loan devices are at the discretion of individual resellers. Contact your reseller directly to ask about their policy.",
  },
  {
    q: "My device was not purchased from a NEO reseller. Am I covered?",
    a: "Warranty claims can only be processed through authorised NEO resellers. If your device was purchased through an unauthorised channel we recommend contacting us directly for guidance.",
  },
];

export default function SupportPage() {
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
            <div className="section-label mb-6">Support & Warranty</div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
              We&apos;ve got you.
              <br />
              <span className="text-gradient">Right here in Zambia.</span>
            </h1>
            <p className="text-lg text-[#bababa] leading-relaxed">
              Every NEO device carries a guaranteed warranty, fully serviced right here in
              Zambia — no shipping overseas, no long waits.
            </p>
          </div>
        </div>
        <div className="hidden xl:block absolute bottom-0 w-[1000px] h-[1050px] pointer-events-none" style={{ right: "-60px" }}>
          <Image
            src="/images/Support guy.png"
            alt="NEO Support"
            fill
            className="object-contain object-bottom"
            priority
            sizes="1000px"
          />
        </div>
      </div>

      {/* Warranty cards [LIGHT] */}
      <section className="bg-[#FAF7F4]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">

          {/* Warranty download */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10 pb-8 border-b border-black/[0.06]">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#FF6D29] mb-1">Official Document</p>
              <h2 className="text-xl font-extrabold text-[#1a1518]">Warranty & Returns Policy</h2>
              <p className="text-sm text-[#7a7178] mt-1">Download the full terms — 12-month coverage, returns process, and claim conditions.</p>
            </div>
            <a
              href="/Specs/NEO_Warranty_Returns_Policy.pdf"
              download
              className="inline-flex items-center gap-3 bg-[#1a1518] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#FF6D29] transition-colors duration-200 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download Warranty T&Cs
            </a>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: "12-Month Warranty",
                desc: "Manufacturer warranty on all NEO devices from date of purchase.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                ),
                title: "Local Servicing",
                desc: "Fully serviced right here in Zambia by certified technicians — no shipping overseas, no long waits.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "5–10 Day Turnaround",
                desc: "Most warranty repairs completed within 5 to 10 business days.",
              },
            ].map((card) => (
              <div key={card.title} className="card-light rounded-[16px] p-6">
                <div className="w-11 h-11 rounded-xl bg-[rgba(255,109,41,0.08)] flex items-center justify-center text-[#FF6D29] mb-4">
                  {card.icon}
                </div>
                <h3 className="font-bold text-[#1a1518] mb-2">{card.title}</h3>
                <p className="text-sm text-[#7a7178] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ [LIGHT] */}
      <section id="faq" className="bg-[#FAF7F4] relative overflow-hidden">
        {/* Left image — absolutely positioned, not in flow */}
        <div className="hidden lg:block absolute bottom-0 w-[1100px] h-[1200px] pointer-events-none" style={{ left: "0px" }}>
          <Image
            src="/images/FAQ.png"
            alt=""
            fill
            className="object-contain object-bottom"
            sizes="1100px"
          />
        </div>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div className="max-w-3xl ml-auto lg:pl-80">
            <div className="text-right mb-10">
              <div className="section-label inline-flex mb-6">FAQ</div>
              <h2 className="text-3xl font-extrabold text-[#1a1518]">Claims FAQ</h2>
            </div>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details key={i} className="card-light rounded-[14px] overflow-hidden group">
                  <summary className="px-6 py-5 cursor-pointer flex items-center justify-between gap-4 marker:hidden list-none">
                    <span className="font-semibold text-[#1a1518] text-sm">{item.q}</span>
                    <svg className="w-4 h-4 text-[#7a7178] shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-[#4a3f46] leading-relaxed border-t border-[#e8e4e0] pt-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact [DARK] */}
      <section id="contact" className="bg-[#0d0b0c]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <div className="section-label mb-6">Contact</div>
              <h2 className="text-2xl font-extrabold text-white mb-4">Get in touch</h2>
              <p className="text-[#bababa] text-sm leading-relaxed mb-6">
                Reach out for warranty queries, reseller support, or general enquiries. We respond to
                all messages within 2 business days.
              </p>
            </div>

            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
