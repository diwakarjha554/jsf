import { site } from "@/content/site";
import { env, mailConfigured, sheetsConfigured } from "./env";

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export const FALLBACK_ERROR = `Sorry, something went wrong on our side. Please try again in a few minutes, or email us at ${site.contact.email}.`;

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Checks "Authorization: Bearer <secret>" in constant time. */
export function hasBearer(request: Request, secret: string) {
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;
  if (header.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < header.length; i++) diff |= header.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

/** Where submissions can go: the Sheet, the team inbox, both, or nowhere (not set up yet). */
export function storageChannels(): "both" | "sheet" | "email" | "none" {
  const sheet = sheetsConfigured();
  const email = mailConfigured() && env.adminEmails.length > 0;
  return sheet && email ? "both" : sheet ? "sheet" : email ? "email" : "none";
}

/**
 * Neither Google Sheets nor SMTP is configured. In local development, accept the
 * submission (logged to the terminal) so the UI can be tested. In production, fail
 * loudly rather than silently losing data.
 */
export function notConfiguredResponse(source: string, data: unknown) {
  if (process.env.NODE_ENV === "production") {
    console.error(`[${source}] Neither Google Sheets nor email is configured. Submission rejected.`);
    return json({ ok: false, message: FALLBACK_ERROR }, 500);
  }
  console.warn(`[${source}] DEV: no Sheet or SMTP configured. Submission not stored:`, data);
  return json({ ok: true, dev: true });
}
