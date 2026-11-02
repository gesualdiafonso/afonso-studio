import { ACoreFallback } from "@/components/a-core/a-core-fallback";
import { SectionEyebrow } from "@/components/ui";
import { getNavigationItem } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getContactContent } from "@/content/contact";
import { defaultLocale, type Locale } from "@/i18n/config";
import { isContactConfigured } from "@/lib/contact-config";
import { ContactChannels } from "./contact-channels";
import { ContactCta } from "./contact-cta";
import { ContactForm } from "./contact-form";
import { ContactHeadline } from "./contact-headline";
import { ContactScene } from "./contact-scene";

export interface ContactSectionProps {
  locale?: Locale;
}

/**
 * SECTION 09 — CONTACT / LET'S BUILD SOMETHING (white panel)
 *   headline (staggered) + supporting text + Start a project CTA
 *   A-CORE final scene + direct channels | contact form
 * The form posts to /api/contact (Resend). Without credentials it is
 * marked "integration pending" and composes an e-mail instead.
 */
export function ContactSection({ locale = defaultLocale }: ContactSectionProps) {
  const content = getContactContent(locale);
  const nav = getNavigationItem("contact");
  const titleId = "contact-title";
  const formId = "contact-form";

  return (
    <ContactScene id={nav.id} surface={nav.surface} labelledBy={titleId} className="relative">
      {/* Continuation of the Studio trace */}
      <svg aria-hidden viewBox="0 0 2 160" preserveAspectRatio="none" className="absolute top-0 left-1/2 h-24 w-0.5 -translate-x-1/2 overflow-visible lg:h-40">
        <path data-contact-trace d="M1 0 V160" pathLength={1} stroke="var(--color-brand-blue)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div aria-hidden className="contact-bg pointer-events-none absolute inset-0" />

      <div className="container-wide section-block relative z-10">
        {/* Closing statement */}
        <div className="grid-site gap-y-8">
          <div data-contact-eyebrow className="col-span-4 md:col-span-8 lg:col-span-12">
            <SectionEyebrow index={nav.index}>{content.eyebrow}</SectionEyebrow>
          </div>
          <ContactHeadline id={titleId} headline={content.headline} className="col-span-4 md:col-span-8 lg:col-span-12" />
          <div className="col-span-4 grid gap-8 md:col-span-6 lg:col-[8/-1]">
            <p data-contact-text className="type-body-lg text-ink-secondary">
              {content.text}
            </p>
            <div>
              <ContactCta label={content.cta} formId={formId} targetId={`${formId}-start`} />
            </div>
          </div>
        </div>

        {/* Final scene + form */}
        <div className="grid-site mt-16 items-start gap-y-14 lg:mt-24">
          <div className="col-span-4 grid gap-12 md:col-span-8 lg:sticky lg:top-24 lg:col-[1/span_5]">
            <div className="relative mx-auto w-full max-w-[14rem] md:max-w-[18rem] lg:max-w-none">
              <div data-acore-anchor="contact" aria-hidden className="relative aspect-square w-full">
                <div data-acore-fallback className="absolute inset-0">
                  <ACoreFallback />
                </div>
              </div>
            </div>
            <ContactChannels content={content.channels} newTab={content.footer.newTab} />
          </div>

          <div id={formId} className="col-span-4 scroll-mt-24 md:col-span-8 lg:col-[7/-1]">
            <span id={`${formId}-start`} tabIndex={-1} className="sr-only">
              {content.form.title}
            </span>
            <ContactForm
              content={content.form}
              configured={isContactConfigured()}
              fallbackEmail={siteConfig.contact.email}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </ContactScene>
  );
}
