import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface IconContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  /** hex = brand hexagon silhouette · square = rounded square. */
  shape?: "hex" | "square";
  tone?: "neutral" | "brand" | "inverse" | "accent";
  /** Accessible name if the icon conveys meaning on its own. */
  label?: string;
  className?: string;
}

const sizeClasses = {
  sm: "size-icon-box-sm [&_svg]:size-icon-sm",
  md: "size-icon-box-md [&_svg]:size-icon-md",
  lg: "size-icon-box-lg [&_svg]:size-icon-xl",
} as const;

const toneClasses = {
  neutral: "bg-panel-muted text-ink",
  brand: "bg-blue-50 text-action-primary",
  inverse: "bg-navy-900 text-brand-cyan",
  accent: "bg-brand-mint text-ink-on-accent",
} as const;

export function IconContainer({
  children,
  size = "md",
  shape = "square",
  tone = "neutral",
  label,
  className,
}: IconContainerProps) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        sizeClasses[size],
        toneClasses[tone],
        shape === "hex" ? "hex-clip" : "rounded-md",
        className,
      )}
    >
      {children}
    </span>
  );
}
