import "./philosophy.css";

/** Data hooks used by the GSAP scene (philosophy-scene.tsx). */
export const philoSelectors = {
  root: '[data-philo="root"]',
  word: "[data-philo-word]",
  underline: "[data-philo-underline]",
  parallax: "[data-philo-parallax]",
  copy: "[data-philo-copy]",
  principle: "[data-philo-principle]",
  rule: "[data-philo-rule]",
  transition: "[data-philo-transition]",
} as const;
