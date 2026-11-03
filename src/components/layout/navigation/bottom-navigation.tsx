"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { navigationMotion } from "@/config/motion";
import type { ResolvedNavigationItem } from "@/config/navigation";
import { NavigationItem } from "./navigation-item";
import "./bottom-navigation.css";

export interface BottomNavigationProps {
  /** id of the active section (NavigationItem.id). */
  activeSection: string;
  /** Called with the item id when a card is activated (click, tap, Enter). */
  onNavigate: (sectionId: string) => void;
  navigationItems: ResolvedNavigationItem[];
  /** Accessible name of the <nav> landmark. */
  label: string;
}

const MD = "(min-width: 48rem)";

/** Card widths in px for the current breakpoint and root font size. */
function useCardSizes() {
  const [sizes, setSizes] = useState(() => toPx(false, 16));
  useEffect(() => {
    const mq = window.matchMedia(MD);
    const update = () => setSizes(toPx(mq.matches, parseFloat(getComputedStyle(document.documentElement).fontSize) || 16));
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return sizes;
}

function toPx(md: boolean, rem: number) {
  const { compact, expanded } = navigationMotion.size;
  return { compact: (md ? compact.md : compact.base) * rem, expanded: (md ? expanded.md : expanded.base) * rem };
}

/**
 * CINEMATIC BOTTOM NAVIGATION — presentational dock.
 * Pure contract: activeSection / onNavigate / navigationItems. It owns no
 * scroll logic; NavigationController (or any parent) wires it to the page.
 *
 * Desktop/tablet: nine cards in one floating dock; the active card expands.
 * Mobile: the dock scrolls horizontally and keeps the active card in view.
 * Keyboard: Tab between cards, ←/→/Home/End move focus, Enter navigates.
 */
export function BottomNavigation({ activeSection, onNavigate, navigationItems, label }: BottomNavigationProps) {
  const track = useRef<HTMLUListElement>(null);
  const sizes = useCardSizes();

  // Keep the active card visible inside the (mobile) scrollable dock.
  useEffect(() => {
    const list = track.current;
    if (!list || list.scrollWidth <= list.clientWidth + 1) return;
    const index = navigationItems.findIndex((i) => i.id === activeSection);
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const left = index * (sizes.compact + gap);
    const target = left - (list.clientWidth - sizes.expanded) / 2;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left: Math.max(0, target), behavior: reduced ? "auto" : "smooth" });
  }, [activeSection, navigationItems, sizes]);

  const onKeyNav = (event: KeyboardEvent<HTMLAnchorElement>) => {
    const links = Array.from(track.current?.querySelectorAll<HTMLAnchorElement>("[data-bnav-link]") ?? []);
    const i = links.indexOf(event.currentTarget);
    const next =
      event.key === "ArrowRight" ? links[(i + 1) % links.length]
      : event.key === "ArrowLeft" ? links[(i - 1 + links.length) % links.length]
      : event.key === "Home" ? links[0]
      : event.key === "End" ? links[links.length - 1]
      : null;
    if (!next) return;
    event.preventDefault();
    next.focus();
    next.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <nav aria-label={label} className="bnav pointer-events-none fixed inset-x-0 z-(--z-dock) flex justify-center px-4">
        <div className="bnav-dock pointer-events-auto max-w-full rounded-[1.25rem] p-1.5">
          <ul ref={track} className="bnav-track flex items-stretch gap-1">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                active={item.id === activeSection}
                width={item.id === activeSection ? sizes.expanded : sizes.compact}
                onNavigate={onNavigate}
                onKeyNav={onKeyNav}
              />
            ))}
          </ul>
        </div>
      </nav>
    </MotionConfig>
  );
}
