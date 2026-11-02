import type { SolutionMockup as MockupType } from "@/content/solutions";

/**
 * Small UI mockups / architecture diagrams drawn inside the solution panel
 * (local 520 × 190 space). Elements marked data-sol-bar grow in on reveal.
 * Colours come from tokens (the section is a dark surface).
 */
export function SolutionMockup({ type, gradientId }: { type: MockupType; gradientId: string }) {
  switch (type) {
    case "dashboard":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${16 + i * 112} 40)`}>
              <rect width="100" height="58" rx="8" fill="var(--color-panel-muted)" />
              <rect x="10" y="12" width="44" height="6" rx="3" fill="var(--color-ink-subtle)" />
              <rect x="10" y="26" width="58" height="10" rx="5" fill="var(--color-ink)" opacity="0.85" />
              <rect x="10" y="44" width="80" height="4" rx="2" fill="var(--color-line)" />
              <rect data-sol-bar x="10" y="44" width={[62, 44, 70][i]} height="4" rx="2" fill={["var(--color-accent-blue)", "var(--color-accent-cyan)", "var(--color-accent-mint)"][i]} />
            </g>
          ))}
          <rect x="352" y="40" width="152" height="134" rx="8" fill="var(--color-panel-muted)" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <circle cx="370" cy={64 + i * 28} r="5" fill={["var(--color-accent-blue)", "var(--color-accent-cyan)", "var(--color-accent-mint)", "var(--color-accent-blue)"][i]} />
              <rect data-sol-bar x="384" y={60 + i * 28} width={[96, 72, 84, 60][i]} height="8" rx="4" fill="var(--color-ink-subtle)" />
            </g>
          ))}
          <rect x="16" y="108" width="324" height="66" rx="8" fill="var(--color-panel-muted)" />
          <path
            data-sol-line
            pathLength={1}
            d="M28 160 L70 146 L112 152 L154 132 L196 138 L238 120 L280 126 L326 112"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeLinecap="butt"
            strokeLinejoin="round"
          />
        </g>
      );

    case "workflow":
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${16 + i * 126} 52)`}>
              {i < 3 ? <path data-sol-line pathLength={1} d="M104 22 H126" stroke="var(--color-accent-cyan)" strokeWidth="2" /> : null}
              <rect width="104" height="44" rx="10" fill="var(--color-panel-muted)" stroke="var(--color-line)" />
              <circle cx="20" cy="22" r="9" fill="var(--color-accent-mint)" opacity="0.9" />
              <path d="M15.5 22 l3 3 l6 -6" stroke="var(--color-navy-900)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="36" y="15" width="54" height="6" rx="3" fill="var(--color-ink)" opacity="0.8" />
              <rect x="36" y="27" width="38" height="5" rx="2.5" fill="var(--color-ink-subtle)" />
            </g>
          ))}
          <rect x="16" y="124" width="488" height="8" rx="4" fill="var(--color-line)" />
          <rect data-sol-bar x="16" y="124" width="488" height="8" rx="4" fill={`url(#${gradientId})`} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <circle cx={24 + i * 168} cy="158" r="4" fill="var(--color-accent-mint)" />
              <rect x={34 + i * 168} y="154" width={[110, 90, 120][i]} height="7" rx="3.5" fill="var(--color-ink-subtle)" />
            </g>
          ))}
        </g>
      );

    case "portal":
      return (
        <g>
          <rect x="16" y="36" width="340" height="142" rx="8" fill="var(--color-panel-muted)" />
          <circle cx="28" cy="48" r="3" fill="var(--color-ink-subtle)" />
          <circle cx="38" cy="48" r="3" fill="var(--color-ink-subtle)" />
          <circle cx="48" cy="48" r="3" fill="var(--color-ink-subtle)" />
          <rect x="30" y="72" width="170" height="12" rx="6" fill="var(--color-ink)" opacity="0.85" />
          <rect x="30" y="92" width="130" height="12" rx="6" fill="var(--color-ink)" opacity="0.85" />
          <rect x="30" y="114" width="150" height="6" rx="3" fill="var(--color-ink-subtle)" />
          <rect data-sol-bar x="30" y="134" width="88" height="24" rx="12" fill={`url(#${gradientId})`} />
          <rect x="220" y="66" width="120" height="96" rx="8" fill="var(--color-panel)" />
          <path d="M236 146 L264 112 L284 132 L300 118 L326 146 Z" fill="var(--color-accent-cyan)" opacity="0.35" />
          <rect x="384" y="22" width="112" height="162" rx="16" fill="var(--color-panel-muted)" stroke="var(--color-line)" />
          <rect x="396" y="40" width="58" height="8" rx="4" fill="var(--color-ink)" opacity="0.85" />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(396 ${60 + i * 36})`}>
              <rect width="88" height="28" rx="6" fill="var(--color-panel)" />
              <circle cx="12" cy="14" r="5" fill={["var(--color-accent-mint)", "var(--color-accent-cyan)", "var(--color-accent-blue)"][i]} />
              <rect data-sol-bar x="22" y="11" width={[52, 40, 58][i]} height="6" rx="3" fill="var(--color-ink-subtle)" />
            </g>
          ))}
        </g>
      );

    case "architecture":
      return (
        <g>
          {/* users → gateway → app instances → database */}
          <g transform="translate(24 84)">
            <circle cx="16" cy="10" r="8" fill="var(--color-ink-subtle)" />
            <path d="M2 34 c2 -12 26 -12 28 0" fill="var(--color-ink-subtle)" />
          </g>
          <path data-sol-line pathLength={1} d="M64 104 H112" stroke="var(--color-accent-cyan)" strokeWidth="2" />
          <rect x="112" y="80" width="92" height="48" rx="10" fill="var(--color-panel-muted)" stroke="var(--color-line)" />
          <rect x="126" y="98" width="64" height="8" rx="4" fill="var(--color-ink)" opacity="0.8" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <path data-sol-line pathLength={1} d={`M204 104 C232 104, 236 ${50 + i * 54}, 264 ${50 + i * 54}`} stroke="var(--color-accent-cyan)" strokeWidth="2" fill="none" />
              <rect x="264" y={34 + i * 54} width="96" height="34" rx="8" fill="var(--color-panel-muted)" stroke="var(--color-line)" />
              <circle cx="280" cy={51 + i * 54} r="5" fill="var(--color-accent-mint)" />
              <rect data-sol-bar x="292" y={47 + i * 54} width="52" height="8" rx="4" fill="var(--color-ink-subtle)" />
              <path data-sol-line pathLength={1} d={`M360 ${51 + i * 54} C386 ${51 + i * 54}, 386 104, 410 104`} stroke="var(--color-accent-cyan)" strokeWidth="2" fill="none" />
            </g>
          ))}
          {/* database */}
          <g transform="translate(410 70)">
            <ellipse cx="46" cy="10" rx="40" ry="10" fill="var(--color-accent-blue)" opacity="0.9" />
            <path d="M6 10 v48 c0 6 18 10 40 10 s40 -4 40 -10 v-48" fill="var(--color-accent-blue)" opacity="0.55" />
            <ellipse cx="46" cy="34" rx="40" ry="10" fill="none" stroke="var(--color-panel)" strokeOpacity="0.6" />
          </g>
        </g>
      );
  }
}
