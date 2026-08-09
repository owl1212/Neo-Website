import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "NEO Zambia terms of service — the rules that govern use of our website.",
};

export default function TermsPage() {
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
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Terms of Service</h1>
          <p className="text-sm text-[#7a7178]">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-24">
        <div className="card-glass rounded-[20px] p-8 sm:p-12">
          <div className="space-y-8 text-[#bababa] leading-relaxed text-sm">
            <section>
              <h2 className="text-white text-lg font-bold mb-3">1. Acceptance of terms</h2>
              <p>By accessing or using the NEO Zambia website (neozambia.com), you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">2. About the website</h2>
              <p>This website is a brand and reseller-recruitment platform for NEO Zambia. It is not an e-commerce site. No purchases can be made directly through this website. All device purchases are made through authorised NEO resellers.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">3. Accuracy of information</h2>
              <p>We publish verified specifications for all devices listed on this site. While we make every effort to ensure accuracy, specifications may be updated without notice. Always confirm specifications with your reseller prior to purchase.</p>
              <p className="mt-2">Pricing is not published on this site. Contact an authorised reseller for current pricing.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">4. Reseller applications</h2>
              <p>Submitting a reseller application does not guarantee approval. NEO reserves the right to approve or decline applications at its discretion. Approved resellers are bound by a separate Reseller Agreement.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">5. Forms and submitted data</h2>
              <p>By submitting any form on this site, you consent to NEO Zambia collecting and processing the information you provide in accordance with our <Link href="/privacy" className="text-[#FF6D29] hover:underline">Privacy Policy</Link>. Do not submit false or misleading information.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">6. Intellectual property</h2>
              <p>All content on this site — including text, images, logos, and design — is the property of NEO Zambia or its licensors. You may not reproduce, distribute, or create derivative works without our written consent.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">7. Limitation of liability</h2>
              <p>The site is provided &ldquo;as is.&rdquo; To the fullest extent permitted by law, NEO Zambia excludes all warranties and shall not be liable for any indirect, incidental, or consequential damages arising from your use of the site.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">8. Governing law</h2>
              <p>These terms are governed by the laws of the Republic of Zambia. Any disputes shall be resolved in the courts of Zambia.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">9. Changes to these terms</h2>
              <p>We may update these terms at any time. Continued use of the site after changes constitutes acceptance of the updated terms.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-bold mb-3">10. Contact</h2>
              <p>Questions about these terms? Email <a href="mailto:legal@neozambia.com" className="text-[#FF6D29] hover:underline">legal@neozambia.com</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
