import { defaultLocale, type Locale } from "@/i18n/config";
import data from "./projects.json";

/**
 * PROJECTS — loader for projects.json (Section 04 · Selected work).
 * ---------------------------------------------------------------------------
 * You should NOT need to edit this file: edit projects.json instead
 * (guide: PROJETOS-COMO-EDITAR.md). This file
 *   1. validates the JSON at build time with clear error messages, and
 *   2. returns each project already translated for the current language,
 *      falling back to English when a translation is missing.
 */

type LocalizedText = { en: string } & Partial<Record<Exclude<Locale, "en">, string>>;
type LocalizedList = { en: string[] } & Partial<Record<Exclude<Locale, "en">, string[]>>;

interface RawProject {
  slug: string;
  sample: boolean;
  year: string;
  client: { name: string; confidential: boolean };
  name: LocalizedText;
  industry: LocalizedText;
  summary: LocalizedText;
  challenge: LocalizedText;
  solution: LocalizedText;
  engineering?: LocalizedList;
  approach?: LocalizedList;
  scope?: LocalizedList;
  technologies: string[];
  preview: { image: string; alt: LocalizedText };
  outcomes?: LocalizedList;
  links?: { live?: string | null; caseStudy?: string | null };
}

/** A project resolved for one language — what components receive. */
export interface Project {
  slug: string;
  sample: boolean;
  year: string;
  client: { name: string; confidential: boolean };
  name: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  engineering: string[];
  approach: string[];
  scope: string[];
  technologies: string[];
  preview: { image: string; alt: string };
  outcomes: string[];
  links: { live: string | null; caseStudy: string | null };
}

// ── Validation (runs once at build / server start) ───────────────────────

function fail(path: string, message: string): never {
  throw new Error(`[projects.json] ${path}: ${message}. See PROJETOS-COMO-EDITAR.md.`);
}

function checkText(value: unknown, path: string) {
  if (!value || typeof value !== "object") fail(path, "must be an object like { \"en\": \"…\" }");
  const en = (value as Record<string, unknown>).en;
  if (typeof en !== "string" || !en.trim()) fail(`${path}.en`, "is required (English text)");
}

function checkList(value: unknown, path: string) {
  if (value === undefined) return;
  if (!value || typeof value !== "object" || !Array.isArray((value as Record<string, unknown>).en)) {
    fail(path, "must be an object like { \"en\": [\"…\"] }");
  }
}

function validate(raw: unknown): RawProject[] {
  const projects = (raw as { projects?: unknown }).projects;
  if (!Array.isArray(projects) || projects.length === 0) fail("projects", "must be a non-empty array");
  const slugs = new Set<string>();

  projects.forEach((p, i) => {
    const at = `projects[${i}]`;
    if (!p || typeof p !== "object") fail(at, "must be an object");
    const project = p as Record<string, unknown>;
    if (typeof project.slug !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(project.slug)) {
      fail(`${at}.slug`, "must be lowercase-with-dashes, e.g. \"my-project\"");
    }
    if (slugs.has(project.slug as string)) fail(`${at}.slug`, `"${project.slug}" is used twice`);
    slugs.add(project.slug as string);
    if (typeof project.sample !== "boolean") fail(`${at}.sample`, "must be true or false");
    if (typeof project.year !== "string") fail(`${at}.year`, "must be a string like \"2025\"");
    ["name", "industry", "summary", "challenge", "solution"].forEach((key) => checkText(project[key], `${at}.${key}`));
    ["engineering", "approach", "scope", "outcomes"].forEach((key) => checkList(project[key], `${at}.${key}`));
    if (!Array.isArray(project.technologies) || project.technologies.length === 0) {
      fail(`${at}.technologies`, "must list at least one technology");
    }
    const preview = project.preview as Record<string, unknown> | undefined;
    if (!preview || typeof preview.image !== "string" || !preview.image.startsWith("/")) {
      fail(`${at}.preview.image`, "must be a path inside /public starting with \"/\"");
    }
    checkText(preview.alt, `${at}.preview.alt`);
  });

  return projects as RawProject[];
}

const rawProjects = validate(data);

// ── Localization ──────────────────────────────────────────────────────────

function text(value: LocalizedText, locale: Locale): string {
  return (locale !== "en" && value[locale]?.trim()) || value.en;
}

function list(value: LocalizedList | undefined, locale: Locale): string[] {
  if (!value) return [];
  const localized = locale !== "en" ? value[locale] : undefined;
  return localized && localized.length ? localized : value.en;
}

function localize(p: RawProject, locale: Locale): Project {
  return {
    slug: p.slug,
    sample: p.sample,
    year: p.year,
    client: p.client,
    name: text(p.name, locale),
    industry: text(p.industry, locale),
    summary: text(p.summary, locale),
    challenge: text(p.challenge, locale),
    solution: text(p.solution, locale),
    engineering: list(p.engineering, locale),
    approach: list(p.approach, locale),
    scope: list(p.scope, locale),
    technologies: p.technologies,
    preview: { image: p.preview.image, alt: text(p.preview.alt, locale) },
    outcomes: list(p.outcomes, locale),
    links: { live: p.links?.live ?? null, caseStudy: p.links?.caseStudy ?? null },
  };
}

export function getProjects(locale: Locale = defaultLocale): Project[] {
  return rawProjects.map((p) => localize(p, locale));
}
