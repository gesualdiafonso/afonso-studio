import type { PhilosophyPrinciple } from "@/content/philosophy";
import { cn } from "@/lib/cn";

export interface PhilosophyPrinciplesProps {
  label: string;
  principles: PhilosophyPrinciple[];
  className?: string;
}

/** Three numbered principles on a hairline grid. */
export function PhilosophyPrinciples({ label, principles, className }: PhilosophyPrinciplesProps) {
  return (
    <div className={className}>
      <h3 className="sr-only">{label}</h3>
      <ol className="grid gap-x-(--spacing-grid-gap) gap-y-10 md:grid-cols-3">
        {principles.map((principle, i) => (
          <li key={principle.title} data-philo-principle className="relative flex flex-col gap-4 pt-6">
            {/* Top rule with a circuit node */}
            <span aria-hidden data-philo-rule className="absolute inset-x-0 top-0 flex items-center">
              <span className="size-2 shrink-0 rounded-pill border-[1.5px] border-brand-blue bg-canvas" />
              <span className="h-px flex-1 bg-line-strong/60" />
            </span>

            <span className="type-label type-numeric text-link">{String(i + 1).padStart(2, "0")}</span>
            <h4 className={cn("type-h3 text-ink")}>{principle.title}</h4>
            <p className="type-body max-w-[26rem] text-ink-secondary">{principle.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
