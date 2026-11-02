import { Handshake, Layers, PenTool, Target, type LucideIcon } from "lucide-react";
import type { StudioValue, StudioValueIcon } from "@/content/studio";
import { cn } from "@/lib/cn";

const icons: Record<StudioValueIcon, LucideIcon> = {
  purpose: Target,
  intention: PenTool,
  scalability: Layers,
  trust: Handshake,
};

export interface StudioValuesProps {
  title: string;
  values: StudioValue[];
  className?: string;
}

/** Four values as an editorial row: drawn rule, number, icon, title, text. */
export function StudioValues({ title, values, className }: StudioValuesProps) {
  return (
    <div className={cn("grid gap-8", className)}>
      <h3 data-studio-reveal className="font-mono text-[0.75rem] tracking-[0.1em] text-ink-secondary uppercase">
        {title}
      </h3>
      <ol className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
        {values.map((value, i) => {
          const Icon = icons[value.icon];
          return (
            <li key={value.id} data-studio-value className="studio-value relative grid content-start gap-4 pt-6">
              <span aria-hidden data-studio-value-rule className="studio-value-rule absolute top-0 left-0 h-0.5 w-full origin-left" />
              <div className="flex items-center justify-between">
                <span aria-hidden className="type-h2 type-numeric text-line-strong">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="studio-value-icon flex size-11 items-center justify-center rounded-[0.75rem]">
                  <Icon className="size-5" strokeWidth={1.6} />
                </span>
              </div>
              <h4 className="type-h4 text-ink">{value.title}</h4>
              <p className="type-body text-ink-secondary">{value.text}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
