import { dailySummary } from "@/emails/templates";
import { hasBearer, json } from "@/lib/api";
import { processConfirmedDonations, staleReportedDonations } from "@/lib/donations";
import { env, sheetsConfigured } from "@/lib/env";
import { logEvent } from "@/lib/log";
import { sendToTeam } from "@/lib/mail";
import { formatINR } from "@/lib/utils";

/**
 * Runs once a day (Vercel Cron, see vercel.json). Vercel sends "Authorization: Bearer CRON_SECRET".
 * 1. Sends any receipts still pending (safety net if the Sheet trigger isn't installed or failed).
 * 2. Reminds the team about donations waiting more than a day for verification.
 */
export async function GET(request: Request) {
  if (!hasBearer(request, env.cronSecret)) return json({ ok: false, message: "Unauthorised." }, 401);
  if (!sheetsConfigured()) return json({ ok: false, message: "Google Sheets is not configured." }, 500);

  const lines: string[] = [];
  try {
    const { processed, failed } = await processConfirmedDonations();
    if (processed.length) lines.push(`${processed.length} receipt(s) sent: ${processed.map((p) => p.receiptNo).join(", ")}.`);
    for (const f of failed) lines.push(`Receipt for ${f.ref} could not be sent: ${f.error}`);

    const stale = await staleReportedDonations(24);
    if (stale.length) {
      lines.push(
        `${stale.length} donation(s) reported over a day ago still need checking against the bank statement: ${stale
          .slice(0, 10)
          .map((r) => `${r.data["Ref"]} (${formatINR(Number(r.data["Amount (INR)"]) || 0)}, UTR ${r.data["UTR"]})`)
          .join("; ")}${stale.length > 10 ? "; …" : ""}`,
      );
    }

    if (lines.length) await sendToTeam(dailySummary(lines));
    await logEvent("cron", "daily-check", "", "ok", lines.join(" | ") || "Nothing to do");
    return json({ ok: true, notes: lines });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await logEvent("cron", "daily-check", "", "error", message);
    return json({ ok: false, message }, 500);
  }
}
