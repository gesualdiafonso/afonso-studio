"use client";

import { useRef, type ReactNode } from "react";
import { gsapEase } from "@/config/motion";
import { useScrollTimeline } from "@/hooks/use-scroll-timeline";
import { acoreState } from "@/lib/acore-state";
import { contactSelectors as s } from "./contact-anim";

export interface ContactSceneProps {
  id: string;
  surface: "light" | "dark";
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

/** Fraction of the approach spent taking the core apart before rebuilding it. */
const SPLIT = 0.4;

/**
 * <section> wrapper that owns the closing animations of Section 09.
 *  1–2. The A-CORE flies into the final scene: on the way it comes apart
 *       (assembly 5 → 0) and every component is put back as it lands
 *       (0 → 5). assembly = 5 is identical to the whole core, so the
 *       hand-over from the Studio section is seamless.
 *  3.   Headline words rise out of their masks, staggered.
 *  4.   The CTA arrives, then its ring pulses (CSS).
 *  +    Continuation trace from the Studio section, form and channels reveal.
 */
export function ContactScene({ id, surface, labelledBy, className, children }: ContactSceneProps) {
  const root = useRef<HTMLElement>(null);

  useScrollTimeline(root, ({ gsap, ScrollTrigger, scope, reducedMotion }) => {
    const q = gsap.utils.selector(scope);
    const anchor = q(s.anchor)[0] as HTMLElement | undefined;

    // 1–2 — final assembly, tied to the core's approach to the contact anchor
    const assemble =
      anchor && !reducedMotion
        ? ScrollTrigger.create({
            trigger: anchor,
            start: "top bottom",
            end: "clamp(center 55%)",
            onUpdate: ({ progress: p }) => {
              acoreState.explode.current = 0;
              acoreState.focus.current = -1;
              acoreState.assembly.current = p < SPLIT ? 5 * (1 - p / SPLIT) : (5 * (p - SPLIT)) / (1 - SPLIT);
            },
            onLeave: () => (acoreState.assembly.current = -1),
            onLeaveBack: () => (acoreState.assembly.current = -1),
          })
        : null;

    if (reducedMotion) return;

    // 3 — headline
    const intro = gsap.timeline({ scrollTrigger: { trigger: q(s.headline)[0], start: "top 82%", once: true } });
    intro
      .from(q(s.eyebrow), { opacity: 0, y: 16, duration: 0.6, ease: gsapEase["out-expo"] })
      .from(q(s.word), { yPercent: 115, rotate: 4, duration: 1, ease: gsapEase["out-expo"], stagger: 0.07 }, 0.1)
      .from(q(s.text), { opacity: 0, y: 20, duration: 0.8, ease: gsapEase["out-expo"] }, "-=0.6")
      // 4 — CTA
      .from(q(s.cta), { opacity: 0, scale: 0.85, y: 16, duration: 0.9, ease: "back.out(1.8)" }, "-=0.5")
      .add(() => q(s.cta)[0]?.setAttribute("data-ready", "true"));

    // Continuation trace from Section 08
    gsap.fromTo(
      q(s.trace),
      { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: scope, start: "top 95%", end: "top 35%", scrub: true } },
    );

    // Form + channels
    gsap.from(q(s.card), {
      opacity: 0,
      y: 48,
      duration: 1.1,
      ease: gsapEase["out-expo"],
      scrollTrigger: { trigger: q(s.card)[0], start: "top 85%", once: true },
    });
    gsap.from(q(s.field), {
      opacity: 0,
      y: 16,
      duration: 0.7,
      ease: gsapEase["out-expo"],
      stagger: 0.06,
      scrollTrigger: { trigger: q(s.card)[0], start: "top 75%", once: true },
    });
    gsap.from(q(s.reveal), {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: gsapEase["out-expo"],
      stagger: 0.08,
      scrollTrigger: { trigger: q(s.reveal)[0], start: "top 88%", once: true },
    });

    return () => {
      assemble?.kill();
      acoreState.assembly.current = -1;
    };
  });

  return (
    <section
      ref={root}
      id={id}
      data-section={id}
      data-surface={surface}
      data-contact="root"
      aria-labelledby={labelledBy}
      className={className}
    >
      {children}
    </section>
  );
}
