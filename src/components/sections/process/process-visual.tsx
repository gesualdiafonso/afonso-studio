import { ACoreFallback } from "@/components/a-core/a-core-fallback";
import type { ProcessStage } from "@/content/process";
import { cn } from "@/lib/cn";

export interface ProcessVisualProps {
  stages: ProcessStage[];
  caption: string;
  stageLabel: string;
  className?: string;
}

/**
 * Sticky A-CORE anchor for Section 06. On desktop the shared 3D stage lands
 * here and assembles one part per stage (acoreState.assembly). The meter
 * below shows how far the assembly — and the project — has progressed.
 */
export function ProcessVisual({ stages, caption, stageLabel, className }: ProcessVisualProps) {
  return (
    <div className={cn("lg:sticky lg:top-[calc(50svh-var(--proc-visual)/2-3rem)]", className)}>
      <div
        data-acore-anchor="process"
        aria-hidden
        className="relative aspect-square w-full lg:mx-auto lg:w-(--proc-visual)"
      >
        <div data-acore-fallback className="absolute inset-0">
          <ACoreFallback />
        </div>
      </div>

      <div aria-hidden className="mt-4 hidden flex-col gap-3 lg:mx-auto lg:flex lg:w-(--proc-visual)">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-secondary uppercase">{caption}</p>
          <div className="type-body-sm text-ink">
            {stages.map((stage, i) => (
              <span key={stage.id} data-index={i} className="proc-stage-label type-numeric">
                {stageLabel} {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {stages.map((stage) => (
            <span key={stage.id} className="proc-seg h-1 rounded-pill" />
          ))}
        </div>
      </div>
    </div>
  );
}
