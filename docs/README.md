# Jeevansphere Foundation website: project docs

These are the planning and reference docs for the foundation's website. They are written from the signed MOA (e-MOA, Form INC-13). Version 2, 15 Nov 2026: donations moved from Razorpay to free UPI, and the UI is built.

**Status:** phase 1 built. The site runs locally with placeholder content. Next steps are the foundation's inputs ([07](07-content-checklist.md)) and setup ([08](08-deployment-and-go-live.md)).

## In one paragraph

The site is built in Next.js 16 and hosted on Vercel's free plan. Content pages are static. The contact, volunteer, partner and newsletter forms each save a row to a Google Sheet. They also email the team and the person who filled in the form.

Donations cost nothing to collect, because there is no payment gateway:
- The donor chooses an amount and pays the foundation's UPI ID, from a QR code or a "Pay with UPI app" button, then enters the transaction ID (UTR).
- Staff confirm the payment in the Sheet, or a free Apps Script confirms it automatically from bank-alert emails.
- The site then emails the donor a receipt.

There is no database: the bank statement is the record of money received, and the Google Sheet is the team's working copy.

## Docs

| # | Doc | What it answers |
|---|-----|-----------------|
| 01 | [Project brief](01-project-brief.md) | Who the foundation is (from the MOA), who the site is for, what it must say and must not claim |
| 02 | [Sitemap](02-sitemap.md) | Every page, its sections, forms and calls to action; navigation; SEO |
| 03 | [Architecture](03-architecture.md) | Stack, folder layout, API routes, environment variables, security, free-plan limits |
| 04 | [Donations](04-donations.md) | The UPI flow, how payments are confirmed, receipts, compliance, testing |
| 05 | [Google Sheet](05-google-sheet.md) | Tabs and columns, setup, the Apps Script, how staff manage it day to day |
| 06 | [Forms and emails](06-forms-and-emails.md) | Fields and validation for each form; every email the site sends |
| 07 | [Content checklist](07-content-checklist.md) | What the foundation must hand over (documents, text, photos, accounts) |
| 08 | [Deployment and go-live](08-deployment-and-go-live.md) | Setup of Google Cloud, Gmail, Vercel and Apps Script; launch checklist |
| 09 | [UI research and traffic plan](09-ui-research-and-growth.md) | What 10 Indian NGO and donation sites do, the design decisions taken from them, and a free plan for traffic |

## Key decisions

| Constraint | Decision | Doc |
|---|---|---|
| Free Vercel (Hobby) plan | Static pages for content; a handful of serverless API routes; one daily cron job | [03](03-architecture.md) |
| No budget for payment fees | UPI QR and deep link straight to the foundation's account; no gateway | [04](04-donations.md) |
| UPI doesn't notify the website | The donor reports the UTR. Staff confirm in the Sheet, or optionally an Apps Script confirms from bank alerts. The receipt is emailed on confirmation | [04](04-donations.md#bank-alert-automation-optional) |
| No database | Google Sheet through a service account. Columns are matched by header name, so staff can add their own columns | [05](05-google-sheet.md) |
| Email needed | SMTP through Nodemailer. Start with a Gmail app password; changing provider only means changing env vars | [06](06-forms-and-emails.md) |
| Not registered under FCRA | Indian citizens only, declared on the form | [04](04-donations.md#legal-and-compliance) |
| Receipt numbers without a database | The row number in a protected `Receipts` tab | [04](04-donations.md#receipts) |
| The site needs traffic | Keyword-led page titles, structured data, a sitemap, cause and event pages, a stories hub, WhatsApp sharing | [09](09-ui-research-and-growth.md#free-traffic-plan) |

## Phases

| Phase | Scope | Status |
|---|---|---|
| 0. Inputs | Content, documents and accounts from [07](07-content-checklist.md) | Waiting on the foundation |
| 1. Build | All pages, the four forms, UPI donations, receipts, Sheet setup script, Apps Script, SEO | **Done** (placeholder content) |
| 2. Setup and launch | Google Cloud, Sheet, Gmail, Vercel, domain, Apps Script, Search Console | Next |
| 3. Grow | Stories twice a month, Google Business Profile, listings, events | After launch |
| 4. Later | Hindi, gallery, event registration, monthly-giving reminders, Form 10BD export, events managed from the Sheet, optional payment gateway | Backlog |

## Open questions

1. **Vercel's free plan and commercial use.** Vercel's docs say the Hobby plan is for "non-commercial, personal use only". Vercel's current pages don't say clearly whether a registered non-profit taking donations counts. Ask Vercel support for a written answer before launch. The code is standard Next.js and can move to another host.
2. **12A / 80G status.** Not applied, applied, provisional approval, or final approval? Set `tax80g` in `src/content/site.ts` to match.
3. **Domain and sending email.** Which domain, and which mailbox sends receipts?
4. **The foundation's UPI ID.** Ask the bank for a business (merchant) UPI ID and QR for the current account.
5. **Draft copy to approve.** The tagline, mission, values, and the impact line under every donation amount ([07](07-content-checklist.md#text)).
6. **Hindi.** Phase 4 by default. Bring it forward if most visitors will prefer it.
7. **Account ownership.** Register Vercel, GitHub, Google Cloud and the domain under the foundation's email, not the developer's.
