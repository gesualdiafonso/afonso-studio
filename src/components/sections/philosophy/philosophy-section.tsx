import { SectionEyebrow } from "@/components/ui";
import { getNavigationItem } from "@/config/navigation";
import { getPhilosophyContent } from "@/content/philosophy";
import { defaultLocale, type Locale } from "@/i18n/config";
import { PhilosophyBackground } from "./philosophy-background";
import { PhilosophyHeadline } from "./philosophy-headline";
import { PhilosophyPrinciples } from "./philosophy-principles";
import { PhilosophyScene } from "./philosophy-scene";
import { PhilosophyVisual } from "./philosophy-visual";

export interface PhilosophySectionProps {
  locale?: Locale;
}

/**
 * SECTION 02 — THE ENGINEERING PHILOSOPHY
 * Editorial composition on a 12-column grid:
 *   eyebrow · oversized headline (cols 1–8) · A-CORE anchor (cols 9–12)
 *   supporting copy offset to col 5 · three principles on a hairline grid.
 */
export function PhilosophySection({ locale = defaultLocale }: PhilosophySectionProps) {
  const content = getPhilosophyContent(locale);
  const nav = getNavigationItem("philosophy");
  const titleId = "philosophy-title";

  return (
    <PhilosophyScene id={nav.id} surface={nav.surface} labelledBy={titleId} className="relative overflow-hidden">
      <PhilosophyBackground index={nav.index} />

      <div className="container-wide section-block relative z-10">
        <div className="grid-site items-center gap-y-10 lg:gap-y-14">
          <SectionEyebrow index={nav.index} className="col-span-4 md:col-span-8 lg:col-[1/span_8]">
            {content.eyebrow}
          </SectionEyebrow>

          <PhilosophyHeadline
            id={titleId}
            words={content.headline}
            className="col-span-4 md:col-span-8 lg:col-[1/span_8] lg:row-start-2"
          />

          <PhilosophyVisual
            caption={content.visualCaption}
            className="col-[2/-1] w-full max-w-[13rem] justify-self-end md:col-[5/-1] md:max-w-[17rem] lg:col-[9/-1] lg:row-[2/span_2] lg:max-w-none lg:justify-self-stretch"
          />

          <p
            data-philo-copy
            className="type-body-lg col-span-4 max-w-[34rem] text-ink-secondary md:col-[3/-1] lg:col-[5/span_4] lg:row-start-3"
          >
            {content.description}
          </p>

          <PhilosophyPrinciples
            label={content.principlesLabel}
            principles={content.principles}
            className="col-span-4 mt-6 md:col-span-8 lg:col-span-12 lg:mt-16"
          />
        </div>
      </div>
    </PhilosophyScene>
  );
}
