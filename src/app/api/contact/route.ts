import nodemailer from "nodemailer";
import { isContactConfigured } from "@/lib/contact-config";
import { PROJECT_TYPES, validateContact, type ContactPayload, type ContactResponse } from "@/lib/contact-form";

/**
 * POST /api/contact — receives the contact form and e-mails it through Gmail
 * (Nodemailer).
 *
 * Environment variables (see .env.example / CONTATO-FORMULARIO.md):
 *   EMAIL_USER        Gmail address that sends the message (e.g. you@gmail.com)
 *   EMAIL_PASS        Google App Password (16 characters) — NOT the normal password
 *   CONTACT_TO_EMAIL  optional — inbox that receives the messages (default: EMAIL_USER;
 *                     comma-separated for several)
 *
 * Without EMAIL_USER + EMAIL_PASS the route answers 503 `not_configured` and
 * NOTHING is sent — the form tells the visitor so. There is no fake success.
 */

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
/** Best-effort, per server instance. */
const hits = new Map<string, number[]>();

const json = (body: ContactResponse, status: number) => Response.json(body, { status });

const typeLabel: Record<(typeof PROJECT_TYPES)[number], string> = {
  software: "Engenharia de software",
  automation: "Automação de processos",
  "digital-product": "Produto digital / site",
  infrastructure: "Sistemas e infraestrutura",
  "not-sure": "Ainda não sabe",
};

/** Visitor text goes into HTML: always escape it. */
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

  // Honeypot filled → bot. Answer ok, send nothing.
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
  const user = process.env.EMAIL_USER!;
  const to = process.env.CONTACT_TO_EMAIL || user;

  const rows: [string, string][] = [
    ["Nome", data.name],
    ["E-mail", data.email],
    ["Empresa", data.company],
    ["Tipo de projeto", typeLabel[data.projectType]],
    ["Idioma da página", data.locale ?? "—"],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMensagem:\n${data.description}`;
  const html = `
    <h2>Nova mensagem do formulário do site</h2>
    <table cellpadding="6">${rows
      .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
      .join("")}</table>
    <p><strong>Mensagem</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(data.description)}</p>`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: `"Site — formulário" <${user}>`, // Gmail only sends as the authenticated account
      to,
      replyTo: `"${data.name.replace(/"/g, "")}" <${data.email}>`, // "Responder" goes to the visitor
      subject: `Novo contato pelo site — ${data.company} (${typeLabel[data.projectType]})`,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error("[contact] Erro ao enviar e-mail:", error instanceof Error ? error.stack || error.message : error);
    return false;
  }
}
