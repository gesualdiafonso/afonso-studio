"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single GSAP entry point. Registers ScrollTrigger once.
 * Every component imports gsap / ScrollTrigger from here.
 *
 * When Lenis is added (scroll-controller task), sync it once:
 *   lenis.on("scroll", ScrollTrigger.update)
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
