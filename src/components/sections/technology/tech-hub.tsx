import { ACoreFallback } from "@/components/a-core/a-core-fallback";
import type { TechCategoryStack } from "@/content/technology";
import { cn } from "@/lib/cn";

export interface TechHubProps {
  label: string;
  title: string;
  categories: Pick<TechCategoryStack, "id" | "tone">[];
  className?: string;
}

/**
 * Centre of the ecosystem: the A-CORE (shared 3D stage lands on the
 * `technology` anchor) inside two orbits that carry one node per group.
 */
export function TechHub({ label, title, categories, className }: TechHubProps) {
  return (
    <div data-tech-hub className={cn("tech-hub relative grid place-items-center", className)}>
      <svg aria-hidden viewBox="0 0 400 400" className="absolute inset-0 m-auto size-full max-h-full" fill="none">
        <g data-tech-orbit className="tech-orbit">
          <ellipse cx="200" cy="200" rx="188" ry="188" stroke="var(--color-navy-700)" />
          <ellipse cx="200" cy="200" rx="160" ry="160" stroke="var(--color-accent-cyan)" strokeOpacity=".35" strokeDasharray="2 8" />
          {categories.map((c, i) => {
            const a = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
            const r = i % 2 ? 160 : 188;
            return (
              <circle
                key={c.id}
                data-tech-orbit-node={c.id}
                data-tone={c.tone}
                className="tech-orbit-node"
                cx={200 + Math.cos(a) * r}
                cy={200 + Math.sin(a) * r}
                r="5"
              />
            );
          })}
        </g>
      </svg>

      <div data-acore-anchor="technology" aria-hidden className="relative aspect-square w-[62%] max-w-[16rem]">
        <div data-acore-fallback className="absolute inset-0">
          <ACoreFallback />
        </div>
      </div>

      <p className="tech-hub-label absolute bottom-3 left-1/2 grid -translate-x-1/2 justify-items-center gap-0.5 text-center whitespace-nowrap">
        <span className="font-mono text-[0.625rem] tracking-[0.1em] text-accent-cyan uppercase">{label}</span>
        <span className="type-body-sm text-ink">{title}</span>
      </p>
    </div>
  );
}
