"use client";

import { useState } from "react";
import { postToBackend, BackendError } from "@/lib/backend";

// Subject values match the Go backend's type enum exactly
// (warranty | reseller | product | other) — sent through as-is.
const subjectLabels: Record<string, string> = {
  warranty: "Warranty claim",
  reseller: "Reseller enquiry",
  product: "Product question",
  other: "Other",
};

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setErrorMessage("");

    try {
      await postToBackend("/api/contact", {
        name: data.get("name"),
        email: data.get("email"),
        type: data.get("subject"),
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
        <h3 className="text-xl font-bold text-white mb-2">Message sent</h3>
        <p className="text-sm text-[#7a7178]">{"We'll"} get back to you within 2 business days.</p>
      </div>
    );
  }

  return (
    <div className="card-glass rounded-[20px] p-8">
      <h3 className="text-xl font-bold text-white mb-6">Send us a message</h3>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="s-name">Full name *</label>
            <input id="s-name" name="name" type="text" required className="neo-input" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="s-email">Email *</label>
            <input id="s-email" name="email" type="email" required className="neo-input" placeholder="you@email.com" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="s-subject">Subject *</label>
          <select id="s-subject" name="subject" required className="neo-input" defaultValue="">
            <option value="">Select subject</option>
            {Object.entries(subjectLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="s-message">Message *</label>
          <textarea id="s-message" name="message" rows={5} required className="neo-input resize-none" placeholder="Describe your issue or question..." />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-neo w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Sending…" : "Send Message"}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}
