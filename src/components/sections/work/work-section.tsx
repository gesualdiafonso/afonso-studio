import { SectionEyebrow } from "@/components/ui";
import { getNavigationItem } from "@/config/navigation";
import { getProjects } from "@/content/projects";
import { getWorkContent } from "@/content/work";
import { defaultLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { WorkStack } from "./work-stack";

export interface WorkSectionProps {
  locale?: Locale;
}

/**
 * SECTION 04 — SELECTED WORK
 * Header + stacked case-study cards. Project data: src/content/projects/projects.json
 * (editing guide: PROJETOS-COMO-EDITAR.md).
 */
export function WorkSection({ locale = defaultLocale }: WorkSectionProps) {
  const content = getWorkContent(locale);
  const projects = getProjects(locale);
  const nav = getNavigationItem("projects");
  const titleId = "work-title";

  return (
    <section
      id={nav.id}
      data-section={nav.id}
      data-surface={nav.surface}
      aria-labelledby={titleId}
      className="relative"
    >
      <div className="container-wide section-block relative z-10">
        <div className="grid-site mb-12 gap-y-6 lg:mb-20">
          <div className="col-span-4 md:col-span-8 lg:col-span-12">
            <SectionEyebrow index={nav.index}>{content.eyebrow}</SectionEyebrow>
          </div>
          <h2 id={titleId} className="type-h1 col-span-4 text-ink md:col-span-8 lg:col-[1/span_7]">
            {content.title.map((part, i) => (
              <span key={i} className={cn("block", part.emphasis && "text-brand-blue")}>
                {part.text}
              </span>
            ))}
          </h2>
          <p className="type-body-lg col-span-4 max-w-[34rem] self-end text-ink-secondary md:col-span-6 lg:col-[9/-1] lg:row-start-2">
            {content.intro}
          </p>
        </div>

        <WorkStack projects={projects} labels={content.labels} />
      </div>
    </section>
  );
}
