/**
 * DESIGN CONFIG — token NAMES only. Values live in src/styles/tokens.css.
 * Use these names in runtime code (canvas, Three.js, GSAP) with
 * `readToken(designTokens.fx.emissive)` from src/lib/tokens.ts.
 */

export const designTokens = {
  brand: {
    blue: "--color-brand-blue",
    cyan: "--color-brand-cyan",
    mint: "--color-brand-mint",
    graphite: "--color-brand-graphite",
  },
  surface: {
    canvas: "--color-canvas",
    panel: "--color-panel",
    panelMuted: "--color-panel-muted",
    panelInverse: "--color-panel-inverse",
  },
  text: {
    primary: "--color-ink",
    secondary: "--color-ink-secondary",
    subtle: "--color-ink-subtle",
    inverse: "--color-ink-inverse",
  },
  action: {
    primary: "--color-action-primary",
    primaryHover: "--color-action-primary-hover",
    primaryActive: "--color-action-primary-active",
    active: "--color-state-active",
    focus: "--color-focus",
  },
  fx: {
    metal: "--color-fx-metal",
    metalDark: "--color-fx-metal-dark",
    highlight: "--color-fx-highlight",
    glass: "--color-fx-glass",
    glassEdge: "--color-fx-glass-edge",
    reflectionBlue: "--color-fx-reflection-blue",
    reflectionCyan: "--color-fx-reflection-cyan",
    emissive: "--color-fx-emissive",
    glow: "--color-fx-glow",
    shadow: "--color-fx-shadow",
    circuit: "--color-fx-circuit",
  },
  layout: {
    gutter: "--spacing-gutter",
    section: "--spacing-section",
    dock: "--spacing-dock",
    container: "--container-site",
  },
  motion: {
    easeOutExpo: "--ease-out-expo",
    durationBase: "--duration-base",
  },
} as const;

/** Typography roles → utility class (defined in globals.css). */
export const typography = {
  display: "type-display",
  h1: "type-h1",
  h2: "type-h2",
  h3: "type-h3",
  h4: "type-h4",
  bodyLarge: "type-body-lg",
  body: "type-body",
  bodySmall: "type-body-sm",
  label: "type-label",
  nav: "type-nav",
} as const;

export type TypographyRole = keyof typeof typography;

/** Font families and the weight range shipped for each. */
export const fonts = {
  display: { family: "Space Grotesk", cssVar: "--font-display", weights: "300–700" },
  body: { family: "Inter", cssVar: "--font-body", weights: "100–900" },
} as const;

/** Breakpoints (Tailwind defaults, rem) — mirrored for JS media queries. */
export const breakpoints = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
} as const;
