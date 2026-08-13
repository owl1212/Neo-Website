import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Become a Reseller",
  description: "Apply to become an official NEO reseller. Free application, competitive margins, and full support.",
};

const requirements = [
  "A registered business or trader operating in Zambia",
  "A physical retail location or established e-commerce presence",
  "Ability to maintain a minimum stock level per device",
  "Commitment to representing the NEO brand accurately",
  "Acceptance of NEO reseller terms and warranty procedures",
];

const whatNeoProvides = [
  {
    title: "Spec Sheets & Assets",
    desc: "Downloadable PDFs and approved photography for every device — ready for your customers and your store displays.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Competitive Margins",
    desc: "Wholesale pricing built for the Zambian retail market. Margins that reward volume sellers.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    title: "Local Warranty Support",
    desc: "All warranty claims handled locally in Zambia. No overseas shipping — fast resolution for your customers.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Marketing Support",
    desc: "Access to campaign assets, social media content, and co-branding opportunities as the network grows.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
      </svg>
    ),
  },
  {
    title: "Training (Phase 2)",
    desc: "Login-gated reseller portal with product training and approved imagery — coming after launch.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    title: "Financing Partners",
    desc: "Your customers can pay over time through Digitize — see the Financing & Community page for details.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
];

export default function BecomeAResellerPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="relative min-h-[700px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,109,41,0.2) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 w-full">
          <div className="max-w-xl">
            <div className="section-label mb-6">Partner programme</div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
              Become a
              <br />
              <span className="text-gradient">NEO Reseller.</span>
            </h1>
            <p className="text-lg text-[#bababa] leading-relaxed">
              Join {"Zambia's"} growing network of official NEO stockists. The application is free,
              open to all registered businesses, and takes under five minutes.
            </p>
          </div>
        </div>
        <div className="hidden lg:block absolute w-[1000px] h-[1050px] pointer-events-none" style={{ right: "-60px", bottom: "-60px" }}>
          <Image
            src="/images/Become Reseller.png"
            alt="NEO Reseller"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>

      {/* What NEO provides [LIGHT] */}
      <section className="bg-[#FAF7F4]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div className="text-right mb-10">
            <div className="section-label inline-flex mb-6">What you get</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1518]">
              Everything you need to sell NEO.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatNeoProvides.map((item) => (
              <div key={item.title} className="card-light rounded-[16px] p-6 hover:border-[rgba(255,109,41,0.3)] transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-[rgba(255,109,41,0.08)] flex items-center justify-center text-[#FF6D29] mb-5 group-hover:bg-[rgba(255,109,41,0.15)] transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#1a1518] mb-2">{item.title}</h3>
                <p className="text-sm text-[#7a7178] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements + Form [DARK] */}
      <section className="bg-[#0d0b0c]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Requirements */}
          <div className="lg:col-span-2">
            <div className="section-label mb-6">Requirements</div>
            <h2 className="text-2xl font-extrabold text-white mb-6">Who can apply?</h2>
            <ul className="space-y-4 mb-8">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#bababa]">
                  <div className="w-5 h-5 rounded-full bg-[rgba(255,109,41,0.15)] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#FF6D29]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  {req}
                </li>
              ))}
            </ul>

            <div className="card-glass rounded-[16px] p-5">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#FF6D29] mb-2">Note</p>
              <p className="text-sm text-[#7a7178] leading-relaxed">
                The reseller application is public and free. A login-gated partner portal
                (brand assets, training, approved imagery) is coming in Phase 2 for approved resellers.
              </p>
            </div>
          </div>

          {/* Application form */}
          <div className="lg:col-span-3">
            <div className="card-glass rounded-[20px] p-8">
              <h2 className="text-2xl font-extrabold text-white mb-2">Apply now</h2>
              <p className="text-sm text-[#7a7178] mb-8">
                {"We'll"} review your application and get back to you within 2 business days.
              </p>

              <form className="space-y-5" action="#" method="POST">
                {/* Honeypot */}
                <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="full-name">Full name *</label>
                    <input id="full-name" name="fullName" type="text" required className="neo-input" placeholder="Chisomo Banda" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="business-name">Business name *</label>
                    <input id="business-name" name="businessName" type="text" required className="neo-input" placeholder="Banda Electronics" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="email">Email address *</label>
                    <input id="email" name="email" type="email" required className="neo-input" placeholder="you@business.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="phone">Phone number *</label>
                    <input id="phone" name="phone" type="tel" required className="neo-input" placeholder="+260 97 000 0000" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="province">Province *</label>
                    <select id="province" name="province" required className="neo-input">
                      <option value="">Select province</option>
                      {["Central", "Copperbelt", "Eastern", "Luapula", "Lusaka", "Muchinga", "Northern", "North-Western", "Southern", "Western"].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="town">Town / City *</label>
                    <input id="town" name="town" type="text" required className="neo-input" placeholder="Lusaka" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="business-type">Business type *</label>
                  <select id="business-type" name="businessType" required className="neo-input">
                    <option value="">Select type</option>
                    <option value="retail-shop">Retail shop / electronics store</option>
                    <option value="market-trader">Market trader</option>
                    <option value="online">Online / e-commerce</option>
                    <option value="mobile-network">Mobile network agent</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="message">
                    Tell us about your business{" "}
                    <span className="text-[#7a7178] font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="neo-input resize-none"
                    placeholder="How long have you been trading? What brands do you currently stock?"
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn-neo w-full justify-center text-base py-4">
                    Submit Application
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                  </button>
                  <p className="text-xs text-[#7a7178] text-center mt-3">
                    By applying you agree to our{" "}
                    <Link href="/terms" className="text-[#FF6D29] hover:underline">Terms</Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#FF6D29] hover:underline">Privacy Policy</Link>.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
