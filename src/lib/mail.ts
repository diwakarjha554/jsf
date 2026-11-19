import nodemailer, { type Transporter } from "nodemailer";
import { env, mailConfigured } from "./env";

let transporter: Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    const s = env.smtp;
    transporter = nodemailer.createTransport({
      host: s.host,
      port: s.port,
      secure: s.secure,
      auth: { user: s.user, pass: s.pass },
    });
  }
  return transporter;
}

export type Email = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

/** Sends an email. Returns false (and logs) instead of throwing, so one failure never blocks the other channel. */
export async function sendMail(email: Email): Promise<boolean> {
  const to = Array.isArray(email.to) ? email.to.filter(Boolean) : email.to;
  if (!to || (Array.isArray(to) && to.length === 0)) return false;
  if (!mailConfigured()) {
    console.warn(`[mail] SMTP not configured; skipped "${email.subject}" to ${String(to)}`);
    return false;
  }
  try {
    await getTransporter().sendMail({
      from: env.mailFrom,
      to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo: email.replyTo,
    });
    return true;
  } catch (err) {
    console.error(`[mail] Failed to send "${email.subject}":`, err);
    return false;
  }
}

export function sendToTeam(email: Omit<Email, "to">) {
  return sendMail({ ...email, to: env.adminEmails });
}
