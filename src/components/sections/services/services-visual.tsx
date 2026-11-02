import { ACoreFallback } from "@/components/a-core/a-core-fallback";
import type { Service } from "@/content/services";
import { cn } from "@/lib/cn";

export interface ServicesVisualProps {
  services: Service[];
  caption: string;
  className?: string;
}

/**
 * Sticky A-CORE anchor for Section 03. On desktop the shared 3D stage lands
 * here and separates into four modules; the legend below maps each module to
 * its service and follows the active card.
 */
export function ServicesVisual({ services, caption, className }: ServicesVisualProps) {
  return (
    <div className={cn("lg:sticky lg:top-[calc(50svh-var(--svc-visual)/2-2rem)]", className)}>
      <div
        data-acore-anchor="services"
        aria-hidden
        className="relative aspect-square w-full lg:mx-auto lg:w-(--svc-visual)"
      >
        <div data-acore-fallback className="absolute inset-0">
          <ACoreFallback />
        </div>
      </div>

      <div data-svc-legend aria-hidden className="mt-4 hidden flex-col gap-3 lg:mx-auto lg:flex lg:w-(--svc-visual)">
        <p className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-secondary uppercase">{caption}</p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
          {services.map((service, i) => (
            <li key={service.id} data-module-index={i} className="svc-legend-item type-body-sm flex items-center gap-2.5">
              <span className="svc-legend-dot size-1.5 shrink-0 rounded-pill" />
              <span className="type-numeric">{String(i + 1).padStart(2, "0")}</span>
              <span className="truncate">{service.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
