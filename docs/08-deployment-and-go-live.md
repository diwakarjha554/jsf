# 08 · Deployment and go-live

## 0. Run it locally
1. Install Node.js 20 or later.
2. In the project folder, run `npm install`, then `npm run dev`, and open http://localhost:3000.
3. With no `.env.local`, every page and the donation flow still work. Form submissions are printed in the terminal instead of being saved.
4. Copy `.env.example` to `.env.local` and fill it in as you complete the steps below.

## 1. Google Cloud and the Sheet
1. Sign in with the foundation's Google account at [console.cloud.google.com](https://console.cloud.google.com) and create a new project, "jeevansphere-website".
2. Go to APIs & Services → Library → **Google Sheets API** → Enable.
3. Go to IAM & Admin → Service accounts → Create. Name it `website`. It needs no roles. Click Done.
4. Open the service account, then Keys → Add key → JSON. Keep the downloaded file safe and never commit it to Git.
5. From the JSON file, copy:
   - `client_email` into `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` into `GOOGLE_PRIVATE_KEY`, in quotes, keeping the `\n` sequences
6. Create the spreadsheet and copy its ID from the URL into `GOOGLE_SHEET_ID`. Copy the full URL into `NEXT_PUBLIC_SHEET_URL`.
7. Share the spreadsheet with the `client_email` address as an Editor.
8. Run `npm run sheet:setup`. It prints a ✓ for each tab.

You might see the error "iam.disableServiceAccountKeyCreation" when creating the key. If so, an admin of the Google Workspace or Cloud organisation must allow key creation for this project.

## 2. Email (Gmail app password)
1. Go to Google Account → Security and turn on 2-Step Verification.
2. In Security → App passwords, create one named "Website".
3. Set:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=465`
   - `SMTP_USER=<the address>`
   - `SMTP_PASS=<the 16-character app password>`
4. `MAIL_FROM` must use the same address, because Gmail replaces any other sender address.
5. Set `ADMIN_EMAILS` to the people who should get alerts.

## 3. Organisation details
Edit `src/content/site.ts`:
- **Legal:** CIN, PAN and registered office. Keep the 80G switch off until approval.
- **Contact:** email, phone, WhatsApp, address and map.
- **Donations:** **the UPI ID and the bank details**.
- **Signatory:** name and designation.
- **Socials:** links.

Then search the code for `[TBD]`.

## 4. Vercel
1. Push the code to a GitHub repository owned by the foundation.
2. In Vercel, choose Add New → Project and import the repo. Vercel detects Next.js automatically.
3. Add every env var from `.env.example` for Production and Preview. Create two long random strings for `CRON_SECRET` and `ADMIN_API_KEY`, for example by running `openssl rand -hex 32` in Git Bash.
4. Deploy. Every push to `main` updates the live site, and every other branch gets its own preview URL.
5. In Domains, add the domain (for example `jeevansphere.org` and `www.jeevansphere.org`). At the domain registrar, add the DNS records Vercel shows. Set `NEXT_PUBLIC_SITE_URL` to the final URL and redeploy.
6. The cron is already set in `vercel.json` (`30 3 * * *`: 03:30 UTC, so between 09:00 and 10:00 IST). Vercel sends `CRON_SECRET` automatically.

## 5. Apps Script in the Sheet
1. In the spreadsheet, open Extensions → Apps Script. Paste `google-apps-script/Code.gs` and save.
2. Under Project Settings → Script properties, add:
   - `SITE_URL` = the live site URL
   - `ADMIN_API_KEY` = the same value as in Vercel
   - optionally `BANK_ALERT_QUERY`, see [04](04-donations.md#bank-alert-automation-optional)
3. Select the function `installTriggers` and click Run. Approve the permissions; the warning screen appears because the script is your own and unverified.
4. Reload the Sheet. A **Jeevansphere** menu appears.

## 6. Search and analytics
- In Google Search Console, verify the domain and submit `https://<domain>/sitemap.xml`.
- Create a Google Business Profile for the office, so the foundation appears in "NGO near me" searches.
- Vercel Web Analytics has a free tier that counts visitors without cookies. Add Google Analytics (GA4) only if the foundation wants it.

## Launch checklist

**Content and legal**
- [ ] No `[TBD]` left (search the code for it)
- [ ] Draft copy and every donation impact line approved by the foundation
- [ ] Address, phone, email, CIN and PAN are correct everywhere
- [ ] The foundation has reviewed the policies, and the draft banner is removed from `src/components/sections/legal-page.tsx`
- [ ] 80G switch matches reality
- [ ] Every photo has consent; no children identifiable without a guardian's consent

**Forms**
- [ ] For each form: the row lands in the right tab, and both the team alert and the auto-reply arrive (check spam folders too)
- [ ] Turnstile works, if enabled

**Donations**
- [ ] The QR code scans in Google Pay, PhonePe, Paytm and BHIM, with the right amount and payee name
- [ ] "Pay with UPI app" opens a UPI app on Android and iPhone
- [ ] A real ₹1–₹10 donation works end to end: report the UTR, the team alert arrives, set Status to `Confirmed`, the receipt email arrives, and the `Receipts` row and number are correct
- [ ] Reusing the same UTR is rejected
- [ ] The daily cron runs (check Vercel → Cron Jobs → Run, and the `System Log` tab)
- [ ] The CA has checked what the receipt says

**Technical**
- [ ] `npm run build` and `npm run lint` pass
- [ ] Lighthouse scores of 90 or more for performance, accessibility and SEO on mobile
- [ ] No sideways scrolling at 360–390 px
- [ ] The link preview works (paste a link into WhatsApp)
- [ ] `sitemap.xml` and `robots.txt` show the real domain
- [ ] The Sheet is shared only with the service account and named staff

## Handover
- Transfer ownership of GitHub, Vercel, Google Cloud and the domain to the foundation, or confirm it already has it.
- Give staff a 15-minute walkthrough of the daily routine: filter "Payment reported", check the bank, set Confirmed.
- Write down where each secret is stored and who can replace it: the app password, the service account key, `CRON_SECRET` and `ADMIN_API_KEY`.
