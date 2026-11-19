import { hasBearer, json, readJson } from "@/lib/api";
import { processConfirmedDonations } from "@/lib/donations";
import { env, sheetsConfigured } from "@/lib/env";
import { DONATION_REF_PATTERN } from "@/lib/upi";

/**
 * Called by the Google Apps Script in the Sheet when staff mark a donation "Confirmed"
 * (or from its "Send pending receipts now" menu). Requires "Authorization: Bearer ADMIN_API_KEY".
 * Body: { "ref": "JSF-261115-7K3Q" } for one donation, or {} for all confirmed donations.
 */
export async function POST(request: Request) {
  if (!hasBearer(request, env.adminApiKey)) return json({ ok: false, message: "Unauthorised." }, 401);
  if (!sheetsConfigured()) return json({ ok: false, message: "Google Sheets is not configured." }, 500);

  const body = (await readJson(request)) ?? {};
  const ref = typeof body.ref === "string" && DONATION_REF_PATTERN.test(body.ref) ? body.ref : undefined;

  try {
    const result = await processConfirmedDonations({ ref });
    return json({ ok: result.failed.length === 0, ...result });
  } catch (err) {
    console.error("[admin:receipts]", err);
    return json({ ok: false, message: err instanceof Error ? err.message : "Failed" }, 500);
  }
}
