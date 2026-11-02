import "./work.css";

/** Data hooks used by the GSAP scene (work-stack.tsx). */
export const workSelectors = {
  root: '[data-work="root"]',
  item: "[data-work-item]",
  surface: "[data-work-surface]",
  dim: "[data-work-dim]",
  parallax: "[data-work-parallax]",
  reveal: "[data-work-reveal]",
} as const;
