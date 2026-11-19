/**
 * Organisation details used across the site, emails and receipts.
 * Everything marked [TBD] must be filled in by the foundation before launch
 * (see docs/07-content-checklist.md). Search the repo for "[TBD]".
 */

export const TBD = "[TBD]";

export const site = {
  name: "Jeevansphere Foundation",
  shortName: "Jeevansphere",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  // DRAFT: foundation to approve the tagline and mission line.
  tagline: "Education, health and dignity for every life we touch.",
  mission:
    "We work with communities across India for quality education, accessible healthcare, social welfare and the celebration of our shared cultural heritage.",
  description:
    "Jeevansphere Foundation is a Delhi-based non-profit (Section 8 company) working for education, healthcare, social welfare, community development and India's cultural heritage.",

  legal: {
    legalName: "Jeevansphere Foundation",
    type: "Section 8 company under the Companies Act, 2013",
    shortType: "Section 8 non-profit",
    cin: TBD,
    pan: TBD,
    incorporatedYear: "2026",
    registeredOffice: `${TBD}, Delhi`,
    areaOfOperation: "All of India",
    /** Turn on only after the 80G approval is issued. Controls tax wording and the PAN fields. */
    tax80g: {
      enabled: false,
      approvalNumber: "",
      validFrom: "",
      validTo: "",
    },
    csr1: "",
    ngoDarpan: "",
    fcraRegistered: false,
  },

  contact: {
    email: "info@jeevansphere.org", // [TBD] confirm the public inbox
    phone: TBD,
    /** Digits only with country code, e.g. "919812345678". Empty hides the WhatsApp button. */
    whatsapp: "",
    hours: "Monday to Saturday, 10:00 am – 6:00 pm",
    addressLines: [TBD, "New Delhi, Delhi"],
    mapEmbedUrl: "",
    mapLink: "",
  },

  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    linkedin: "",
    x: "",
  },

  donation: {
    /** UPI ID linked to the foundation's current account (preferably a business/merchant UPI ID). */
    upiId: "[TBD]@upi",
    payeeName: "Jeevansphere Foundation",
    presets: [501, 1100, 2100, 5100, 11000],
    minAmount: 100,
    maxAmount: 200000,
    bank: {
      accountName: "Jeevansphere Foundation",
      accountNumber: TBD,
      ifsc: TBD,
      bankName: TBD,
      branch: TBD,
      accountType: "Current account",
    },
    /** Working days within which staff confirm a UPI/bank payment and send the receipt. */
    confirmationDays: 2,
    refundWindowDays: 7,
  },

  signatory: {
    name: TBD,
    designation: "Director",
  },
} as const;

export function isPlaceholder(value: string | undefined | null) {
  return !value || value.includes(TBD);
}

export function socialLinks() {
  return Object.entries(site.social).filter(([, href]) => Boolean(href)) as [
    keyof typeof site.social,
    string,
  ][];
}
