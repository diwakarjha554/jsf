import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "When and how Jeevansphere Foundation refunds donations made by mistake.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  const days = site.donation.refundWindowDays;
  return (
    <LegalPage title="Refund & Cancellation Policy" updated="15 November 2026">
      <p>
        We&apos;re grateful for every donation. Because donations go straight to our charitable work, they are generally
        not refundable. We will, however, refund donations made by mistake.
      </p>
      <h2>When we refund</h2>
      <ul>
        <li>You paid the same donation twice.</li>
        <li>You entered the wrong amount (for example ₹11,000 instead of ₹1,100).</li>
        <li>Money was debited but the payment didn&apos;t reach us. In this case your bank or UPI app usually reverses it automatically within a few working days.</li>
      </ul>
      <h2>How to ask for a refund</h2>
      <p>
        Email <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> within {days} days of the donation, with
        your donation reference (starting &quot;JSF-&quot;), the UPI transaction ID / UTR, the amount and the date. We&apos;ll reply
        within 3 working days.
      </p>
      <h2>How refunds are paid</h2>
      <p>
        Approved refunds are paid back to the same UPI ID or bank account the donation came from, within 7 working days of
        approval. We can&apos;t refund to a different person or account.
      </p>
      <h2>Receipts</h2>
      <p>
        If we&apos;ve already issued a receipt for a refunded donation, the receipt is cancelled and the donation won&apos;t
        be reported for tax purposes.
      </p>
    </LegalPage>
  );
}
