import type { z } from "zod";
import { autoReply, teamAlert, type Rendered } from "@/emails/templates";
import { FALLBACK_ERROR, json, notConfiguredResponse, readJson, storageChannels } from "@/lib/api";
import { sheetsConfigured } from "@/lib/env";
import { logEvent } from "@/lib/log";
import { sendMail, sendToTeam } from "@/lib/mail";
import {
  contactSchema,
  fieldErrors,
  newsletterSchema,
  normalisePhone,
  partnerSchema,
  volunteerSchema,
  type ContactInput,
  type NewsletterInput,
  type PartnerInput,
  type VolunteerInput,
} from "@/lib/schemas";
import { appendRow, readRows, TAB, type RowRecord } from "@/lib/sheets";
import { checkSpam, stripSpamFields } from "@/lib/spam";
import { istTimestamp } from "@/lib/utils";

type FormDef<T> = {
  schema: z.ZodType<T>;
  tab: string;
  toRow: (d: T) => RowRecord;
  team?: (d: T) => Rendered;
  reply?: (d: T) => Rendered;
  replyTo?: (d: T) => string;
  email: (d: T) => string;
  name: (d: T) => string;
  beforeSave?: (d: T) => Promise<"skip" | void>;
};

const contact: FormDef<ContactInput> = {
  schema: contactSchema,
  tab: TAB.contact,
  toRow: (d) => ({
    "Submitted At": istTimestamp(),
    Name: d.name,
    Email: d.email,
    Phone: normalisePhone(d.phone),
    Subject: d.subject,
    Message: d.message,
    Status: "New",
  }),
  team: (d) =>
    teamAlert(`New enquiry: ${d.subject} — ${d.name}`, "Someone has written to us through the website's contact form.", [
      ["Name", d.name],
      ["Email", d.email],
      ["Phone", normalisePhone(d.phone)],
      ["Subject", d.subject],
      ["Message", d.message],
    ]),
  reply: (d) =>
    autoReply(d.name, "We've received your message", [
      "Thank you for writing to Jeevansphere Foundation. We've received your message and someone from our team will get back to you within two working days.",
      `For reference, you wrote: "${d.message.length > 300 ? `${d.message.slice(0, 300)}…` : d.message}"`,
    ]),
  email: (d) => d.email,
  name: (d) => d.name,
};

const volunteer: FormDef<VolunteerInput> = {
  schema: volunteerSchema,
  tab: TAB.volunteers,
  toRow: (d) => ({
    "Submitted At": istTimestamp(),
    Name: d.name,
    Email: d.email,
    Phone: normalisePhone(d.phone),
    City: d.city,
    "Age Group": d.ageGroup,
    Type: d.type,
    Interests: d.interests.join(", "),
    Availability: d.availability,
    Skills: d.skills,
    Message: d.message,
    "Guardian Consent": d.ageGroup === "Under 18" ? (d.guardianConsent ? "Yes" : "No") : "",
    Status: "New",
  }),
  team: (d) =>
    teamAlert(`New ${d.type.toLowerCase()} sign-up — ${d.name}, ${d.city}`, "A new volunteer has signed up on the website.", [
      ["Name", d.name],
      ["Email", d.email],
      ["Phone", normalisePhone(d.phone)],
      ["City", d.city],
      ["Age group", d.ageGroup],
      ["Wants to", d.type],
      ["Interests", d.interests.join(", ")],
      ["Availability", d.availability],
      ["Skills", d.skills],
      ["Message", d.message],
    ]),
  reply: (d) =>
    autoReply(d.name, "Thank you for signing up to volunteer", [
      `Thank you for offering your time to Jeevansphere Foundation as ${d.type === "Intern" ? "an intern" : "a volunteer"}. People like you make our work possible.`,
      "Our volunteer coordinator will contact you within a week to talk about how you'd like to help and what's coming up.",
    ]),
  email: (d) => d.email,
  name: (d) => d.name,
};

const partner: FormDef<PartnerInput> = {
  schema: partnerSchema,
  tab: TAB.partners,
  toRow: (d) => ({
    "Submitted At": istTimestamp(),
    Organisation: d.organisation,
    "Organisation Type": d.orgType,
    "Contact Person": d.contactPerson,
    Designation: d.designation,
    Email: d.email,
    Phone: normalisePhone(d.phone),
    Website: d.website,
    Interest: d.interests.join(", "),
    Message: d.message,
    Status: "New",
  }),
  team: (d) =>
    teamAlert(`Partnership enquiry — ${d.organisation}`, "An organisation wants to partner with us.", [
      ["Organisation", d.organisation],
      ["Type", d.orgType],
      ["Contact person", d.contactPerson],
      ["Designation", d.designation],
      ["Email", d.email],
      ["Phone", normalisePhone(d.phone)],
      ["Website", d.website],
      ["Interested in", d.interests.join(", ")],
      ["Message", d.message],
    ]),
  reply: (d) =>
    autoReply(d.contactPerson, "Thank you for reaching out to Jeevansphere Foundation", [
      `Thank you for your interest in partnering with Jeevansphere Foundation on behalf of ${d.organisation}.`,
      "We've shared your message with our partnerships team, who will get in touch within three working days to set up a conversation.",
    ]),
  email: (d) => d.email,
  name: (d) => d.contactPerson,
};

const newsletter: FormDef<NewsletterInput> = {
  schema: newsletterSchema,
  tab: TAB.newsletter,
  toRow: (d) => ({
    "Subscribed At": istTimestamp(),
    Email: d.email,
    Name: d.name,
    "Source Page": d.source,
    Status: "Subscribed",
  }),
  reply: (d) =>
    autoReply(d.name || "friend", "Welcome to Jeevansphere Foundation updates", [
      "Thank you for subscribing. We'll write about once a month with news of our programmes, upcoming events and ways to get involved.",
      "If you ever want to stop receiving these emails, just reply with \"unsubscribe\".",
    ]),
  email: (d) => d.email,
  name: (d) => d.name,
  beforeSave: async (d) => {
    if (!sheetsConfigured()) return;
    const { rows } = await readRows(TAB.newsletter);
    if (rows.some((r) => r.data["Email"]?.toLowerCase() === d.email && r.data["Status"] !== "Unsubscribed")) return "skip";
  },
};

const FORMS: Record<string, FormDef<unknown>> = {
  contact: contact as unknown as FormDef<unknown>,
  volunteer: volunteer as unknown as FormDef<unknown>,
  partner: partner as unknown as FormDef<unknown>,
  newsletter: newsletter as unknown as FormDef<unknown>,
};

export async function POST(request: Request, ctx: { params: Promise<{ form: string }> }) {
  const { form } = await ctx.params;
  const def = FORMS[form] as FormDef<unknown> | undefined;
  if (!def) return json({ ok: false, message: "Unknown form." }, 404);

  const body = await readJson(request);
  if (!body) return json({ ok: false, message: "Invalid request." }, 400);

  const verdict = await checkSpam(body, request);
  if (verdict === "bot") return json({ ok: true });
  if (verdict === "captcha-failed") {
    return json({ ok: false, message: "Please complete the security check and try again." }, 400);
  }

  const parsed = def.schema.safeParse(stripSpamFields(body));
  if (!parsed.success) {
    return json({ ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) }, 400);
  }
  const data = parsed.data;

  try {
    if (def.beforeSave && (await def.beforeSave(data)) === "skip") return json({ ok: true });
  } catch (err) {
    console.error(`[forms:${form}] beforeSave failed`, err);
  }

  const channels = storageChannels();
  if (channels === "none") return notConfiguredResponse(`forms:${form}`, data);

  const team = def.team?.(data);
  const [saved, alerted] = await Promise.all([
    sheetsConfigured()
      ? appendRow(def.tab, def.toRow(data)).then(
          () => true,
          (err) => {
            console.error(`[forms:${form}] Sheet write failed`, err);
            return false;
          },
        )
      : Promise.resolve(false),
    team ? sendToTeam({ ...team, replyTo: def.email(data) }) : Promise.resolve(false),
  ]);

  if (!saved && !alerted) {
    await logEvent(`form:${form}`, "submission-lost", def.email(data), "error", "Sheet and email both failed");
    return json({ ok: false, message: FALLBACK_ERROR }, 500);
  }

  const reply = def.reply?.(data);
  if (reply) await sendMail({ ...reply, to: def.email(data) });

  return json({ ok: true });
}
