"use client";

import { useState } from "react";
import Link from "next/link";
import { postToBackend, BackendError } from "@/lib/backend";

const provinces = [
  "Central", "Copperbelt", "Eastern", "Luapula", "Lusaka",
  "Muchinga", "Northern", "North-Western", "Southern", "Western",
];

const businessTypeLabels: Record<string, string> = {
  "retail-shop": "Retail shop / electronics store",
  "market-trader": "Market trader",
  online: "Online / e-commerce",
  "mobile-network": "Mobile network agent",
  other: "Other",
};

type Status = "idle" | "submitting" | "success" | "error";

export function ResellerApplicationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("_honey")) return; // honeypot — silently drop

    setStatus("submitting");
    setErrorMessage("");

    try {
      await postToBackend("/api/reseller-applications", {
        companyName: data.get("businessName"),
        contactName: data.get("fullName"),
        email: data.get("email"),
        phone: data.get("phone"),
        province: data.get("province"),
        town: data.get("town"),
        businessType: data.get("businessType"),
        message: data.get("message"),
      });
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof BackendError ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="card-glass rounded-[20px] p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[rgba(255,109,41,0.15)] flex items-center justify-center text-[#FF6D29] mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">Application received</h2>
        <p className="text-sm text-[#7a7178]">
          {"We'll"} review your application and get back to you within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="card-glass rounded-[20px] p-8">
      <h2 className="text-2xl font-extrabold text-white mb-2">Apply now</h2>
      <p className="text-sm text-[#7a7178] mb-8">
        {"We'll"} review your application and get back to you within 2 business days.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
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
            <select id="province" name="province" required className="neo-input" defaultValue="">
              <option value="">Select province</option>
              {provinces.map((p) => (
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
          <select id="business-type" name="businessType" required className="neo-input" defaultValue="">
            <option value="">Select type</option>
            {Object.entries(businessTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
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

        {status === "error" && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {errorMessage}
          </p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-neo w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Submitting…" : "Submit Application"}
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
  );
}
