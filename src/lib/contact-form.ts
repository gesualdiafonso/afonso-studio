/**
 * CONTACT FORM — shared contract between the form (client) and the API route
 * (server). One validation function, used on both sides.
 */

export const PROJECT_TYPES = ["software", "automation", "digital-product", "infrastructure", "not-sure"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export interface ContactPayload {
  name: string;
  email: string;
  company: string;
  projectType: ProjectType;
  description: string;
  /** Honeypot — real visitors never fill it. */
  website?: string;
  /** Locale of the page the message came from (for the reply). */
  locale?: string;
}

export type ContactField = "name" | "email" | "company" | "projectType" | "description";
export type ContactErrorCode = "required" | "email" | "tooShort" | "tooLong" | "invalid";

export const LIMITS = {
  name: 120,
  email: 200,
  company: 160,
  descriptionMin: 20,
  description: 4000,
} as const;

/** Free mailbox domains — the form asks for a *business* email. */
const FREE_MAIL = /@(gmail|hotmail|outlook|live|yahoo|icloud|bol|uol|terra|aol)\./i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: Partial<Record<keyof ContactPayload, unknown>>): {
  data: ContactPayload | null;
  errors: Partial<Record<ContactField, ContactErrorCode>>;
  /** Soft warning (not blocking): personal mailbox instead of a business one. */
  personalEmail: boolean;
} {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(input.name);
  const email = str(input.email);
  const company = str(input.company);
  const projectType = str(input.projectType);
  const description = str(input.description);
  const errors: Partial<Record<ContactField, ContactErrorCode>> = {};

  if (!name) errors.name = "required";
  else if (name.length > LIMITS.name) errors.name = "tooLong";

  if (!email) errors.email = "required";
  else if (!EMAIL.test(email) || email.length > LIMITS.email) errors.email = "email";

  if (!company) errors.company = "required";
  else if (company.length > LIMITS.company) errors.company = "tooLong";

  if (!projectType) errors.projectType = "required";
  else if (!(PROJECT_TYPES as readonly string[]).includes(projectType)) errors.projectType = "invalid";

  if (!description) errors.description = "required";
  else if (description.length < LIMITS.descriptionMin) errors.description = "tooShort";
  else if (description.length > LIMITS.description) errors.description = "tooLong";

  const ok = Object.keys(errors).length === 0;
  return {
    data: ok
      ? {
          name,
          email,
          company,
          projectType: projectType as ProjectType,
          description,
          website: str(input.website),
          locale: str(input.locale) || undefined,
        }
      : null,
    errors,
    personalEmail: ok && FREE_MAIL.test(email),
  };
}

/** API responses. */
export type ContactResponse =
  | { ok: true }
  | { ok: false; code: "validation"; errors: Partial<Record<ContactField, ContactErrorCode>> }
  | { ok: false; code: "not_configured" | "rate_limited" | "send_failed" | "bad_request" };
