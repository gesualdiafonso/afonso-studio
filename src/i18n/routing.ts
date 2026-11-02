import { defineRouting } from "next-intl/routing";

/**
 * Locales + URL prefixes.
 * Internal locale codes are valid BCP 47 tags (needed by Intl date/number
 * formatting and <html lang>). The URL shows the custom prefixes:
 *   en    → /eng
 *   pt-BR → /pt-br
 *   es    → /es
 */
/** URL prefix of each locale (also used for language links). */
export const localePrefixes = {
  en: "/eng",
  "pt-BR": "/pt-br",
  es: "/es",
} as const;

export const routing = defineRouting({
  locales: ["en", "pt-BR", "es"],
  defaultLocale: "en",
  localePrefix: {
    mode: "always",
    prefixes: localePrefixes,
  },
});

export type AppLocale = (typeof routing.locales)[number];
