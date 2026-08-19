"use client";

import { useState } from "react";

type Errors = Record<string, string>;

export function SupportForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  function validate(form: HTMLFormElement): Errors {
    const data = new FormData(form);
    const errs: Errors = {};
    if (!data.get("name")?.toString().trim()) errs.name = "Please enter your name.";
    if (!data.get("email")?.toString().trim()) errs.email = "Please enter your email.";
    if (!data.get("subject")?.toString()) errs.subject = "Please select a subject.";
    if (!data.get("message")?.toString().trim()) errs.message = "Please enter a message.";
    return errs;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(e.currentTarget);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    // Backend placeholder — Clivet will wire up the real API endpoint
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  }

  function clearError(field: string) {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  }

  if (submitted) {
    return (
      <div className="card-glass rounded-[20px] p-8 flex flex-col items-center justify-center text-center min-h-[400px] gap-6">
        <div className="w-16 h-16 rounded-full bg-[rgba(255,109,41,0.15)] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#FF6D29]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-white mb-2">Message sent</h3>
          <p className="text-sm text-[#bababa] max-w-sm leading-relaxed">
            {"Thank you for reaching out. We'll get back to you within 2 business days."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-glass rounded-[20px] p-8">
      <h3 className="text-xl font-bold text-white mb-6">Send us a message</h3>
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="s-name">Full name *</label>
            <input
              id="s-name"
              name="name"
              type="text"
              className={`neo-input${errors.name ? " border-red-500" : ""}`}
              placeholder="Your name"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "s-name-err" : undefined}
              onChange={() => clearError("name")}
            />
            {errors.name && <p id="s-name-err" role="alert" className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="s-email">Email *</label>
            <input
              id="s-email"
              name="email"
              type="email"
              className={`neo-input${errors.email ? " border-red-500" : ""}`}
              placeholder="you@email.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "s-email-err" : undefined}
              onChange={() => clearError("email")}
            />
            {errors.email && <p id="s-email-err" role="alert" className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="s-subject">Subject *</label>
          <select
            id="s-subject"
            name="subject"
            className={`neo-input${errors.subject ? " border-red-500" : ""}`}
            aria-invalid={errors.subject ? true : undefined}
            aria-describedby={errors.subject ? "s-subject-err" : undefined}
            onChange={() => clearError("subject")}
          >
            <option value="">Select subject</option>
            <option value="warranty">Warranty claim</option>
            <option value="reseller">Reseller enquiry</option>
            <option value="product">Product question</option>
            <option value="other">Other</option>
          </select>
          {errors.subject && <p id="s-subject-err" role="alert" className="mt-1.5 text-xs text-red-400">{errors.subject}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="s-message">Message *</label>
          <textarea
            id="s-message"
            name="message"
            rows={5}
            className={`neo-input resize-none${errors.message ? " border-red-500" : ""}`}
            placeholder="Describe your issue or question..."
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "s-message-err" : undefined}
            onChange={() => clearError("message")}
          />
          {errors.message && <p id="s-message-err" role="alert" className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-neo w-full justify-center disabled:opacity-60"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending…
            </>
          ) : (
            <>
              Send Message
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
