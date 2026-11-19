// Shared validation for the browser and the API (Zod).
import { z } from "zod";
import { DONATION_CAUSES } from "@/content/causes";
import {
  AGE_GROUPS,
  AVAILABILITY,
  CONTACT_SUBJECTS,
  ORG_TYPES,
  PAID_VIA,
  PARTNER_INTERESTS,
  VOLUNTEER_INTERESTS,
  VOLUNTEER_TYPES,
} from "@/content/options";
import { site } from "@/content/site";
import { DONATION_REF_PATTERN } from "./upi";

const PHONE_RE = /^(\+?91)?[6-9]\d{9}$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PIN_RE = /^[1-9]\d{5}$/;

const cleanPhone = (s: string) => s.replace(/[\s-]/g, "");

const name = z.string().trim().min(2, "Please enter your name").max(80, "Please keep this under 80 characters");
const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address"));
const phone = z
  .string()
  .trim()
  .refine((s) => PHONE_RE.test(cleanPhone(s)), "Enter a valid 10-digit Indian mobile number");
const optionalPhone = z
  .string()
  .trim()
  .refine((s) => s === "" || PHONE_RE.test(cleanPhone(s)), "Enter a valid 10-digit Indian mobile number")
  .optional()
  .default("");
const optionalText = (max: number) => z.string().trim().max(max, `Please keep this under ${max} characters`).optional().default("");
const mustTick = (msg = "Please tick this box to continue") => z.boolean().refine((v) => v === true, msg);

export const contactSchema = z.object({
  name,
  email,
  phone: optionalPhone,
  subject: z.enum(CONTACT_SUBJECTS, "Please choose a subject"),
  message: z.string().trim().min(10, "Please write at least a few words").max(2000, "Please keep this under 2,000 characters"),
  consent: mustTick(),
});

export const volunteerSchema = z
  .object({
    name,
    email,
    phone,
    city: z.string().trim().min(2, "Please enter your city").max(60),
    ageGroup: z.enum(AGE_GROUPS, "Please choose your age group"),
    type: z.enum(VOLUNTEER_TYPES, "Please choose one"),
    interests: z.array(z.enum(VOLUNTEER_INTERESTS)).min(1, "Pick at least one area"),
    availability: z.enum(AVAILABILITY, "Please choose your availability"),
    skills: optionalText(1000),
    message: optionalText(1000),
    guardianConsent: z.boolean().optional().default(false),
    consent: mustTick(),
  })
  .superRefine((v, ctx) => {
    if (v.ageGroup === "Under 18" && !v.guardianConsent) {
      ctx.addIssue({ code: "custom", path: ["guardianConsent"], message: "A parent or guardian must agree for volunteers under 18" });
    }
  });

export const partnerSchema = z.object({
  organisation: z.string().trim().min(2, "Please enter the organisation's name").max(120),
  orgType: z.enum(ORG_TYPES, "Please choose a type"),
  contactPerson: name,
  designation: optionalText(80),
  email,
  phone,
  website: z
    .string()
    .trim()
    .max(200)
    .refine((s) => s === "" || /^https?:\/\/\S+\.\S+/.test(s) || /^\S+\.\S+$/.test(s), "Enter a valid website")
    .optional()
    .default(""),
  interests: z.array(z.enum(PARTNER_INTERESTS)).min(1, "Pick at least one"),
  message: z.string().trim().min(10, "Please tell us a little about your idea").max(2000),
  consent: mustTick(),
});

export const newsletterSchema = z.object({
  email,
  name: optionalText(80),
  source: optionalText(120),
});

const donorFields = {
  amount: z.coerce
    .number("Enter an amount")
    .int("Please enter a whole number of rupees")
    .min(site.donation.minAmount, `The minimum online donation is ₹${site.donation.minAmount}`)
    .max(site.donation.maxAmount, `For donations above ₹${site.donation.maxAmount.toLocaleString("en-IN")}, please contact us for bank details`),
  cause: z.enum(DONATION_CAUSES, "Please choose a cause"),
  name,
  email,
  phone,
  wants80g: z.boolean().optional().default(false),
  pan: z.string().trim().toUpperCase().optional().default(""),
  address: optionalText(250),
  city: optionalText(60),
  state: optionalText(60),
  pincode: z.string().trim().optional().default(""),
  dedicationType: z.enum(["", "honour", "memory", "occasion"]).optional().default(""),
  dedicationName: optionalText(80),
  citizen: mustTick("We can accept donations only from Indian citizens"),
  consent: mustTick(),
};

type DonorShape = {
  wants80g: boolean;
  pan: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  dedicationType: string;
  dedicationName: string;
};

function refineDonor(v: DonorShape, ctx: z.RefinementCtx) {
  if (v.pan && !PAN_RE.test(v.pan)) {
    ctx.addIssue({ code: "custom", path: ["pan"], message: "Enter a valid PAN, e.g. ABCDE1234F" });
  }
  if (v.pincode && !PIN_RE.test(v.pincode)) {
    ctx.addIssue({ code: "custom", path: ["pincode"], message: "Enter a valid 6-digit PIN code" });
  }
  if (v.wants80g && site.legal.tax80g.enabled) {
    if (!v.pan) ctx.addIssue({ code: "custom", path: ["pan"], message: "PAN is needed for an 80G receipt" });
    if (!v.address) ctx.addIssue({ code: "custom", path: ["address"], message: "Address is needed for an 80G receipt" });
    if (!v.city) ctx.addIssue({ code: "custom", path: ["city"], message: "City is needed for an 80G receipt" });
    if (!v.state) ctx.addIssue({ code: "custom", path: ["state"], message: "State is needed for an 80G receipt" });
    if (!v.pincode) ctx.addIssue({ code: "custom", path: ["pincode"], message: "PIN code is needed for an 80G receipt" });
  }
  if (v.dedicationType && !v.dedicationName) {
    ctx.addIssue({ code: "custom", path: ["dedicationName"], message: "Add a name or occasion, or untick the dedication" });
  }
}

export const donationStartSchema = z.object(donorFields).superRefine(refineDonor);

export const donationReportSchema = z
  .object({
    ...donorFields,
    ref: z.string().regex(DONATION_REF_PATTERN, "Missing donation reference. Please start again."),
    paidVia: z.enum(PAID_VIA, "Choose how you paid"),
    utr: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9]{6,30}$/, "Enter the transaction ID / UTR from your payment (letters and numbers only)"),
  })
  .superRefine(refineDonor);

export const amountOnlySchema = donorFields.amount;

export type ContactInput = z.infer<typeof contactSchema>;
export type VolunteerInput = z.infer<typeof volunteerSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type DonationStartInput = z.infer<typeof donationStartSchema>;
export type DonationReportInput = z.infer<typeof donationReportSchema>;

/** Turns Zod issues into { fieldName: firstMessage }. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function normalisePhone(raw: string) {
  const digits = cleanPhone(raw).replace(/^\+?91/, "");
  return digits ? `+91 ${digits}` : "";
}
