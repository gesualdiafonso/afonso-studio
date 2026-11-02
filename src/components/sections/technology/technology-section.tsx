import { SectionEyebrow } from "@/components/ui";
import { getNavigationItem } from "@/config/navigation";
import { getTechnologyContent, stack } from "@/content/technology";
import { defaultLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { TechnologyGrid } from "./technology-grid";
import { TechnologyScene } from "./technology-scene";

export interface TechnologySectionProps {
  locale?: Locale;
}

/**
 * SECTION 07 — TECHNOLOGY & CAPABILITIES (Deep Navy surface)
 * The real stack, grouped into six categories around the A-CORE hub, with
 * orbital connections between the hub and each group. No proficiency
 * indicators: the eighth cell states that the stack is chosen per project.
 */
export function TechnologySection({ locale = defaultLocale }: TechnologySectionProps) {
  const content = getTechnologyContent(locale);
  const nav = getNavigationItem("technology");
  const titleId = "technology-title";

  return (
    <TechnologyScene id={nav.id} surface={nav.surface} labelledBy={titleId} className="relative">
      <div className="container-wide section-block relative z-10">
        <div className="grid-site mb-12 gap-y-6 lg:mb-16">
          <div data-tech-reveal className="col-span-4 md:col-span-8 lg:col-span-12">
            <SectionEyebrow index={nav.index}>{content.eyebrow}</SectionEyebrow>
          </div>
          <h2 id={titleId} data-tech-reveal className="type-h1 col-span-4 text-ink md:col-span-8 lg:col-[1/span_8]">
            {content.title.map((part, i) => (
              <span key={i} className={cn("block", part.emphasis && "text-accent-cyan")}>
                {part.text}
              </span>
            ))}
          </h2>
          <p
            data-tech-reveal
            className="type-body-lg col-span-4 max-w-[34rem] self-end text-ink-secondary md:col-span-6 lg:col-[9/-1] lg:row-start-2"
          >
            {content.intro}
          </p>
        </div>

        <TechnologyGrid content={content} stack={stack} />
      </div>
    </TechnologyScene>
  );
}
