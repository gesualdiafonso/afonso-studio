"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { navigationMotion } from "@/config/motion";
import type { ResolvedNavigationItem } from "@/config/navigation";
import { ActiveNavigationIndicator } from "./active-navigation-indicator";
import { NavigationIcon } from "./navigation-icons";

export interface NavigationItemProps {
  item: ResolvedNavigationItem;
  active: boolean;
  /** Card width in px (compact or expanded, already resolved for the breakpoint). */
  width: number;
  onNavigate: (sectionId: string) => void;
  onKeyNav: (event: KeyboardEvent<HTMLAnchorElement>) => void;
}

/**
 * One dock card: a real link to the section (works without JS), compact
 * when inactive (icon only + hover tooltip), expanded when active
 * (icon + label revealed).
 */
export function NavigationItem({ item, active, width, onNavigate, onKeyNav }: NavigationItemProps) {
  const link = useRef<HTMLAnchorElement>(null);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    onNavigate(item.id);
  };

  // Subtle magnetic pull — desktop mouse only.
  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = link.current!;
    const r = el.getBoundingClientRect();
    const m = navigationMotion.magnet;
    el.style.setProperty("--bx", `${((event.clientX - r.left) / r.width - 0.5) * 2 * m}px`);
    el.style.setProperty("--by", `${((event.clientY - r.top) / r.height - 0.5) * 2 * m}px`);
  };
  const onPointerLeave = () => {
    link.current?.style.setProperty("--bx", "0px");
    link.current?.style.setProperty("--by", "0px");
  };

  return (
    <motion.li
      className="bnav-item relative shrink-0"
      data-active={active}
      initial={false}
      animate={{ width }}
      transition={navigationMotion.width}
    >
      <a
        ref={link}
        href={`#${item.targetId}`}
        data-bnav-link={item.id}
        aria-label={item.ariaLabel}
        aria-current={active ? "location" : undefined}
        onClick={onClick}
        onKeyDown={onKeyNav}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="bnav-link relative flex h-full w-full items-center overflow-hidden rounded-[0.875rem]"
      >
        {active && <ActiveNavigationIndicator />}
        <span className="bnav-content relative z-10 flex w-full items-center gap-2.5 px-3">
          <NavigationIcon icon={item.icon} className="bnav-icon size-[1.125rem] shrink-0" />
          <AnimatePresence initial={false}>
            {active && (
              <motion.span
                key="label"
                aria-hidden
                className="bnav-label truncate"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4, transition: { duration: navigationMotion.hover.duration } }}
                transition={navigationMotion.label}
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </a>
      {/* Hover / focus tooltip for compact cards (desktop) */}
      {!active && (
        <span aria-hidden className="bnav-tip pointer-events-none absolute bottom-full left-1/2 mb-3 whitespace-nowrap">
          {item.label}
        </span>
      )}
    </motion.li>
  );
}
