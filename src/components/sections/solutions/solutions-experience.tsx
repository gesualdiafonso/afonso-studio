"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { gsapEase } from "@/config/motion";
import type { SolutionsContent } from "@/content/solutions";
import { useScrollTimeline } from "@/hooks/use-scroll-timeline";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { buildSolutionTimeline } from "./build-timeline";
import { SolutionDiagram } from "./solution-diagram";
import "./solutions-anim";
import { SolutionsConnector } from "./solutions-connector";

export interface SolutionsExperienceProps {
  content: SolutionsContent;
  /** Section header (server-rendered), revealed by this scene. */
  header: ReactNode;
}

type Phase = "problem" | "solution";
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

/**
 * Four problem → solution experiences.
 *
 * Desktop: one sticky stage. Scrolling through the 400svh track walks the
 * four cases; inside each case the scroll scrubs its diagram from
 * "disconnected modules" to "connected system + UI mockup".
 * Mobile: one card per case; the diagram plays when it enters the viewport
 * and a Problem / Solution toggle lets the visitor compare.
 * Reduced motion: diagrams show the solution; the toggle switches instantly.
 */
export function SolutionsExperience({ content, header }: SolutionsExperienceProps) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const mobileTimelines = useRef<ReturnType<typeof buildSolutionTimeline>[]>([]);
  const reduced = useRef(false);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  // Markup starts in the solution state (no JS / reduced motion); the scene
  // switches to "problem" as soon as the animated timelines take over.
  const [phases, setPhases] = useState<Phase[]>(() => content.cases.map(() => "solution"));
  const { labels, cases } = content;

  useScrollTimeline(root, ({ ScrollTrigger, scope, isDesktop, reducedMotion }) => {
    reduced.current = reducedMotion;
    const q = gsap.utils.selector(scope);

    if (isDesktop) {
      const timelines = (q("[data-sol-desktop-diagram]") as Element[]).map((el) => buildSolutionTimeline(gsap, el));
      const steps = q("[data-sol-step]") as HTMLElement[];
      timelines.forEach((tl) => tl.progress(reducedMotion ? 1 : 0));

      ScrollTrigger.create({
        trigger: track.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress * cases.length;
          const index = Math.min(cases.length - 1, Math.floor(p));
          const local = clamp01(p - index);
          const t = clamp01((local - 0.05) / 0.6); // solution complete at 65 %, then holds

          if (index !== activeRef.current) {
            activeRef.current = index;
            setActive(index);
            timelines.forEach((tl, i) => {
              if (i < index) tl.progress(1);
              if (i > index) tl.progress(reducedMotion ? 1 : 0);
            });
          }
          timelines[index]?.progress(reducedMotion ? 1 : t);
          steps.forEach((step, i) =>
            step.style.setProperty("--p", String(i < index ? 1 : i > index ? 0 : local)),
          );
          if (stage.current) stage.current.dataset.phase = reducedMotion || t > 0.5 ? "solution" : "problem";
        },
      });
    } else {
      const timelines = (q("[data-sol-mobile-diagram]") as Element[]).map((el) => buildSolutionTimeline(gsap, el));
      mobileTimelines.current = timelines;
      if (!reducedMotion) setPhases(cases.map(() => "problem"));
      timelines.forEach((tl, i) => {
        if (reducedMotion) {
          tl.progress(1);
          return;
        }
        ScrollTrigger.create({
          trigger: (q("[data-sol-card]") as Element[])[i],
          start: "top 70%",
          once: true,
          onEnter: () => {
            gsap.to(tl, { progress: 1, duration: 2.4, ease: "none" });
            setPhases((prev) => prev.map((ph, k) => (k === i ? "solution" : ph)));
          },
        });
      });
    }

    // Lines and nodes that lead into the next section, drawn with the scroll.
    if (!reducedMotion) {
      const connector = q("[data-sol-connector]")[0];
      gsap.fromTo(
        q("[data-sol-connector-path]"),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: { trigger: connector, start: "top 85%", end: "bottom 65%", scrub: true },
        },
      );
      gsap.fromTo(
        q("[data-sol-connector-node]"),
        { scale: 0, transformOrigin: "50% 50%" },
        {
          scale: 1,
          ease: "back.out(2)",
          stagger: 0.05,
          scrollTrigger: { trigger: connector, start: "top 70%", end: "bottom 60%", scrub: true },
        },
      );
    }

    if (!reducedMotion) {
      gsap.from(q("[data-sol-reveal]"), {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.08,
        ease: gsapEase["out-expo"],
        scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      });
    }
  });

  /** Mobile toggle: play the diagram towards the chosen state. */
  const showPhase = useCallback((index: number, phase: Phase) => {
    setPhases((prev) => prev.map((ph, k) => (k === index ? phase : ph)));
    const tl = mobileTimelines.current[index];
    if (!tl) return;
    tl.pause();
    if (reduced.current) tl.progress(phase === "solution" ? 1 : 0);
    else gsap.to(tl, { progress: phase === "solution" ? 1 : 0, duration: 1.4, ease: "power2.inOut" });
  }, []);

  /** Desktop: jump to a case (lands on its solution). */
  const goTo = useCallback(
    (index: number) => {
      const el = track.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const range = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + ((index + 0.8) / cases.length) * range, behavior: "smooth" });
    },
    [cases.length],
  );

  return (
    <div ref={root} className="sol-root">
      {header}

      {/* ── Desktop: sticky scrollytelling ─────────────────────────────── */}
      <div ref={track} className="relative hidden lg:block lg:h-[400svh]">
        <div className="sticky top-0 flex h-svh items-center pb-(--spacing-dock)">
          <div className="grid-site w-full items-center">
            <ol className="col-[1/span_5] flex flex-col">
              {cases.map((item, i) => {
                const isActive = active === i;
                return (
                  <li
                    key={item.id}
                    data-sol-step
                    data-active={isActive}
                    aria-current={isActive ? "step" : undefined}
                    className="sol-step relative border-t border-line py-5 last:border-b"
                  >
                    <span aria-hidden className="sol-step-progress absolute -top-px left-0 h-0.5 w-full" />
                    <h3>
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        className="flex w-full items-baseline gap-4 text-left"
                      >
                        <span className="type-label type-numeric text-link">{String(i + 1).padStart(2, "0")}</span>
                        <span className="sol-step-title type-h4 uppercase">{item.title}</span>
                      </button>
                    </h3>
                    <div className="sol-step-panel">
                      <div>
                        <dl className="grid gap-4 pt-4 pl-10">
                          <div className="grid gap-1">
                            <dt className="type-label text-ink-secondary">{labels.problem}</dt>
                            <dd className="type-body text-ink">{item.problem}</dd>
                          </div>
                          <div className="sol-solution grid gap-1">
                            <dt className="type-label">{labels.solution}</dt>
                            <dd className="type-body text-ink">{item.solution}</dd>
                          </div>
                          <div className="grid gap-1">
                            <dt className="type-label text-ink-secondary">{labels.inPractice}</dt>
                            <dd className="type-body-sm text-ink-secondary">{item.example}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div ref={stage} data-phase="problem" className="sol-stage relative col-[6/-1] justify-self-end">
              <div className="sol-chip type-label absolute top-4 left-4 z-10 flex items-center gap-2 rounded-pill border border-line bg-panel px-3 py-1.5">
                <span aria-hidden className="sol-chip-dot size-2 rounded-pill" />
                <span className="sol-chip-problem">{labels.showProblem}</span>
                <span className="sol-chip-solution">{labels.showSolution}</span>
              </div>
              <div className="sol-stage-frame relative overflow-hidden rounded-[1.5rem] border border-line bg-panel-inverse/40 p-4 pt-12">
                {cases.map((item, i) => (
                  <div
                    key={item.id}
                    data-sol-desktop-diagram
                    className={cn("sol-diagram", i === 0 ? "relative" : "absolute inset-x-4 top-12")}
                    data-visible={active === i}
                  >
                    <SolutionDiagram item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile / tablet: one card per case ────────────────────────── */}
      <ol className="flex flex-col gap-6 lg:hidden">
        {cases.map((item, i) => (
          <li key={item.id} data-sol-card className="overflow-hidden rounded-[1.5rem] border border-line bg-panel">
            <div className="flex flex-col gap-4 p-5 md:p-7">
              <h3 className="flex items-baseline gap-3">
                <span className="type-label type-numeric text-link">{String(i + 1).padStart(2, "0")}</span>
                <span className="type-h4 text-ink uppercase">{item.title}</span>
              </h3>
              <div role="group" aria-label={item.title} className="inline-flex w-fit rounded-pill border border-line p-1">
                {(["problem", "solution"] as const).map((phase) => (
                  <button
                    key={phase}
                    type="button"
                    aria-pressed={phases[i] === phase}
                    onClick={() => showPhase(i, phase)}
                    className="type-label min-h-10 rounded-pill px-4 text-ink-secondary transition-colors aria-pressed:bg-action-primary aria-pressed:text-ink-on-action"
                  >
                    {phase === "problem" ? labels.showProblem : labels.showSolution}
                  </button>
                ))}
              </div>
            </div>
            <div data-sol-mobile-diagram className="border-y border-line bg-panel-inverse/40 px-3 py-4">
              <SolutionDiagram item={item} />
            </div>
            <dl className="grid gap-4 p-5 md:p-7">
              <div className="grid gap-1">
                <dt className="type-label text-ink-secondary">{labels.problem}</dt>
                <dd className="type-body text-ink">{item.problem}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="type-label text-accent-cyan">{labels.solution}</dt>
                <dd className="type-body text-ink">{item.solution}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="type-label text-ink-secondary">{labels.inPractice}</dt>
                <dd className="type-body-sm text-ink-secondary">{item.example}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>

      <SolutionsConnector label={labels.next} />
    </div>
  );
}
