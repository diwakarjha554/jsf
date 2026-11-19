import { randomInt } from "node:crypto";
import { donationCauseLabel } from "@/content/causes";
import { DEDICATION_TYPES } from "@/content/options";
import { donationReceipt, type DonationEmailData } from "@/emails/templates";
import { logEvent } from "./log";
import { sendMail } from "./mail";
import { appendRow, readRows, TAB, updateRow, type RowRecord, type SheetRow } from "./sheets";
import { normalisePhone, type DonationStartInput } from "./schemas";
import { financialYear, istDateCode, istTimestamp } from "./utils";

export const STATUS = {
  awaiting: "Awaiting payment",
  reported: "Payment reported",
  confirmed: "Confirmed",
  receiptSent: "Receipt sent",
  notReceived: "Not received",
} as const;

const REF_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** e.g. "JSF-261115-7K3Q": date in IST + 4 random characters (no 0/O/1/I confusion). */
export function newDonationRef(date = new Date()) {
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
  return `JSF-${istDateCode(date)}-${suffix}`;
}

export function dedicationText(type: string, name: string) {
  const label = DEDICATION_TYPES.find((d) => d.value === type)?.label;
  return label && name ? `${label} ${name}` : "";
}

export function addressText(d: Pick<DonationStartInput, "address" | "city" | "state" | "pincode">) {
  return [d.address, d.city, d.state, d.pincode].filter(Boolean).join(", ");
}

export function donationRow(d: DonationStartInput, ref: string, status: string): RowRecord {
  return {
    Ref: ref,
    "Created At": istTimestamp(),
    Status: status,
    "Amount (INR)": d.amount,
    Cause: donationCauseLabel(d.cause),
    "Donor Name": d.name,
    Email: d.email,
    Phone: normalisePhone(d.phone),
    PAN: d.pan,
    Address: d.address,
    City: d.city,
    State: d.state,
    Pincode: d.pincode,
    "Wants 80G": d.wants80g ? "Yes" : "No",
    "Citizen Declared": d.citizen ? "Yes" : "No",
    Dedication: dedicationText(d.dedicationType, d.dedicationName),
  };
}

export function emailDataFromInput(d: DonationStartInput & { ref: string; paidVia: string; utr: string }): DonationEmailData {
  return {
    ref: d.ref,
    amount: d.amount,
    causeLabel: donationCauseLabel(d.cause),
    name: d.name,
    email: d.email,
    phone: normalisePhone(d.phone),
    pan: d.pan,
    address: addressText(d),
    dedication: dedicationText(d.dedicationType, d.dedicationName),
    paidVia: d.paidVia,
    utr: d.utr,
    wants80g: d.wants80g,
  };
}

function emailDataFromRow(r: Record<string, string>): DonationEmailData {
  return {
    ref: r["Ref"],
    amount: Number(String(r["Amount (INR)"]).replace(/[^\d.]/g, "")) || 0,
    causeLabel: r["Cause"],
    name: r["Donor Name"],
    email: r["Email"],
    phone: r["Phone"],
    pan: r["PAN"],
    address: [r["Address"], r["City"], r["State"], r["Pincode"]].filter(Boolean).join(", "),
    dedication: r["Dedication"],
    paidVia: r["Paid Via"] || "UPI",
    utr: r["UTR"],
    wants80g: r["Wants 80G"] === "Yes",
  };
}

/**
 * Receipt numbers come from the row number in the protected "Receipts" tab.
 * Appends never share a row, so numbers can't collide (as long as rows aren't deleted).
 */
export function receiptNumber(rowNumber: number, dateReceived: string) {
  return `JSF/${financialYear(dateReceived)}/${String(rowNumber - 1).padStart(5, "0")}`;
}

export type ProcessResult = { ref: string; receiptNo?: string; error?: string };

/**
 * Issues receipts for donations that staff have marked "Confirmed".
 * Safe to run repeatedly: it reuses an existing receipt row for the same donation and
 * only marks a donation "Receipt sent" after the email has gone out.
 */
export async function processConfirmedDonations(opts: { ref?: string } = {}) {
  const donations = await readRows(TAB.donations);
  const targets = donations.rows.filter(
    (r) =>
      r.data["Status"] === STATUS.confirmed &&
      !r.data["Receipt Sent At"] &&
      r.data["Ref"] &&
      (!opts.ref || r.data["Ref"] === opts.ref),
  );
  const processed: ProcessResult[] = [];
  const failed: ProcessResult[] = [];
  if (!targets.length) return { processed, failed };

  const receipts = await readRows(TAB.receipts);

  for (const target of targets) {
    const d = target.data;
    try {
      if (!d["Email"]) throw new Error("No donor email on this row");
      const dateReceived = d["Reported At"] || d["Created At"] || istTimestamp();
      let receiptNo = d["Receipt No"];

      if (!receiptNo) {
        const existing: SheetRow | undefined = receipts.rows.find((r) => r.data["Donation Ref"] === d["Ref"]);
        const rowNumber =
          existing?.row ??
          (await appendRow(TAB.receipts, {
            "Issued At": istTimestamp(),
            "Donation Ref": d["Ref"],
            "Date Received": dateReceived.slice(0, 10),
            "Amount (INR)": Number(String(d["Amount (INR)"]).replace(/[^\d.]/g, "")) || 0,
            "Donor Name": d["Donor Name"],
            Email: d["Email"],
            PAN: d["PAN"],
            Address: [d["Address"], d["City"], d["State"], d["Pincode"]].filter(Boolean).join(", "),
            "Paid Via": d["Paid Via"] || "UPI",
            UTR: d["UTR"],
            Cause: d["Cause"],
            "Donation Type": "Others",
            "Receipt Status": "Valid",
          }));
        receiptNo = existing?.data["Receipt No"] || receiptNumber(rowNumber, dateReceived);
        if (!existing?.data["Receipt No"]) await updateRow(TAB.receipts, rowNumber, { "Receipt No": receiptNo });
        await updateRow(TAB.donations, target.row, { "Receipt No": receiptNo }, donations.headers);
      }

      const sent = await sendMail({
        to: d["Email"],
        ...donationReceipt({
          ...emailDataFromRow(d),
          receiptNo,
          dateReceived: dateReceived.slice(0, 10),
          donationType: "Others",
        }),
      });
      if (!sent) throw new Error("Receipt email could not be sent (check SMTP settings)");

      await updateRow(
        TAB.donations,
        target.row,
        { "Receipt Sent At": istTimestamp(), Status: STATUS.receiptSent },
        donations.headers,
      );
      processed.push({ ref: d["Ref"], receiptNo });
      await logEvent("receipts", "receipt-sent", d["Ref"], "ok", receiptNo);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      failed.push({ ref: d["Ref"], error: message });
      await logEvent("receipts", "receipt-failed", d["Ref"], "error", message);
    }
  }
  return { processed, failed };
}

/** Donations reported by donors but not yet checked by staff, older than `hours`. */
export async function staleReportedDonations(hours = 24) {
  const { rows } = await readRows(TAB.donations);
  const cutoff = istTimestamp(new Date(Date.now() - hours * 3600_000));
  return rows.filter((r) => r.data["Status"] === STATUS.reported && (r.data["Reported At"] || "") < cutoff);
}
