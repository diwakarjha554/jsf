import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/sections/legal-page";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for using the Jeevansphere Foundation website and making donations.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="15 November 2026">
      <p>
        These terms apply to your use of this website, operated by {site.legal.legalName}, a {site.legal.type.toLowerCase()}{" "}
        with its registered office in Delhi. By using the site or making a donation, you agree to them.
      </p>
      <h2>Donations</h2>
      <ul>
        <li>Donations are voluntary contributions to support the foundation&apos;s charitable objectives. They are not payment for any goods or services.</li>
        <li>Donations are made by UPI or bank transfer directly to the foundation&apos;s bank account. We confirm each payment against our bank statement before issuing a receipt.</li>
        <li>
          We accept donations only from Indian citizens, from their own funds.
          {!site.legal.fcraRegistered && " The foundation is not registered under the Foreign Contribution (Regulation) Act, 2010, and cannot accept foreign contributions."}{" "}
          By donating you confirm this declaration is true.
        </li>
        <li>
          {site.legal.tax80g.enabled
            ? "Donations are eligible for deduction under section 80G as stated on the receipt. Tax benefits depend on the details you provide (including PAN) and on applicable law."
            : "The foundation's 80G approval is in process. Until it is granted, donations do not qualify for a tax deduction."}
        </li>
        <li>We direct donations to the cause you choose wherever possible. If a cause is fully funded, we may use your gift for our other charitable objectives.</li>
        <li>Refunds are covered by our <Link href="/refund-policy">Refund Policy</Link>.</li>
      </ul>
      <h2>Accuracy of information</h2>
      <p>
        You agree to give accurate information in our forms. We may decline or return a donation if we can&apos;t verify
        it, or if we believe it breaks the law.
      </p>
      <h2>Website content</h2>
      <p>
        Content on this site belongs to the foundation unless stated otherwise. You may share it for non-commercial
        purposes with credit. We try to keep information accurate and up to date, but it may change without notice.
      </p>
      <h2>Liability</h2>
      <p>
        We are not responsible for losses caused by payment errors in your UPI or bank app, by sending money to the wrong
        UPI ID or account, or by websites we link to. Always check that the payee name is &quot;{site.donation.payeeName}&quot;
        before paying.
      </p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. Courts in Delhi have exclusive jurisdiction.</p>
      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>
    </LegalPage>
  );
}
