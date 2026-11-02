import tokens from "./motion.tokens.json";

/**
 * CENTRAL ANIMATION CONFIG.
 * Raw values live in motion.tokens.json and mirror the `--ease-*` and
 * `--duration-*` tokens in src/styles/tokens.css (checked by
 * `npm run validate:tokens`). Framer Motion, GSAP and CSS all share them.
 */

export type EaseName = keyof typeof tokens.ease;
export type DurationName = keyof typeof tokens.duration;
export type CubicBezier = [number, number, number, number];

/** Cubic-bezier arrays — for Framer Motion `transition.ease`. */
export const ease = tokens.ease as Record<EaseName, CubicBezier>;

/** Durations in seconds — Framer Motion and GSAP both use seconds. */
export const duration = Object.fromEntries(
  Object.entries(tokens.duration).map(([key, ms]) => [key, ms / 1000]),
) as Record<DurationName, number>;

/**
 * Closest built-in GSAP eases (no CustomEase plugin needed).
 * Use these for timelines and ScrollTrigger tweens.
 */
export const gsapEase: Record<EaseName, string> = {
  standard: "power2.out",
  "out-expo": "expo.out",
  "in-out-quart": "power3.inOut",
  "out-back": "back.out(1.4)",
};

/** Reveal distances & staggers used by the global motion language. */
export const reveal = {
  distance: 32, // px — translateY for fade-up reveals
  stagger: 0.06, // s — word-by-word / list staggers
  charStagger: 0.02, // s — character reveals
  viewportAmount: 0.3, // fraction visible before triggering
} as const;

/** Preset variants for <MotionContainer variant="…">. */
export const motionPresets = {
  "fade-up": {
    hidden: { opacity: 0, y: reveal.distance },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
  "clip-up": {
    hidden: { clipPath: "inset(100% 0% 0% 0%)" },
    visible: { clipPath: "inset(0% 0% 0% 0%)" },
  },
} as const;

export type MotionPreset = keyof typeof motionPresets;
