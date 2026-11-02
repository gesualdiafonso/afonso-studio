import { CodeXml, Network, Rocket, Search, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ProcessIcon, ProcessStage } from "@/content/process";
import { cn } from "@/lib/cn";

const icons: Record<ProcessIcon, LucideIcon> = {
  discovery: Search,
  architecture: Network,
  engineering: CodeXml,
  testing: ShieldCheck,
  delivery: Rocket,
};

export interface ProcessTimelineProps {
  stages: ProcessStage[];
  labels: { deliverables: string; stage: string };
  className?: string;
}

/**
 * Vertical five-stage timeline (desktop and mobile).
 * The markup renders every stage as reached (data-active="true") so the
 * content is complete without JS; process-scene.tsx resets and drives it.
 */
export function ProcessTimeline({ stages, labels, className }: ProcessTimelineProps) {
  return (
    <ol data-proc-list className={cn("proc-list relative", className)}>
      <span aria-hidden className="proc-rail" />
      <span aria-hidden className="proc-rail-fill" />
      <span aria-hidden className="proc-rail-tip" />

      {stages.map((stage, i) => {
        const Icon = icons[stage.icon];
        const number = String(i + 1).padStart(2, "0");
        return (
          <li
            key={stage.id}
            data-proc-stage
            data-active="true"
            className="relative grid grid-cols-[var(--proc-node-col)_1fr] gap-x-4 pb-14 last:pb-0 md:gap-x-8 lg:pb-24"
          >
            {/* Node + branch trace (interconnected micro-nodes) */}
            <div aria-hidden className="relative flex justify-center pt-4">
              <span data-proc-node className="proc-node relative z-10 size-3.5 rounded-pill" />
              <svg
                className="proc-branch absolute top-[1.4375rem] left-[calc(50%+0.5rem)] hidden h-10 w-10 overflow-visible md:block"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  d="M0 0 H14 L24 10 V34"
                  pathLength={1}
                  stroke="var(--color-accent-cyan)"
                  strokeWidth="1.5"
                />
                <circle cx="14" cy="0" r="2.5" fill="var(--color-brand-blue)" />
                <circle cx="24" cy="34" r="3" fill="none" stroke="var(--color-accent-mint)" strokeWidth="1.5" />
              </svg>
            </div>

            <article className="grid gap-4 md:grid-cols-[auto_1fr] md:gap-x-28">
              <div className="flex items-center gap-4 md:flex-col md:items-start">
                <span className="type-h2 type-numeric text-link" aria-hidden>
                  {number}
                </span>
                <span className="proc-icon flex size-12 items-center justify-center rounded-[0.875rem] border border-line bg-panel text-brand-blue shadow-sm">
                  <Icon className="size-5" strokeWidth={1.6} aria-hidden />
                </span>
              </div>

              <div className="grid gap-3">
                <h3 className="proc-title type-h3 uppercase">
                  <span className="sr-only">
                    {labels.stage} {number}:{" "}
                  </span>
                  {stage.title}
                </h3>
                <div className="proc-details grid gap-5">
                  <p className="type-body-lg max-w-[34rem] text-ink-secondary">{stage.description}</p>
                  <div className="grid gap-2.5">
                    <p className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-secondary uppercase">
                      {labels.deliverables}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {stage.deliverables.map((item) => (
                        <li
                          key={item}
                          className="type-body-sm flex items-center gap-2 rounded-pill border border-line bg-panel px-3 py-1.5 text-ink"
                        >
                          <span aria-hidden className="size-1.5 rounded-pill bg-accent-mint" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
