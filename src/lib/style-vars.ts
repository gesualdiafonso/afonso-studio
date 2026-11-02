import type { CSSProperties } from "react";

/** Inline CSS custom properties with type safety: cssVars({ "--d": "120ms" }). */
export function cssVars(vars: Record<`--${string}`, string | number>): CSSProperties {
  return vars as CSSProperties;
}
