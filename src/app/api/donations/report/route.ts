import { donationReportedDonor, donationReportedTeam } from "@/emails/templates";
import { FALLBACK_ERROR, json, notConfiguredResponse, readJson, storageChannels } from "@/lib/api";
import { donationRow, emailDataFromInput, STATUS } from "@/lib/donations";
import { sheetsConfigured } from "@/lib/env";
import { logEvent } from "@/lib/log";
import { sendMail, sendToTeam } from "@/lib/mail";
import { donationReportSchema, fieldErrors } from "@/lib/schemas";
import { appendRow, readRows, TAB, updateRow } from "@/lib/sheets";
import { istTimestamp } from "@/lib/utils";

/**
 * Step 3: the donor says they've paid and gives the UTR / transaction ID.
 * Updates the pledge row (or adds it if step 2 couldn't be saved), then emails
 * an acknowledgement to the donor and a "please verify" alert to the team.
 */
export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return json({ ok: false, message: "Invalid request." }, 400);

  const parsed = donationReportSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) }, 400);
  }
  const d = parsed.data;
  if (storageChannels() === "none") return notConfiguredResponse("donations:report", d);
  const reportedAt = istTimestamp();
  const update = { "Paid Via": d.paidVia, UTR: d.utr, "Reported At": reportedAt, Status: STATUS.reported };

  let saved = false;
  if (sheetsConfigured()) {
    try {
      const { headers, rows } = await readRows(TAB.donations);
      const utrTaken = rows.find((r) => r.data["UTR"] === d.utr && r.data["Ref"] !== d.ref);
      if (utrTaken) {
        return json(
          { ok: false, message: "This transaction ID has already been used for another donation.", errors: { utr: "This transaction ID has already been submitted." } },
          409,
        );
      }
      const existing = rows.find((r) => r.data["Ref"] === d.ref);
      if (existing && existing.data["Email"].toLowerCase() !== d.email) {
        return json({ ok: false, message: "This donation reference doesn't match your email. Please start the donation again." }, 409);
      }
      if (existing) {
        const locked = existing.data["Status"] === STATUS.confirmed || existing.data["Status"] === STATUS.receiptSent;
        if (!locked) await updateRow(TAB.donations, existing.row, update, headers);
      } else {
        await appendRow(TAB.donations, { ...donationRow(d, d.ref, STATUS.reported), ...update });
      }
      saved = true;
    } catch (err) {
      console.error("[donations:report] Sheet write failed", d.ref, err);
    }
  }

  const emailData = emailDataFromInput(d);
  const alerted = await sendToTeam({ ...donationReportedTeam(emailData), replyTo: d.email });

  if (!saved && !alerted) {
    await logEvent("donations", "report-lost", d.ref, "error", `UTR ${d.utr}, ₹${d.amount}, ${d.email}`);
    return json({ ok: false, message: FALLBACK_ERROR }, 500);
  }

  await sendMail({ ...donationReportedDonor(emailData), to: d.email });
  await logEvent("donations", "payment-reported", d.ref, saved ? "saved" : "email-only", `UTR ${d.utr}`);
  return json({ ok: true });
}
