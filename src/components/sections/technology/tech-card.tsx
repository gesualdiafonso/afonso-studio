import type { TechCategoryId, TechItem, TechTone } from "@/content/technology";
import { cn } from "@/lib/cn";
import { CategoryIcon } from "./tech-icons";

export interface TechCardProps {
  id: TechCategoryId;
  tone: TechTone;
  index: number;
  title: string;
  description: string;
  items: TechItem[];
  /** Running tile number of the first item (periodic-table style index). */
  startNumber: number;
  countLabel: string;
  /** "Also used in Automation: Python" — names shared with other groups. */
  shared: { name: string; categories: string[] }[];
  alsoInLabel: string;
  className?: string;
  /** "wide": periodic-table layout (large tiles above the names) for a 2-column card. */
  layout?: "compact" | "wide";
  /** Name of the hovered shared technology — matching tiles light up. */
  highlight?: string | null;
  onTechEnter?: (name: string) => void;
  onTechLeave?: () => void;
}

/**
 * One technology group: header (icon, number, title, count), one-line purpose,
 * and the stack as "element" tiles — an original typographic mark per tool,
 * never a brand logo, and no proficiency indicators.
 */
export function TechCard({
  id,
  tone,
  index,
  title,
  description,
  items,
  startNumber,
  countLabel,
  shared,
  alsoInLabel,
  className,
  highlight,
  layout = "compact",
  onTechEnter,
  onTechLeave,
}: TechCardProps) {
  const headingId = `tech-${id}-title`;
  return (
    <article
      data-tech-card={id}
      data-tone={tone}
      aria-labelledby={headingId}
      className={cn("tech-card relative flex flex-col gap-5 rounded-[1.25rem] p-5 md:p-6", className)}
    >
      <header className="flex items-start gap-4">
        <span aria-hidden className="tech-card-icon flex size-11 shrink-0 items-center justify-center rounded-[0.75rem]">
          <CategoryIcon id={id} className="size-5" />
        </span>
        <div className="grid min-w-0 flex-1 gap-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 id={headingId} className="type-h4 text-ink uppercase">
              {title}
            </h3>
            <span className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-secondary uppercase">
              {String(index + 1).padStart(2, "0")} · {items.length} {countLabel}
            </span>
          </div>
          <p className="type-body-sm text-ink-secondary">{description}</p>
        </div>
      </header>

      <ul data-layout={layout} className="tech-tiles grid flex-1 gap-2">
        {items.map((item, i) => (
          <li
            key={item.name}
            data-tech-item={item.name}
            data-match={highlight === item.name || undefined}
            className="tech-item flex min-h-12 items-center gap-3 rounded-[0.75rem] py-1.5 pr-3 pl-1.5 lg:in-data-[layout=wide]:flex-col lg:in-data-[layout=wide]:items-start lg:in-data-[layout=wide]:justify-end lg:in-data-[layout=wide]:p-3"
            onPointerEnter={() => onTechEnter?.(item.name)}
            onPointerLeave={() => onTechLeave?.()}
          >
            <span aria-hidden data-tech-tile className="flex shrink-0">
              <span className="tech-tile relative grid size-9 place-items-center rounded-[0.5rem] lg:in-data-[layout=wide]:size-14 lg:in-data-[layout=wide]:rounded-[0.75rem]">
                <span className="tech-tile-num absolute top-0.5 left-1 font-mono text-[0.5rem] leading-none">
                {startNumber + i}
              </span>
                <span className="tech-tile-symbol font-display text-[0.9375rem] leading-none font-semibold lg:in-data-[layout=wide]:text-[1.375rem]">
                  {item.symbol}
                </span>
              </span>
            </span>
            <span data-tech-label className="type-body-sm text-ink">
              {item.name}
            </span>
          </li>
        ))}
      </ul>

      {shared.length > 0 && (
        <p className="mt-auto font-mono text-[0.6875rem] tracking-[0.04em] text-ink-secondary">
          {shared.map((s) => `${alsoInLabel} ${s.categories.join(", ")}: ${s.name}`).join(" · ")}
        </p>
      )}

      {/* Connection terminal (desktop) — where the orbital line meets the card */}
      <span aria-hidden data-tech-terminal className="tech-terminal absolute size-2.5 rounded-pill" />
    </article>
  );
}
