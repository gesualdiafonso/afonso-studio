import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Locale-aware Link / redirect / router — use instead of next/link for internal pages. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
