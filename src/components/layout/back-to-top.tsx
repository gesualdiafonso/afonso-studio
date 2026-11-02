"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef } from "react";

export interface BackToTopProps {
  label: string;
}

/**
 * Back-to-top with a ring that shows how much of the page has been read.
 * The ring is driven by a CSS variable (no React re-render on scroll).
 * After scrolling, focus moves to <main> so keyboard users start over too.
 */
export function BackToTop({ label }: BackToTopProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current?.style.setProperty("--progress", String(max > 0 ? Math.min(window.scrollY / max, 1) : 0));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const onClick = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <button ref={ref} type="button" onClick={onClick} className="back-to-top group inline-flex items-center gap-4">
      <span className="type-label text-ink">{label}</span>
      <span aria-hidden className="back-to-top-disc relative grid size-16 place-items-center rounded-pill">
        <svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" fill="none">
          <circle cx="32" cy="32" r="30" stroke="var(--color-navy-700)" strokeWidth="2" />
          <circle
            className="back-to-top-ring"
            cx="32"
            cy="32"
            r="30"
            stroke="var(--color-accent-cyan)"
            strokeWidth="2"
            pathLength={1}
            strokeLinecap="round"
          />
        </svg>
        <ArrowUp className="back-to-top-arrow size-5 text-accent-cyan" strokeWidth={1.8} />
      </span>
    </button>
  );
}
