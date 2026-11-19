# 07 · Content checklist

This is what the foundation needs to provide. The site is built with placeholders: search the code for `[TBD]`, and most items go in `src/content/site.ts`. The site can't launch without the items marked **Launch**.

## Legal and registration

| Item | Used on | Priority |
|---|---|---|
| CIN and date of incorporation | Footer, About, receipts | Launch |
| Certificate of Incorporation (PDF) | Transparency | Launch |
| Section 8 licence (PDF) | Transparency | Launch |
| Foundation's PAN | Receipts, Transparency | Launch |
| Registered office address | Contact, footer, receipts, policies | Launch |
| FCRA status (registered or not) | FAQ, Donate | Launch |
| 12A/12AB and 80G status, numbers and validity (provisional or final) | Receipts, Donate, Transparency | As soon as available |
| CSR-1 registration number | Partner, Transparency | When available |
| NGO Darpan ID (from NITI Aayog; many government grants need it) | Transparency | Nice to have |

## Brand
- Logo: SVG preferred, or PNG at least 1,000 px wide. Also a version for dark backgrounds
- Brand colours and any preferred fonts. If there are none yet, the developer will propose some
- Tagline (one line)

## Text
- Our story: why the foundation was started (200–400 words)
- Vision (one sentence), mission (one to three sentences), and values (three to five, with one line each)
- For each focus area: what the foundation is doing now and plans next, and any real programmes
- **Approve or correct the draft copy already on the site:**
  - the tagline ("Every life deserves a fair start." / "Education, health and dignity for every life we touch.")
  - the mission, vision and values on About
  - the "Why we exist" text on Home
- **Approve the impact line under every donation amount**, for every cause, in `src/content/causes.ts`. These are promises to donors, so the costs must be real. For example: "₹1,100 can provide a school kit with bag, books and supplies".
- Team members: name, role, 50-word bio, photo, and each person's consent to appear
  - The MOA's founding members are Prashant Prashar, Shubham Gupta, Deepti Gupta and Priyanka Gupta. Confirm who should be listed and their titles.
- Events: name, date, venue, description and photo (for example Ram Leela, festivals, camps)
- FAQs specific to the foundation
- Review and approve the drafted privacy, terms and refund policies. The developer drafts them; ideally a CA or lawyer checks them

## Photos
- 10–20 good-quality landscape photos of real work, events and people, at least 1,600 px wide
- Consent from the people shown. For children, a guardian's consent, and no names or schools
- No stock photos presented as the foundation's own work

## Contact
- Public email (for example info@…), phone, WhatsApp number and office hours
- Google Maps link to the office
- Social media links

## Donations
- The foundation's current account: account name, number, IFSC, bank and branch (for the bank transfer section)
- **A business (merchant) UPI ID and QR for that current account.** Ask the bank. UPI apps sometimes show warnings, or block pre-filled pay links, for personal UPI IDs, and a personal ID must never be used.
- Turn on email alerts for credits to the current account, sent to the Google account that owns the Sheet. The optional bank-alert automation needs these ([04](04-donations.md#bank-alert-automation-optional)).
- Causes to show on the donation form. Default: the five focus areas plus "Where it's needed most"
- Suggested amounts. Default: ₹501 / ₹1,100 / ₹2,100 / ₹5,100 / ₹11,000
- The authorised signatory's name and designation, and a signature image for receipts
- Refund window. Default: 7 days

## Accounts (create these with a foundation email address)

| Account | Purpose | Who sets it up |
|---|---|---|
| Domain (for example jeevansphere.org) | Website and email | The foundation buys it; the developer sets up DNS |
| Google account | Owns the Sheet and the Google Cloud project | The foundation; add the developer as an editor during the build |
| GitHub organisation or account | Holds the code | The foundation; add the developer as a collaborator |
| Vercel | Hosting | The foundation, with the developer as a member. Or the developer transfers the project at handover |
| Email for sending (Gmail or Google Workspace) | Receipts and alerts | The foundation |
| Bank (business UPI ID, credit alerts) | Receiving donations | The foundation |
| Cloudflare (free) | Turnstile spam protection | The developer, using the foundation's email |
| Google Search Console and Google Business Profile | Search indexing and the Maps listing | The developer, using the foundation's email |

No payment gateway account is needed. If the foundation adds one later (see [04](04-donations.md#limits-and-whats-possible-later)), the gateway will ask for incorporation documents, the PAN, bank proof, KYC of the signatory, and a live website with policies; this site already has the policies.
