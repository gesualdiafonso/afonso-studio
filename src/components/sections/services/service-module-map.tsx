import { useId } from "react";
import { HEX, frameSegmentPolygon, frameSegments, monogram, toPath } from "@/components/brand/symbol-geometry";
import type { ServiceModule } from "@/content/services";
import { cn } from "@/lib/cn";

/**
 * Mini map of the A-CORE frame with the service's module highlighted —
 * drawn from the same geometry as the logo and the 3D model.
 */
export function ServiceModuleMap({ module, className }: { module: ServiceModule; className?: string }) {
  const uid = useId().replace(/:/g, "");
  // Crop the viewBox to the hexagon (no outer traces)
  const pad = 8;
  const x = 180 - HEX.radius - pad;
  const y = 190 - HEX.radius - pad;
  const size = HEX.radius * 2 + pad * 2;

  return (
    <svg
      viewBox={`${x} ${y} ${size} ${size}`}
      className={cn("shrink-0", className)}
      fill="none"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={`svc-map-${uid}`} x1="40" y1="50" x2="320" y2="330" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-brand-blue)" />
          <stop offset="1" stopColor="var(--color-brand-cyan)" />
        </linearGradient>
      </defs>
      {frameSegments.map((seg) => {
        const on = seg.id === module;
        return (
          <path
            key={seg.id}
            d={toPath(frameSegmentPolygon(seg.from, seg.to), true)}
            className="svc-map-segment"
            fill={on ? `url(#svc-map-${uid})` : "transparent"}
            stroke={on ? "transparent" : "var(--color-line-strong)"}
            strokeWidth={5}
            strokeLinejoin="round"
          />
        );
      })}
      <path d={toPath(monogram.outline, true)} stroke="var(--color-line-strong)" strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
}

/** frameSegments index for a service module (used by the 3D focus). */
export function moduleIndex(module: ServiceModule): number {
  return frameSegments.findIndex((seg) => seg.id === module);
}
