"use client";

import { useRef, type ReactNode } from "react";
import { gsapEase } from "@/config/motion";
import { useScrollTimeline } from "@/hooks/use-scroll-timeline";
import { philoSelectors as s } from "./philosophy-anim";

export interface PhilosophySceneProps {
  id: string;
  surface: "light" | "dark";
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

/**
 * <section> wrapper that owns every scroll animation of Section 02.
 * Markup stays server-rendered (children); this only adds motion.
 *
 *  1. Headline words reveal one by one, scrubbed to scroll.
 *  2. Highlighted words get their accent underline drawn after they appear.
 *  3. Background layers move at different speeds (parallax).
 *  4. Copy + principles enter in sequence.
 *  5. The bottom of the section fades into the next section's surface.
 * The A-CORE travel is handled by the shared stage (data-acore-anchor).
 */
export function PhilosophyScene({ id, surface, labelledBy, className, children }: PhilosophySceneProps) {
  const root = useRef<HTMLElement>(null);

  useScrollTimeline(root, ({ gsap, scope, reducedMotion, isDesktop }) => {
    if (reducedMotion) return; // final state is the default markup

    const q = gsap.utils.selector(scope);
    const words = q(s.word);
    const underlines = q(s.underline);

    // 1 + 2 — word-by-word reveal, scrubbed
    gsap.set(words, { opacity: 0.12, yPercent: 18 });
    gsap.set(underlines, { scaleX: 0 });

    const headline = gsap.timeline({
      scrollTrigger: {
        trigger: q("h2")[0],
        start: isDesktop ? "top 82%" : "top 88%",
        end: isDesktop ? "bottom 42%" : "bottom 55%",
        scrub: 0.6,
      },
    });
    headline.to(words, { opacity: 1, yPercent: 0, ease: "none", stagger: 0.12, duration: 0.5 });
    underlines.forEach((line) => {
      // Draw each underline right after its own word has appeared.
      const word = line.closest(s.word);
      const index = words.indexOf(word as HTMLElement);
      headline.to(line, { scaleX: 1, ease: "power2.out", duration: 0.45 }, index * 0.12 + 0.35);
    });

    // 3 — layered parallax (depth from data-philo-parallax)
    q(s.parallax).forEach((layer) => {
      const depth = Number((layer as HTMLElement).dataset.philoParallax ?? 0.2);
      gsap.fromTo(
        layer,
        { yPercent: depth * 30 },
        {
          yPercent: depth * -30,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });

    // 4 — copy and principles
    gsap.from(q(s.copy), {
      opacity: 0,
      y: 28,
      duration: 0.9,
      ease: gsapEase["out-expo"],
      scrollTrigger: { trigger: q(s.copy)[0], start: "top 85%", once: true },
    });

    gsap.from(q(s.rule), {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.2,
      ease: gsapEase["in-out-quart"],
      stagger: 0.12,
      scrollTrigger: { trigger: q(s.principle)[0], start: "top 88%", once: true },
    });

    gsap.from(q(s.principle), {
      opacity: 0,
      y: 36,
      duration: 1,
      ease: gsapEase["out-expo"],
      stagger: 0.12,
      scrollTrigger: { trigger: q(s.principle)[0], start: "top 85%", once: true },
    });

    // 5 — fade into the next section's surface
    gsap.fromTo(
      q(s.transition),
      { opacity: 0 },
      {
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: scope, start: "bottom 95%", end: "bottom 35%", scrub: true },
      },
    );
  });

  return (
    <section
      ref={root}
      id={id}
      data-section={id}
      data-surface={surface}
      data-philo="root"
      aria-labelledby={labelledBy}
      className={className}
    >
      {children}
    </section>
  );
}
