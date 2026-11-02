import { SectionEyebrow } from "@/components/ui";
import { getNavigationItem } from "@/config/navigation";
import { getStudioContent } from "@/content/studio";
import { defaultLocale, type Locale } from "@/i18n/config";
import { StudioBackground } from "./studio-background";
import { StudioComposition } from "./studio-composition";
import { StudioNext } from "./studio-next";
import { StudioScene } from "./studio-scene";
import { StudioStatement } from "./studio-statement";
import { StudioValues } from "./studio-values";

export interface StudioSectionProps {
  locale?: Locale;
}

/**
 * SECTION 08 — ABOUT THE STUDIO (light, editorial)
 *   eyebrow → large statement (word-by-word fill)
 *   A-CORE in its original state | positioning as an equation
 *   four values
 *   hand-off into Contact (trace + invitation), fading to the panel surface
 */
export function StudioSection({ locale = defaultLocale }: StudioSectionProps) {
  const content = getStudioContent(locale);
  const nav = getNavigationItem("studio");
  const contact = getNavigationItem("contact");
  const titleId = "studio-title";

  return (
    <StudioScene id={nav.id} surface={nav.surface} labelledBy={titleId} className="relative">
      <StudioBackground />
      <div className="container-wide section-block relative z-10 pb-0!">
        <div data-studio-reveal className="mb-10 lg:mb-14">
          <SectionEyebrow index={nav.index}>{content.eyebrow}</SectionEyebrow>
        </div>

        <StudioStatement
          id={titleId}
          kicker={content.kicker}
          statement={content.statement}
          emphasis={content.statementEmphasis}
        />

        <StudioComposition
          positioning={content.positioning}
          disciplines={content.disciplines}
          equals={content.equals}
          className="mt-20 lg:mt-32"
        />

        <StudioValues title={content.valuesTitle} values={content.values} className="mt-24 lg:mt-36" />

        <StudioNext next={content.next} index={contact.index} contactId={contact.id} />
      </div>
    </StudioScene>
  );
}
