# 01 · Project brief

## The organisation

Everything in this table comes from the signed e-MOA (Form INC-13), unless marked *needed*. Items marked *needed* are not in the MOA and must come from the foundation.

| | |
|---|---|
| Legal name | Jeevansphere Foundation |
| Legal form | Section 8 company under the Companies Act, 2013 (not-for-profit), limited by shares |
| Registered office | State of Delhi. Full address *needed* |
| Area of operation | Whole of India (MOA clause 4) |
| Use of income | Used only for the MOA objects. No dividend or profit goes to members (clause 5) |
| Accounts | Audited every year (clause 9) |
| MOA signed | 31 May 2026, by the four subscribers |
| Founding members (subscribers) | Prashant Prashar, Shubham Gupta, Deepti Gupta, Priyanka Gupta |
| CIN, foundation PAN, date of incorporation | *needed* |
| 12A / 80G / CSR-1 / NGO Darpan | *needed* (status and numbers) |
| FCRA | Assumed not registered, as the company is new. See [04](04-donations.md#legal-and-compliance) |

> The MOA also lists the subscribers' home addresses and their PAN and DIN numbers. None of that goes on the website.

## What the MOA says the foundation does

The site's "Our work" section is built from the main objects in clause 3(a). Supporting areas come from clause 3(b).

| Focus area (site) | MOA basis | What it covers |
|---|---|---|
| Education & Skills | 3(a) 1–3 | Primary to higher education, technical and vocational training, skill development and digital literacy, for marginalised and economically disadvantaged groups. Schools, colleges, vocational and digital learning centres, libraries. Scholarships, study material, digital devices, mid-day meals, transport, infrastructure. Teacher training and curriculum development |
| Healthcare & Wellness | 3(a) 5 | Hospitals, clinics, diagnostic centres, dispensaries. Awareness of hygiene, nutrition, sanitation, mental health and preventive care, through workshops, seminars and campaigns |
| Social Welfare | 3(a) 4 | Poverty alleviation, access to healthcare, livelihood generation, women's empowerment, child welfare, care of senior citizens; community mobilisation |
| Culture & Heritage | 3(a) 4 | Ram Leela, spiritual gatherings, religious events, festivals, devotional programmes |
| Community Development | 3(b) 1 | Hunger and food security, gender equality, agriculture and natural resources, slum development, environment, renewable energy, water resources, income and livelihoods |

Other MOA clauses that shape the site:

| Clause | Says | Site feature |
|---|---|---|
| 3(b) 2, 18, 19 | Work with academic, government, NGO, CBO, CSO and corporate partners | Partner / CSR page and form |
| 3(b) 4 | Run seminars, workshops, conferences and awareness programmes | Events page |
| 3(b) 5, 6 | Do research; act as a resource centre | Resources page (phase 4) |
| 3(b) 8 | Offer vocational and educational guidance and counselling | Mentioned under Education |
| 3(b) 12, 13, 20 | Raise funds; accept donations, grants and gifts | Donate page |
| 3(b) 31 | Engage volunteers and interns | Volunteer / internship form |

## Goals for the website

1. Explain clearly who the foundation is and what it works on.
2. Make donating easy and safe, and send a receipt every time.
3. Turn visitors into volunteers, interns and partners (including companies giving CSR funds).
4. Show the foundation is legitimate: registration, policies, transparency. Payment gateways check for this too.
5. Give the team one place, the Google Sheet, to follow up every enquiry and donation.

## Audiences

| Audience | Wants | Main pages |
|---|---|---|
| Individual donors in India | Trust, a quick way to pay, a receipt, a tax benefit if available | Home, Donate, Transparency, FAQ |
| Volunteers and students | What they can do and how to sign up | Get involved, Volunteer, Events |
| Company CSR teams, institutions, other NGOs | Legal status, focus areas, registrations (CSR-1, 12A/80G) | About, Transparency, Partner |
| Local community in Delhi | Upcoming events such as Ram Leela; contact details | Events, Contact |
| Payment gateway and bank reviewers | Contact details, policies, a clear description of what donors pay for | Contact, policies, Donate |

## Content rules

- **No invented numbers.** The foundation is newly incorporated, so no claims like "10,000 lives impacted" until they are true. Placeholders in the build are marked `[TBD]`.
- **No tax claims before approval.** Don't mention 80G or tax savings until the certificate is issued. The switch for this is `tax80g.enabled` in `src/content/site.ts`.
- **Protect children's privacy.** Don't publish the names, schools or locations of children in photos. Get a guardian's consent for every photo of a child.
- **Consent on every form**, linking to the privacy policy.
- **Tone:** warm, plain and respectful. English first; Hindi is an open decision.
