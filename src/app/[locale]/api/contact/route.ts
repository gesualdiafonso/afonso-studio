import { isContactConfigured } from "@/lib/contact-config";
import { PROJECT_TYPES, validateContact, type ContactPayload, type ContactResponse } from "@/lib/contact-form";

/**
 * POST /api/contact — receives the contact form and e-mails it via Resend.
 *
 * Configuration (environment variables — see .env.example):
 *   RESEND_API_KEY      API key from https://resend.com (required)
 *   CONTACT_TO_EMAIL    inbox that receives the messages (required)
 *   CONTACT_FROM_EMAIL  sender on a domain verified in Resend
 *                       (default: "Website <onboarding@resend.dev>", test only)
 *
 * Without RESEND_API_KEY + CONTACT_TO_EMAIL the route answers 503
 * `not_configured` and NOTHING is sent — the form tells the visitor so and
 * offers e-mail / WhatsApp instead. There is no fake success.
 */

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
/** Best-effort, per server instance (use a shared store for strict limits). */
const hits = new Map<string, number[]>();

const json = (body: ContactResponse, status: number) => Response.json(body, { status });

const typeLabel: Record<(typeof PROJECT_TYPES)[number], string> = {
  software: "Software engineering",
  automation: "Business automation",
  "digital-product": "Digital product / website",
  infrastructure: "Systems & infrastructure",
  "not-sure": "Not sure yet",
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "bad_request" }, 400);
  }

  const { data, errors } = validateContact(body);
  if (!data) return json({ ok: false, code: "validation", errors }, 422);

  // Honeypot filled → pretend nothing happened, send nothing.
  if (data.website) return json({ ok: true }, 200);

  if (!isContactConfigured()) return json({ ok: false, code: "not_configured" }, 503);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) return json({ ok: false, code: "rate_limited" }, 429);
  hits.set(ip, [...recent, now]);

  const sent = await sendEmail(data);
  return sent ? json({ ok: true }, 200) : json({ ok: false, code: "send_failed" }, 502);
}

async function sendEmail(data: ContactPayload) {
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Business email", data.email],
    ["Company", data.company],
    ["Project type", typeLabel[data.projectType]],
    ["Page language", data.locale ?? "—"],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${data.description}`;
  const html = `<table cellpadding="6">${rows
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><p style="white-space:pre-wrap">${escapeHtml(data.description)}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Website <onboarding@resend.dev>",
        to: process.env.CONTACT_TO_EMAIL!.split(",").map((s) => s.trim()),
        reply_to: data.email,
        subject: `New project enquiry — ${data.company} (${typeLabel[data.projectType]})`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (error) {
    console.error("[contact] send failed", error);
    return false;
  }
}
