import { locale as rootLocale } from "next/root-params";
import { ACoreStage } from "@/components/canvas/a-core-stage";
import { HeroSection } from "@/components/sections/hero";
import { PhilosophySection } from "@/components/sections/philosophy";
import { ProcessSection } from "@/components/sections/process";
import { ServicesSection } from "@/components/sections/services";
import { SolutionsSection } from "@/components/sections/solutions";
import { StudioSection } from "@/components/sections/studio";
import { ContactSection } from "@/components/sections/contact";
import { NavigationController } from "@/components/layout/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { getNavigationItems } from "@/config/navigation";
import { TechnologySection } from "@/components/sections/technology";
import { WorkSection } from "@/components/sections/work";
import { defaultLocale, getMessages, isLocale } from "@/i18n/config";

/** Anchors the persistent A-CORE travels through, in page order. */
const ACORE_ANCHORS = ["hero", "philosophy", "services", "process", "technology", "studio", "contact"] as const;

/**
 * Home — the nine storytelling sections, in order.
 * The layout already validated the locale; this just reads it.
 */
export default async function Home() {
  const value = await rootLocale();
  const locale = isLocale(value) ? value : defaultLocale;

  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">
        <HeroSection locale={locale} />
        <PhilosophySection locale={locale} />
        <ServicesSection locale={locale} />
        <WorkSection locale={locale} />
        <SolutionsSection locale={locale} />
        <ProcessSection locale={locale} />
        <TechnologySection locale={locale} />
        <StudioSection locale={locale} />
        <ContactSection locale={locale} />
      </main>
      <SiteFooter locale={locale} />
      {/* Shared 3D layer — after the sections so it paints above their backgrounds */}
      <ACoreStage anchors={ACORE_ANCHORS} />
      {/* Cinematic bottom navigation (fixed, z-dock) */}
      <NavigationController navigationItems={getNavigationItems(locale)} label={getMessages(locale).navigation.label} />
    </>
  );
}
