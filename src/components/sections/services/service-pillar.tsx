import type { Service } from "@/content/services";
import { cn } from "@/lib/cn";
import { ServiceModuleMap } from "./service-module-map";

export interface ServicePillarProps {
  service: Service;
  index: number;
  active: boolean;
  /** Activate this card (hover, focus, click). */
  onActivate: (index: number) => void;
  labels: { capabilities: string; module: string };
}

/**
 * One large numbered service card (WAI-ARIA disclosure pattern).
 * Collapsed: number, title, summary, module map.
 * Expanded: capabilities + the A-CORE module it maps to.
 */
export function ServicePillar({ service, index, active, onActivate, labels }: ServicePillarProps) {
  const number = String(index + 1).padStart(2, "0");
  const buttonId = `svc-${service.id}-trigger`;
  const panelId = `svc-${service.id}-panel`;

  return (
    <article
      data-svc-card
      data-active={active}
      onMouseEnter={() => onActivate(index)}
      className={cn(
        "group/svc relative overflow-hidden rounded-card border bg-canvas transition-[background-color,border-color,box-shadow] duration-(--duration-base) ease-out-expo",
        "border-line hover:border-line-strong",
        "data-[active=true]:border-line-accent/40 data-[active=true]:bg-panel data-[active=true]:shadow-md",
      )}
    >
      {/* Left accent bar */}
      <span aria-hidden className="svc-bar absolute inset-y-0 left-0 w-1 bg-linear-to-b from-accent-blue via-accent-cyan to-accent-mint" />

      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={active}
          aria-controls={panelId}
          onClick={() => onActivate(index)}
          onFocus={() => onActivate(index)}
          className="grid w-full grid-cols-[auto_1fr_auto] items-start gap-x-5 p-5 text-left md:gap-x-8 md:p-8"
        >
          <span aria-hidden className="svc-number">
            {number}
          </span>
          <span className="flex min-w-0 flex-col gap-2 pt-1 md:pt-2">
            <span className="type-label type-numeric text-ink-secondary">{number} / 04</span>
            <span className="type-h3 font-display text-ink uppercase">{service.title}</span>
            <span className="type-body text-ink-secondary">{service.summary}</span>
          </span>
          <ServiceModuleMap module={service.module} className="mt-1 hidden size-16 sm:block md:size-20" />
        </button>
      </h3>

      <div id={panelId} role="region" aria-labelledby={buttonId} className="svc-panel" inert={!active}>
        <div>
          <div className="flex flex-col gap-6 border-t border-line px-5 pt-6 pb-7 md:ml-[calc(var(--spacing-grid-gap)+clamp(3.5rem,2.5rem+4.4vw,7.5rem))] md:px-8 md:pb-9 md:pl-0">
            <div className="flex flex-col gap-3">
              <p className="type-label text-ink-secondary">{labels.capabilities}</p>
              <ul className="flex flex-wrap gap-2">
                {service.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="type-body-sm rounded-pill border border-line-strong/50 bg-canvas px-3.5 py-1.5 text-ink"
                  >
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
            <p className="type-label flex items-center gap-3 text-ink-secondary">
              <span aria-hidden className="h-px w-6 bg-line-accent" />
              {labels.module} {number}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
