import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { routing } from "./routing";

/**
 * next-intl request config.
 *
 * The locale comes from the [locale] root segment via `next/root-params`
 * (works with Cache Components — no headers()). `locale` is only set when
 * a function is called with an explicit override, e.g.
 * getTranslations({ locale: "es" }).
 *
 * Never call notFound() here: an invalid value falls back to the default
 * locale. Invalid URLs are rejected in [locale]/layout.tsx instead.
 */
export default getRequestConfig(async ({ locale }) => {
  const requested = locale ?? (await rootLocale());
  const resolved = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale: resolved,
    messages: (await import(`../messages/${resolved}.json`)).default,
  };
});
