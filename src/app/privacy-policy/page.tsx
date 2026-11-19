import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";
import { isPlaceholder, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Jeevansphere Foundation collects, uses and protects the personal information you share with us.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="15 November 2026">
      <p>
        {site.legal.legalName} (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what personal
        information we collect through this website, why, and how we protect it, in line with India&apos;s Digital
        Personal Data Protection Act, 2023 and the Information Technology Act, 2000.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Donations:</strong> name, email, mobile number, amount, cause, payment reference (UTR), and, if you ask for an 80G receipt, your PAN and address.</li>
        <li><strong>Volunteer and partner forms:</strong> name, contact details, city, age group, interests, skills and your message; for partners, your organisation&apos;s details.</li>
        <li><strong>Contact form and newsletter:</strong> name, email, phone (optional) and your message.</li>
        <li><strong>Technical data:</strong> basic, anonymous usage statistics (pages visited, device type) to improve the site. We don&apos;t use advertising cookies.</li>
      </ul>
      <p>We never see or store your UPI PIN, card details or bank login. UPI payments happen entirely inside your own UPI or bank app.</p>
      <h2>Why we use it</h2>
      <ul>
        <li>To match your payment, issue receipts and meet our legal and tax obligations (for example, reporting donations to the Income Tax Department where required).</li>
        <li>To respond to your enquiry, volunteer sign-up or partnership proposal.</li>
        <li>To send our newsletter, only if you subscribed. You can unsubscribe at any time.</li>
      </ul>
      <h2>Your consent</h2>
      <p>
        We process your data on the basis of the consent you give when you submit a form. You can withdraw consent at any
        time by emailing us; this won&apos;t affect records we must keep by law (such as donation receipts).
      </p>
      <h2>Where it&apos;s stored and who sees it</h2>
      <p>
        Submissions are stored in a Google Workspace spreadsheet owned by the foundation and sent to our team by email.
        Access is limited to authorised staff and volunteers who need it. We use trusted service providers (website
        hosting, Google, email) only to run this website. We don&apos;t sell or rent your information to anyone.
      </p>
      <h2>How long we keep it</h2>
      <p>
        Donation records are kept for at least eight years, as required for accounting and tax purposes. Other submissions
        are kept for as long as needed to respond and follow up, and reviewed every year.
      </p>
      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete your personal information, or raise a grievance, by writing to{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>. We&apos;ll respond within 30 days.
      </p>
      <h2>Children</h2>
      <p>
        Volunteers under 18 must have a parent or guardian&apos;s consent. We don&apos;t knowingly collect information
        from children for any other purpose, and we don&apos;t publish identifying details of the children we work with.
      </p>
      <h2>Changes</h2>
      <p>We may update this policy. The date at the top shows the latest version.</p>
      <h2>Contact</h2>
      <p>
        {site.legal.legalName}, {site.contact.addressLines.filter((line) => !isPlaceholder(line)).join(", ")}. Email:{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>
    </LegalPage>
  );
}
