"use client";

import { useState } from "react";

type UseCase = {
  label: string;
  heading: string;
  desc: string;
  stat: { value: string; unit?: string; label: string };
};

const useCasesByRange: Record<string, UseCase[]> = {
  Fusion: [
    {
      label: "Home Office",
      heading: "Your whole desk. One clean unit.",
      desc: "Browse, email, spreadsheets, and video calls running comfortably at the same time. The Fusion A5 fits a full workstation into one unit with no tower to hide.",
      stat: { value: "i5", label: "Intel Core processor" },
    },
    {
      label: "Business Counter",
      heading: "Professional. Presentable.",
      desc: "A reception desk, a point-of-sale, a front-of-house display — the Fusion A5 looks the part and performs the part. Nothing under the desk, nothing to trip over.",
      stat: { value: '23.8"', label: "Full HD IPS display" },
    },
    {
      label: "Video Calls",
      heading: "Always clear. Always on.",
      desc: "Built-in HD webcam and dual-band Wi-Fi. A large, bright screen your team or clients can see clearly. No dongles. No setup. Just open it and call.",
      stat: { value: "HD", label: "Built-in webcam" },
    },
    {
      label: "Multitasking",
      heading: "Many tabs. No sweat.",
      desc: "8 GB DDR4 keeps multiple apps open without grinding to a halt — browser, spreadsheet, email, and a video call all at once. Comfortably.",
      stat: { value: "8", unit: "GB", label: "DDR4 RAM" },
    },
    {
      label: "Reception & POS",
      heading: "Built for the front of house.",
      desc: "A slim, cable-tidy all-in-one that looks right on any counter. Stock management, billing, customer-facing display — the Fusion A5 handles it all.",
      stat: { value: "512", unit: "GB", label: "SSD storage" },
    },
  ],
  Lite: [
    {
      label: "Study",
      heading: "Built for the classroom.",
      desc: "Light enough to carry everywhere, with a battery that lasts the full school day. Take notes, write assignments, do research — the Lite handles it without fuss.",
      stat: { value: "8", unit: "hrs", label: "Battery life" },
    },
    {
      label: "Browsing",
      heading: "Fast pages. Long battery.",
      desc: "Anti-glare screen, fast SSD, stable dual-band Wi-Fi. Browsing, streaming, and reading — exactly what you need from a laptop every single day.",
      stat: { value: "512", unit: "GB", label: "SSD storage" },
    },
    {
      label: "Work",
      heading: "Office essentials, done properly.",
      desc: "Word, Excel, PowerPoint, email. Everything a working Zambian needs — on a laptop that's light enough to carry to any meeting and slim enough to fit in any bag.",
      stat: { value: "i3", label: "Intel Core processor" },
    },
    {
      label: "Video Calls",
      heading: "Stay connected wherever you are.",
      desc: "Built-in HD webcam and microphone. Whether it's a team meeting, a family call, or a job interview — you'll always come through clearly.",
      stat: { value: "HD", label: "Built-in webcam" },
    },
    {
      label: "First Laptop",
      heading: "The perfect starting point.",
      desc: "Simple to set up, simple to use. Windows 11 Pro, a clean keyboard, a proper screen. For anyone getting their first laptop — this is the right one.",
      stat: { value: "14", unit: '"', label: "HD anti-glare display" },
    },
  ],
  Pulse: [
    {
      label: "Work",
      heading: "Serious performance for serious work.",
      desc: "A bigger screen, a faster processor — for professionals who've outgrown a basic laptop and need something that keeps up with the real demands of the job.",
      stat: { value: '15.6"', label: "Full HD display" },
    },
    {
      label: "Editing",
      heading: "Edit without limits.",
      desc: "Photo editing, video cuts, design layouts — the Pulse handles creative tasks without grinding to a halt. Fast SSD. Enough RAM. A screen you can actually see the detail on.",
      stat: { value: "512", unit: "GB", label: "SSD storage" },
    },
    {
      label: "Multitasking",
      heading: "Run it all at once.",
      desc: "Keep your browser, communications, documents, and media open simultaneously. The Pulse range doesn't ask you to close one thing to open another.",
      stat: { value: "8", unit: "GB", label: "DDR4 RAM" },
    },
    {
      label: "Business",
      heading: "The professional's machine.",
      desc: "Fast, reliable, well-specced. Present, pitch, analyse, and report — all on a machine that looks and performs like it means business. Windows 11 Pro included.",
      stat: { value: "Pro", label: "Windows 11" },
    },
    {
      label: "School & University",
      heading: "Step up for higher demands.",
      desc: "Engineering diagrams, data analysis, presentations, research — the Pulse 5 is the step up students in demanding programmes actually need.",
      stat: { value: "8", unit: "hrs", label: "Battery life" },
    },
  ],
  Tab: [
    {
      label: "Entertainment",
      heading: "Your screen, everywhere.",
      desc: "A bright 10.1-inch IPS display, 7000 mAh battery, and crisp stereo audio. Streaming, casual gaming, and video — wherever you happen to be.",
      stat: { value: "12", unit: "hrs", label: "Video playback" },
    },
    {
      label: "Study",
      heading: "Learn anywhere. No Wi-Fi required.",
      desc: "4G LTE means you're never stuck without internet. Download lectures, read course material, submit assignments — the Tab T606 goes wherever your learning does.",
      stat: { value: "4G", label: "LTE connectivity" },
    },
    {
      label: "Work & Travel",
      heading: "Light enough to take everywhere.",
      desc: "Dual SIM, dual-band Wi-Fi, and a full-day battery. Whether you're commuting, traveling, or working from a different site — you stay connected and productive.",
      stat: { value: "7000", unit: "mAh", label: "Battery capacity" },
    },
    {
      label: "Photography",
      heading: "Capture the moment.",
      desc: "A 13 MP rear camera with autofocus and 1080p video. Sharp enough for the moments that matter — and the memories worth keeping.",
      stat: { value: "13", unit: "MP", label: "Rear camera" },
    },
    {
      label: "Family",
      heading: "One tablet, the whole family.",
      desc: "Kids for school, parents for calls and browsing, everyone for entertainment. The Tab T606's long battery and expandable storage means it's always ready.",
      stat: { value: "1", unit: "TB", label: "Expandable storage" },
    },
  ],
};

const rangeAccents: Record<string, string> = {
  Fusion: "#FF6D29",
  Lite: "#6b9fff",
  Pulse: "#a855f7",
  Tab: "#22d3ee",
};

export function ProductUseCases({ range }: { range: string }) {
  const cases = useCasesByRange[range] ?? useCasesByRange.Lite;
  const [active, setActive] = useState(0);
  const current = cases[active];
  const accent = rangeAccents[range] ?? "#FF6D29";

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center justify-center flex-wrap border-b border-[#1a1518] mb-16">
        {cases.map((c, i) => (
          <button
            key={c.label}
            onClick={() => setActive(i)}
            className="relative px-5 py-4 text-sm font-semibold transition-colors duration-200 whitespace-nowrap"
            style={{ color: i === active ? "#1a1518" : "#9a9096" }}
          >
            {c.label}
            {i === active && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: accent }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto text-center px-5">
        {/* Big stat */}
        <div className="mb-8">
          <p
            className="font-extrabold leading-none"
            style={{ color: accent, fontSize: "clamp(56px, 10vw, 100px)" }}
          >
            {current.stat.value}
            {current.stat.unit && (
              <span style={{ fontSize: "0.45em" }}>{current.stat.unit}</span>
            )}
          </p>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#9a9096] mt-2">
            {current.stat.label}
          </p>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1a1518] mb-4 leading-snug">
          {current.heading}
        </h3>
        <p className="text-[#4a3f46] leading-relaxed">{current.desc}</p>
      </div>
    </div>
  );
}
