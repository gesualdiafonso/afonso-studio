import Image from "next/image";
import { PrimaryButton } from "@/components/ui";
import type { Project } from "@/content/projects";
import type { WorkContent } from "@/content/work";
import { cn } from "@/lib/cn";
import { cssVars } from "@/lib/style-vars";

export interface WorkCardProps {
  project: Project;
  index: number;
  total: number;
  labels: WorkContent["labels"];
  onOpen: (slug: string, trigger: HTMLElement) => void;
}

const isSvg = (src: string) => src.toLowerCase().endsWith(".svg");

/**
 * One large project card. On desktop it sticks and the next card slides over
 * it (work-stack.tsx scales/dims it). Left: engineering story. Right: preview.
 */
export function WorkCard({ project, index, total, labels, onOpen }: WorkCardProps) {
  const number = String(index + 1).padStart(2, "0");
  const titleId = `work-${project.slug}-title`;

  return (
    <li data-work-item className="work-item" style={cssVars({ "--i": index })}>
      <article
        data-work-surface
        aria-labelledby={titleId}
        className="work-surface relative grid overflow-hidden rounded-[1.75rem] border border-line bg-panel shadow-lg lg:grid-cols-12"
      >
        {/* Preview (first on mobile, right on desktop) */}
        <div className="relative m-2.5 overflow-hidden rounded-[1.25rem] bg-panel-muted max-lg:aspect-[16/10] lg:order-2 lg:col-span-7 lg:m-3">
          <div data-work-parallax className="absolute inset-x-0 -inset-y-[8%]">
            <Image
              src={project.preview.image}
              alt={project.preview.alt}
              fill
              sizes="(min-width: 64rem) 58vw, 100vw"
              unoptimized={isSvg(project.preview.image)}
              className="object-cover object-left-top"
            />
          </div>
          {project.sample ? (
            <span className="type-label absolute bottom-3 left-3 rounded-pill border border-dashed border-line-strong bg-panel/90 px-3 py-1.5 text-ink-secondary">
              {labels.sample}
            </span>
          ) : null}
        </div>

        {/* Story */}
        <div className="flex min-h-0 flex-col gap-5 p-6 md:p-8 lg:order-1 lg:col-span-5 lg:gap-5 lg:p-9">
          <p data-work-reveal className="type-label flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-secondary">
            <span className="type-numeric text-link">
              {number} <span className="text-ink-secondary">/ {String(total).padStart(2, "0")}</span>
            </span>
            <span aria-hidden className="h-px w-5 bg-line-strong" />
            <span>{project.industry}</span>
            <span aria-hidden className="h-px w-5 bg-line-strong" />
            <span className="type-numeric">{project.year}</span>
          </p>

          <div data-work-reveal className="flex flex-col gap-3">
            <h3 id={titleId} className="work-title text-ink">
              {project.name}
            </h3>
            <p className="type-body text-ink-secondary">{project.summary}</p>
          </div>

          <dl className="grid gap-4 border-t border-line pt-5">
            <div data-work-reveal className="grid gap-1.5">
              <dt className="type-label text-ink">{labels.challenge}</dt>
              <dd className="type-body-sm line-clamp-3 text-ink-secondary">{project.challenge}</dd>
            </div>
            <div data-work-reveal className="grid gap-1.5">
              <dt className="type-label text-ink">{labels.solution}</dt>
              <dd className="type-body-sm line-clamp-3 text-ink-secondary">{project.solution}</dd>
            </div>
            {project.engineering.length ? (
              <div data-work-reveal className="work-engineering grid gap-2">
                <dt className="type-label text-ink">{labels.engineering}</dt>
                <dd>
                  <ul className="grid gap-1.5">
                    {project.engineering.slice(0, 3).map((item) => (
                      <li key={item} className="type-body-sm flex items-start gap-2.5 text-ink">
                        <span aria-hidden className="mt-[0.5em] size-1.5 shrink-0 rounded-pill bg-brand-blue" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>

          <div data-work-reveal className="mt-auto flex flex-col gap-5">
            <ul aria-label={labels.technologies} className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <li key={tech} className="type-body-sm rounded-md bg-panel-muted px-2.5 py-1 font-mono text-[0.75rem] text-ink">
                  {tech}
                </li>
              ))}
            </ul>
            <div>
              <PrimaryButton
                aria-haspopup="dialog"
                onClick={(event) => onOpen(project.slug, event.currentTarget)}
                className={cn("w-full sm:w-auto")}
              >
                {labels.viewCaseStudy}
                <span className="sr-only">: {project.name}</span>
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* Dim layer used while the next card stacks over this one */}
        <span aria-hidden data-work-dim className="pointer-events-none absolute inset-0 bg-navy-900 opacity-0" />
      </article>
    </li>
  );
}
