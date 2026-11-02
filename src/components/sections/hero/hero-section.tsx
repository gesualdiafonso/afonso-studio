import { ChartNoAxesCombined, Handshake, Hexagon, type LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand";
import { getNavigationItem } from "@/config/navigation";
import { getHeroContent, type HeroDetailIcon } from "@/content/hero";
import { defaultLocale, getMessages, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { cssVars } from "@/lib/style-vars";
import { HeroCircuits } from "./hero-circuits";
import { HeroContent } from "./hero-content";
import { HERO_SECTION_ID } from "./hero-scroll";
import { HeroVisual } from "./hero-visual";
import { ScrollIndicator } from "./scroll-indicator";
import { heroAnim } from "./hero-anim";

const detailIcons: Record<HeroDetailIcon, LucideIcon> = {
  studio: Hexagon,
  partner: Handshake,
  business: ChartNoAxesCombined,
};

export interface HeroSectionProps {
  locale?: Locale;
}

/**
 * SECTION 01 — INTRO / HERO
 * Full-viewport editorial composition: oversized headline on the left,
 * A-CORE as the dominant visual on the right (stacked above on mobile),
 * details rail + scroll cue at the bottom, clear of the navigation dock.
 */
export function HeroSection({ locale = defaultLocale }: HeroSectionProps) {
  const content = getHeroContent(locale);
  const nav = getNavigationItem(HERO_SECTION_ID);
  const navLabel = getMessages(locale).navigation[nav.labelKey];
  const titleId = "hero-title";

  return (
    <section
      id={nav.id}
      data-section={nav.id}
      data-surface={nav.surface}
      data-hero="root"
      aria-labelledby={titleId}
      className="relative overflow-hidden bg-canvas"
    >
      <div data-hero-layer="decor" className="absolute inset-0 hidden lg:block">
        <HeroCircuits />
      </div>

      <div className="container-wide relative z-10 flex min-h-svh flex-col pt-5 pb-[calc(var(--spacing-dock)+0.75rem)] lg:pt-7">
        {/* Top bar: logo + section index (not navigation) */}
        <div className="flex items-center justify-between gap-6">
          <div className={heroAnim.logo}>
            <BrandLogo locale={locale} />
          </div>
          <p
            aria-hidden
            className={cn("type-label type-numeric flex items-center gap-3 text-ink-secondary", heroAnim.fadeUp)}
            style={cssVars({ "--d": "300ms" })}
          >
            <span className="text-ink">{nav.index}</span>
            <span className="h-px w-8 bg-line-strong" />
            <span>09</span>
            <span className="hidden sm:inline">· {navLabel}</span>
          </p>
        </div>

        {/* Stage */}
        <div className="grid-site flex-1 content-center items-center gap-y-6 py-8 lg:py-6">
          <HeroContent
            content={content}
            index={nav.index}
            titleId={titleId}
            className="col-span-4 md:col-span-8 lg:col-[1/-1] lg:row-start-1"
          />

          <div
            data-hero-layer="visual"
            className={cn(
              "order-first col-[2/span_3] w-full max-w-[13rem] justify-self-end",
              "md:col-[5/span_4] md:max-w-[18rem]",
              "lg:order-none lg:col-[7/-1] lg:row-start-1 lg:max-w-[min(100%,64svh)] lg:justify-self-end",
            )}
          >
            <HeroVisual alt={content.visualAlt} captions={content.visualCaptions} className="lg:translate-x-[4%]" />
          </div>
        </div>

        {/* Details rail + scroll cue */}
        <div
          data-hero-layer="details"
          className="flex items-end justify-between gap-8 border-t border-line pt-5"
        >
          <ul className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:gap-x-10">
            {content.details.map((detail, i) => {
              const Icon = detailIcons[detail.icon];
              return (
                <li
                  key={detail.label}
                  className={cn("type-body-sm flex items-center gap-2.5 text-ink", heroAnim.fadeUp)}
                  style={cssVars({ "--d": `${1250 + i * 90}ms` })}
                >
                  <Icon aria-hidden className="size-icon-sm shrink-0 text-action-primary" strokeWidth={1.75} />
                  {detail.label}
                </li>
              );
            })}
          </ul>

          <div data-hero-layer="scroll" className="shrink-0">
            <div className={heroAnim.fadeUp} style={cssVars({ "--d": "1600ms" })}>
              <ScrollIndicator {...content.scroll} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
