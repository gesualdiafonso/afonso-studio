import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { siteConfig } from "@/config/site";
import { getMessages, localeMeta, type Locale } from "@/i18n/config";
import { routing } from "@/i18n/routing";
import { fontVariables } from "../fonts";
import "../globals.css";

/** Required with Cache Components: one static shell per locale. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Reads and validates the [locale] segment. Unknown values → 404. */
async function resolveLocale(): Promise<Locale> {
  const value = await rootLocale();
  if (!hasLocale(routing.locales, value)) notFound();
  return value;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const t = getMessages(locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${t.brand.tagline}`,
      template: `%s · ${siteConfig.name}`,
    },
    description: t.brand.description,
    applicationName: siteConfig.name,
    alternates: {
      languages: {
        en: "/eng",
        "pt-BR": "/pt-br",
        es: "/es",
        "x-default": "/eng",
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: localeMeta[locale].ogLocale,
      title: siteConfig.name,
      description: t.brand.description,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#f5f8fa", // --color-ice (metadata cannot read CSS variables)
  colorScheme: "light",
  viewportFit: "cover", // lets the bottom dock respect safe-area insets
};

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await resolveLocale();
  const t = getMessages(locale);

  return (
    <html lang={localeMeta[locale].htmlLang} className={fontVariables}>
      <body>
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only-focusable type-nav fixed top-4 left-4 z-(--z-modal) rounded-control bg-action-primary px-4 py-3 text-ink-on-action"
          >
            {t.actions.skipToContent}
          </a>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
