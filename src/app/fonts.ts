import localFont from "next/font/local";

/**
 * Self-hosted variable fonts (SIL Open Font License 1.1).
 * The Latin subset covers EN / PT / ES (á é í ó ú ã õ ç ñ ¿ ¡ …).
 * Exposed as CSS variables consumed by `--font-display` / `--font-body`
 * in src/styles/tokens.css.
 */
export const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-Variable-latin.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const inter = localFont({
  src: "./fonts/Inter-Variable-latin.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const fontVariables = `${spaceGrotesk.variable} ${inter.variable}`;
