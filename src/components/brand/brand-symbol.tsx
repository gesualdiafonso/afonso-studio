import { useId } from "react";
import { cn } from "@/lib/cn";
import {
  LOGO_VIEWBOX,
  frameSegmentPolygon,
  frameSegments,
  monogram,
  perimeterPoint,
  HEX,
  toPath,
  traces,
  type LogoTone,
  type Trace,
} from "./symbol-geometry";

export type BrandSymbolVariant = "color" | "inverse" | "mono";

export interface BrandSymbolProps {
  /** Rendered width in px (height follows the logo's aspect ratio). */
  size?: number;
  /**
   * color   = light backgrounds (white details darkened for contrast)
   * inverse = dark backgrounds (original artwork colours)
   * mono    = single colour (currentColor)
   */
  variant?: BrandSymbolVariant;
  /** Show the circuit traces radiating outside the hexagon. Off for tiny sizes. */
  outerTraces?: boolean;
  /** Accessible name. Omit when the symbol is decorative (next to a wordmark). */
  title?: string;
  className?: string;
}

type Palette = { fill: Record<LogoTone, string>; stroke: Record<LogoTone, string> };

const palettes: Record<BrandSymbolVariant, Palette> = {
  inverse: {
    fill: { blue: "var(--color-brand-blue)", cyan: "var(--color-brand-cyan)", mint: "var(--color-brand-mint)", white: "var(--color-white)" },
    stroke: { blue: "var(--color-brand-blue)", cyan: "var(--color-brand-cyan)", mint: "var(--color-brand-mint)", white: "var(--color-white)" },
  },
  color: {
    // On ice-white, pure white would disappear: gradients use a pale blue,
    // thin white traces and nodes use slate.
    fill: { blue: "var(--color-brand-blue)", cyan: "var(--color-brand-cyan)", mint: "var(--color-brand-mint)", white: "var(--color-blue-100)" },
    stroke: { blue: "var(--color-brand-blue)", cyan: "var(--color-brand-cyan)", mint: "#00d47f", white: "var(--color-slate-400)" },
  },
  mono: {
    fill: { blue: "currentColor", cyan: "currentColor", mint: "currentColor", white: "currentColor" },
    stroke: { blue: "currentColor", cyan: "currentColor", mint: "currentColor", white: "currentColor" },
  },
};

function GradientStops({ tones, palette }: { tones: LogoTone[]; palette: Palette }) {
  return (
    <>
      {tones.map((tone, i) => (
        <stop key={i} offset={tones.length === 1 ? 0 : i / (tones.length - 1)} stopColor={palette.fill[tone]} />
      ))}
    </>
  );
}

function TraceShape({ trace, palette }: { trace: Trace; palette: Palette }) {
  const color = palette.stroke[trace.tone];
  return (
    <g>
      <path
        d={toPath(trace.points)}
        stroke={color}
        strokeWidth={trace.width}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        fill="none"
      />
      {trace.terminal ? (
        trace.terminal.kind === "ring" ? (
          <circle
            cx={trace.terminal.at[0]}
            cy={trace.terminal.at[1]}
            r={trace.terminal.r}
            fill="none"
            stroke={color}
            strokeWidth={4}
          />
        ) : (
          <circle cx={trace.terminal.at[0]} cy={trace.terminal.at[1]} r={trace.terminal.r} fill={color} />
        )
      ) : null}
    </g>
  );
}

/**
 * The official brand symbol, drawn from symbol-geometry.ts (the same data
 * the 3D A-CORE is extruded from). All colours come from design tokens.
 */
export function BrandSymbol({
  size = 40,
  variant = "color",
  outerTraces = true,
  title,
  className,
}: BrandSymbolProps) {
  const uid = useId().replace(/:/g, "");
  const titleId = `bs-title-${uid}`;
  const palette = palettes[variant];
  const { width, height } = LOGO_VIEWBOX;

  return (
    <svg
      width={size}
      height={(size * height) / width}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <defs>
        {frameSegments.map((seg) => {
          const [x1, y1] = perimeterPoint(HEX.radius, seg.from);
          const [x2, y2] = perimeterPoint(HEX.radius, seg.to);
          return (
            <linearGradient key={seg.id} id={`bs-${seg.id}-${uid}`} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
              <GradientStops tones={seg.stops} palette={palette} />
            </linearGradient>
          );
        })}
        <linearGradient id={`bs-a-${uid}`} x1="0" y1="88" x2="0" y2="279" gradientUnits="userSpaceOnUse">
          <GradientStops tones={monogram.stops} palette={palette} />
        </linearGradient>
        <linearGradient id={`bs-bar-${uid}`} x1="127" y1="0" x2="229" y2="0" gradientUnits="userSpaceOnUse">
          <GradientStops tones={monogram.crossbarStops} palette={palette} />
        </linearGradient>
      </defs>

      {outerTraces
        ? traces.filter((t) => t.layer === "outer").map((t) => <TraceShape key={t.id} trace={t} palette={palette} />)
        : null}

      {/* Segmented hexagonal frame */}
      {frameSegments.map((seg) => (
        <path key={seg.id} d={toPath(frameSegmentPolygon(seg.from, seg.to), true)} fill={`url(#bs-${seg.id}-${uid})`} />
      ))}

      {traces.filter((t) => t.layer === "inner").map((t) => <TraceShape key={t.id} trace={t} palette={palette} />)}

      {/* "A" monogram + crossbar */}
      <path d={toPath(monogram.outline, true)} fill={`url(#bs-a-${uid})`} />
      <path d={toPath(monogram.crossbar, true)} fill={`url(#bs-bar-${uid})`} />
    </svg>
  );
}
