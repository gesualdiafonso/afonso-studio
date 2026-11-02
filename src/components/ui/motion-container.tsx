"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { duration, ease, motionPresets, reveal, type DurationName, type EaseName, type MotionPreset } from "@/config/motion";

const elements = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  ul: motion.ul,
  li: motion.li,
  figure: motion.figure,
} as const;

export interface MotionContainerProps {
  children: ReactNode;
  as?: keyof typeof elements;
  /** Preset from src/config/motion.ts. */
  variant?: MotionPreset;
  delay?: number;
  duration?: DurationName;
  ease?: EaseName;
  /** Stagger direct MotionContainer children (seconds). */
  stagger?: number;
  /** Animate only the first time it enters the viewport. */
  once?: boolean;
  amount?: number;
  /** Child of a staggered MotionContainer: follow the parent's trigger. */
  inherit?: boolean;
  className?: string;
  id?: string;
}

/**
 * Viewport-triggered entrance wrapper driven by the central motion config.
 * A parent with `stagger` reveals children marked `inherit` in sequence.
 * With prefers-reduced-motion the content renders in its final state.
 */
export function MotionContainer({
  children,
  as = "div",
  variant = "fade-up",
  delay = 0,
  duration: durationName = "slow",
  ease: easeName = "out-expo",
  stagger,
  once = true,
  amount = reveal.viewportAmount,
  inherit = false,
  className,
  id,
}: MotionContainerProps) {
  const reduceMotion = useReducedMotion();
  const Element = elements[as];
  const preset = motionPresets[variant];

  return (
    <Element
      id={id}
      className={className}
      {...(inherit
        ? {}
        : {
            initial: reduceMotion ? false : "hidden",
            whileInView: "visible",
            viewport: { once, amount },
          })}
      variants={{
        hidden: preset.hidden,
        visible: {
          ...preset.visible,
          transition: {
            duration: duration[durationName],
            ease: ease[easeName],
            delay,
            ...(stagger ? { staggerChildren: stagger, delayChildren: delay } : {}),
          },
        },
      }}
    >
      {children}
    </Element>
  );
}
