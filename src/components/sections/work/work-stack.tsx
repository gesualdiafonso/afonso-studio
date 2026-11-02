"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsapEase } from "@/config/motion";
import type { Project } from "@/content/projects";
import type { WorkContent } from "@/content/work";
import { useScrollTimeline } from "@/hooks/use-scroll-timeline";
import { CaseStudyDialog } from "./case-study-dialog";
import { workSelectors as s } from "./work-anim";
import { WorkCard } from "./work-card";

export interface WorkStackProps {
  projects: Project[];
  labels: WorkContent["labels"];
}

const HASH_PREFIX = "#work-";

/**
 * Stacked project cards + case-study dialog.
 *
 * Scroll (desktop): every card is `position: sticky`; while the next card
 * slides up over it, the current one scales down and dims (scrubbed). Images
 * move with a light parallax and each card's story reveals progressively.
 * Mobile: plain vertical list with the same reveal (no sticky, no scaling).
 *
 * Deep link: /#work-<slug> opens that case study directly.
 */
export function WorkStack({ projects, labels }: WorkStackProps) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const open = useCallback((slug: string, from?: HTMLElement) => {
    if (from) trigger.current = from;
    setOpenSlug(slug);
    window.history.replaceState(null, "", `${HASH_PREFIX}${slug}`);
  }, []);

  const close = useCallback(() => {
    setOpenSlug(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    trigger.current?.focus({ preventScroll: true });
  }, []);

  // Open from the URL hash on first load.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith(HASH_PREFIX)) return;
    const slug = hash.slice(HASH_PREFIX.length);
    if (projects.some((p) => p.slug === slug)) {
      const id = requestAnimationFrame(() => setOpenSlug(slug));
      return () => cancelAnimationFrame(id);
    }
  }, [projects]);

  useScrollTimeline(root, ({ gsap, scope, isDesktop, reducedMotion }) => {
    if (reducedMotion) return;
    const q = gsap.utils.selector(scope);
    const items = q(s.item) as HTMLElement[];

    items.forEach((item, i) => {
      const surface = item.querySelector(s.surface);
      const dim = item.querySelector(s.dim);
      const image = item.querySelector(s.parallax);
      const next = items[i + 1];

      // 1 + 2 — stack: scale + dim while the next card arrives (desktop)
      if (isDesktop && next && surface && dim) {
        // The next card's sticky offset, resolved by the browser (px).
        const stickTop = parseFloat(getComputedStyle(next).top) || 72;
        const stackTrigger = { trigger: next, start: "top bottom", end: `top ${stickTop}px`, scrub: true };
        gsap.to(surface, { scale: 0.94, ease: "none", scrollTrigger: stackTrigger });
        gsap.to(dim, { opacity: 0.28, ease: "none", scrollTrigger: { ...stackTrigger } });
      }

      // 3 — image parallax
      if (image) {
        gsap.fromTo(
          image,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }

      // 4 — progressive reveal of the story
      const reveal = item.querySelectorAll(s.reveal);
      gsap.from(reveal, {
        opacity: 0,
        y: 22,
        duration: 0.8,
        ease: gsapEase["out-expo"],
        stagger: 0.08,
        scrollTrigger: { trigger: item, start: isDesktop ? "top 70%" : "top 85%", once: true },
      });
    });

  });

  return (
    <div ref={root} data-work="root">
      <ol className="flex flex-col gap-6 lg:gap-[18svh]">
        {projects.map((project, i) => (
          <WorkCard
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
            labels={labels}
            onOpen={(slug, el) => open(slug, el)}
          />
        ))}
      </ol>

      <CaseStudyDialog
        projects={projects}
        openSlug={openSlug}
        labels={labels}
        onNavigate={(slug) => open(slug)}
        onClose={close}
      />
    </div>
  );
}
