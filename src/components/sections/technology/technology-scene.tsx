"use client";

import { useRef, type ReactNode } from "react";
import { gsapEase } from "@/config/motion";
import { useScrollTimeline } from "@/hooks/use-scroll-timeline";
import { techSelectors as s } from "./technology-anim";

export interface TechnologySceneProps {
  id: string;
  surface: "light" | "dark";
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

/**
 * <section> wrapper that owns the scroll animations of Section 07.
 *  1. The navy panel opens from rounded, inset edges as the section arrives.
 *  2. Header and cards are introduced; inside each card the tiles pop in and
 *     the labels slide after them (icons + labels animated on scroll).
 *  3. Desktop: the orbital connections grow out of the hub (--tech-draw,
 *     scrubbed) and the terminals light up when the lines reach the cards.
 * Hover states live in technology-grid.tsx / technology.css.
 */
export function TechnologyScene({ id, surface, labelledBy, className, children }: TechnologySceneProps) {
  const root = useRef<HTMLElement>(null);

  useScrollTimeline(root, ({ gsap, scope, isDesktop, reducedMotion }) => {
    const q = gsap.utils.selector(scope);
    const grid = q(s.grid)[0] as HTMLElement | undefined;
    if (reducedMotion || !grid) return;

    // 1 — panel opening
    gsap.fromTo(
      q(s.panel),
      { clipPath: "inset(0% 3% 0% 3% round 48px)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "none",
        scrollTrigger: { trigger: scope, start: "top bottom", end: "top 15%", scrub: true },
      },
    );

    // 2 — header, then cards, tiles and labels
    gsap.from(q(s.reveal), {
      opacity: 0,
      y: 32,
      duration: 1,
      ease: gsapEase["out-expo"],
      stagger: 0.12,
      scrollTrigger: { trigger: q(s.reveal)[0], start: "top 85%", once: true },
    });

    gsap.from(q(s.hub), {
      opacity: 0,
      scale: 0.85,
      duration: 1.2,
      ease: gsapEase["out-expo"],
      scrollTrigger: { trigger: grid, start: "top 75%", once: true },
    });

    (q(s.card) as HTMLElement[]).forEach((card, i) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: "top 88%", once: true },
        delay: isDesktop ? (i % 3) * 0.08 : 0,
      });
      tl.from(card, { opacity: 0, y: 40, duration: 0.9, ease: gsapEase["out-expo"] })
        .from(
          card.querySelectorAll(s.tile),
          { opacity: 0, scale: 0.4, rotate: -24, duration: 0.6, ease: "back.out(2)", stagger: 0.045 },
          0.2,
        )
        .from(
          card.querySelectorAll(s.label),
          { opacity: 0, x: -10, duration: 0.5, ease: gsapEase["out-expo"], stagger: 0.045 },
          0.3,
        );
    });

    // 3 — orbital connections grow out of the hub
    if (isDesktop) {
      grid.style.setProperty("--tech-draw", "0");
      gsap.to(grid, {
        "--tech-draw": 1,
        ease: "none",
        scrollTrigger: { trigger: grid, start: "top 70%", end: "center 55%", scrub: true },
      });
      return () => grid.style.removeProperty("--tech-draw");
    }
  });

  return (
    <section
      ref={root}
      id={id}
      data-section={id}
      data-surface={surface}
      data-tech="root"
      aria-labelledby={labelledBy}
      className={className}
    >
      <div aria-hidden data-tech-panel className="tech-panel absolute inset-0" />
      {children}
    </section>
  );
}
