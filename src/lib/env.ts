// Server-side configuration. Read lazily so missing values only matter when a feature is used.

export const env = {
  get siteUrl() {
    return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  },
  get sheetId() {
    return process.env.GOOGLE_SHEET_ID?.trim() || "";
  },
  get sheetUrl() {
    return process.env.NEXT_PUBLIC_SHEET_URL?.trim() || "";
  },
  get serviceAccountEmail() {
    return process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() || "";
  },
  get privateKey() {
    return (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n").replace(/^"|"$/g, "");
  },
  get smtp() {
    const port = Number(process.env.SMTP_PORT || 465);
    return {
      host: process.env.SMTP_HOST?.trim() || "",
      port,
      secure: port === 465,
      user: process.env.SMTP_USER?.trim() || "",
      pass: process.env.SMTP_PASS || "",
    };
  },
  get mailFrom() {
    return process.env.MAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || "";
  },
  get adminEmails() {
    return (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  },
  get turnstileSecret() {
    return process.env.TURNSTILE_SECRET_KEY?.trim() || "";
  },
  get cronSecret() {
    return process.env.CRON_SECRET?.trim() || "";
  },
  get adminApiKey() {
    return process.env.ADMIN_API_KEY?.trim() || "";
  },
};

export function sheetsConfigured() {
  return Boolean(env.sheetId && env.serviceAccountEmail && env.privateKey);
}

export function mailConfigured() {
  const s = env.smtp;
  return Boolean(s.host && s.user && s.pass && env.mailFrom);
}
