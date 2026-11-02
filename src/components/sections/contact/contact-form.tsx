"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { PrimaryButton } from "@/components/ui";
import type { ContactContent } from "@/content/contact";
import {
  LIMITS,
  PROJECT_TYPES,
  validateContact,
  type ContactErrorCode,
  type ContactField,
  type ContactResponse,
} from "@/lib/contact-form";
import { cn } from "@/lib/cn";

export interface ContactFormProps {
  content: ContactContent["form"];
  /** false → "integration pending": the form composes an e-mail instead of posting. */
  configured: boolean;
  /** Inbox used by the pending mode (mailto). */
  fallbackEmail: string;
  locale: string;
  className?: string;
}

type Status = "idle" | "sending" | "success" | "not_configured" | "rate_limited" | "failed" | "mailto";
const FIELDS: ContactField[] = ["name", "email", "company", "projectType", "description"];

/**
 * Contact form — real submission to /api/contact, never a fake
 * success. /api/contact sends through Gmail (Nodemailer). If the server is not configured, the form says so clearly and
 * opens the visitor's e-mail app with the message composed instead.
 */
export function ContactForm({ content, configured, fallbackEmail, locale, className }: ContactFormProps) {
  const uid = useId().replace(/:/g, "");
  const form = useRef<HTMLFormElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const [errors, setErrors] = useState<Partial<Record<ContactField, ContactErrorCode>>>({});
  const [touched, setTouched] = useState(false);
  const [personal, setPersonal] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const f = content.fields;
  const fid = (name: string) => `${uid}-${name}`;

  const read = (el: HTMLFormElement) => Object.fromEntries(new FormData(el)) as Record<string, string>;

  const focusFirstError = (errs: Partial<Record<ContactField, ContactErrorCode>>) => {
    const first = FIELDS.find((k) => errs[k]);
    if (first) form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const onBlur = (event: { currentTarget: { form: HTMLFormElement | null } }) => {
    const el = event.currentTarget.form;
    if (!touched || !el) return;
    setErrors(validateContact(read(el)).errors);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    const values = read(event.currentTarget);
    const result = validateContact({ ...values, locale });
    setErrors(result.errors);
    setPersonal(result.personalEmail);
    if (!result.data) {
      focusFirstError(result.errors);
      return;
    }

    if (!configured) {
      const d = result.data;
      const body = [
        `${f.name.label}: ${d.name}`,
        `${f.email.label}: ${d.email}`,
        `${f.company.label}: ${d.company}`,
        `${f.projectType.label}: ${content.projectTypes[d.projectType]}`,
        "",
        d.description,
      ].join("\n");
      const subject = `${content.projectTypes[d.projectType]} — ${d.company}`;
      window.location.assign(`mailto:${fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      const data = (await res.json().catch(() => ({ ok: false, code: "send_failed" }))) as ContactResponse;
      if (data.ok) {
        setStatus("success");
        form.current?.reset();
        requestAnimationFrame(() => successHeading.current?.focus());
      } else if (data.code === "validation") {
        setErrors(data.errors);
        setStatus("idle");
        focusFirstError(data.errors);
      } else if (data.code === "not_configured") setStatus("not_configured");
      else if (data.code === "rate_limited") setStatus("rate_limited");
      else setStatus("failed");
    } catch {
      setStatus("failed");
    }
  };

  const errorCount = Object.keys(errors).length;

  if (status === "success") {
    return (
      <div className={cn("contact-card grid content-center gap-4 p-6 md:p-10", className)}>
        <span aria-hidden className="contact-success-mark grid size-14 place-items-center rounded-pill">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 ref={successHeading} tabIndex={-1} className="type-h3 text-ink outline-none">
          {content.status.success.title}
        </h3>
        <p className="type-body-lg text-ink-secondary">{content.status.success.text}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="type-label w-fit text-link underline-offset-4 hover:underline"
        >
          {content.status.success.again}
        </button>
      </div>
    );
  }

  const message =
    status === "not_configured"
      ? content.status.notConfigured
      : status === "rate_limited"
        ? content.status.rateLimited
        : status === "failed"
          ? content.status.failed
          : null;

  const field = (name: ContactField) => ({
    id: fid(name),
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": cn(errors[name] && fid(`${name}-error`), fid(`${name}-hint`)) || undefined,
    onBlur,
    className: "contact-input",
  });

  const label = (name: ContactField, text: string) => (
    <label htmlFor={fid(name)} className="type-label flex items-baseline justify-between gap-3 text-ink">
      {text}
      <span className="font-mono text-[0.625rem] tracking-[0.08em] text-ink-secondary normal-case">
        {content.required}
      </span>
    </label>
  );

  const fieldError = (name: ContactField) =>
    errors[name] ? (
      <p id={fid(`${name}-error`)} className="contact-error type-body-sm">
        {content.errors[errors[name]!]}
      </p>
    ) : null;

  return (
    <div className={cn("contact-card grid gap-6 p-5 md:p-8 lg:p-10", className)}>
      <div className="grid gap-2">
        {!configured && (
          <p className="contact-pending type-label flex w-fit items-center gap-2 rounded-pill px-3 py-1.5">
            <span aria-hidden className="size-2 rounded-pill bg-current" />
            {content.pending.badge}
          </p>
        )}
        <h3 className="type-h3 text-ink">{content.title}</h3>
        <p className="type-body text-ink-secondary">{configured ? content.intro : content.pending.text}</p>
      </div>

      <form ref={form} noValidate onSubmit={onSubmit} className="grid gap-5" aria-describedby={fid("privacy")}>
        {touched && errorCount > 0 && (
          <p role="alert" className="contact-error-summary type-body-sm rounded-[0.75rem] px-4 py-3">
            {content.errorSummary}
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid content-start gap-2" data-contact-field>
            {label("name", f.name.label)}
            <input {...field("name")} type="text" autoComplete="name" required maxLength={LIMITS.name} placeholder={f.name.placeholder} />
            {fieldError("name")}
          </div>
          <div className="grid content-start gap-2" data-contact-field>
            {label("email", f.email.label)}
            <input
              {...field("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              maxLength={LIMITS.email}
              placeholder={f.email.placeholder}
            />
            {fieldError("email")}
            <p id={fid("email-hint")} className="type-body-sm text-ink-secondary">
              {personal ? f.email.personal : f.email.hint}
            </p>
          </div>
          <div className="grid content-start gap-2" data-contact-field>
            {label("company", f.company.label)}
            <input
              {...field("company")}
              type="text"
              autoComplete="organization"
              required
              maxLength={LIMITS.company}
              placeholder={f.company.placeholder}
            />
            {fieldError("company")}
          </div>
          <div className="grid content-start gap-2" data-contact-field>
            {label("projectType", f.projectType.label)}
            <div className="relative">
              <select {...field("projectType")} required defaultValue="" className="contact-input contact-select">
                <option value="" disabled>
                  {f.projectType.placeholder}
                </option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {content.projectTypes[type]}
                  </option>
                ))}
              </select>
              <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-secondary" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 6l4 4 4-4" />
              </svg>
            </div>
            {fieldError("projectType")}
          </div>
        </div>

        <div className="grid content-start gap-2" data-contact-field>
          {label("description", f.description.label)}
          <textarea
            {...field("description")}
            required
            rows={5}
            minLength={LIMITS.descriptionMin}
            maxLength={LIMITS.description}
            placeholder={f.description.placeholder}
          />
          {fieldError("description")}
          <p id={fid("description-hint")} className="type-body-sm text-ink-secondary">
            {f.description.hint}
          </p>
        </div>

        {/* Honeypot — hidden from people and assistive tech */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={fid("website")}>Website</label>
          <input id={fid("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex flex-col items-start gap-4 pt-1 md:flex-row md:items-center md:justify-between">
          <p id={fid("privacy")} className="type-body-sm max-w-[22rem] text-ink-secondary">
            {content.privacy}
          </p>
          <PrimaryButton type="submit" size="lg" disabled={status === "sending"} className="w-full md:w-auto">
            {status === "sending" ? content.sending : configured ? content.submit : content.pending.submit}
          </PrimaryButton>
        </div>

        <div role="status" aria-live="polite" className="empty:hidden">
          {message ? <p className="contact-error-summary type-body-sm rounded-[0.75rem] px-4 py-3">{message}</p> : null}
        </div>
      </form>
    </div>
  );
}
