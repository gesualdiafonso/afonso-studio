import type { PhilosophyWord } from "@/content/philosophy";
import { cn } from "@/lib/cn";
import "./philosophy-anim";

export interface PhilosophyHeadlineProps {
  words: PhilosophyWord[];
  id: string;
  className?: string;
}

/**
 * Editorial headline split into words for the scroll reveal.
 * Highlighted words are brand blue and carry an accent underline.
 * Real spaces between words keep it readable for screen readers and SEO.
 */
export function PhilosophyHeadline({ words, id, className }: PhilosophyHeadlineProps) {
  return (
    <h2 id={id} className={cn("type-h1 philo-title text-ink", className)}>
      {words.map((word, i) => (
        <span key={i}>
          <span data-philo-word className={cn("philo-word", word.emphasis && "text-brand-blue")}>
            {word.text}
            {word.emphasis ? <span aria-hidden data-philo-underline className="philo-underline" /> : null}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </h2>
  );
}
