import { ACoreFallback } from "@/components/a-core/a-core-fallback";
import { cn } from "@/lib/cn";
import { cssVars } from "@/lib/style-vars";
import { heroAnim } from "./hero-anim";

export interface HeroVisualProps {
  /** Accessible description of the A-CORE. */
  alt: string;
  captions: { title: string; meta: string };
  className?: string;
}

/**
 * A-CORE position in the hero.
 * - Marks the first anchor (`data-acore-anchor="hero"`) for the shared 3D
 *   stage (src/components/canvas/a-core-stage.tsx), which renders the 3D
 *   core here on desktop and carries it into the next sections.
 * - Renders the 2D SVG version (instant, no JS). It is hidden only while the
 *   3D stage is running; mobile, reduced motion and no-WebGL keep it.
 */
export function HeroVisual({ alt, captions, className }: HeroVisualProps) {
  return (
    <div role="img" aria-label={alt} className={cn("relative", className)}>
      <div className={heroAnim.visualIn} style={cssVars({ "--d": "200ms" })}>
        <div data-acore-anchor="hero" className="relative aspect-square w-full">
          <div data-acore-fallback className="absolute inset-0">
            <ACoreFallback floatClassName={heroAnim.float} orbitClassName={heroAnim.orbit} />
          </div>

          {/* Technical frame: corner marks */}
          <span aria-hidden className="pointer-events-none absolute inset-[4%] hidden lg:block">
            {(["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"] as const).map(
              (pos) => (
                <span key={pos} className={cn("absolute size-4 border-t border-l border-line-strong/60", pos)} />
              ),
            )}
          </span>
        </div>

        <p aria-hidden className="mt-2 hidden items-center justify-end gap-3 font-mono text-[0.6875rem] tracking-[0.08em] text-ink-secondary uppercase lg:flex">
          <span className="text-ink">{captions.title}</span>
          <span className="h-px w-6 bg-line-strong" />
          <span>{captions.meta}</span>
        </p>
      </div>
    </div>
  );
}
