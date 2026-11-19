import { site } from "./site";

export type Faq = { q: string; a: string };

const days = site.donation.confirmationDays;
const tax = site.legal.tax80g;

export const donationFaqs: Faq[] = [
  {
    q: "How do I donate?",
    a: "Choose an amount and a cause on the Donate page and enter your details. Then scan the QR code with any UPI app (Google Pay, PhonePe, Paytm, BHIM or your bank's app), or tap \"Pay with UPI app\" on your phone. After paying, enter the transaction ID (UTR) so we can match your payment.",
  },
  {
    q: "Is it safe to donate by UPI?",
    a: "Yes. You pay from your own UPI app straight into the foundation's bank account. We never see your UPI PIN, card or bank login. Always check that the payee name shown in your UPI app is Jeevansphere Foundation before you pay.",
  },
  {
    q: "Why UPI instead of card payments?",
    a: "UPI payments carry no payment-gateway fee, so the full amount you give reaches the foundation. It also works with every UPI app in India.",
  },
  {
    q: "When will I get my receipt?",
    a: `We check every payment against our bank statement. Your receipt is emailed as soon as your payment is confirmed, usually within ${days} working days.`,
  },
  {
    q: "What is the UTR or transaction ID, and where do I find it?",
    a: "It's the reference number of your payment, usually 12 digits for UPI. Open the payment in your UPI app's history; it's shown as UPI reference, UPI transaction ID or UTR. For bank transfers, it's the UTR shown in your bank's confirmation.",
  },
  tax.enabled
    ? {
        q: "Will I get a tax benefit under 80G?",
        a: `Yes. Donations to ${site.name} are eligible for deduction under section 80G (approval no. ${tax.approvalNumber}). Tick "I want an 80G receipt" and give your PAN and address. After the financial year ends, we file your donation with the Income Tax Department and send you Form 10BE by 31 May.`,
      }
    : {
        q: "Will I get a tax benefit under 80G?",
        a: "Not yet. The foundation is newly registered and its 80G approval is in process. Until it's approved, we can't offer a tax deduction. We'll update this page as soon as it is.",
      },
  {
    q: "Can I donate from outside India?",
    a: "We can accept donations only from Indian citizens, including Indian citizens living abroad who pay from an Indian bank account. The foundation isn't registered under the Foreign Contribution (Regulation) Act (FCRA), so it can't accept money from foreign nationals or foreign sources.",
  },
  {
    q: "Can I give by bank transfer or cheque?",
    a: "Yes. Bank details are on the Donate page. Use your donation reference in the remarks, and enter the UTR afterwards so we can match it. For cheques, please contact us first.",
  },
  {
    q: "Can I donate on a birthday, anniversary or in memory of someone?",
    a: "Yes. On the Donate page, tick \"Dedicate this donation\" and add the name or occasion. It's a meaningful way to mark birthdays, anniversaries, festivals or a loved one's memory.",
  },
  {
    q: "Can I get a refund?",
    a: `Donations are generally not refundable. If you paid twice or entered the wrong amount, email us within ${site.donation.refundWindowDays} days with your transaction ID and we'll help. See our Refund Policy for details.`,
  },
];

export const volunteerFaqs: Faq[] = [
  {
    q: "Who can volunteer?",
    a: "Anyone who wants to help. Volunteers under 18 need a parent or guardian's consent. You don't need experience; we'll match you with work that suits your skills and time.",
  },
  {
    q: "Do you offer internships?",
    a: "Yes, for students and recent graduates. Choose \"Intern\" on the volunteer form and tell us what you're studying and how long you're available.",
  },
  {
    q: "Can I volunteer remotely?",
    a: "Yes. Design, writing, social media, research and fundraising can all be done from home. Choose \"Remote only\" as your availability.",
  },
];

export const partnerFaqs: Faq[] = [
  {
    q: "Can companies support you through CSR?",
    a: site.legal.csr1
      ? `Yes. ${site.name} is registered with the Ministry of Corporate Affairs for CSR activities (CSR-1: ${site.legal.csr1}).`
      : "We're completing the registrations companies need for CSR funding (12A, 80G and CSR-1). Get in touch and we'll keep you updated, and can plan a partnership in the meantime.",
  },
  {
    q: "What kinds of partnerships do you offer?",
    a: "Programme partnerships, in-kind support, employee volunteering, event sponsorship and research collaborations with schools, hospitals, NGOs, companies and government bodies.",
  },
];
