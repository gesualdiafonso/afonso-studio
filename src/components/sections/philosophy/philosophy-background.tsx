/**
 * Background layers with different parallax depths (data-philo-parallax).
 * Decorative only; positioned behind the content and the 3D stage.
 */
export function PhilosophyBackground({ index }: { index: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Huge outlined section number */}
      <div data-philo-parallax="0.6" className="absolute -top-[6%] -left-[3%]">
        <span className="philo-numeral block">{index}</span>
      </div>

      {/* Technical dot grid */}
      <div data-philo-parallax="0.25" className="philo-dots absolute hidden lg:block right-[4%] bottom-[18%] h-[46%] w-[42%]" />

      {/* Wireframe hexagon behind the A-CORE */}
      <div data-philo-parallax="0.4" className="absolute top-[10%] right-[-6%] hidden w-[46%] lg:block">
        <svg viewBox="0 0 200 230" className="w-full" fill="none">
          <path d="M100 4 196 59.5v111L100 226 4 170.5v-111Z" stroke="var(--color-line)" strokeWidth="1" />
          <path d="M100 34 170 74.5v81L100 196 30 155.5v-81Z" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="2 6" />
        </svg>
      </div>

      {/* Fade into the next section (opacity scrubbed by the scene) */}
      <div data-philo-transition className="absolute inset-x-0 bottom-0 h-[38%] bg-linear-to-b from-transparent to-panel" />
    </div>
  );
}
