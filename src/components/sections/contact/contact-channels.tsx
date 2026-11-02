import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { ContactContent } from "@/content/contact";
import { cn } from "@/lib/cn";

export interface ContactChannelsProps {
  content: ContactContent["channels"];
  newTab: string;
  className?: string;
}

export function whatsappHref(message: string) {
  const number = siteConfig.contact.whatsapp;
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null;
}

/** Direct channels: e-mail, WhatsApp and professional social links. */
export function ContactChannels({ content, newTab, className }: ContactChannelsProps) {
  const wa = whatsappHref(content.whatsappMessage);
  return (
    <div className={cn("grid gap-6", className)}>
      <h3 data-contact-reveal className="type-h4 text-ink">
        {content.title}
      </h3>
      <ul className="grid gap-3">
        <li data-contact-reveal>
          <a href={`mailto:${siteConfig.contact.email}`} className="contact-channel group">
            <span aria-hidden className="contact-channel-icon">
              <Mail className="size-5" strokeWidth={1.6} />
            </span>
            <span className="grid">
              <span className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-secondary uppercase">{content.email}</span>
              <span className="type-body text-ink">{siteConfig.contact.email}</span>
            </span>
            <ArrowUpRight aria-hidden className="contact-channel-arrow ml-auto size-4" />
          </a>
        </li>
        {wa && (
          <li data-contact-reveal>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="contact-channel group" data-channel="whatsapp">
              <span aria-hidden className="contact-channel-icon">
                <MessageCircle className="size-5" strokeWidth={1.6} />
              </span>
              <span className="grid">
                <span className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-secondary uppercase">{content.whatsapp}</span>
                <span className="type-body text-ink">
                  +{siteConfig.contact.whatsapp}
                  <span className="sr-only"> {newTab}</span>
                </span>
              </span>
              <ArrowUpRight aria-hidden className="contact-channel-arrow ml-auto size-4" />
            </a>
          </li>
        )}
      </ul>
      <p data-contact-reveal className="type-body-sm text-ink-secondary">
        {content.response}
      </p>
      <div data-contact-reveal className="grid gap-3">
        <p className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-secondary uppercase">{content.social}</p>
        <ul className="flex flex-wrap gap-2">
          {siteConfig.social.map((s) => (
            <li key={s.network}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="type-body-sm inline-flex min-h-11 items-center gap-1.5 rounded-pill border border-line-strong px-4 text-ink transition-colors hover:border-action-primary hover:text-link"
              >
                {s.label}
                <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">{newTab}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
