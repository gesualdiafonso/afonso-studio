import { format, getMessages, type Locale, type Messages } from "@/i18n/config";

/**
 * NAVIGATION CONFIG — single source for the nine storytelling sections.
 * Order here = order on the page, in the bottom navigation dock and in the
 * footer. Labels come from src/messages/*.json (`navigation.<labelKey>`).
 * Visual styling lives in the components, never here.
 */
export type SectionId =
  | "intro"
  | "philosophy"
  | "services"
  | "projects"
  | "solutions"
  | "process"
  | "technology"
  | "studio"
  | "contact";

/** Optional icon key — mapped to an icon by the component that renders it. */
export type NavigationIcon =
  | "home"
  | "philosophy"
  | "services"
  | "projects"
  | "solutions"
  | "process"
  | "technology"
  | "studio"
  | "contact";

type LabelKey = Exclude<keyof Messages["navigation"], "label" | "goTo">;

export interface NavigationItem {
  id: SectionId;
  /** "01" … "09" */
  index: string;
  labelKey: LabelKey;
  /** DOM id of the section the item scrolls to. */
  targetId: string;
  icon?: NavigationIcon;
  /** Section background — dark sections remap tokens via data-surface. */
  surface: "light" | "dark";
}

const order: Array<Pick<NavigationItem, "id" | "surface" | "icon">> = [
  { id: "intro", surface: "light", icon: "home" },
  { id: "philosophy", surface: "light", icon: "philosophy" },
  { id: "services", surface: "light", icon: "services" },
  { id: "projects", surface: "light", icon: "projects" },
  { id: "solutions", surface: "dark", icon: "solutions" },
  { id: "process", surface: "light", icon: "process" },
  { id: "technology", surface: "dark", icon: "technology" },
  { id: "studio", surface: "light", icon: "studio" },
  { id: "contact", surface: "light", icon: "contact" },
];

export const navigation: NavigationItem[] = order.map((item, i) => ({
  ...item,
  index: String(i + 1).padStart(2, "0"),
  labelKey: item.id,
  targetId: item.id,
}));

export function getNavigationItem(id: SectionId): NavigationItem {
  const item = navigation.find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown section id: ${id}`);
  return item;
}

/** Navigation item with its texts resolved for one locale (what the UI receives). */
export interface ResolvedNavigationItem {
  id: SectionId;
  number: string;
  label: string;
  targetId: string;
  icon?: NavigationIcon;
  /** Accessible name — starts with the visible text (WCAG 2.5.3), e.g. "Services — go to section". */
  ariaLabel: string;
}

export function getNavigationItems(locale: Locale): ResolvedNavigationItem[] {
  const t = getMessages(locale).navigation;
  return navigation.map((item) => ({
    id: item.id,
    number: item.index,
    label: t[item.labelKey],
    targetId: item.targetId,
    icon: item.icon,
    ariaLabel: format(t.goTo, { number: item.index, label: t[item.labelKey] }),
  }));
}
