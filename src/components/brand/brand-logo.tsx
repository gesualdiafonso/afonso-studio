import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { format, getMessages, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { BrandSymbol } from "./brand-symbol";

export interface BrandLogoProps {
  /** Where the logo links. Pass `null` to render without a link. */
  href?: string | null;
  /** light = on ice/white surfaces · dark = on Deep Navy surfaces. */
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  /** Hide the wordmark (symbol only). */
  symbolOnly?: boolean;
  locale?: Locale;
  className?: string;
}

const sizes = {
  sm: { symbol: 28, text: "text-[1rem]", gap: "gap-2" },
  md: { symbol: 36, text: "text-[1.25rem]", gap: "gap-2.5" },
  lg: { symbol: 52, text: "text-[1.75rem]", gap: "gap-3.5" },
} as const;

/**
 * Brand logo: official artwork when configured in siteConfig.logo.official,
 * otherwise the provisional vector symbol + wordmark.
 */
export function BrandLogo({
  href = "/",
  tone = "light",
  size = "md",
  symbolOnly = false,
  locale,
  className,
}: BrandLogoProps) {
  const s = sizes[size];
  const { official } = siteConfig.logo;
  const label = format(getMessages(locale).a11y.logo, { name: siteConfig.name });
  const officialSrc = symbolOnly
    ? official.symbol
    : tone === "dark"
      ? (official.fullInverse ?? official.full)
      : official.full;

  const mark = officialSrc ? (
    <Image
      src={officialSrc}
      alt={href ? "" : siteConfig.name}
      width={symbolOnly ? s.symbol : official.width}
      height={symbolOnly ? s.symbol : official.height}
      priority
      className="h-auto"
    />
  ) : (
    <span className={cn("inline-flex items-center", s.gap)}>
      <BrandSymbol size={s.symbol} variant={tone === "dark" ? "inverse" : "color"} outerTraces={size === "lg"} />
      {symbolOnly ? null : (
        <span
          className={cn(
            "font-display leading-none font-semibold tracking-[-0.03em]",
            s.text,
            tone === "dark" ? "text-ink-inverse" : "text-brand-graphite",
          )}
        >
          {siteConfig.name}
        </span>
      )}
    </span>
  );

  if (!href) {
    return (
      <span className={cn("inline-flex", className)} role="img" aria-label={siteConfig.name}>
        {mark}
      </span>
    );
  }

  return (
    <Link href={href} aria-label={label} className={cn("inline-flex rounded-sm", className)}>
      {mark}
    </Link>
  );
}
