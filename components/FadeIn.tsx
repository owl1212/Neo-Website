"use client";

import { useEffect, useRef, useState } from "react";

export function FadeIn({
  children,
  delay = 0,
  className = "",
  from = "bottom",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right" | "none";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const translate = {
    bottom: visible ? "translateY(0)" : "translateY(28px)",
    left: visible ? "translateX(0)" : "translateX(-28px)",
    right: visible ? "translateX(0)" : "translateX(28px)",
    none: "none",
  }[from];

  return (
    <div
      ref={ref}
      className={className}
      style={
        reduced
          ? { opacity: 1 }
          : {
              opacity: visible ? 1 : 0,
              transform: translate,
              transition: `opacity 0.3s ease ${delay}ms, transform 0.3s ease ${delay}ms`,
            }
      }
    >
      {children}
    </div>
  );
}
