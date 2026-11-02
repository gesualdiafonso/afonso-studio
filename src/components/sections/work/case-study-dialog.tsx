"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Project } from "@/content/projects";
import type { WorkContent } from "@/content/work";
import { duration, ease } from "@/config/motion";

export interface CaseStudyDialogProps {
  projects: Project[];
  /** Slug of the open project, or null when closed. */
  openSlug: string | null;
  labels: WorkContent["labels"];
  onNavigate: (slug: string) => void;
  onClose: () => void;
}

const isSvg = (src: string) => src.toLowerCase().endsWith(".svg");

/**
 * Full case study in a native modal <dialog>:
 * focus trap, Esc to close and inert background come from the browser.
 * Previous / next switch projects with a cross-fade (framer-motion).
 */
export function CaseStudyDialog({ projects, openSlug, labels, onNavigate, onClose }: CaseStudyDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const index = projects.findIndex((p) => p.slug === openSlug);
  const project = index >= 0 ? projects[index] : null;

  // Open / close the native dialog when the selected slug changes.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (project && !el.open) {
      el.showModal();
      document.documentElement.classList.add("work-dialog-open");
    } else if (!project && el.open) {
      el.close();
    }
  }, [project]);

  // Back to the top when switching projects.
  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
  }, [openSlug]);

  const prev = index > 0 ? projects[index - 1] : projects[projects.length - 1];
  const next = index < projects.length - 1 ? projects[index + 1] : projects[0];
  const titleId = "case-study-title";

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className="work-dialog m-auto h-[min(92svh,60rem)] w-[min(100%-1.5rem,72rem)] max-w-none overflow-hidden rounded-[1.75rem] border border-line bg-panel p-0 text-ink shadow-lg"
      onClose={() => {
        document.documentElement.classList.remove("work-dialog-open");
        onClose();
      }}
      onClick={(event) => {
        // Click on the backdrop (outside the content box) closes the dialog.
        if (event.target === event.currentTarget) dialog.current?.close();
      }}
    >
      {project ? (
        <div className="flex h-full flex-col">
          {/* Header */}
          <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-8">
            <p className="type-label flex min-w-0 items-center gap-3 text-ink-secondary">
              <span className="text-link">{labels.caseStudy}</span>
              <span aria-hidden className="h-px w-5 bg-line-strong" />
              <span className="type-numeric">
                {String(index + 1).padStart(2, "0")} {labels.of} {String(projects.length).padStart(2, "0")}
              </span>
            </p>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill border border-line-strong text-ink transition-colors hover:bg-panel-muted"
            >
              <X aria-hidden className="size-icon-md" strokeWidth={1.75} />
              <span className="sr-only">{labels.close}</span>
            </button>
          </header>

          {/* Body */}
          <div ref={body} tabIndex={0} className="min-h-0 flex-1 overflow-y-auto overscroll-contain focus-visible:outline-offset-[-3px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={project.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: duration.base, ease: ease["out-expo"] }}
                className="flex flex-col gap-10 px-5 py-8 md:px-10 md:py-10"
              >
                <div className="flex flex-col gap-4">
                  <p className="type-label text-ink-secondary">
                    {project.industry} · <span className="type-numeric">{project.year}</span>
                  </p>
                  <h2 id={titleId} className="type-h2 text-ink">
                    {project.name}
                  </h2>
                  <p className="type-body-lg max-w-[44rem] text-ink-secondary">{project.summary}</p>
                  {project.sample ? (
                    <p className="type-body-sm w-fit rounded-md border border-dashed border-line-strong px-3 py-2 text-ink-secondary">
                      {labels.sample} — projects.json
                    </p>
                  ) : null}
                </div>

                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-panel-muted">
                  <Image
                    src={project.preview.image}
                    alt={project.preview.alt}
                    fill
                    sizes="(min-width: 72rem) 68rem, 100vw"
                    unoptimized={isSvg(project.preview.image)}
                    className="object-cover object-left-top"
                  />
                </div>

                {/* Facts */}
                <dl className="grid gap-x-8 gap-y-5 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="grid gap-1">
                    <dt className="type-label text-ink-secondary">{labels.client}</dt>
                    <dd className="type-body text-ink">
                      {project.client.confidential ? labels.confidential : project.client.name}
                    </dd>
                  </div>
                  <div className="grid gap-1">
                    <dt className="type-label text-ink-secondary">{labels.industry}</dt>
                    <dd className="type-body text-ink">{project.industry}</dd>
                  </div>
                  <div className="grid gap-1">
                    <dt className="type-label text-ink-secondary">{labels.year}</dt>
                    <dd className="type-body type-numeric text-ink">{project.year}</dd>
                  </div>
                  {project.scope.length ? (
                    <div className="grid gap-1">
                      <dt className="type-label text-ink-secondary">{labels.scope}</dt>
                      <dd className="type-body text-ink">{project.scope.join(" · ")}</dd>
                    </div>
                  ) : null}
                </dl>

                {/* Story */}
                <div className="grid gap-10 md:grid-cols-2">
                  <section className="grid content-start gap-3">
                    <h3 className="type-h4 text-ink">{labels.challenge}</h3>
                    <p className="type-body text-ink-secondary">{project.challenge}</p>
                  </section>
                  <section className="grid content-start gap-3">
                    <h3 className="type-h4 text-ink">{labels.solution}</h3>
                    <p className="type-body text-ink-secondary">{project.solution}</p>
                  </section>
                </div>

                {project.approach.length ? (
                  <section className="grid gap-5">
                    <h3 className="type-h4 text-ink">{labels.approach}</h3>
                    <ol className="grid gap-4 md:grid-cols-3">
                      {project.approach.map((step, i) => (
                        <li key={step} className="grid content-start gap-2 border-t border-line pt-4">
                          <span className="type-label type-numeric text-link">{String(i + 1).padStart(2, "0")}</span>
                          <p className="type-body-sm text-ink">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </section>
                ) : null}

                <div className="grid gap-10 md:grid-cols-2">
                  {project.engineering.length ? (
                    <section className="grid content-start gap-3">
                      <h3 className="type-h4 text-ink">{labels.engineering}</h3>
                      <ul className="grid gap-2">
                        {project.engineering.map((item) => (
                          <li key={item} className="type-body flex items-start gap-3 text-ink">
                            <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-pill bg-brand-blue" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  <section className="grid content-start gap-3">
                    <h3 className="type-h4 text-ink">{labels.technologies}</h3>
                    <ul className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <li key={tech} className="rounded-md bg-panel-muted px-3 py-1.5 font-mono text-[0.8125rem] text-ink">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                {project.outcomes.length ? (
                  <section className="grid gap-3">
                    <h3 className="type-h4 text-ink">{labels.outcomes}</h3>
                    <ul className="grid gap-2">
                      {project.outcomes.map((item) => (
                        <li key={item} className="type-body flex items-start gap-3 text-ink">
                          <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-pill bg-brand-mint" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {project.links.live || project.links.caseStudy ? (
                  <div className="flex flex-wrap gap-4">
                    {project.links.live ? (
                      <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="type-nav inline-flex items-center gap-2 text-link hover:text-link-hover">
                        {labels.visitLive} <ArrowUpRight aria-hidden className="size-icon-sm" />
                      </a>
                    ) : null}
                    {project.links.caseStudy ? (
                      <a href={project.links.caseStudy} target="_blank" rel="noopener noreferrer" className="type-nav inline-flex items-center gap-2 text-link hover:text-link-hover">
                        {labels.externalCaseStudy} <ArrowUpRight aria-hidden className="size-icon-sm" />
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Footer: previous / next project */}
          <nav aria-label={labels.caseStudy} className="flex items-center justify-between gap-3 border-t border-line px-5 py-3 md:px-8">
            <button
              type="button"
              onClick={() => onNavigate(prev.slug)}
              className="type-nav inline-flex min-h-11 min-w-0 items-center gap-2 rounded-md px-2 text-ink hover:text-link"
            >
              <ArrowLeft aria-hidden className="size-icon-sm shrink-0" />
              <span className="truncate">{prev.name}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate(next.slug)}
              className="type-nav inline-flex min-h-11 min-w-0 items-center gap-2 rounded-md px-2 text-right text-ink hover:text-link"
            >
              <span className="truncate">{next.name}</span>
              <ArrowRight aria-hidden className="size-icon-sm shrink-0" />
            </button>
          </nav>
        </div>
      ) : null}
    </dialog>
  );
}
