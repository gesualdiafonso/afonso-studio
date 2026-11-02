import "./contact.css";

/** Data hooks used by the GSAP scene (contact-scene.tsx). */
export const contactSelectors = {
  anchor: '[data-acore-anchor="contact"]',
  headline: ".contact-headline",
  eyebrow: "[data-contact-eyebrow]",
  word: "[data-contact-word]",
  text: "[data-contact-text]",
  cta: "[data-contact-cta]",
  trace: "[data-contact-trace]",
  card: ".contact-card",
  field: "[data-contact-field]",
  reveal: "[data-contact-reveal]",
} as const;
