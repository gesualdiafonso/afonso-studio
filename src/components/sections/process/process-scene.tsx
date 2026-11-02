"use client";

import { useRef, type ReactNode } from "react";
import { gsapEase } from "@/config/motion";
import { useScrollTimeline } from "@/hooks/use-scroll-timeline";
import { acoreState } from "@/lib/acore-state";
import { procSelectors as s } from "./process-anim";

export interface ProcessSceneProps {
  id: string;
  surface: "light" | "dark";
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

/**
 * <section> wrapper that owns the scroll animations of Section 06.
 *  1. A continuous progress line is drawn down the rail (scrubbed).
 *  2. Each stage activates when the line reaches it: node, branch trace,
 *     icon and description light up (CSS, via data-active).
 *  3. The A-CORE assembles one part per stage (acoreState.assembly = 0…5)
 *     and is complete when the last stage is reached.
 * Reduced motion: all stages active, rail full, the core stays assembled.
 */
/** Height of the "progress line" in the viewport (stage activation point). */
const LINE = 0.6;

export function ProcessScene({ id, surface, labelledBy, className, children }: ProcessSceneProps) {
  const root = useRef<HTMLElement>(null);

  useScrollTimeline(root, ({ gsap, ScrollTrigger, scope, reducedMotion }) => {
    const q = gsap.utils.selector(scope);
    const list = q(s.list)[0] as HTMLElement | undefined;
    const stages = q(s.stage) as HTMLElement[];
    if (!list || !stages.length) return;

    const setActive = (count: number) => {
      stages.forEach((stage, i) => (stage.dataset.active = String(i < count)));
      scope.dataset.processActive = String(count - 1);
    };

    if (reducedMotion) {
      list.style.setProperty("--proc-p", "1");
      setActive(stages.length);
      return () => list.style.removeProperty("--proc-p");
    }

    setActive(0);
    list.style.setProperty("--proc-p", "0");

    // Rail fill — a continuous line, scrubbed with the scroll.
    const rail = ScrollTrigger.create({
      trigger: list,
      start: "clamp(top 60%)",
      end: "clamp(bottom 60%)",
      onUpdate: (self) => list.style.setProperty("--proc-p", self.progress.toFixed(4)),
    });

    // A-CORE assembly, keyed to the stages: part k is complete exactly when
    // stage k is reached (assembly = k + 1), interpolated in between.
    const assemblyAt = () => {
      const line = window.innerHeight * LINE;
      const tops = stages.map((stage) => stage.getBoundingClientRect().top);
      const lead = tops[1] - tops[0];
      if (line < tops[0]) return Math.max(0, 1 - (tops[0] - line) / lead);
      for (let k = 0; k < tops.length - 1; k++) {
        if (line < tops[k + 1]) return k + 1 + (line - tops[k]) / (tops[k + 1] - tops[k]);
      }
      return stages.length;
    };

    // Stage activation: when the progress line (at 60 % of the viewport) reaches its node.
    const stageTriggers = stages.map((stage, i) =>
      ScrollTrigger.create({
        trigger: stage,
        start: "clamp(top 60%)",
        onEnter: () => setActive(i + 1),
        onLeaveBack: () => setActive(i),
      }),
    );

    // While the section is on screen the core follows the stages; outside it
    // is whole (-1 = assembly off).
    const section = ScrollTrigger.create({
      trigger: scope,
      start: "top bottom",
      end: "bottom top",
      onUpdate: () => (acoreState.assembly.current = assemblyAt()),
      onToggle: (self) => (acoreState.assembly.current = self.isActive ? assemblyAt() : -1),
    });

    // Header introduction + stage content entrance
    gsap.from(q(s.reveal), {
      opacity: 0,
      y: 32,
      duration: 1,
      ease: gsapEase["out-expo"],
      stagger: 0.12,
      scrollTrigger: { trigger: q(s.reveal)[0], start: "top 85%", once: true },
    });
    stages.forEach((stage) =>
      gsap.from(stage.querySelector("article"), {
        opacity: 0,
        x: 24,
        duration: 0.9,
        ease: gsapEase["out-expo"],
        scrollTrigger: { trigger: stage, start: "top 85%", once: true },
      }),
    );

    return () => {
      rail.kill();
      section.kill();
      stageTriggers.forEach((t) => t.kill());
      list.style.removeProperty("--proc-p");
      setActive(stages.length);
      acoreState.assembly.current = -1;
    };
  });

  return (
    <section
      ref={root}
      id={id}
      data-section={id}
      data-surface={surface}
      data-process="root"
      data-process-active="4"
      aria-labelledby={labelledBy}
      className={className}
    >
      {children}
    </section>
  );
}
