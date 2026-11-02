import type { gsap as GSAP } from "gsap";

/**
 * Builds the problem → solution timeline for one diagram (paused, length 1).
 * Progress 0 = problem state, 1 = solution state. The caller drives it with
 * scroll (desktop) or with the Problem / Solution toggle (mobile).
 *
 *   0.00–0.15  problem holds (scattered, dashed, broken links)
 *   0.15–0.50  modules move into place and become solid
 *   0.48–0.70  links draw into the hub, the hub appears
 *   0.68–1.00  the UI mockup / architecture panel builds
 */
export function buildSolutionTimeline(gsap: typeof GSAP, root: Element) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });

  // Fixed total length so progress maps 1:1 to the phases above.
  tl.set({}, {}, 1);

  q("[data-sol-module]").forEach((el, i) => {
    const node = el as unknown as SVGGElement;
    tl.fromTo(
      node,
      {
        x: Number(node.dataset.dx ?? 0),
        y: Number(node.dataset.dy ?? 0),
        rotation: Number(node.dataset.r ?? 0),
        transformOrigin: "50% 50%",
      },
      { x: 0, y: 0, rotation: 0, duration: 0.32, ease: "power3.inOut" },
      0.15 + i * 0.03,
    );
  });

  tl.fromTo(q("[data-sol-broken]"), { opacity: 1 }, { opacity: 0, duration: 0.14 }, 0.14);
  tl.fromTo(q("[data-sol-mod-problem]"), { opacity: 1 }, { opacity: 0, duration: 0.18 }, 0.3);
  tl.fromTo(q("[data-sol-mod-solution]"), { opacity: 0 }, { opacity: 1, duration: 0.18 }, 0.3);
  tl.fromTo(q("[data-sol-mod-dot]"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.44);

  tl.fromTo(
    q("[data-sol-link]"),
    { strokeDasharray: 1, strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 0.2, stagger: 0.02, ease: "power1.inOut" },
    0.48,
  );
  tl.fromTo(
    q("[data-sol-hub]"),
    { opacity: 0, scale: 0.86, transformOrigin: "50% 50%" },
    { opacity: 1, scale: 1, duration: 0.16, ease: "back.out(1.6)" },
    0.52,
  );
  tl.fromTo(
    q("[data-sol-node]"),
    { scale: 0, transformOrigin: "50% 50%" },
    { scale: 1, duration: 0.08, stagger: 0.015, ease: "back.out(2)" },
    0.62,
  );

  tl.fromTo(q("[data-sol-mockup]"), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.2, ease: "power3.out" }, 0.68);
  tl.fromTo(
    q("[data-sol-bar]"),
    { scaleX: 0, transformOrigin: "0% 50%" },
    { scaleX: 1, duration: 0.16, stagger: 0.012, ease: "power2.out" },
    0.78,
  );
  tl.fromTo(
    q("[data-sol-line]"),
    { strokeDasharray: 1, strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 0.16, stagger: 0.01, ease: "power1.inOut" },
    0.8,
  );

  return tl;
}
