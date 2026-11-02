import type { Messages } from "@/i18n/config";

/**
 * The nine storytelling sections. Order here = order on the page and in the
 * bottom navigation dock. `id` is the DOM anchor; `labelKey` points to the
 * translated label in src/i18n/messages/*.json.
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

export interface NavigationItem {
  id: SectionId;
  index: string; // "01" … "09"
  labelKey: Exclude<keyof Messages["navigation"], "label">;
  /** Section background — dark sections remap tokens via data-surface. */
  surface: "light" | "dark";
}

const order: Array<Pick<NavigationItem, "id" | "surface">> = [
  { id: "intro", surface: "light" },
  { id: "philosophy", surface: "light" },
  { id: "services", surface: "light" },
  { id: "projects", surface: "light" },
  { id: "solutions", surface: "dark" },
  { id: "process", surface: "light" },
  { id: "technology", surface: "dark" },
  { id: "studio", surface: "light" },
  { id: "contact", surface: "light" },
];

export const navigation: NavigationItem[] = order.map((item, i) => ({
  ...item,
  index: String(i + 1).padStart(2, "0"),
  labelKey: item.id,
}));

export function getNavigationItem(id: SectionId): NavigationItem {
  const item = navigation.find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown section id: ${id}`);
  return item;
}
