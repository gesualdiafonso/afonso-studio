"use client";

import { ArrowDown } from "lucide-react";
import { useRef, type MouseEvent, type PointerEvent } from "react";

export interface ContactCtaProps {
  label: string;
  /** id of the form's first field. */
  targetId: string;
  formId: string;
}

/**
 * "Start a project" — magnetic primary CTA. Scrolls to the form and moves
 * focus to its first field (keyboard and screen-reader friendly).
 */
export function ContactCta({ label, targetId, formId }: ContactCtaProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.35;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--mx", "0px");
    ref.current?.style.setProperty("--my", "0px");
  };
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const form = document.getElementById(formId);
    if (!form) return;
    e.preventDefault();
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    form.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "center" });
    window.setTimeout(() => document.getElementById(targetId)?.focus({ preventScroll: true }), smooth ? 700 : 0);
  };

  return (
    <a
      ref={ref}
      href={`#${formId}`}
      data-contact-cta
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onClick}
      className="contact-cta group relative inline-flex min-h-14 items-center gap-4 rounded-pill bg-action-primary py-2 pr-2 pl-7 font-display text-[1.0625rem] font-medium text-ink-on-action shadow-glow transition-colors hover:bg-action-primary-hover"
    >
      <span aria-hidden className="contact-cta-ring absolute inset-0 rounded-pill" />
      {label}
      <span aria-hidden className="contact-cta-icon grid size-10 place-items-center rounded-pill bg-white text-action-primary">
        <ArrowDown className="contact-cta-arrow size-4" strokeWidth={2} />
      </span>
    </a>
  );
}
