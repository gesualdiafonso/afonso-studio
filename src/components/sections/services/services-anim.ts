import "./services.css";

/** Data hooks used by the GSAP scene (services-scene.tsx). */
export const svcSelectors = {
  root: '[data-services="root"]',
  intro: "[data-svc-intro]",
  card: "[data-svc-card]",
  legend: "[data-svc-legend]",
} as const;
