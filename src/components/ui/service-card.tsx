import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconContainer } from "./icon-container";

export interface ServiceCardProps {
  index: string;
  title: string;
  description: string;
  icon?: ReactNode;
  capabilities?: string[];
  headingLevel?: 3 | 4;
  tone?: "panel" | "muted";
  className?: string;
}

/** One service pillar. Lifts gently on hover; content-only, no CTA required. */
export function ServiceCard({
  index,
  title,
  description,
  icon,
  capabilities,
  headingLevel = 3,
  tone = "panel",
  className,
}: ServiceCardProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <article
      className={cn(
        "group/service relative flex h-full flex-col gap-8 overflow-hidden rounded-card border border-line p-6 md:p-8",
        "transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-out-expo",
        "hover:-translate-y-1 hover:border-line-strong hover:shadow-md",
        tone === "panel" ? "bg-panel" : "bg-panel-muted",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {icon ? (
          <IconContainer shape="hex" tone="brand" size="md">
            {icon}
          </IconContainer>
        ) : (
          <span />
        )}
        <span className="type-label type-numeric text-ink-secondary">{index}</span>
      </div>

      <div className="flex flex-col gap-3">
        <Heading className="type-h3 text-ink">{title}</Heading>
        <p className="type-body text-ink-secondary">{description}</p>
      </div>

      {capabilities?.length ? (
        <ul className="mt-auto flex flex-col border-t border-line">
          {capabilities.map((item) => (
            <li key={item} className="type-body-sm flex items-center gap-3 border-b border-line py-3 text-ink">
              <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-accent-cyan" />
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Circuit accent drawn on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-accent-blue via-accent-cyan to-accent-mint transition-transform duration-(--duration-slow) ease-out-expo group-hover/service:scale-x-100"
      />
    </article>
  );
}
