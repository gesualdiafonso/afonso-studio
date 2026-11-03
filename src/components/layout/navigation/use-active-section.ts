"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Which section is under the middle of the viewport — read from GSAP
 * ScrollTrigger, so it follows Lenis automatically once it drives the page.
 */
export function useActiveSection(targetIds: string[]) {
  const [active, setActive] = useState(targetIds[0]);
  const key = targetIds.join("|");

  useEffect(() => {
    const ids = key.split("|");
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    // Resolve from the layout itself (the section under the viewport middle):
    // robust to fast jumps, where several triggers toggle in the same frame.
    let frame = 0;
    const resolve = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      const current = elements.find((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= mid && r.bottom > mid;
      });
      if (current) setActive(current.id);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(resolve);
    };

    // ScrollTrigger tells us *when* the section boundary is crossed.
    const triggers = elements.map((el) =>
      ScrollTrigger.create({ trigger: el, start: "top 50%", end: "bottom 50%", onToggle: schedule }),
    );
    schedule(); // initial state (e.g. reload in the middle of the page)

    return () => {
      cancelAnimationFrame(frame);
      triggers.forEach((t) => t.kill());
    };
  }, [key]);

  return active;
}
