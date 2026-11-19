import { env } from "./env";

export type SpamVerdict = "ok" | "bot" | "captcha-failed";

/**
 * Cheap, database-free spam checks:
 * 1. Honeypot: a hidden "homepage" field that people never see or fill in.
 * 2. Speed: humans take more than a couple of seconds to fill a form.
 * 3. Cloudflare Turnstile (only when TURNSTILE_SECRET_KEY is set).
 */
export async function checkSpam(body: Record<string, unknown>, request: Request): Promise<SpamVerdict> {
  if (typeof body.homepage === "string" && body.homepage.trim() !== "") return "bot";
  const elapsed = Number(body.elapsedMs);
  if (Number.isFinite(elapsed) && elapsed > 0 && elapsed < 2500) return "bot";

  const secret = env.turnstileSecret;
  if (!secret) return "ok";
  const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
  if (!token) return "captcha-failed";

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success ? "ok" : "captcha-failed";
  } catch {
    // If Cloudflare is unreachable, don't block real people.
    return "ok";
  }
}

export function stripSpamFields<T extends Record<string, unknown>>(body: T) {
  const { homepage: _w, elapsedMs: _e, turnstileToken: _t, ...rest } = body;
  void _w;
  void _e;
  void _t;
  return rest;
}
