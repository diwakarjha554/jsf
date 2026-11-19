import { site } from "@/content/site";
import { env } from "@/lib/env";
import { escapeHtml, formatINR, rupeesInWords } from "@/lib/utils";

export type Rendered = { subject: string; html: string; text: string };
type Rows = [label: string, value: string][];

const BRAND = "#134644";
const MUTED = "#52625f";

function layout(title: string, body: string, preheader = "") {
  const host = env.siteUrl.replace(/^https?:\/\//, "");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f6eee2;font-family:Arial,Helvetica,sans-serif;color:#1b2a2c;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6eee2;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
<tr><td style="background:${BRAND};padding:20px 28px;">
<div style="color:#ffffff;font-size:19px;font-weight:bold;font-family:Georgia,serif;">${escapeHtml(site.name)}</div>
<div style="color:#a6dad5;font-size:12px;margin-top:2px;">${escapeHtml(site.tagline)}</div>
</td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.6;">${body}</td></tr>
<tr><td style="padding:18px 28px;background:#fffbf5;color:${MUTED};font-size:12px;line-height:1.6;">
${escapeHtml(site.legal.legalName)} · ${escapeHtml(site.legal.type)}<br>
${escapeHtml(site.contact.email)} · <a href="${env.siteUrl}" style="color:#155753;">${escapeHtml(host)}</a>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function table(rows: Rows) {
  const tr = rows
    .filter(([, v]) => v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eadfcd;color:${MUTED};width:38%;vertical-align:top;">${escapeHtml(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #eadfcd;font-weight:600;white-space:pre-wrap;">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eadfcd;border-radius:10px;border-collapse:separate;margin:16px 0;">${tr}</table>`;
}

function textRows(rows: Rows) {
  return rows
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

const p = (s: string) => `<p style="margin:0 0 14px;">${escapeHtml(s)}</p>`;
const h = (s: string) => `<h1 style="margin:0 0 14px;font-size:22px;font-family:Georgia,serif;color:${BRAND};">${escapeHtml(s)}</h1>`;
const button = (href: string, label: string) =>
  `<p style="margin:20px 0;"><a href="${href}" style="display:inline-block;background:#c2410c;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px;">${escapeHtml(label)}</a></p>`;

const signoff = `Warm regards,\nTeam ${site.name}`;
const signoffHtml = `<p style="margin:18px 0 0;">Warm regards,<br>Team ${escapeHtml(site.name)}</p>`;

// ── Forms ────────────────────────────────────────────────────────────

export function teamAlert(subject: string, intro: string, rows: Rows): Rendered {
  const sheet = env.sheetUrl ? button(env.sheetUrl, "Open the Google Sheet") : "";
  return {
    subject,
    html: layout(subject, `${h(subject)}${p(intro)}${table(rows)}${sheet}<p style="color:${MUTED};font-size:13px;">Reply to this email to answer the sender directly.</p>`),
    text: `${subject}\n\n${intro}\n\n${textRows(rows)}${env.sheetUrl ? `\n\nSheet: ${env.sheetUrl}` : ""}`,
  };
}

export function autoReply(name: string, subject: string, paragraphs: string[]): Rendered {
  const first = name.split(" ")[0] || name;
  return {
    subject,
    html: layout(subject, `${p(`Dear ${first},`)}${paragraphs.map(p).join("")}${signoffHtml}`, paragraphs[0]),
    text: `Dear ${first},\n\n${paragraphs.join("\n\n")}\n\n${signoff}`,
  };
}

// ── Donations ────────────────────────────────────────────────────────

export type DonationEmailData = {
  ref: string;
  amount: number;
  causeLabel: string;
  name: string;
  email: string;
  phone: string;
  pan: string;
  address: string;
  dedication: string;
  paidVia: string;
  utr: string;
  wants80g: boolean;
};

export function donationReportedDonor(d: DonationEmailData): Rendered {
  const subject = `We've received your donation details (${d.ref})`;
  const days = site.donation.confirmationDays;
  const rows: Rows = [
    ["Reference", d.ref],
    ["Amount", formatINR(d.amount)],
    ["Cause", d.causeLabel],
    ["Paid via", d.paidVia],
    ["Transaction ID / UTR", d.utr],
    ["Dedication", d.dedication],
  ];
  const first = d.name.split(" ")[0];
  const body = `${p(`Dear ${first},`)}${p(`Thank you for your donation to ${site.name}. We've received your payment details:`)}${table(rows)}${p(`Our team checks every payment against our bank statement. As soon as yours is confirmed, usually within ${days} working days, we'll email your receipt.`)}${p(`If anything above looks wrong, just reply to this email.`)}${signoffHtml}`;
  return {
    subject,
    html: layout(subject, body, `Thank you! Your receipt follows once we confirm your payment.`),
    text: `Dear ${first},\n\nThank you for your donation to ${site.name}. We've received your payment details:\n\n${textRows(rows)}\n\nOur team checks every payment against our bank statement. As soon as yours is confirmed, usually within ${days} working days, we'll email your receipt.\n\nIf anything above looks wrong, just reply to this email.\n\n${signoff}`,
  };
}

export function donationReportedTeam(d: DonationEmailData): Rendered {
  const subject = `Please verify: ${formatINR(d.amount)} via ${d.paidVia}, UTR ${d.utr}`;
  const rows: Rows = [
    ["Reference", d.ref],
    ["Amount", formatINR(d.amount)],
    ["Paid via", d.paidVia],
    ["UTR / Txn ID", d.utr],
    ["Cause", d.causeLabel],
    ["Donor", d.name],
    ["Email", d.email],
    ["Phone", d.phone],
    ["PAN", d.pan],
    ["Wants 80G receipt", d.wants80g ? "Yes" : "No"],
    ["Dedication", d.dedication],
  ];
  const steps = `<ol style="margin:0 0 14px;padding-left:20px;"><li>Find UTR <b>${escapeHtml(d.utr)}</b> for ${escapeHtml(formatINR(d.amount))} in the bank statement or bank app.</li><li>In the Sheet's <b>Donations</b> tab, find reference <b>${escapeHtml(d.ref)}</b>.</li><li>Set <b>Status</b> to <b>Confirmed</b> (or <b>Not received</b>) and fill in <b>Verified By</b>.</li></ol><p style="margin:0 0 14px;">The receipt is emailed to the donor automatically.</p>`;
  const sheet = env.sheetUrl ? button(env.sheetUrl, "Open the Google Sheet") : "";
  return {
    subject,
    html: layout(subject, `${h("New donation to verify")}${table(rows)}${steps}${sheet}`),
    text: `New donation to verify\n\n${textRows(rows)}\n\n1. Find UTR ${d.utr} for ${formatINR(d.amount)} in the bank statement.\n2. In the Donations tab, find ${d.ref}.\n3. Set Status to Confirmed (or Not received) and fill in Verified By.\nThe receipt is emailed automatically.${env.sheetUrl ? `\n\nSheet: ${env.sheetUrl}` : ""}`,
  };
}

export type ReceiptEmailData = DonationEmailData & {
  receiptNo: string;
  dateReceived: string;
  donationType: string;
};

export function donationReceipt(d: ReceiptEmailData): Rendered {
  const subject = `Your donation receipt ${d.receiptNo}`;
  const tax = site.legal.tax80g;
  const rows: Rows = [
    ["Receipt number", d.receiptNo],
    ["Date received", d.dateReceived],
    ["Received from", d.name],
    ["Address", d.address],
    ["Donor PAN", d.pan],
    ["Amount", formatINR(d.amount)],
    ["Amount in words", rupeesInWords(d.amount)],
    ["Mode of payment", d.paidVia === "UPI" ? "Electronic (UPI)" : "Electronic (bank transfer)"],
    ["Transaction ID / UTR", d.utr],
    ["Purpose", d.causeLabel],
    ["Donation type", d.donationType],
    ["Dedication", d.dedication],
    ["Donation reference", d.ref],
  ];
  const org: Rows = [
    ["Organisation", site.legal.legalName],
    ["Registered office", site.legal.registeredOffice],
    ["Legal status", site.legal.type],
    ["CIN", site.legal.cin],
    ["PAN", site.legal.pan],
  ];
  const taxNote = tax.enabled
    ? `Donations to ${site.legal.legalName} are eligible for deduction under section 80G (approval no. ${tax.approvalNumber}, valid ${tax.validFrom} to ${tax.validTo}). After the financial year ends, we report your donation to the Income Tax Department and send you Form 10BE, which you need to claim the deduction.`
    : `This receipt acknowledges your donation. ${site.legal.legalName}'s 80G approval is in process, so this donation is not eligible for a tax deduction.`;
  const first = d.name.split(" ")[0];
  const body = `${p(`Dear ${first},`)}${p(`Thank you! We've received your donation and it's now at work. Your receipt is below; please keep this email for your records.`)}${h("Donation receipt")}${table(rows)}${table(org)}<p style="margin:0 0 14px;font-size:13px;color:${MUTED};">${escapeHtml(taxNote)}</p><p style="margin:0 0 14px;font-size:13px;color:${MUTED};">${escapeHtml(`We accept donations only from Indian citizens. This donation was declared by the donor as made from their own funds.`)}</p><p style="margin:18px 0 0;">${escapeHtml(site.signatory.name)}<br><span style="color:${MUTED};">${escapeHtml(site.signatory.designation)}, ${escapeHtml(site.name)}</span></p>${button(`${env.siteUrl}/stories`, "See what your support makes possible")}`;
  return {
    subject,
    html: layout(subject, body, `Receipt ${d.receiptNo} for ${formatINR(d.amount)}. Thank you!`),
    text: `Dear ${first},\n\nThank you! We've received your donation. Your receipt:\n\n${textRows(rows)}\n\n${textRows(org)}\n\n${taxNote}\n\n${site.signatory.name}\n${site.signatory.designation}, ${site.name}`,
  };
}

export function dailySummary(lines: string[]): Rendered {
  const subject = `Daily donation check: ${lines.length} item${lines.length === 1 ? "" : "s"} to note`;
  const sheet = env.sheetUrl ? button(env.sheetUrl, "Open the Google Sheet") : "";
  return {
    subject,
    html: layout(subject, `${h("Daily donation check")}<ul style="padding-left:20px;margin:0 0 14px;">${lines.map((l) => `<li style="margin-bottom:6px;">${escapeHtml(l)}</li>`).join("")}</ul>${sheet}`),
    text: `Daily donation check\n\n${lines.map((l) => `- ${l}`).join("\n")}${env.sheetUrl ? `\n\nSheet: ${env.sheetUrl}` : ""}`,
  };
}
