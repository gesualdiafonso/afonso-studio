import { useId } from "react";
import type { SolutionCase } from "@/content/solutions";
import { SolutionMockup } from "./solution-mockup";

/**
 * Problem → solution diagram (600 × 460).
 *
 * The markup is drawn in its SOLUTION state (what visitors without JS or with
 * reduced motion see). build-timeline.ts animates FROM the problem state:
 *   • modules start scattered, tilted, dashed (data-dx / data-dy / data-r)
 *   • broken connections are visible, then fade
 *   • modules snap into a row, links draw into the hub
 *   • the hub appears, then the UI mockup / architecture panel
 */

const BOX_W = 128;
const BOX_H = 52;
const ROW_Y = 30;
const moduleX = (i: number) => 20 + i * 144;

/** Where each module sits in the problem state, relative to its slot. */
const scatter = [
  { dx: 14, dy: 150, r: -8 },
  { dx: 70, dy: 286, r: 6 },
  { dx: 46, dy: 98, r: -5 },
  { dx: -8, dy: 222, r: 9 },
];

export interface SolutionDiagramProps {
  item: SolutionCase;
}

export function SolutionDiagram({ item }: SolutionDiagramProps) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `sol-grad-${uid}`;

  return (
    <svg viewBox="0 0 600 460" className="block h-auto w-full" fill="none" aria-hidden focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-brand-blue)" />
          <stop offset="1" stopColor="var(--color-brand-cyan)" />
        </linearGradient>
        <pattern id={`sol-dots-${uid}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.2" fill="var(--color-line)" />
        </pattern>
      </defs>

      <rect width="600" height="460" fill={`url(#sol-dots-${uid})`} />

      {/* Broken connections (problem only) */}
      <g data-sol-broken opacity="0" stroke="var(--color-ink-subtle)" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round">
        <path d="M150 232 L220 300" />
        <path d="M262 312 L330 200" />
        <path d="M430 168 L440 236" />
        <g strokeDasharray="none" strokeWidth="2">
          <path d="M180 260 l12 12 M192 260 l-12 12" />
          <path d="M292 250 l12 12 M304 250 l-12 12" />
          <path d="M429 196 l12 12 M441 196 l-12 12" />
        </g>
      </g>

      {/* Links module → hub, hub → panel */}
      <g stroke={`url(#${gradientId})`} strokeWidth="2.5" strokeLinecap="butt">
        {[0, 1, 2, 3].map((i) => {
          const x1 = moduleX(i) + BOX_W / 2;
          const x2 = 300 + (i - 1.5) * 48;
          return (
            <path key={i} data-sol-link pathLength={1} d={`M${x1} ${ROW_Y + BOX_H} C${x1} 125, ${x2} 118, ${x2} 160`} />
          );
        })}
        <path data-sol-link pathLength={1} d="M300 216 V262" />
      </g>

      {/* Hub */}
      <g data-sol-hub>
        <rect x="170" y="160" width="260" height="56" rx="14" fill={`url(#${gradientId})`} />
        <text
          x="300"
          y="193"
          textAnchor="middle"
          fill="var(--color-white)"
          style={{ font: "600 15px var(--font-display)", letterSpacing: "-0.01em" }}
        >
          {item.hub}
        </text>
      </g>

      {/* Nodes where links meet */}
      <g fill="var(--color-accent-mint)" stroke="var(--color-navy-900)" strokeWidth="2">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} data-sol-node cx={300 + (i - 1.5) * 48} cy="160" r="5" />
        ))}
        <circle data-sol-node cx="300" cy="262" r="5" />
      </g>

      {/* Modules */}
      {item.modules.map((label, i) => (
        <g key={label} transform={`translate(${moduleX(i)} ${ROW_Y})`}>
          <g data-sol-module data-dx={scatter[i].dx} data-dy={scatter[i].dy} data-r={scatter[i].r}>
            <rect
              data-sol-mod-solution
              width={BOX_W}
              height={BOX_H}
              rx="12"
              fill="var(--color-panel)"
              stroke="var(--color-accent-cyan)"
              strokeOpacity="0.7"
            />
            <rect
              data-sol-mod-problem
              opacity="0"
              width={BOX_W}
              height={BOX_H}
              rx="12"
              fill="var(--color-panel)"
              stroke="var(--color-ink-subtle)"
              strokeDasharray="5 5"
            />
            <text
              x={BOX_W / 2}
              y={BOX_H / 2 + 4.5}
              textAnchor="middle"
              fill="var(--color-ink)"
              style={{ font: "500 12.5px var(--font-body)" }}
            >
              {label}
            </text>
            <circle data-sol-mod-dot cx={BOX_W / 2} cy={BOX_H} r="4" fill="var(--color-accent-cyan)" />
          </g>
        </g>
      ))}

      {/* UI mockup / architecture panel */}
      <g transform="translate(40 262)">
        <g data-sol-mockup>
        <rect width="520" height="190" rx="14" fill="var(--color-panel)" stroke="var(--color-line)" />
        <text x="16" y="24" fill="var(--color-ink-secondary)" style={{ font: "500 11px var(--font-display)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {item.outcome}
        </text>
        <SolutionMockup type={item.mockup} gradientId={gradientId} />
        </g>
      </g>

    </svg>
  );
}
