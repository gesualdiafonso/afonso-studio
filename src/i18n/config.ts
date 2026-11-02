import en from "@/messages/en.json";
import ptBR from "@/messages/pt-BR.json";
import es from "@/messages/es.json";
import { routing, type AppLocale } from "./routing";

/**
 * Shared locale helpers for server components that receive `locale` as a prop
 * (section content files, metadata). Locale list comes from ./routing.ts.
 * Inside components you can also use next-intl directly:
 *   const t = await getTranslations("navigation");
 */
export const locales = routing.locales;
export type Locale = AppLocale;
export const defaultLocale: Locale = routing.defaultLocale;

export const localeMeta: Record<Locale, { label: string; htmlLang: string; ogLocale: string }> = {
  en: { label: "English", htmlLang: "en", ogLocale: "en_US" },
  "pt-BR": { label: "Português", htmlLang: "pt-BR", ogLocale: "pt_BR" },
  es: { label: "Español", htmlLang: "es", ogLocale: "es_ES" },
};

export type Messages = typeof en;

// `satisfies` makes TypeScript fail if PT or ES miss a key that EN has.
export const messages = { en, "pt-BR": ptBR, es } satisfies Record<Locale, Messages>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function getMessages(locale: Locale = defaultLocale): Messages {
  return messages[locale];
}

/** Minimal `{placeholder}` interpolation for plain-object messages. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
