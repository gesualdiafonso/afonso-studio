"use client";

import { useRef, type ReactNode } from "react";
import { gsapEase } from "@/config/motion";
import { useScrollTimeline } from "@/hooks/use-scroll-timeline";
import { resetACoreState } from "@/lib/acore-state";
import { studioSelectors as s } from "./studio-anim";

export interface StudioSceneProps {
  id: string;
  surface: "light" | "dark";
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

/**
 * <section> wrapper that owns the scroll animations of Section 08.
 *  1. The statement fills with ink word by word (scrubbed).
 *  2. Background: the large symbol outline drifts and turns, the light slides.
 *  3. The A-CORE arrives at the `studio` anchor in its original assembled
 *     state — every section modifier (explode / focus / assembly) is reset.
 *  4. Positioning equation, values and the hand-off trace into Contact.
 */
export function StudioScene({ id, surface, labelledBy, className, children }: StudioSceneProps) {
  const root = useRef<HTMLElement>(null);

  useScrollTimeline(root, ({ gsap, ScrollTrigger, scope, reducedMotion }) => {
    const q = gsap.utils.selector(scope);

    // 3 — whatever the previous sections left, the core is whole here.
    const home = ScrollTrigger.create({
      trigger: scope,
      start: "top 90%",
      end: "bottom top",
      onToggle: (self) => self.isActive && resetACoreState(),
    });

    if (reducedMotion) return () => home.kill();

    // 1 — word-by-word ink fill
    const words = q(s.word) as HTMLElement[];
    gsap.set(words, { "--w": 0 });
    gsap.to(words, {
      "--w": 1,
      ease: "none",
      stagger: 0.5,
      scrollTrigger: { trigger: q(s.statement)[0], start: "top 80%", end: "bottom 45%", scrub: 0.6 },
    });

    // 2 — subtle background movement
    gsap.fromTo(
      q(s.drift),
      { yPercent: -8, rotate: -6 },
      { yPercent: 18, rotate: 10, ease: "none", scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: true } },
    );
    gsap.fromTo(
      q(s.glow),
      { xPercent: 0, yPercent: 0 },
      { xPercent: 70, yPercent: 40, ease: "none", scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: true } },
    );

    // Reveals
    (q(s.reveal) as HTMLElement[]).forEach((el) =>
      gsap.from(el, {
        opacity: 0,
        y: 28,
        duration: 1,
        ease: gsapEase["out-expo"],
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }),
    );

    // 4a — the equation: disciplines add up, rule draws, result appears
    const eq = gsap.timeline({ scrollTrigger: { trigger: q(s.discipline)[0], start: "top 80%", once: true } });
    eq.from(q(s.discipline), { opacity: 0, x: 32, duration: 0.8, ease: gsapEase["out-expo"], stagger: 0.12 })
      .from(q(s.rule), { scaleX: 0, duration: 0.9, ease: gsapEase["out-expo"] }, "-=0.3")
      .from(q(s.result), { opacity: 0, y: 12, duration: 0.7, ease: gsapEase["out-expo"] }, "-=0.4");

    // 4b — values
    const values = gsap.timeline({ scrollTrigger: { trigger: q(s.value)[0], start: "top 85%", once: true } });
    values
      .from(q(s.valueRule), { scaleX: 0, duration: 1.1, ease: gsapEase["out-expo"], stagger: 0.12 })
      .from(
        (q(s.value) as HTMLElement[]).map((v) => Array.from(v.children).filter((c) => !c.hasAttribute("data-studio-value-rule"))),
        { opacity: 0, y: 20, duration: 0.8, ease: gsapEase["out-expo"], stagger: 0.08 },
        0.15,
      );

    // 4c — the trace leading into Contact, drawn with the scroll
    const trace = q(s.trace)[0];
    gsap.fromTo(
      q(s.trace),
      { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: trace, start: "clamp(top 90%)", end: "clamp(bottom 60%)", scrub: true } },
    );
    gsap.fromTo(
      q(s.node),
      { scale: 0, transformOrigin: "50% 50%" },
      { scale: 1, ease: "back.out(2)", stagger: 0.1, scrollTrigger: { trigger: trace, start: "clamp(top 75%)", end: "clamp(bottom 60%)", scrub: true } },
    );

    return () => home.kill();
  });

  return (
    <section
      ref={root}
      id={id}
      data-section={id}
      data-surface={surface}
      data-studio="root"
      aria-labelledby={labelledBy}
      className={className}
    >
      {children}
    </section>
  );
}
