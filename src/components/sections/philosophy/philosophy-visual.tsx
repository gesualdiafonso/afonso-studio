import { ACoreFallback } from "@/components/a-core/a-core-fallback";
import { cn } from "@/lib/cn";

export interface PhilosophyVisualProps {
  caption: string;
  className?: string;
}

/**
 * Second A-CORE anchor. On desktop the shared 3D stage glides here from the
 * hero; elsewhere the static 2D symbol is shown.
 */
export function PhilosophyVisual({ caption, className }: PhilosophyVisualProps) {
  return (
    <div className={cn("relative", className)} aria-hidden>
      <div data-acore-anchor="philosophy" className="relative aspect-square w-full">
        <div data-acore-fallback className="absolute inset-0">
          <ACoreFallback />
        </div>
      </div>
      <p className="mt-2 hidden items-center justify-end gap-3 font-mono text-[0.6875rem] tracking-[0.08em] text-ink-secondary uppercase lg:flex">
        <span className="h-px w-6 bg-line-strong" />
        <span>{caption}</span>
      </p>
    </div>
  );
}
