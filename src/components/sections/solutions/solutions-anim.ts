import "./solutions.css";

/** Data hooks used by solutions-experience.tsx and build-timeline.ts. */
export const solSelectors = {
  step: "[data-sol-step]",
  desktopDiagram: "[data-sol-desktop-diagram]",
  mobileDiagram: "[data-sol-mobile-diagram]",
  card: "[data-sol-card]",
  reveal: "[data-sol-reveal]",
  connector: "[data-sol-connector]",
} as const;
