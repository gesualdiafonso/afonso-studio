import { SectionEyebrow } from "@/components/ui";
import { getNavigationItem } from "@/config/navigation";
import { getServicesContent } from "@/content/services";
import { defaultLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { ServicesList } from "./services-list";
import { ServicesScene } from "./services-scene";
import { ServicesVisual } from "./services-visual";

export interface ServicesSectionProps {
  locale?: Locale;
}

/**
 * SECTION 03 — WHAT WE ENGINEER
 * Header across the grid, then a modular composition:
 *   sticky A-CORE (cols 1–5, separates into 4 modules)  |  4 service cards (cols 6–12)
 * Starts on the white panel surface the Philosophy section fades into.
 */
export function ServicesSection({ locale = defaultLocale }: ServicesSectionProps) {
  const content = getServicesContent(locale);
  const nav = getNavigationItem("services");
  const titleId = "services-title";

  return (
    <ServicesScene id={nav.id} surface={nav.surface} labelledBy={titleId} className="relative">
      <div className="container-wide section-block relative z-10">
        {/* Header */}
        <div className="grid-site gap-y-6">
          <div data-svc-intro className="col-span-4 md:col-span-8 lg:col-span-12">
            <SectionEyebrow index={nav.index}>{content.eyebrow}</SectionEyebrow>
          </div>
          <h2 id={titleId} data-svc-intro className="type-h1 col-span-4 text-ink md:col-span-8 lg:col-[1/span_8]">
            {content.title.map((part, i) => (
              <span key={i} className={cn("block", part.emphasis && "text-brand-blue")}>
                {part.text}
              </span>
            ))}
          </h2>
          <p
            data-svc-intro
            className="type-body-lg col-span-4 max-w-[34rem] self-end text-ink-secondary md:col-span-6 lg:col-[9/-1] lg:row-start-2"
          >
            {content.intro}
          </p>
        </div>

        {/* Modular composition */}
        <div className="grid-site mt-12 items-start gap-y-10 lg:mt-20">
          <ServicesVisual
            services={content.services}
            caption={content.visualCaption}
            className="col-[2/-1] w-full max-w-[13rem] justify-self-end md:col-[5/-1] md:max-w-[17rem] lg:col-[1/span_5] lg:max-w-none lg:justify-self-stretch"
          />
          <ServicesList
            services={content.services}
            labels={{ capabilities: content.capabilitiesLabel, module: content.moduleLabel }}
            className="col-span-4 md:col-span-8 lg:col-[6/-1]"
          />
        </div>
      </div>
    </ServicesScene>
  );
}
