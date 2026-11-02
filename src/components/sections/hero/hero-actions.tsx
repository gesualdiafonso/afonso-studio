import { PrimaryButton, SecondaryButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import { cssVars } from "@/lib/style-vars";
import { heroAnim } from "./hero-anim";

export interface HeroActionsProps {
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  /** Entrance delay in ms (follows the headline reveal). */
  delay?: number;
  className?: string;
}

const ctaText = "uppercase tracking-[0.06em] text-[0.875rem]";

/** Primary + secondary CTAs. Full-width stacked on small phones. */
export function HeroActions({ primary, secondary, delay = 0, className }: HeroActionsProps) {
  return (
    <div className={cn("flex flex-col gap-3 min-[26rem]:flex-row min-[26rem]:flex-wrap", className)}>
      <div className={heroAnim.fadeUp} style={cssVars({ "--d": `${delay}ms` })}>
        <PrimaryButton href={primary.href} size="lg" className={cn(ctaText, "w-full min-[26rem]:w-auto")}>
          {primary.label}
        </PrimaryButton>
      </div>
      <div className={heroAnim.fadeUp} style={cssVars({ "--d": `${delay + 90}ms` })}>
        <SecondaryButton href={secondary.href} size="lg" className={cn(ctaText, "w-full min-[26rem]:w-auto")}>
          {secondary.label}
        </SecondaryButton>
      </div>
    </div>
  );
}
