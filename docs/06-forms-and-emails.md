# 06 · Forms and emails

## Rules for every form

- Each form is checked in the browser for quick feedback, and again on the server with the same Zod schema.
- Spam protection: a hidden honeypot field (named `homepage`), a minimum time of about 2.5 seconds from first focus to submit, and Cloudflare Turnstile if its keys are set. Submissions caught as spam get a normal-looking "OK" but are thrown away.
- A required consent checkbox: "I agree to Jeevansphere Foundation storing these details to respond to me, as described in the Privacy Policy."
- Field formats:
  - Phone: a 10-digit Indian mobile number, with optional `+91`.
  - Email: the standard format.
  - Text fields: spaces trimmed, with length limits.
- After the form is sent, a success message appears on the page without a reload. The button is disabled while sending so it can't be clicked twice.

## Forms

### Contact `/contact`
Saved to tab `Contact`.

| Field | Type | Required |
|---|---|---|
| Name | text (2–80 characters) | Yes |
| Email | email | Yes |
| Phone | tel | No |
| Subject | select: General / Donation query / Volunteering / Partnership / Media / Other | Yes |
| Message | textarea (10–2,000 characters) | Yes |

### Volunteer / internship `/get-involved/volunteer`
Saved to tab `Volunteers`.

| Field | Type | Required |
|---|---|---|
| Name, Email, Phone | text, email, tel | Yes |
| City | text | Yes |
| Age group | select: Under 18 / 18–25 / 26–40 / 41–60 / 60+ | Yes |
| I want to | select: Volunteer / Intern | Yes |
| Areas of interest | checkboxes: the five focus areas, plus Events, Fundraising, Digital/Design, Teaching, Medical | At least one |
| Availability | select: Weekdays / Weekends / Flexible / Remote only | Yes |
| Skills / experience | textarea (up to 1,000 characters) | No |
| Why do you want to join? | textarea (up to 1,000 characters) | No |
| "My parent or guardian agrees" | checkbox, shown only for Under 18 | Yes, if under 18 |

### Partnership / CSR `/get-involved/partner`
Saved to tab `Partners`.

| Field | Type | Required |
|---|---|---|
| Organisation name | text | Yes |
| Organisation type | select: Company (CSR) / NGO / Educational institution / Government body / Hospital / Other | Yes |
| Contact person | text | Yes |
| Designation | text | No |
| Email, Phone | email, tel | Yes |
| Website | URL | No |
| Interested in | checkboxes: CSR funding / Programme partnership / In-kind support / Employee volunteering / Event sponsorship / Other | At least one |
| Message | textarea | Yes |

### Newsletter (footer and home page)
Saved to tab `Newsletter`. Email is required and name is optional. If an email is already subscribed, the site quietly skips it.

### Donation `/donate` (three steps)

The full flow is described in [04](04-donations.md).

**Step 1, amount**

| Field | Type | Required |
|---|---|---|
| Cause | buttons: Where it's needed most, plus the five focus areas. Pre-filled from `?cause=` | Yes |
| Amount | buttons for ₹501 / ₹1,100 / ₹2,100 / ₹5,100 / ₹11,000, or "Other". Pre-filled from `?amount=` | Yes; whole rupees from ₹100 to ₹2,00,000 |
| Dedicate this donation | checkbox, then a type (in honour of / in memory of / occasion) and a name or occasion | No |

**Step 2, details**

| Field | Type | Required |
|---|---|---|
| Full name | text | Yes |
| Email | email | Yes; the receipt goes here |
| Mobile | tel | Yes |
| "I want an 80G receipt" | checkbox, shown only when `tax80g.enabled` is true in `site.ts` | No |
| PAN | `AAAAA9999A`, changed to capitals | Yes, if an 80G receipt is wanted |
| Address, City, State, PIN code | text, and a state dropdown | Yes, if an 80G receipt is wanted, because Form 10BD needs them |
| "I am an Indian citizen and this donation is from my own funds" | checkbox | Yes (FCRA) |
| Agree to Terms and Privacy Policy | checkbox | Yes |

**Step 3, payment**

| Field | Type | Required |
|---|---|---|
| Payment method | tabs: UPI (recommended) / Bank transfer | Yes |
| UTR / transaction ID | letters and digits, 6–30 characters (12 digits for UPI) | Yes |

The suggested amounts end in 1 (₹501, ₹1,100 and so on), a common Indian practice for auspicious offerings. The foundation can change them in `src/content/site.ts`.

## Emails

Emails are sent through SMTP from the `MAIL_FROM` address. Each one has an HTML version with the logo and a plain-text version.
- When someone replies to an auto-reply, the reply goes to the foundation's main inbox (`Reply-To`).
- Team alerts set `Reply-To` to the person who filled in the form, so staff can simply press Reply.

| Trigger | To | Subject |
|---|---|---|
| Contact form | Team | New enquiry: {subject} — {name} |
| Contact form | Sender | We've received your message |
| Volunteer form | Team | New {volunteer/intern} sign-up — {name}, {city} |
| Volunteer form | Sender | Thank you for signing up to volunteer |
| Partner form | Team | Partnership enquiry — {organisation} |
| Partner form | Sender | Thank you for reaching out to Jeevansphere Foundation |
| Newsletter signup | Subscriber | Welcome to Jeevansphere Foundation updates (optional) |
| Donor reports payment (step 3) | Donor | We've received your donation details ({ref}) |
| Donor reports payment (step 3) | Team | Please verify: ₹{amount} via {UPI/Bank transfer}, UTR {utr} (with step-by-step instructions and a link to the Sheet) |
| Staff set Status to Confirmed | Donor | Your donation receipt {receipt no} |
| Daily cron finds pending receipts, failures or unverified payments | Team | Daily donation check: {n} items to note |

## Sending limits

| Provider | Free limit (approximate) | Notes |
|---|---|---|
| Gmail with an app password | About 500 recipients a day | The easiest start. The account needs 2-Step Verification, and emails show the Gmail address as sender. |
| Google Workspace | About 2,000 a day | Emails come from the foundation's own domain. Google offers Workspace free to eligible non-profits. |
| Resend or Brevo (over SMTP) | Free tiers with daily limits | Best at keeping emails out of spam on the foundation's domain; needs DNS records. |

Start with Gmail or Google Workspace; moving later is only an env-var change. Once the site has its own domain, add SPF, DKIM and DMARC records so receipts don't land in spam.
