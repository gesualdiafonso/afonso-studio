import type { ReactNode } from "react";
import { typography, type TypographyRole } from "@/config/design";
import { cn } from "@/lib/cn";
import { SectionEyebrow } from "./section-eyebrow";

type HeadingLevel = 1 | 2 | 3;
type HeadingSize = Extract<TypographyRole, "display" | "h1" | "h2" | "h3">;

export interface SectionHeadingProps {
  title: ReactNode;
  /** Semantic level (document outline). Visual size is set separately. */
  level?: HeadingLevel;
  size?: HeadingSize;
  eyebrow?: { label: ReactNode; index?: string };
  description?: ReactNode;
  align?: "start" | "center";
  /** id for aria-labelledby on the parent <section>. */
  id?: string;
  className?: string;
}

const defaultSize: Record<HeadingLevel, HeadingSize> = { 1: "h1", 2: "h2", 3: "h3" };

/** Eyebrow + heading + optional lead paragraph, with consistent rhythm. */
export function SectionHeading({
  title,
  level = 2,
  size,
  eyebrow,
  description,
  align = "start",
  id,
  className,
}: SectionHeadingProps) {
  const Heading = `h${level}` as const;
  const visual = size ?? defaultSize[level];

  return (
    <div
      className={cn(
        "flex max-w-[60rem] flex-col gap-5 md:gap-6",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? <SectionEyebrow index={eyebrow.index}>{eyebrow.label}</SectionEyebrow> : null}
      <Heading id={id} className={cn(typography[visual], "text-ink")}>
        {title}
      </Heading>
      {description ? (
        <p className={cn(typography.bodyLarge, "max-w-prose text-ink-secondary")}>{description}</p>
      ) : null}
    </div>
  );
}
