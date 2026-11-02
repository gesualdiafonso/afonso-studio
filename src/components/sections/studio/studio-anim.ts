import "./studio.css";

/** Data hooks used by the GSAP scene (studio-scene.tsx). */
export const studioSelectors = {
  reveal: "[data-studio-reveal]",
  statement: "[data-studio-statement]",
  word: "[data-studio-word]",
  drift: "[data-studio-drift]",
  glow: "[data-studio-glow]",
  discipline: "[data-studio-discipline]",
  rule: "[data-studio-rule]",
  result: "[data-studio-result]",
  value: "[data-studio-value]",
  valueRule: "[data-studio-value-rule]",
  trace: "[data-studio-trace]",
  node: "[data-studio-node]",
} as const;
