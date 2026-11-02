import { BrandLogo } from "@/components/brand";
import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getContactContent } from "@/content/contact";
import { getMessages, localeMeta, locales, type Locale } from "@/i18n/config";
import { localePrefixes } from "@/i18n/routing";
import { whatsappHref } from "@/components/sections/contact/contact-channels";
import { BackToTop } from "./back-to-top";
import "./site-footer.css";

export interface SiteFooterProps {
  locale: Locale;
}

/**
 * Closing footer (Deep Navy): logo + positioning, section navigation,
 * contact, social, language and the back-to-top control.
 */
export function SiteFooter({ locale }: SiteFooterProps) {
  const t = getMessages(locale);
  const content = getContactContent(locale);
  const f = content.footer;
  const wa = whatsappHref(content.channels.whatsappMessage);
  const prefixes: Record<Locale, string> = localePrefixes;

  const heading = "font-mono text-[0.6875rem] tracking-[0.1em] text-ink-secondary uppercase";

  return (
    <footer data-surface="dark" className="site-footer relative z-10 overflow-hidden">
      <div className="container-wide relative pt-20 pb-[calc(var(--spacing-dock)+2.5rem)] lg:pt-28">
        <div className="grid-site gap-y-12">
          <div className="col-span-4 grid content-start gap-6 md:col-span-8 lg:col-[1/span_5]">
            <BrandLogo tone="dark" size="lg" href={prefixes[locale]} locale={locale} />
            <p className="type-body-lg max-w-[26rem] text-ink-secondary">{f.tagline}</p>
          </div>

          <nav aria-label={f.navigation} className="col-span-2 md:col-span-3 lg:col-[7/span_2]">
            <h2 className={heading}>{f.navigation}</h2>
            <ul className="mt-5 grid gap-2.5">
              {navigation.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="footer-link type-body-sm inline-flex min-h-6 items-baseline gap-2.5">
                    <span className="footer-link-index type-numeric font-mono text-[0.6875rem]">{item.index}</span>
                    {t.navigation[item.labelKey]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 grid content-start gap-10 md:col-span-3 lg:col-[9/span_2]">
            <div>
              <h2 className={heading}>{f.contact}</h2>
              <ul className="mt-5 grid gap-2.5">
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className="footer-link type-body-sm break-all">
                    {siteConfig.contact.email}
                  </a>
                </li>
                {wa && (
                  <li>
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="footer-link type-body-sm">
                      WhatsApp<span className="sr-only"> {f.newTab}</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h2 className={heading}>{f.social}</h2>
              <ul className="mt-5 grid gap-2.5">
                {siteConfig.social.map((s) => (
                  <li key={s.network}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="footer-link type-body-sm">
                      {s.label}
                      <span className="sr-only"> {f.newTab}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-4 md:col-span-2 lg:col-[11/-1]">
            <h2 className={heading}>{f.language}</h2>
            <ul className="mt-5 grid gap-2.5">
              {locales.map((l) => (
                <li key={l}>
                  <a
                    href={prefixes[l]}
                    hrefLang={localeMeta[l].htmlLang}
                    lang={localeMeta[l].htmlLang}
                    aria-current={l === locale ? "true" : undefined}
                    className="footer-link type-body-sm"
                  >
                    {localeMeta[l].label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Circuit rule */}
        <svg aria-hidden viewBox="0 0 1200 24" preserveAspectRatio="none" className="footer-circuit mt-16 h-6 w-full lg:mt-24" fill="none">
          <path d="M0 12 H520 L536 4 H664 L680 12 H1200" stroke="var(--color-navy-700)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="600" cy="4" r="3" fill="var(--color-accent-mint)" />
        </svg>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-8 md:flex-row md:items-center">
          <p className="type-body-sm text-ink-secondary">
            © {siteConfig.copyrightYear} {siteConfig.legalName}. {f.rights}
          </p>
          <BackToTop label={f.backToTop} />
        </div>
      </div>
    </footer>
  );
}
