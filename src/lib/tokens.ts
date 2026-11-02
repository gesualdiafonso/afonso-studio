/**
 * Reads a design token's computed value at runtime (client only).
 * Use for canvas / Three.js / GSAP code that needs real values:
 *   readToken(designTokens.fx.emissive) → "#00ff99"
 * Pass an element to read a token remapped by data-surface="dark".
 */
export function readToken(name: `--${string}`, element?: Element | null): string {
  if (typeof window === "undefined") return "";
  const target = element ?? document.documentElement;
  return getComputedStyle(target).getPropertyValue(name).trim();
}

/** Reads a time token ("360ms" / "0.36s") as seconds. */
export function readDuration(name: `--${string}`, element?: Element | null): number {
  const raw = readToken(name, element);
  if (raw.endsWith("ms")) return parseFloat(raw) / 1000;
  if (raw.endsWith("s")) return parseFloat(raw);
  return 0;
}
