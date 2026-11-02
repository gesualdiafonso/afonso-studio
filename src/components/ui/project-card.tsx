import Link from "next/link";
import type { ImageProps } from "next/image";
import { cn } from "@/lib/cn";
import { ArrowUpRightIcon } from "./icons";
import { ImageFrame, type ImageRatio } from "./image-frame";

/**
 * A real project / case study. There is intentionally no field for
 * metrics or testimonials — only add verified, client-approved facts.
 */
export interface Project {
  slug: string;
  title: string;
  client?: string;
  category: string;
  year: string;
  summary: string;
  tags?: string[];
  image?: { src: ImageProps["src"]; alt: string };
  href?: string;
}

export interface ProjectCardProps {
  project: Project;
  /** feature = large editorial composition · standard = grid card. */
  layout?: "feature" | "standard";
  ratio?: ImageRatio;
  headingLevel?: 2 | 3;
  ctaLabel?: string;
  className?: string;
}

export function ProjectCard({
  project,
  layout = "standard",
  ratio,
  headingLevel = 3,
  ctaLabel,
  className,
}: ProjectCardProps) {
  const Heading = `h${headingLevel}` as const;
  const isFeature = layout === "feature";

  return (
    <article
      className={cn(
        "group/project relative flex flex-col gap-5",
        isFeature && "lg:grid lg:grid-cols-12 lg:items-end lg:gap-(--spacing-grid-gap)",
        className,
      )}
    >
      <div className={cn(isFeature && "lg:col-span-8")}>
        {project.image ? (
          <ImageFrame
            src={project.image.src}
            alt={project.image.alt}
            ratio={ratio ?? (isFeature ? "wide" : "landscape")}
            sizes={isFeature ? "(min-width: 64rem) 66vw, 100vw" : "(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw"}
            imageClassName="transition-transform duration-(--duration-cinematic) ease-out-expo group-hover/project:scale-[1.035]"
          />
        ) : (
          <div
            aria-hidden
            className={cn(
              "rounded-media border border-line bg-panel-muted",
              isFeature ? "aspect-wide" : "aspect-landscape",
            )}
          />
        )}
      </div>

      <div className={cn("flex flex-col gap-3", isFeature && "lg:col-span-4 lg:pb-2")}>
        <p className="type-label flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-secondary">
          <span>{project.category}</span>
          <span aria-hidden className="h-px w-4 bg-line-strong" />
          <span className="type-numeric">{project.year}</span>
          {project.client ? (
            <>
              <span aria-hidden className="h-px w-4 bg-line-strong" />
              <span>{project.client}</span>
            </>
          ) : null}
        </p>

        <Heading className={cn(isFeature ? "type-h2" : "type-h4", "text-ink")}>
          {project.href ? (
            <Link
              href={project.href}
              className="rounded-xs after:absolute after:inset-0 after:content-[''] focus-visible:outline-offset-4"
            >
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </Heading>

        <p className="type-body text-ink-secondary">{project.summary}</p>

        {project.tags?.length ? (
          <ul className="flex flex-wrap gap-2 pt-1">
            {project.tags.map((tag) => (
              <li key={tag} className="type-body-sm rounded-pill border border-line px-3 py-1 text-ink-secondary">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {project.href && ctaLabel ? (
          <span
            aria-hidden
            className="type-nav mt-2 inline-flex items-center gap-2 text-link transition-colors group-hover/project:text-link-hover"
          >
            {ctaLabel}
            <ArrowUpRightIcon className="size-icon-sm transition-transform duration-(--duration-base) ease-out-expo group-hover/project:-translate-y-0.5 group-hover/project:translate-x-0.5" />
          </span>
        ) : null}
      </div>
    </article>
  );
}
