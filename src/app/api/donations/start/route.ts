import { json, readJson } from "@/lib/api";
import { donationRow, newDonationRef, STATUS } from "@/lib/donations";
import { sheetsConfigured } from "@/lib/env";
import { donationStartSchema, fieldErrors } from "@/lib/schemas";
import { appendRow, TAB } from "@/lib/sheets";
import { checkSpam, stripSpamFields } from "@/lib/spam";

/**
 * Step 2 of the donation flow: the donor has entered their details.
 * Creates a reference code and records the pledge as "Awaiting payment".
 * Recording is best-effort: if the Sheet is down, the full details are sent again
 * with the payment report in step 3, so nothing is lost.
 */
export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return json({ ok: false, message: "Invalid request." }, 400);

  const verdict = await checkSpam(body, request);
  if (verdict === "bot") return json({ ok: false, message: "Please try again." }, 400);
  if (verdict === "captcha-failed") {
    return json({ ok: false, message: "Please complete the security check and try again." }, 400);
  }

  const parsed = donationStartSchema.safeParse(stripSpamFields(body));
  if (!parsed.success) {
    return json({ ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) }, 400);
  }

  const ref = newDonationRef();
  if (sheetsConfigured()) {
    try {
      await appendRow(TAB.donations, donationRow(parsed.data, ref, STATUS.awaiting));
    } catch (err) {
      console.error("[donations:start] Could not record pledge", ref, err);
    }
  }
  return json({ ok: true, ref });
}
