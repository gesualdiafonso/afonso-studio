import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowRightIcon } from "./icons";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "md" | "lg";

interface BaseProps {
  children: ReactNode;
  size?: ButtonSize;
  /** Trailing icon. Defaults to an arrow; pass `null` for none. */
  icon?: ReactNode | null;
  className?: string;
}

type AsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & { href?: undefined };
type AsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps> & { href: string; external?: boolean };

export type ButtonProps = AsButton | AsLink;

const shared =
  "group/button relative inline-flex items-center justify-center gap-2.5 select-none whitespace-nowrap " +
  "rounded-control font-display font-medium tracking-[-0.005em] " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-(--duration-fast) ease-out-expo " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-control-md px-5 text-[0.9375rem]",
  lg: "h-control-lg px-7 text-[1rem]",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-action-primary text-ink-on-action shadow-sm " +
    "hover:bg-action-primary-hover hover:shadow-glow active:bg-action-primary-active",
  secondary:
    "border border-action-secondary-line bg-action-secondary text-action-secondary-ink " +
    "hover:border-action-secondary-line-hover hover:bg-action-secondary-hover active:bg-action-secondary-active",
};

function ButtonBase({ variant, ...props }: ButtonProps & { variant: ButtonVariant }) {
  const { children, size = "md", icon, className } = props;
  const classes = cn(shared, sizeClasses[size], variantClasses[variant], className);
  const trailing =
    icon === null ? null : (
      <span
        aria-hidden
        className="inline-flex transition-transform duration-(--duration-base) ease-out-expo group-hover/button:translate-x-0.5"
      >
        {icon ?? <ArrowRightIcon className="size-icon-sm" />}
      </span>
    );

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, external, children: _c, size: _s, icon: _i, className: _cl, ...rest } = props;
    const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...rest}
        >
          {children}
          {trailing}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
        {trailing}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children: _c, size: _s, icon: _i, className: _cl, type = "button", ...rest } = props as AsButton;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
      {trailing}
    </button>
  );
}

/** Filled Electric Blue (blue-600 for AA) call-to-action. */
export function PrimaryButton(props: ButtonProps) {
  return <ButtonBase variant="primary" {...props} />;
}

/** Outline action for secondary paths. Adapts to dark surfaces automatically. */
export function SecondaryButton(props: ButtonProps) {
  return <ButtonBase variant="secondary" {...props} />;
}
