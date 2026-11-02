import "./process.css";

/** Data hooks used by the GSAP scene (process-scene.tsx). */
export const procSelectors = {
  root: '[data-process="root"]',
  list: "[data-proc-list]",
  stage: "[data-proc-stage]",
  node: "[data-proc-node]",
  reveal: "[data-proc-reveal]",
} as const;
