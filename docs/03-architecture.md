# 03 · Architecture

## Stack

| Part | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) with TypeScript | Static pages and API routes in one project; well supported on Vercel. Cache Components and Partial Prefetching are on |
| Styling | Tailwind CSS 4. The theme, fluid type scale, gradients and animations are in `src/app/globals.css` | Quick to build with; small CSS output |
| Fonts | Bricolage Grotesque (headings), Instrument Serif italic (highlighted words) and Plus Jakarta Sans (text), through `next/font` | Self-hosted at build time, so pages make no request to Google Fonts |
| Motion | framer-motion 14, GSAP 3 (ScrollTrigger and SplitText) and Lenis smooth scroll, plus CSS keyframes. Hero entrances are pure CSS, so content shows even without JavaScript | Premium scroll and hover effects. Every effect respects reduced motion |
| Component libraries | Adapted components from **Vengeance UI** (MIT) and the free tier of **Skiper UI** (attribution in the footer), in `src/components/vendor/`. See `THIRD_PARTY_NOTICES.md` | Proven effects, recoloured to the brand, each file credited |
| Icons | lucide-react; brand logos are small inline SVGs | lucide-react v1 no longer ships brand icons |
| Validation | Zod 4 (`src/lib/schemas.ts`) | One schema checks the form in the browser and again in the API |
| Data store | Google Sheets API v4, accessed with a service account. Plain `fetch` and a JWT signed with Node `crypto`, no SDK | No database; staff already know Sheets |
| Email | Nodemailer over SMTP | Works with Gmail, Google Workspace, Zoho, Resend or Brevo. Changing provider means changing env vars, not code |
| Payments | UPI QR code (the `qrcode` package, generated in the browser) and a `upi://pay` deep link | ₹0. No gateway |
| Confirmation | Staff edit in the Sheet. A Google Apps Script trigger then calls the site, which sends the receipt | Free; works without a webhook |
| Spam protection | Hidden honeypot field, timing check, optional Cloudflare Turnstile | Free; works without a database |
| Hosting | Vercel (Hobby plan) | Free, and pushing to Git deploys the site. See open question 1 in the [README](README.md#open-questions) |
| Scheduled job | Vercel Cron, once a day | Safety net for receipts, plus reminders to the team |
| Content | TypeScript files in `src/content/` | No paid CMS; edits go through Git |

## How the pieces connect

```
Visitor ──► Vercel CDN ──► static pages (Home, About, Our work, Donate UI, …)      no server cost
   │
   ├─ form submit ──► /api/forms/[form] ──┬─► Google Sheet (append row)
   │                                       └─► SMTP (team alert + auto-reply)
   │
   ├─ donate step 2 ─► /api/donations/start ──► Sheet "Donations" (Awaiting payment) → reference
   │     QR / UPI deep link in the browser ──► donor pays in their own UPI app → foundation's bank account
   └─ donate step 3 ─► /api/donations/report ─► Sheet (Payment reported) + emails (donor ack, team "verify")

Staff set Status = Confirmed in the Sheet ─► Apps Script onEdit ─► /api/admin/receipts ─┬─► Sheet "Receipts"
(optional) Apps Script reads bank-alert emails, auto-confirms ──────────────────────────┘    + receipt email
Vercel Cron (daily) ─► /api/cron/daily ─► pending receipts + "still to verify" reminder to the team
```

## Rendering

- All content pages, including the donate page's shell, are generated once at build time. Vercel serves them from its CDN, so they use no function invocations.
- The donation flow and thank-you page read the URL (`?cause=`, `?ref=`) with `useSearchParams` inside a `<Suspense>` boundary, so that part renders in the browser.
- Things that matter with Cache Components on:
  - Server components can't read the clock or randomness during prerender. The footer year uses `useSyncExternalStore` for this reason.
  - The old `dynamic` and `dynamicParams` route settings aren't available.
  - Dynamic routes need `generateStaticParams` (see `stories/[slug]`).
  - POST routes always run at request time.
- API routes run on the Node.js runtime, which provides `crypto`, SMTP and the Google sign-in.

## Folder layout

```
d:\BITROPIX\JSF
├── docs/                          these documents
├── google-apps-script/Code.gs     paste into the Sheet (Extensions → Apps Script)
├── scripts/setup-sheet.mjs        npm run sheet:setup: creates tabs, headers, dropdowns, protection
├── public/                        add images/ and documents/ here
├── src/
│   ├── app/
│   │   ├── layout.tsx             fonts, header, footer, floating Donate/WhatsApp, organisation schema
│   │   ├── page.tsx               Home
│   │   ├── about/, about/team/, our-work/ (+5 cause folders), events/, stories/, stories/[slug]/
│   │   ├── get-involved/ (+volunteer, partner), donate/ (+thank-you), transparency/, faq/, contact/
│   │   ├── privacy-policy/, terms-and-conditions/, refund-policy/, not-found.tsx
│   │   ├── sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
│   │   └── api/
│   │       ├── forms/[form]/route.ts        contact | volunteer | partner | newsletter
│   │       ├── donations/start/route.ts
│   │       ├── donations/report/route.ts
│   │       ├── admin/receipts/route.ts      called by the Apps Script
│   │       └── cron/daily/route.ts          called by Vercel Cron
│   ├── components/
│   │   ├── layout/    header, mobile-nav, footer, floating (mobile Donate bar + WhatsApp)
│   │   ├── sections/  page-hero, blocks (cause cards, CTAs, …), cause-page template, legal-page
│   │   ├── donate/    donate-flow (3 steps), upi-pay (QR, deep link, bank details), thank-you
│   │   ├── forms/     fields, use-form-submit, turnstile, contact/volunteer/partner/newsletter forms
│   │   └── ui/        button, layout, artwork (patterned placeholders), logo, misc, tones, icons
│   ├── content/       site.ts (organisation details, UPI, bank, 80G switch), causes.ts, faqs.ts,
│   │                  events.ts, team.ts, stories.ts, navigation.ts, options.ts
│   ├── emails/        templates.ts (team alerts, auto-replies, donation emails, receipt)
│   └── lib/           env, sheets, mail, donations, schemas, spam, upi, utils, log, api,
│                      sheet-schema.json (tab and column definitions shared with the setup script)
├── vercel.json        cron schedule
└── .env.example       every variable, with no secrets
```

## API routes

| Route | Method | Called by | What it does | Sheet tabs it writes | Emails |
|---|---|---|---|---|---|
| `/api/forms/[form]` | POST | The four forms | Spam check, validation, save | `Contact`, `Volunteers`, `Partners` or `Newsletter` | Team alert (not for the newsletter) and auto-reply |
| `/api/donations/start` | POST | Donate step 2 | Spam check, validation, creates a reference, saves the pledge | `Donations` (Awaiting payment) | None |
| `/api/donations/report` | POST | Donate step 3 | Saves the UTR. Rejects a UTR that's already used, or a reference with the wrong email | `Donations` (Payment reported) | Acknowledgement to the donor, "please verify" to the team |
| `/api/admin/receipts` | POST | The Apps Script, with `ADMIN_API_KEY` as a Bearer token | Issues receipts for `Confirmed` donations: one (`{ref}`) or all | `Receipts`, `Donations`, `System Log` | Receipt |
| `/api/cron/daily` | GET | Vercel Cron, with `CRON_SECRET` as a Bearer token | Sends pending receipts; reminds the team about unverified payments older than 24 hours | Same as above | Receipts, team summary |

If neither the Sheet nor SMTP is configured, the form and report routes behave differently by environment:
- **Local development:** they accept submissions and log them to the terminal, so the UI can be tested.
- **Production:** they return an error rather than silently losing data.

## Environment variables

These are set in Vercel → Project → Settings → Environment Variables. The file `.env.example` lists them all. Values starting with `NEXT_PUBLIC_` are visible in the browser.

| Variable | Example or note |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.jeevansphere.org`. Used in the sitemap, canonical URLs and emails |
| `GOOGLE_SHEET_ID` | From the Sheet URL: `/d/<id>/edit` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `website@<project>.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | From the service account's JSON key. Paste it with `\n` for line breaks |
| `SHEET_OWNER_EMAILS` | Optional. Comma-separated people allowed to edit the protected tabs |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | `smtp.gmail.com` / `465` / the mailbox / its app password |
| `MAIL_FROM` | `Jeevansphere Foundation <same-address@gmail.com>` |
| `ADMIN_EMAILS` | Comma-separated list of people who get alerts |
| `NEXT_PUBLIC_SHEET_URL` | Link to the Sheet, shown as a button in team emails |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Optional spam check |
| `CRON_SECRET` | A random string. Vercel sends it to the cron route |
| `ADMIN_API_KEY` | A random string. The same value goes in the Apps Script properties |

Organisation details that aren't secret live in `src/content/site.ts`: legal details, the 80G switch, contact details, the UPI ID, bank details, suggested amounts and the signatory.

## Security

- Secrets live only in env vars. `.env*` files are excluded from Git, except `.env.example`.
- Every API route checks its input with Zod on the server, whatever the browser sent.
- Rows are written with `valueInputOption=RAW`, so form text can never run as a formula in the Sheet.
- The admin and cron routes need a Bearer secret, compared in constant time.
- The donation report route protects against misuse:
  - A reference only works with the email it was created with.
  - A UTR can't be used for two donations.
  - Rows that are already Confirmed can't be changed.
- Security headers are set in `next.config.ts`: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and HSTS. There is no strict CSP yet; inline Next.js scripts would need nonces, which would make every page dynamic.
- Email templates escape every value the user typed.
- The Sheet is shared only with the service account and named staff, and `Receipts` is protected.

## Reliability without a database

| Failure | What happens |
|---|---|
| Sheet write fails on a form | The team alert email still goes out with all the data, and the visitor sees a success message |
| Email fails on a form | The row is still in the Sheet |
| Both fail | The visitor sees an error asking them to email the foundation, and the failure is logged |
| Sheet down at donate step 2 | The visitor still gets a reference; step 3 resends the full details and the row is added then |
| Receipt email fails | Status stays `Confirmed`. The next trigger or the daily cron retries, reusing the same receipt number |
| Apps Script not installed | Receipts go out once a day through the cron |

## Free-plan limits

- Vercel Hobby cron jobs run once a day, accurate to the hour. Functions can run for up to 300 seconds; these routes take one to three seconds.
- Static pages use no function invocations. Only form submissions, donations and the cron do.
- The Google Sheets API allows about 60 requests a minute for the service account. A form uses one or two requests; a donation uses about five across its steps.
- Gmail SMTP sends to about 500 recipients a day.
- Apps Script free quotas are far above this site's needs: triggers, UrlFetch, and reading Gmail every 15 minutes.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Local development at http://localhost:3000 |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run sheet:setup` | Creates and formats the Sheet tabs (reads `.env.local`) |
