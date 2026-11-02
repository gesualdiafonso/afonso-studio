"use client";

import { Compass } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { TechnologyContent, TechCategoryStack } from "@/content/technology";
import { cn } from "@/lib/cn";
import { TechCard } from "./tech-card";
import { TechHub } from "./tech-hub";

export interface TechnologyGridProps {
  content: TechnologyContent;
  stack: TechCategoryStack[];
}

interface Link {
  id: string;
  d: string;
  end: { x: number; y: number };
}

/** Desktop placement (3 × 3, hub in the centre). Order = stack order. */
const placement: Record<string, string> = {
  frontend: "lg:col-[1/3] lg:row-[1]",
  backend: "lg:col-[3] lg:row-[1]",
  databases: "lg:col-[1] lg:row-[2]",
  infrastructure: "lg:col-[3] lg:row-[2]",
  automation: "lg:col-[1] lg:row-[3]",
  design: "lg:col-[2] lg:row-[3]",
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * The ecosystem: six group cards + the honesty note around the A-CORE hub.
 * On desktop an SVG layer draws one orbital (curved) connection from the hub
 * to each card, plus a cross-link between groups that share a technology
 * (Python: Backend ↔ Automation). Hovering a card or a shared technology
 * lights its connections. Geometry is measured, so it follows any layout.
 */
export function TechnologyGrid({ content, stack }: TechnologyGridProps) {
  const root = useRef<HTMLDivElement>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [cross, setCross] = useState<{ name: string; d: string; ids: string[] }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hoverCard, setHoverCard] = useState<string | null>(null);
  const [hoverTech, setHoverTech] = useState<string | null>(null);

  // Technologies used by more than one group.
  const sharedNames = new Map<string, string[]>();
  stack.forEach((c) => c.items.forEach((t) => sharedNames.set(t.name, [...(sharedNames.get(t.name) ?? []), c.id])));
  const shared = [...sharedNames].filter(([, ids]) => ids.length > 1);

  const measure = useCallback(() => {
    const el = root.current;
    if (!el) return;
    // offset* geometry ignores the reveal transforms running on the cards.
    const box = { left: 0, top: 0, width: el.offsetWidth, height: el.offsetHeight };
    const rect = (node: HTMLElement) => ({
      left: node.offsetLeft,
      top: node.offsetTop,
      width: node.offsetWidth,
      height: node.offsetHeight,
    });
    const hub = el.querySelector<HTMLElement>("[data-tech-hub]");
    if (!hub || !window.matchMedia("(min-width: 64rem)").matches) {
      setLinks([]);
      setCross([]);
      return;
    }
    const h = rect(hub);
    const cx = h.left + h.width / 2 - box.left;
    const cy = h.top + h.height / 2 - box.top;
    const rectOf = (id: string) => {
      const node = el.querySelector<HTMLElement>(`[data-tech-wrap="${id}"]`);
      return node ? rect(node) : undefined;
    };

    const next: Link[] = [];
    stack.forEach((c, i) => {
      const r = rectOf(c.id);
      if (!r) return;
      const x0 = r.left - box.left;
      const y0 = r.top - box.top;
      // Nearest point of the card to the hub centre, pulled in a little.
      const ex = clamp(cx, x0 + 24, x0 + r.width - 24);
      const ey = clamp(cy, y0 + 24, y0 + r.height - 24);
      const tx = ex === x0 + 24 || ex === x0 + r.width - 24 ? (ex < cx ? x0 + r.width : x0) : ex;
      const ty = ey === y0 + 24 || ey === y0 + r.height - 24 ? (ey < cy ? y0 + r.height : y0) : ey;
      // Orbital bend: control point rotated off the straight line.
      const mx = (cx + tx) / 2;
      const my = (cy + ty) / 2;
      const dx = tx - cx;
      const dy = ty - cy;
      const bend = (i % 2 ? 1 : -1) * 0.22;
      const qx = mx - dy * bend;
      const qy = my + dx * bend;
      next.push({ id: c.id, d: `M${cx} ${cy} Q${qx} ${qy} ${tx} ${ty}`, end: { x: tx, y: ty } });
    });

    const crossLinks = shared.map(([name, ids]) => {
      const [a, b] = ids.map((id) => next.find((l) => l.id === id)!.end);
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      // Arc around the hub (pushed away from the centre).
      const ox = mx - cx;
      const oy = my - cy;
      const len = Math.hypot(ox, oy) || 1;
      const push = Math.hypot(a.x - b.x, a.y - b.y) * 0.35;
      return { name, ids, d: `M${a.x} ${a.y} Q${mx + (ox / len) * push} ${my + (oy / len) * push} ${b.x} ${b.y}` };
    });

    // Terminals sit where the line meets the card.
    next.forEach((l) => {
      const r = rectOf(l.id);
      const t = el.querySelector<HTMLElement>(`[data-tech-card="${l.id}"] [data-tech-terminal]`);
      if (!r || !t) return;
      t.style.left = `${l.end.x - (r.left - box.left)}px`;
      t.style.top = `${l.end.y - (r.top - box.top)}px`;
    });

    setSize({ w: box.width, h: box.height });
    setLinks(next);
    setCross(crossLinks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stack]);

  useLayoutEffect(() => {
    measure();
    const el = root.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  const activeCards = new Set<string>();
  if (hoverCard) activeCards.add(hoverCard);
  if (hoverTech) sharedNames.get(hoverTech)?.forEach((id) => activeCards.add(id));

  const starts = stack.map((_, i) => 1 + stack.slice(0, i).reduce((n, c) => n + c.items.length, 0));
  return (
    <div
      ref={root}
      data-tech-grid
      data-hovering={activeCards.size > 0}
      className="tech-grid relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_minmax(22rem,auto)_auto] lg:gap-6"
    >
      {/* Orbital connections (desktop) */}
      {links.length > 0 && (
        <svg
          aria-hidden
          className="tech-links pointer-events-none absolute inset-0 hidden lg:block"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          fill="none"
        >
          {links.map((l) => {
            const tone = stack.find((c) => c.id === l.id)?.tone;
            return (
              <g key={l.id} data-tech-link={l.id} data-tone={tone} data-active={activeCards.has(l.id)}>
                <path data-tech-link-path className="tech-link" d={l.d} pathLength={1} />
                <path className="tech-link-pulse" d={l.d} pathLength={1} />
              </g>
            );
          })}
          {cross.map((c) => (
            <g key={c.name} data-active={hoverTech === c.name || c.ids.every((id) => activeCards.has(id))}>
              <path className="tech-cross" d={c.d} pathLength={1} />
              <path className="tech-link-pulse" d={c.d} pathLength={1} />
            </g>
          ))}
        </svg>
      )}

      <TechHub
        label={content.hub.label}
        title={content.hub.title}
        categories={stack}
        className="order-first aspect-square md:col-span-2 md:mx-auto md:w-80 lg:order-none lg:mx-0 lg:col-[2] lg:row-[2] lg:aspect-auto lg:w-auto"
      />

      {stack.map((c, i) => {
        const text = content.categories[c.id];
        return (
          <div
            key={c.id}
            data-tech-reveal-card
            data-tech-wrap={c.id}
            className={cn("relative z-10 flex", placement[c.id], c.id === "frontend" && "md:col-span-2")}
            onPointerEnter={() => setHoverCard(c.id)}
            onPointerLeave={() => setHoverCard(null)}
          >
            <TechCard
              id={c.id}
              tone={c.tone}
              index={i}
              title={text.title}
              description={text.description}
              items={c.items}
              startNumber={starts[i]}
              countLabel={content.labels.technologies}
              alsoInLabel={content.labels.alsoIn}
              shared={shared
                .filter(([name, ids]) => ids.includes(c.id) && c.items.some((t) => t.name === name))
                .map(([name, ids]) => ({
                  name,
                  categories: ids.filter((id) => id !== c.id).map((id) => content.categories[id as keyof typeof content.categories].title),
                }))}
              className={cn("w-full", activeCards.has(c.id) && "is-active")}
              highlight={hoverTech}
              layout={c.id === "frontend" ? "wide" : "compact"}
              onTechEnter={(name) => sharedNames.get(name)!.length > 1 && setHoverTech(name)}
              onTechLeave={() => setHoverTech(null)}
            />
          </div>
        );
      })}

      {/* The honesty note — eighth cell */}
      <div
        data-tech-reveal-card
        className="tech-principle relative z-10 flex flex-col justify-end gap-3 rounded-[1.25rem] p-5 md:col-span-2 md:p-6 lg:col-[3] lg:row-[3] lg:col-span-1"
      >
        <span aria-hidden className="tech-card-icon flex size-11 items-center justify-center rounded-[0.75rem]">
          <Compass className="size-5" strokeWidth={1.6} />
        </span>
        <h3 className="type-h4 text-ink uppercase">{content.principle.title}</h3>
        <p className="type-body-sm text-ink-secondary">{content.principle.text}</p>
      </div>
    </div>
  );
}
