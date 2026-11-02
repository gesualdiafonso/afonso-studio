/**
 * Server-side check: is the contact form connected to e-mail delivery?
 * Read by the API route and by ContactSection (to show "integration pending").
 *
 * Gmail (Nodemailer): EMAIL_USER + EMAIL_PASS (a Google *App Password*).
 */
export function isContactConfigured() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}
