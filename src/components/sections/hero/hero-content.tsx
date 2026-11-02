import { SectionEyebrow } from "@/components/ui";
import type { HeroContent as HeroContentData } from "@/content/hero";
import { cn } from "@/lib/cn";
import { cssVars } from "@/lib/style-vars";
import { HeroActions } from "./hero-actions";
import { heroAnim } from "./hero-anim";

export interface HeroContentProps {
  content: HeroContentData;
  /** Section number shown in the eyebrow ("01"). */
  index: string;
  titleId: string;
  className?: string;
}

const WORD_START = 260; // ms — after the logo starts
const WORD_STAGGER = 90; // ms

/** Eyebrow, word-by-word headline, supporting text and CTAs. */
export function HeroContent({ content, index, titleId, className }: HeroContentProps) {
  let wordIndex = 0;
  const wordCount = content.headline.flat().length;
  const afterHeadline = WORD_START + wordCount * WORD_STAGGER;

  return (
    <div className={cn("relative z-10 flex flex-col", className)}>
      <div data-hero-layer="eyebrow">
        <div className={heroAnim.fadeUp} style={cssVars({ "--d": "120ms" })}>
          <SectionEyebrow index={index}>{content.eyebrow}</SectionEyebrow>
        </div>
      </div>

      <div data-hero-layer="headline" className="mt-6 lg:mt-8">
        <h1 id={titleId} className={cn("type-display text-ink", heroAnim.title)}>
          {content.headline.map((line, lineIndex) => (
            <span
              key={lineIndex}
              className={cn(
                "block lg:whitespace-nowrap",
                // Asymmetric editorial indent on the second line (tablet only;
                // on desktop the copy column carries the offset instead so the
                // headline never collides with the A-CORE).
                lineIndex === 1 && "sm:max-lg:pl-[0.9em]",
              )}
            >
              {line.map((word, i) => {
                const delay = WORD_START + wordIndex++ * WORD_STAGGER;
                return (
                  <span key={i}>
                    <span className={heroAnim.wordMask}>
                      <span
                        data-hero-word
                        className={cn(heroAnim.word, word.emphasis && "text-brand-blue")}
                        style={cssVars({ "--d": `${delay}ms` })}
                      >
                        {word.text}
                      </span>
                    </span>
                    {i < line.length - 1 ? " " : null}
                  </span>
                );
              })}
              {lineIndex < content.headline.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
      </div>

      <div data-hero-layer="copy" className="mt-8 lg:mt-12 lg:pl-[calc(var(--hero-display)*1.15)]">
        <p
          className={cn("type-body-lg max-w-[34rem] text-ink-secondary", heroAnim.fadeUp)}
          style={cssVars({ "--d": `${afterHeadline + 80}ms` })}
        >
          {content.description}
        </p>
      </div>

      <div data-hero-layer="actions" className="mt-8 lg:pl-[calc(var(--hero-display)*1.15)]">
        <HeroActions primary={content.primaryCta} secondary={content.secondaryCta} delay={afterHeadline + 200} />
      </div>
    </div>
  );
}
