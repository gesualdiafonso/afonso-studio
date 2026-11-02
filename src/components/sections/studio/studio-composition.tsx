import { ACoreFallback } from "@/components/a-core/a-core-fallback";
import type { StudioContent } from "@/content/studio";
import { cn } from "@/lib/cn";

export interface StudioCompositionProps {
  positioning: StudioContent["positioning"];
  disciplines: StudioContent["disciplines"];
  equals: string;
  className?: string;
}

/**
 * Brand composition: the A-CORE back in its original, assembled form
 * (anchor `studio`) beside the positioning — four disciplines that add up
 * to one technology partner, written as an equation.
 */
export function StudioComposition({ positioning, disciplines, equals, className }: StudioCompositionProps) {
  return (
    <div className={cn("grid-site items-center gap-y-12", className)}>
      <div className="relative col-span-4 mx-auto w-full max-w-[18rem] md:col-span-8 md:max-w-[22rem] lg:col-[1/span_5] lg:max-w-none">
        {/* Blueprint frame around the core */}
        <div aria-hidden className="studio-frame absolute -inset-4 lg:-inset-6">
          <span className="studio-corner studio-corner--tl" />
          <span className="studio-corner studio-corner--tr" />
          <span className="studio-corner studio-corner--bl" />
          <span className="studio-corner studio-corner--br" />
        </div>
        <div data-acore-anchor="studio" aria-hidden className="relative aspect-square w-full">
          <div data-acore-fallback className="absolute inset-0">
            <ACoreFallback />
          </div>
        </div>
        <p aria-hidden className="mt-6 flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.08em] text-ink-secondary uppercase lg:mt-8">
          <span className="text-link">A-CORE</span>
          <span className="h-px w-8 bg-line-strong" />
          <span>Assembled state · 08</span>
        </p>
      </div>

      <div className="col-span-4 grid gap-8 md:col-span-8 lg:col-[7/-1]">
        <div data-studio-reveal className="grid gap-4">
          <h3 className="type-h2 text-ink">{positioning.title}</h3>
          <p className="type-body-lg max-w-[36rem] text-ink-secondary">{positioning.text}</p>
        </div>

        <div className="grid gap-0" aria-label={`${disciplines.join(" + ")} = ${equals}`} role="group">
          <ul aria-hidden className="grid">
            {disciplines.map((item, i) => (
              <li
                key={item}
                data-studio-discipline
                className="studio-discipline flex items-baseline justify-between gap-6 border-t border-line py-3.5"
              >
                <span className="type-h4 text-ink">{item}</span>
                <span className="font-mono text-[0.875rem] text-ink-secondary">
                  {i < disciplines.length - 1 ? "+" : ""}
                </span>
              </li>
            ))}
          </ul>
          <span aria-hidden data-studio-rule className="studio-rule h-0.5 w-full origin-left bg-ink" />
          <p aria-hidden data-studio-result className="flex items-baseline gap-4 pt-4">
            <span className="type-h3 text-link">=</span>
            <span className="type-h3 text-link">{equals}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
