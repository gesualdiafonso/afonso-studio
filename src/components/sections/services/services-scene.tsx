"use client";

import { useRef, type ReactNode } from "react";
import { gsapEase } from "@/config/motion";
import { useScrollTimeline } from "@/hooks/use-scroll-timeline";
import { acoreState } from "@/lib/acore-state";
import { svcSelectors as s } from "./services-anim";

export interface ServicesSceneProps {
  id: string;
  surface: "light" | "dark";
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * <section> wrapper that owns the scroll animations of Section 03.
 *  1. Header elements are introduced progressively.
 *  2. The four cards reveal with a stagger.
 *  3. The A-CORE separates into its four modules while the section is in
 *     view (acoreState.explode), then reassembles before the next section.
 * Card hover/expand and module focus live in services-list.tsx.
 */
export function ServicesScene({ id, surface, labelledBy, className, children }: ServicesSceneProps) {
  const root = useRef<HTMLElement>(null);

  useScrollTimeline(root, ({ gsap, ScrollTrigger, scope, reducedMotion }) => {
    const q = gsap.utils.selector(scope);

    // 3 — separation, mapped to the section's scroll range:
    //     0→1 while it enters, hold, 1→0 while it leaves.
    const explode = ScrollTrigger.create({
      trigger: scope,
      start: "top 70%",
      end: "bottom 30%",
      onUpdate: (self) => {
        const p = self.progress;
        const value = p < 0.25 ? smooth(p / 0.25) : p > 0.82 ? smooth(1 - (p - 0.82) / 0.18) : 1;
        acoreState.explode.current = reducedMotion ? 0 : value;
      },
      onLeave: () => (acoreState.explode.current = 0),
      onLeaveBack: () => (acoreState.explode.current = 0),
    });

    // Card heights change when they expand: keep trigger positions accurate.
    let timer = 0;
    const resize = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    });
    resize.observe(scope);

    if (!reducedMotion) {
      // 1 — progressive introduction of the header
      gsap.from(q(s.intro), {
        opacity: 0,
        y: 32,
        duration: 1,
        ease: gsapEase["out-expo"],
        stagger: 0.12,
        scrollTrigger: { trigger: q(s.intro)[0], start: "top 85%", once: true },
      });

      // 2 — staggered card reveal
      gsap.from(q(s.card), {
        opacity: 0,
        y: 56,
        clipPath: "inset(0% 0% 18% 0% round 20px)",
        duration: 1.1,
        ease: gsapEase["out-expo"],
        stagger: 0.14,
        clearProps: "clipPath",
        scrollTrigger: { trigger: q(s.card)[0], start: "top 88%", once: true },
      });

      gsap.from(q(s.legend), {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: gsapEase["out-expo"],
        scrollTrigger: { trigger: q(s.legend)[0], start: "top 92%", once: true },
      });
    }

    return () => {
      explode.kill();
      resize.disconnect();
      window.clearTimeout(timer);
      acoreState.explode.current = 0;
    };
  });

  return (
    <section
      ref={root}
      id={id}
      data-section={id}
      data-surface={surface}
      data-services="root"
      data-services-active="0"
      aria-labelledby={labelledBy}
      className={className}
    >
      {children}
    </section>
  );
}
