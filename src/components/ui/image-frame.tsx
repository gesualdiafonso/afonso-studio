import Image, { type ImageProps } from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ImageRatio = "square" | "portrait" | "tall" | "landscape" | "wide" | "cinema";

const ratioClasses: Record<ImageRatio, string> = {
  square: "aspect-square",
  portrait: "aspect-portrait",
  tall: "aspect-tall",
  landscape: "aspect-landscape",
  wide: "aspect-wide",
  cinema: "aspect-cinema",
};

export interface ImageFrameProps {
  src: ImageProps["src"];
  /** Describe the image; pass "" only when it is purely decorative. */
  alt: string;
  ratio?: ImageRatio;
  /** Responsive `sizes` hint — required for correct srcset selection. */
  sizes?: string;
  priority?: boolean;
  caption?: ReactNode;
  rounded?: boolean;
  /** Extra classes for the <img> (e.g. hover scale from a parent group). */
  imageClassName?: string;
  className?: string;
}

/**
 * Responsive image inside a fixed aspect-ratio frame. Reserves space
 * (no layout shift) and shows a muted surface while loading.
 */
export function ImageFrame({
  src,
  alt,
  ratio = "landscape",
  sizes = "(min-width: 64rem) 50vw, 100vw",
  priority = false,
  caption,
  rounded = true,
  imageClassName,
  className,
}: ImageFrameProps) {
  const frame = (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-panel-muted",
        ratioClasses[ratio],
        rounded && "rounded-media",
        !caption && className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );

  if (!caption) return frame;

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      {frame}
      <figcaption className="type-body-sm text-ink-secondary">{caption}</figcaption>
    </figure>
  );
}
