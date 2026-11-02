"use client";

import { useEffect, useLayoutEffect, type DependencyList, type RefObject } from "react";
import { breakpoints } from "@/config/design";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface ScrollTimelineContext {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  /** Root element of the section (all selectors are scoped to it). */
  scope: HTMLElement;
  isDesktop: boolean;
  reducedMotion: boolean;
}

/**
 * Builds scroll-driven GSAP animations for one section.
 * - Selectors inside `setup` are scoped to `scope` (gsap.context).
 * - Re-runs automatically when the desktop / reduced-motion state changes
 *   (gsap.matchMedia), and reverts everything on unmount — no leaks.
 * - With prefers-reduced-motion, `setup` still runs (reducedMotion = true)
 *   so the section can render its final state without motion.
 */
export function useScrollTimeline(
  scope: RefObject<HTMLElement | null>,
  setup: (ctx: ScrollTimelineContext) => void | (() => void),
  deps: DependencyList = [],
) {
  useIsomorphicLayoutEffect(() => {
    const element = scope.current;
    if (!element) return;

    const mm = gsap.matchMedia(element);
    mm.add(
      {
        isDesktop: `(min-width: ${breakpoints.lg})`,
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop = false, reducedMotion = false } = context.conditions ?? {};
        return setup({ gsap, ScrollTrigger, scope: element, isDesktop, reducedMotion });
      },
    );

    return () => mm.revert();
  }, deps);
}
