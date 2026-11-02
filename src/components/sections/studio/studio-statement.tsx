import { cn } from "@/lib/cn";

export interface StudioStatementProps {
  id: string;
  kicker: string;
  statement: string;
  emphasis: string[];
  className?: string;
}

/**
 * The main editorial statement (the section's h2). Each word carries its own
 * fill progress (--w): the scene sweeps ink across the sentence as it is
 * scrolled, word after word. Default --w = 1, so without JS it reads fully.
 */
export function StudioStatement({ id, kicker, statement, emphasis, className }: StudioStatementProps) {
  const words = statement.split(" ");
  return (
    <div className={cn("grid gap-6", className)}>
      <p data-studio-reveal className="flex items-center gap-3 font-mono text-[0.75rem] tracking-[0.1em] text-ink-secondary uppercase">
        <span aria-hidden className="h-px w-10 bg-brand-blue" />
        {kicker}
      </p>
      <h2 id={id} data-studio-statement className="studio-statement text-ink">
        {words.map((word, i) => (
          <span key={i}>
            <span data-studio-word className={cn("studio-word", emphasis.includes(word) && "studio-word--em")}>
              {word}
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </h2>
    </div>
  );
}
