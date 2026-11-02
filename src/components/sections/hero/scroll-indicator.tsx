import { cn } from "@/lib/cn";
import { cssVars } from "@/lib/style-vars";
import { heroAnim } from "./hero-anim";

export interface ScrollIndicatorProps {
  label: string;
  ariaLabel: string;
  href: string;
  className?: string;
}

/**
 * Small "scroll" cue: a circuit track with a travelling node.
 * It is a real link to the next section, so it also works with the keyboard.
 */
export function ScrollIndicator({ label, ariaLabel, href, className }: ScrollIndicatorProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "group/scroll type-label inline-flex items-center gap-3 rounded-sm text-ink-secondary transition-colors hover:text-link",
        className,
      )}
    >
      <span aria-hidden className="relative block h-11 w-[7px] overflow-hidden">
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line-strong/50" />
        <span
          className={cn(
            "absolute top-0 left-px block size-[5px] rounded-pill bg-brand-blue shadow-[0_0_0_2px_var(--color-fx-glow)]",
            heroAnim.scrollDot,
          )}
          style={cssVars({ "--travel": "38px" })}
        />
      </span>
      <span>{label}</span>
    </a>
  );
}
