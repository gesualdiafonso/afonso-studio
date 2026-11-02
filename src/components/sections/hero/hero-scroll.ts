/**
 * HERO ↔ ScrollTrigger contract.
 * ---------------------------------------------------------------------------
 * The hero does not create any scroll engine. The global scroll controller
 * (Task 05) will import these selectors to build its scrubbed timeline.
 *
 * Each layer is an OUTER wrapper with no CSS transform/animation of its own,
 * so GSAP can freely animate `y`, `scale`, `opacity` etc. without fighting
 * the CSS intro animations that live on inner elements.
 */

export const HERO_SECTION_ID = "intro";

export type HeroLayer = "eyebrow" | "headline" | "copy" | "actions" | "visual" | "decor" | "details" | "scroll";

export const heroSelectors = {
  root: '[data-hero="root"]',
  layer: (name: HeroLayer) => `[data-hero-layer="${name}"]`,
  /** Individual headline words (inner spans) for per-word scrub effects. */
  words: '[data-hero-layer="headline"] [data-hero-word]',
} as const;

/** Suggested scroll behaviour for Task 05/08 (reference, not executed here). */
export const heroScrollPlan: Record<HeroLayer, string> = {
  eyebrow: "fade out early",
  headline: "parallax up + slight scale down while leaving",
  copy: "fade + translate up",
  actions: "fade out before the section ends",
  visual: "handed off to the global A-CORE (persists into Philosophy)",
  decor: "slow parallax (depth layer)",
  details: "fade out",
  scroll: "hide after the first scroll",
};
