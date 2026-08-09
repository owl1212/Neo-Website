import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "NEO Zambia privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  const lastUpdated = "9 August 2026";

  return (
    <div className="pt-20 min-h-screen">
      <div className="relative py-16 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255,109,41,0.1) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8">
          <div className="section-label mb-6">Legal</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Privacy Policy</h1>
          <p className="text-sm text-[#7a7178]">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-24">
        <div className="card-glass rounded-[20px] p-8 sm:p-12 prose prose-invert prose-sm max-w-none">
          <div className="space-y-8 text-[#bababa] leading-relaxed text-sm">
            <section>
              <h2 className="text-white text-lg font-bold mb-3">1. Who we are</h2>
              <p>NEO Zambia (&ldquo;NEO,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website neozambia.com. We are a Zambian-registered company. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website or contact us.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">2. What data we collect</h2>
              <p>We collect information you voluntarily provide, including:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
                <li>Name, email address, phone number — when you submit a contact or reseller application form.</li>
                <li>Business name, province, and town — when you apply to become a reseller.</li>
                <li>Message content — when you contact us via any form on the site.</li>
              </ul>
              <p className="mt-3">We do not collect payment information. We do not place tracking cookies beyond basic anonymous analytics (if enabled).</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">3. How we use your data</h2>
              <p>We use the information you provide to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
                <li>Respond to your enquiries and support requests.</li>
                <li>Process and evaluate reseller applications.</li>
                <li>Send you information about your application status.</li>
                <li>Improve our website and services.</li>
              </ul>
              <p className="mt-3">We do not sell, rent, or trade your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">4. Legal basis for processing</h2>
              <p>We process your data on the basis of your consent (when you submit a form) and our legitimate interests (responding to enquiries, improving the site). You may withdraw consent at any time by contacting us.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">5. Data retention</h2>
              <p>We retain form submission data for up to 24 months or until you request deletion, whichever is sooner. Anonymous analytics data may be retained indefinitely.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">6. Your rights</h2>
              <p>You have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact us at privacy@neozambia.com. We will respond within 30 days.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">7. Cookies</h2>
              <p>We use strictly necessary cookies required for the website to function. If we use analytics cookies, we will request your consent. You can control cookies through your browser settings.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">8. Changes to this policy</h2>
              <p>We may update this policy from time to time. Changes will be posted on this page with an updated &ldquo;last updated&rdquo; date. We encourage you to review this page periodically.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">9. Contact us</h2>
              <p>
                For privacy-related queries: <a href="mailto:privacy@neozambia.com" className="text-[#FF6D29] hover:underline">privacy@neozambia.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
