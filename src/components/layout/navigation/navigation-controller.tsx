"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { navigationMotion } from "@/config/motion";
import type { ResolvedNavigationItem } from "@/config/navigation";
import { scrollToSection } from "@/lib/scroll-to";
import { BottomNavigation } from "./bottom-navigation";
import { useActiveSection } from "./use-active-section";

export interface NavigationControllerProps {
  navigationItems: ResolvedNavigationItem[];
  label: string;
}

/**
 * Connects the dock to the page:
 *  • active section ← ScrollTrigger (useActiveSection)
 *  • navigation     → scrollToSection (Lenis when registered, native otherwise)
 * While a programmatic navigation runs, the clicked item stays active (no
 * flicker through the sections in between) and repeated clicks on the same
 * target are ignored; a new target simply re-routes the scroll.
 */
export function NavigationController({ navigationItems, label }: NavigationControllerProps) {
  const targets = navigationItems.map((i) => i.targetId);
  const scrolled = useActiveSection(targets);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const pending = useRef<string | null>(null);
  const timeout = useRef(0);

  const idFromTarget = (targetId: string) => navigationItems.find((i) => i.targetId === targetId)?.id ?? targetId;
  const activeSection = navigatingTo ?? idFromTarget(scrolled);

  const onNavigate = useCallback(
    (sectionId: string) => {
      if (pending.current === sectionId) return;
      const item = navigationItems.find((i) => i.id === sectionId);
      if (!item) return;
      pending.current = sectionId;
      setNavigatingTo(sectionId);
      window.clearTimeout(timeout.current);
      const release = () => {
        if (pending.current !== sectionId) return; // a newer navigation took over
        pending.current = null;
        setNavigatingTo(null);
        window.clearTimeout(timeout.current);
      };
      timeout.current = window.setTimeout(release, navigationMotion.navigationTimeoutMs);
      scrollToSection(item.targetId, { onComplete: release });
    },
    [navigationItems],
  );

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  return (
    <BottomNavigation
      activeSection={activeSection}
      onNavigate={onNavigate}
      navigationItems={navigationItems}
      label={label}
    />
  );
}
