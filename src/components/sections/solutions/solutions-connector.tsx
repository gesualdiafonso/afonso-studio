/**
 * Transition into the next section: four traces (one per case) converge
 * into a single node — "everything connected" — and continue down.
 * Drawn with the scroll by solutions-experience.tsx.
 */
export function SolutionsConnector({ label }: { label: string }) {
  const xs = [90, 270, 450, 630];
  return (
    <div data-sol-connector aria-hidden className="relative mt-16 lg:mt-8">
      <svg viewBox="0 0 720 260" className="mx-auto block h-auto w-full max-w-[45rem]" fill="none">
        <g stroke="var(--color-accent-cyan)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8">
          {xs.map((x) => (
            <path key={x} data-sol-connector-path pathLength={1} d={`M${x} 0 V60 C${x} 120, 360 100, 360 170`} />
          ))}
          <path data-sol-connector-path pathLength={1} d="M360 170 V260" stroke="var(--color-accent-mint)" strokeWidth="2" />
        </g>
        <g fill="var(--color-accent-mint)" stroke="var(--color-canvas)" strokeWidth="3">
          {xs.map((x) => (
            <circle key={x} data-sol-connector-node cx={x} cy="60" r="5" />
          ))}
          <circle data-sol-connector-node cx="360" cy="170" r="9" />
        </g>
      </svg>
      <p className="type-label mt-2 text-center text-ink-secondary">{label}</p>
    </div>
  );
}
