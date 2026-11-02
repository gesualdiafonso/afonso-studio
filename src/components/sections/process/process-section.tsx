import { SectionEyebrow } from "@/components/ui";
import { getNavigationItem } from "@/config/navigation";
import { getProcessContent } from "@/content/process";
import { defaultLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { ProcessScene } from "./process-scene";
import { ProcessTimeline } from "./process-timeline";
import { ProcessVisual } from "./process-visual";

export interface ProcessSectionProps {
  locale?: Locale;
}

/**
 * SECTION 06 — OUR ENGINEERING PROCESS
 * Header, then:
 *   sticky A-CORE assembling stage by stage (cols 1–5) | vertical timeline (cols 6–12)
 * On mobile the timeline stays vertical and the 2D logo sits above it.
 */
export function ProcessSection({ locale = defaultLocale }: ProcessSectionProps) {
  const content = getProcessContent(locale);
  const nav = getNavigationItem("process");
  const titleId = "process-title";

  return (
    <ProcessScene id={nav.id} surface={nav.surface} labelledBy={titleId} className="relative">
      <div className="container-wide section-block relative z-10">
        <div className="grid-site gap-y-6">
          <div data-proc-reveal className="col-span-4 md:col-span-8 lg:col-span-12">
            <SectionEyebrow index={nav.index}>{content.eyebrow}</SectionEyebrow>
          </div>
          <h2 id={titleId} data-proc-reveal className="type-h1 col-span-4 text-ink md:col-span-8 lg:col-[1/span_8]">
            {content.title.map((part, i) => (
              <span key={i} className={cn("block", part.emphasis && "text-brand-blue")}>
                {part.text}
              </span>
            ))}
          </h2>
          <p
            data-proc-reveal
            className="type-body-lg col-span-4 max-w-[34rem] self-end text-ink-secondary md:col-span-6 lg:col-[9/-1] lg:row-start-2"
          >
            {content.intro}
          </p>
        </div>

        <div className="grid-site mt-12 items-start gap-y-10 lg:mt-20">
          <ProcessVisual
            stages={content.stages}
            caption={content.labels.assembly}
            stageLabel={content.labels.stage}
            className="col-[2/-1] w-full max-w-[13rem] justify-self-end md:col-[5/-1] md:max-w-[17rem] lg:col-[1/span_5] lg:max-w-none lg:justify-self-stretch"
          />
          <ProcessTimeline
            stages={content.stages}
            labels={content.labels}
            className="col-span-4 md:col-span-8 lg:col-[6/-1]"
          />
        </div>
      </div>
    </ProcessScene>
  );
}
