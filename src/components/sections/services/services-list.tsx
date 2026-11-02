"use client";

import { useEffect, useRef, useState } from "react";
import { breakpoints } from "@/config/design";
import type { Service } from "@/content/services";
import { acoreState } from "@/lib/acore-state";
import { cn } from "@/lib/cn";
import { moduleIndex } from "./service-module-map";
import { ServicePillar } from "./service-pillar";

export interface ServicesListProps {
  services: Service[];
  labels: { capabilities: string; module: string };
  className?: string;
}

/**
 * The four pillars as an accordion with one open card.
 * Active card = last hovered / focused / clicked; on desktop it also follows
 * the scroll (the card crossing the middle of the screen).
 * The active service is mirrored to:
 *   • the A-CORE (acoreState.focus → that frame module glows), and
 *   • the section (data-services-active → module legend highlight).
 */
export function ServicesList({ services, labels, className }: ServicesListProps) {
  const list = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const inView = useRef(false);

  // Mirror the active service to the 3D core and the section legend.
  useEffect(() => {
    activeRef.current = active;
    const section = list.current?.closest("section");
    section?.setAttribute("data-services-active", String(active));
    if (inView.current) acoreState.focus.current = moduleIndex(services[active].module);
  }, [active, services]);

  // Focus glow only while the section is on screen.
  useEffect(() => {
    const section = list.current?.closest("section");
    if (!section) return;
    const io = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      acoreState.focus.current = entry.isIntersecting ? moduleIndex(services[activeRef.current].module) : -1;
    });
    io.observe(section);
    return () => {
      io.disconnect();
      acoreState.focus.current = -1;
    };
  }, [services]);

  // Desktop: the card crossing the middle of the viewport becomes active.
  useEffect(() => {
    const root = list.current;
    if (!root || !window.matchMedia(`(min-width: ${breakpoints.lg})`).matches) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-svc-card]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(cards.indexOf(entry.target as HTMLElement));
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    cards.forEach((card) => io.observe(card));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={list} className={cn("flex flex-col gap-4 md:gap-5", className)}>
      {services.map((service, i) => (
        <ServicePillar
          key={service.id}
          service={service}
          index={i}
          active={active === i}
          onActivate={setActive}
          labels={labels}
        />
      ))}
    </div>
  );
}
