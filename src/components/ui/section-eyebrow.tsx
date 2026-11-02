import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SectionEyebrowProps {
  children: ReactNode;
  /** Section number, e.g. "03". */
  index?: string;
  as?: "p" | "span" | "div";
  className?: string;
}

/**
 * Small uppercase label above a heading: index · circuit trace · label.
 * The trace is the brand's circuit line in miniature.
 */
export function SectionEyebrow({ children, index, as: Tag = "p", className }: SectionEyebrowProps) {
  return (
    <Tag className={cn("type-label inline-flex items-center gap-3 text-ink-secondary", className)}>
      {index ? <span className="type-numeric text-link">{index}</span> : null}
      <svg width="28" height="8" viewBox="0 0 28 8" fill="none" aria-hidden focusable="false" className="shrink-0">
        <path d="M0 4h18l3-3" stroke="var(--color-line-accent)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="1.5" r="1.5" fill="var(--color-accent-mint)" stroke="var(--color-line-accent)" />
      </svg>
      <span>{children}</span>
    </Tag>
  );
}
