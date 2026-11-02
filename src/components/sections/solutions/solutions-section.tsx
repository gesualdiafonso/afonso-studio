import { SectionEyebrow } from "@/components/ui";
import { getNavigationItem } from "@/config/navigation";
import { getSolutionsContent } from "@/content/solutions";
import { defaultLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { SolutionsExperience } from "./solutions-experience";

export interface SolutionsSectionProps {
  locale?: Locale;
}

/**
 * SECTION 05 — BUSINESS SOLUTIONS (Deep Navy surface)
 * Four problem → solution experiences: disconnected modules connect into a
 * system, then the UI mockup / architecture appears. Ends with traces
 * converging into the next section.
 */
export function SolutionsSection({ locale = defaultLocale }: SolutionsSectionProps) {
  const content = getSolutionsContent(locale);
  const nav = getNavigationItem("solutions");
  const titleId = "solutions-title";

  const header = (
    <div className="grid-site mb-14 gap-y-6 lg:mb-6">
      <div data-sol-reveal className="col-span-4 md:col-span-8 lg:col-span-12">
        <SectionEyebrow index={nav.index}>{content.eyebrow}</SectionEyebrow>
      </div>
      <h2 id={titleId} data-sol-reveal className="type-h1 col-span-4 text-ink md:col-span-8 lg:col-[1/span_7]">
        {content.title.map((part, i) => (
          <span key={i} className={cn("block", part.emphasis && "text-accent-cyan")}>
            {part.text}
          </span>
        ))}
      </h2>
      <p
        data-sol-reveal
        className="type-body-lg col-span-4 max-w-[34rem] self-end text-ink-secondary md:col-span-6 lg:col-[9/-1] lg:row-start-2"
      >
        {content.intro}
      </p>
    </div>
  );

  return (
    <section
      id={nav.id}
      data-section={nav.id}
      data-surface={nav.surface}
      aria-labelledby={titleId}
      className="relative"
    >
      <div className="container-wide section-block relative z-10">
        <SolutionsExperience content={content} header={header} />
      </div>
    </section>
  );
}
