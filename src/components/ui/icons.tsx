import type { SVGProps } from "react";

/**
 * Minimal line-icon set drawn on a 24px grid with a 1.75 stroke,
 * matching the circuit-trace weight of the brand symbol.
 * Size with the icon tokens: className="size-icon-md".
 */
type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
};

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function CircuitNodeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12h6l3-3h4" />
      <circle cx="18.5" cy="9" r="2.5" />
      <path d="M12 15h9" />
    </svg>
  );
}

export function CodeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
    </svg>
  );
}

export function AutomationIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <circle cx="12" cy="12" r="5" />
      <path d="m10.5 10 3 2-3 2z" />
    </svg>
  );
}

export function ProductIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4M7 9h5M7 12h8" />
    </svg>
  );
}

export function InfrastructureIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.5 20.5 7.25v9.5L12 21.5 3.5 16.75v-9.5z" />
      <path d="M12 12 20.5 7.25M12 12 3.5 7.25M12 12v9.5" />
    </svg>
  );
}
