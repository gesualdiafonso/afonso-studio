"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { breakpoints } from "@/config/design";
import { acoreState } from "@/lib/acore-state";
import { prefersLightweight, supportsWebGL } from "@/lib/webgl";
import "./a-core-stage.css";

// The 3D code is only requested on capable desktop devices.
const ACoreCanvas = dynamic(() => import("@/components/a-core/a-core-canvas"), { ssr: false });

export interface ACoreStageProps {
  /**
   * Ordered anchor names. Each section marks where the A-CORE should sit with
   * `data-acore-anchor="<name>"`. The core travels from one anchor to the next
   * as the next anchor scrolls from the bottom of the viewport to its centre.
   */
  anchors: readonly string[];
}

/** Extra room around an anchor so orbits and traces are never clipped. */
const BLEED = 1.24;
/** How long the stage keeps re-measuring after a scroll / resize. */
const SETTLE_MS = 1200;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * ONE persistent A-CORE for the whole page.
 * ---------------------------------------------------------------------------
 * A fixed, pointer-transparent canvas that follows the section anchors:
 *   • sits exactly on the current anchor (and scrolls with it),
 *   • glides + scales from one anchor to the next between sections,
 *   • pauses rendering when no anchor is on screen.
 * Sections keep a 2D fallback inside their anchor; it is hidden only while
 * the 3D stage is running (html[data-acore="3d"]), so mobile, reduced motion
 * and no-WebGL visitors always see the logo.
 *
 * No scroll engine of its own: it reads the native scroll position, so it
 * works unchanged once Lenis drives the page.
 */
export function ACoreStage({ anchors }: ACoreStageProps) {
  const stage = useRef<HTMLDivElement>(null);
  const travel = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  // Decide once (and on breakpoint / preference changes) whether to run 3D.
  useEffect(() => {
    const desktop = window.matchMedia(`(min-width: ${breakpoints.lg})`);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const capable = supportsWebGL() && !prefersLightweight();
    const update = () => setEnabled(capable && desktop.matches && !motion.matches);
    update();
    desktop.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  // Tell sections to hide their 2D fallback once the 3D frame is ready.
  useEffect(() => {
    const root = document.documentElement;
    if (enabled && ready) root.dataset.acore = "3d";
    else delete root.dataset.acore;
    return () => {
      delete root.dataset.acore;
    };
  }, [enabled, ready]);

  // Position the stage over the anchors on every scroll / resize frame.
  useEffect(() => {
    if (!enabled) return;
    const el = stage.current;
    if (!el) return;

    let frame = 0;
    let base = 0;
    let lastActive = true;

    const elements = () =>
      anchors
        .map((name) => document.querySelector<HTMLElement>(`[data-acore-anchor="${name}"]`))
        .filter((node): node is HTMLElement => Boolean(node));

    const measureBase = () => {
      const sizes = elements().map((node) => Math.max(node.offsetWidth, node.offsetHeight));
      base = Math.round(Math.max(...sizes, 1) * BLEED);
      el.style.width = `${base}px`;
      el.style.height = `${base}px`;
    };

    const update = () => {
      frame = 0;
      const nodes = elements();
      if (!nodes.length || !base) return;
      const vh = window.innerHeight;
      const rects = nodes.map((node) => node.getBoundingClientRect());

      // Active segment = the last anchor whose arrival has started.
      let index = 0;
      let progress = 0;
      for (let i = 1; i < rects.length; i++) {
        const r = rects[i];
        // 0 when the anchor's top enters the viewport bottom, 1 when its centre reaches mid-screen.
        const p = (vh - r.top) / (vh / 2 + r.height / 2);
        const clamped = Math.min(Math.max(p, 0), 1);
        if (clamped > 0) {
          index = i - 1;
          progress = clamped;
        }
      }

      const from = rects[index];
      const to = rects[Math.min(index + 1, rects.length - 1)];
      const t = easeInOut(progress);
      const cx = lerp(from.left + from.width / 2, to.left + to.width / 2, t);
      const cy = lerp(from.top + from.height / 2, to.top + to.height / 2, t);
      const size = lerp(Math.max(from.width, from.height), Math.max(to.width, to.height), t) * BLEED;
      const scale = size / base;

      el.style.transform = `translate3d(${cx - base / 2}px, ${cy - base / 2}px, 0) scale(${scale})`;
      travel.current = index + progress;

      const onScreen = cy + size / 2 > -40 && cy - size / 2 < vh + 40;
      el.style.visibility = onScreen ? "visible" : "hidden";
      if (onScreen !== lastActive) {
        lastActive = onScreen;
        setActive(onScreen);
      }
    };

    // Keep following for a moment after the last scroll: reveal animations
    // and late layout shifts can still move an anchor without a scroll event.
    let settleUntil = 0;
    const tick = () => {
      update();
      if (performance.now() < settleUntil) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      settleUntil = performance.now() + SETTLE_MS;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onResize = () => {
      measureBase();
      schedule();
    };

    measureBase();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    const observer = new ResizeObserver(onResize);
    elements().forEach((node) => observer.observe(node));
    observer.observe(document.body); // page height changes = anchors moved

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [enabled, anchors]);

  if (!enabled) return null;

  return (
    <div ref={stage} aria-hidden className="acore-stage" data-ready={ready}>
      <ACoreCanvas
        animate
        active={active}
        travel={travel}
        explode={acoreState.explode}
        focus={acoreState.focus}
        assembly={acoreState.assembly}
        onReady={() => setReady(true)}
        className="size-full"
      />
    </div>
  );
}
