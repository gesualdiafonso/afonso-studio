"use client";

import { motion } from "framer-motion";
import { navigationMotion } from "@/config/motion";

/**
 * The blue surface behind the active card. One shared layoutId: when the
 * active item changes, it glides from the previous card to the new one.
 */
export function ActiveNavigationIndicator() {
  return (
    <motion.span
      aria-hidden
      layoutId="bottom-nav-indicator"
      className="bnav-indicator absolute inset-0 rounded-[0.875rem]"
      transition={{ layout: navigationMotion.indicator }}
    />
  );
}
