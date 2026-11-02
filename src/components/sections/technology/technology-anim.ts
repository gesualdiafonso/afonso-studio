import "./technology.css";

/** Data hooks used by the GSAP scene (technology-scene.tsx). */
export const techSelectors = {
  panel: "[data-tech-panel]",
  reveal: "[data-tech-reveal]",
  card: "[data-tech-reveal-card]",
  tile: "[data-tech-tile]",
  label: "[data-tech-label]",
  link: "[data-tech-link-path]",
  terminal: "[data-tech-terminal]",
  hub: "[data-tech-hub]",
  grid: "[data-tech-grid]",
} as const;
