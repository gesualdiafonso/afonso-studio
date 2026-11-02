import { cn } from "@/lib/cn";
import { cssVars } from "@/lib/style-vars";
import { heroAnim } from "./hero-anim";

/**
 * Decorative circuit traces behind the hero (desktop only).
 * Drawn on a 1440 × 900 canvas that is cropped (slice) to the viewport.
 * Faint structural lines use --color-line; a few "live" traces in brand
 * blue / cyan draw on and end in mint nodes, leading into the A-CORE.
 */
const structural = [
  "M0 168H1440",
  "M0 732H1440",
  "M120 0V900",
  "M1320 0V900",
];

const live: Array<{ d: string; node: [number, number]; color: string; delay: number }> = [
  // From the right edge into the A-CORE (upper connector)
  { d: "M1440 252H1324L1292 284H1210", node: [1206, 284], color: "var(--color-accent-blue)", delay: 900 },
  // Lower connector
  { d: "M1440 640H1352L1316 604H1236", node: [1232, 604], color: "var(--color-accent-cyan)", delay: 1100 },
];

export function HeroCircuits({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      fill="none"
    >
      <g stroke="var(--color-line)" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {structural.map((d) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>

      {/* Registration marks at grid intersections */}
      <g stroke="var(--color-line-strong)" strokeWidth="1" strokeOpacity="0.6">
        {[
          [120, 168],
          [1320, 168],
          [120, 732],
          [1320, 732],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x - 6} ${y}H${x + 6}M${x} ${y - 6}V${y + 6}`} />
        ))}
      </g>

      {live.map(({ d, node, color, delay }) => (
        <g key={d}>
          <path
            d={d}
            pathLength={1}
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={heroAnim.trace}
            style={cssVars({ "--d": `${delay}ms` })}
          />
          <circle
            cx={node[0]}
            cy={node[1]}
            r="4"
            fill="var(--color-accent-mint)"
            stroke={color}
            strokeWidth="1.5"
            className={heroAnim.node}
            style={cssVars({ "--d": `${delay + 1500}ms` })}
          />
        </g>
      ))}
    </svg>
  );
}
