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

type FieldName =
  | "fullName"
  | "businessName"
  | "email"
  | "phone"
  | "province"
  | "town"
  | "businessType";

type FieldErrors = Partial<Record<FieldName, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// .neo-input's border-color is plain (unlayered) CSS, which beats Tailwind
// utility classes under cascade layers — an inline style is the reliable
// way to override it for the invalid state.
const invalidBorderStyle = { borderColor: "rgba(248, 113, 113, 0.6)" };

function validate(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const get = (name: FieldName) => String(data.get(name) ?? "").trim();

  if (!get("fullName")) errors.fullName = "Full name is required.";
  if (!get("businessName")) errors.businessName = "Business name is required.";

  const email = get("email");
  if (!email) errors.email = "Email address is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  if (!get("phone")) errors.phone = "Phone number is required.";
  if (!get("province")) errors.province = "Select a province.";
  if (!get("town")) errors.town = "Town / city is required.";
  if (!get("businessType")) errors.businessType = "Select a business type.";

  return errors;
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export function ResellerApplicationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  function clearFieldError(name: string) {
    setErrors((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name as FieldName];
      return next;
    });
  }

  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    clearFieldError(e.target.name);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("_honey")) return; // honeypot — silently drop

    const fieldErrors = validate(data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
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

  const isSubmitting = status === "submitting";

  return (
    <div className="card-glass rounded-[20px] p-8">
      <h2 className="text-2xl font-extrabold text-white mb-2">Apply now</h2>
      <p className="text-sm text-[#7a7178] mb-8">
        {"We'll"} review your application and get back to you within 2 business days.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {/* Honeypot */}
        <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="full-name">Full name *</label>
            <input
              id="full-name"
              name="fullName"
              type="text"
              required
              className="neo-input"
              placeholder="Chisomo Banda"
              style={errors.fullName ? invalidBorderStyle : undefined}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "full-name-error" : undefined}
              onChange={handleFieldChange}
            />
            {errors.fullName && (
              <p id="full-name-error" className="mt-1.5 text-xs text-red-400">{errors.fullName}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="business-name">Business name *</label>
            <input
              id="business-name"
              name="businessName"
              type="text"
              required
              className="neo-input"
              placeholder="Banda Electronics"
              style={errors.businessName ? invalidBorderStyle : undefined}
              aria-invalid={!!errors.businessName}
              aria-describedby={errors.businessName ? "business-name-error" : undefined}
              onChange={handleFieldChange}
            />
            {errors.businessName && (
              <p id="business-name-error" className="mt-1.5 text-xs text-red-400">{errors.businessName}</p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="email">Email address *</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="neo-input"
              placeholder="you@business.com"
              style={errors.email ? invalidBorderStyle : undefined}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              onChange={handleFieldChange}
            />
            {errors.email && <p id="email-error" className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="phone">Phone number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="neo-input"
              placeholder="+260 97 000 0000"
              style={errors.phone ? invalidBorderStyle : undefined}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              onChange={handleFieldChange}
            />
            {errors.phone && <p id="phone-error" className="mt-1.5 text-xs text-red-400">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="province">Province *</label>
            <select
              id="province"
              name="province"
              required
              className="neo-input"
              defaultValue=""
              style={errors.province ? invalidBorderStyle : undefined}
              aria-invalid={!!errors.province}
              aria-describedby={errors.province ? "province-error" : undefined}
              onChange={handleFieldChange}
            >
              <option value="">Select province</option>
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.province && <p id="province-error" className="mt-1.5 text-xs text-red-400">{errors.province}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="town">Town / City *</label>
            <input
              id="town"
              name="town"
              type="text"
              required
              className="neo-input"
              placeholder="Lusaka"
              style={errors.town ? invalidBorderStyle : undefined}
              aria-invalid={!!errors.town}
              aria-describedby={errors.town ? "town-error" : undefined}
              onChange={handleFieldChange}
            />
            {errors.town && <p id="town-error" className="mt-1.5 text-xs text-red-400">{errors.town}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#bababa] mb-2" htmlFor="business-type">Business type *</label>
          <select
            id="business-type"
            name="businessType"
            required
            className="neo-input"
            defaultValue=""
            style={errors.businessType ? invalidBorderStyle : undefined}
            aria-invalid={!!errors.businessType}
            aria-describedby={errors.businessType ? "business-type-error" : undefined}
            onChange={handleFieldChange}
          >
            <option value="">Select type</option>
            {Object.entries(businessTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.businessType && (
            <p id="business-type-error" className="mt-1.5 text-xs text-red-400">{errors.businessType}</p>
          )}
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
            disabled={isSubmitting}
            className="btn-neo w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Submitting…" : "Submit Application"}
            {!isSubmitting && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            )}
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
