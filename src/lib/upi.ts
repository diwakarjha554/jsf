// Safe to import in the browser and on the server.

export const DONATION_REF_PATTERN = /^JSF-\d{6}-[2-9A-HJ-NP-Z]{4}$/;

/**
 * Builds a UPI deep link (NPCI "upi://pay" format) that every UPI app understands.
 * pa = payee UPI ID, pn = payee name, am = amount, cu = currency, tn = note shown to the payee.
 */
export function buildUpiUri({
  upiId,
  payeeName,
  amount,
  note,
}: {
  upiId: string;
  payeeName: string;
  amount: number;
  note: string;
}) {
  const parts = [
    `pa=${upiId.trim()}`,
    `pn=${encodeURIComponent(payeeName)}`,
    `am=${amount.toFixed(2)}`,
    "cu=INR",
    `tn=${encodeURIComponent(note.slice(0, 50))}`,
  ];
  return `upi://pay?${parts.join("&")}`;
}

export function donationNote(ref: string) {
  return `${ref} Donation`;
}
