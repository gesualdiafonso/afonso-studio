import type { ContactContent } from "@/content/contact";
import { cn } from "@/lib/cn";

export interface ContactHeadlineProps {
  id: string;
  headline: ContactContent["headline"];
  className?: string;
}

/**
 * Closing headline. Every word sits in its own mask so the scene can raise
 * the words in, staggered. Markup = final state (no JS / reduced motion).
 */
export function ContactHeadline({ id, headline, className }: ContactHeadlineProps) {
  return (
    <h2 id={id} className={cn("contact-headline text-ink", className)}>
      {headline.map((line, l) => (
        <span key={l} className={cn("block", line.emphasis && "text-brand-blue")}>
          {line.text.split(" ").map((word, i, arr) => (
            <span key={i}>
              <span className="contact-word-mask">
                <span data-contact-word className="contact-word">
                  {word}
                </span>
              </span>
              {i < arr.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}
