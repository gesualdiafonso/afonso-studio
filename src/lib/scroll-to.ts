/**
 * SCROLL ADAPTER — the one place that moves the page programmatically.
 *
 * This is NOT a scroll controller. The global smooth-scroll engine (Lenis,
 * see the scroll-controller task) registers itself here with
 * `registerScroller(lenis)`; until then the browser's native scrolling is
 * used. Lenis' own `scrollTo(target, { offset, immediate, onComplete })`
 * matches the `Scroller` interface, so it plugs in without wrappers, and
 * ScrollTrigger keeps working because it listens to the resulting scroll.
 */

export interface ScrollToOptions {
  offset?: number;
  immediate?: boolean;
  onComplete?: () => void;
}

export interface Scroller {
  scrollTo(target: HTMLElement | number, options?: ScrollToOptions): void;
}

let scroller: Scroller | null = null;

export function registerScroller(instance: Scroller) {
  scroller = instance;
  return () => {
    if (scroller === instance) scroller = null;
  };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scrolls to a section and moves keyboard focus to it (without a second
 * jump), then calls `onComplete`.
 */
export function scrollToSection(targetId: string, { onComplete }: { onComplete?: () => void } = {}) {
  const el = document.getElementById(targetId);
  if (!el) {
    onComplete?.();
    return;
  }
  const immediate = prefersReducedMotion();
  const done = () => {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    onComplete?.();
  };

  if (scroller) {
    scroller.scrollTo(el, { offset: 0, immediate, onComplete: done });
    return;
  }

  const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
  if (immediate || Math.abs(window.scrollY - top) < 2) {
    window.scrollTo({ top, behavior: "auto" });
    requestAnimationFrame(done);
    return;
  }

  // Native smooth scroll: finish on `scrollend` (or when the position settles).
  let finished = false;
  let last = -1;
  let still = 0;
  const finish = () => {
    if (finished) return;
    finished = true;
    window.removeEventListener("scrollend", finish);
    done();
  };
  const poll = () => {
    if (finished) return;
    const y = window.scrollY;
    still = Math.abs(y - last) < 1 ? still + 1 : 0;
    last = y;
    if (still > 6) finish();
    else requestAnimationFrame(poll);
  };
  window.addEventListener("scrollend", finish, { once: true });
  window.setTimeout(finish, 3000); // safety net for very long or interrupted scrolls
  window.scrollTo({ top, behavior: "smooth" });
  requestAnimationFrame(poll);
}
