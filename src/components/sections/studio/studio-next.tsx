import { ArrowDownRight } from "lucide-react";
import type { StudioContent } from "@/content/studio";

export interface StudioNextProps {
  next: StudioContent["next"];
  /** "09" */
  index: string;
  contactId: string;
}

/**
 * Hand-off into Section 09: a short invitation and a circuit trace that is
 * drawn down out of the section, into the contact form.
 */
export function StudioNext({ next, index, contactId }: StudioNextProps) {
  return (
    <div className="relative grid justify-items-center gap-6 pt-24 text-center lg:pt-32">
      <p data-studio-reveal className="font-mono text-[0.75rem] tracking-[0.1em] text-ink-secondary uppercase">
        {next.label} · {index}
      </p>
      <p data-studio-reveal className="type-h2 max-w-[22ch] text-ink">
        {next.text}
      </p>
      <a
        data-studio-reveal
        href={`#${contactId}`}
        className="studio-next-link type-label group inline-flex min-h-12 items-center gap-3 rounded-pill border border-line-strong px-6 text-ink transition-colors hover:border-action-primary hover:text-link"
      >
        {next.cta}
        <ArrowDownRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
      </a>

      <svg aria-hidden viewBox="0 0 120 220" className="mt-4 h-40 w-auto overflow-visible lg:h-52" fill="none">
        <path
          data-studio-trace
          pathLength={1}
          d="M60 0 V80 L36 104 V150 L60 174 V220"
          stroke="var(--color-brand-blue)"
          strokeWidth="1.5"
        />
        <path data-studio-trace pathLength={1} d="M60 80 L84 104 V132" stroke="var(--color-accent-cyan)" strokeWidth="1.5" />
        <circle data-studio-node cx="84" cy="136" r="4" stroke="var(--color-accent-cyan)" strokeWidth="1.5" fill="var(--color-panel)" />
        <circle data-studio-node cx="36" cy="127" r="3" fill="var(--color-brand-blue)" />
        <circle data-studio-node cx="60" cy="220" r="5" fill="var(--color-accent-mint)" stroke="var(--color-navy-900)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
