# 09 · UI research and traffic plan

This doc reviews 10 Indian NGO and donation sites, fetched on 15 Nov 2026. It turns what they do well, and badly, into decisions for this site, then sets out a free plan for getting traffic.

## Sites reviewed

| # | Site | Read | Most useful lesson |
|---|---|---|---|
| 1 | Akshaya Patra (akshayapatra.org) | Home + donate | Preset amounts framed around one outcome ("feed a child for a year"); campaign cards with progress bars |
| 2 | Smile Foundation (smilefoundationindia.org) | Home + donate | A donate page per cause, each with one impact line. Fund-use split (85% project / 11% admin). Floating WhatsApp button |
| 3 | Goonj (goonj.org) | Home + donate | Indian/foreign donor split at the top of the donate page. Impact counters dated ("2014 to 2025") |
| 4 | Pratham (pratham.org) | Home + donate | Cause blocks with one headline outcome and one CTA. Stories of Change on the home page |
| 5 | Bal Raksha Bharat / Save the Children India (balrakshabharat.org) | Home + donate | **Registration strip (12A, 80G, CSR-1) at the top of every page.** Tax FAQ that lists the documents needed for 10BE |
| 6 | Uday Foundation, Delhi (udayfoundation.org) | Home + donate | **Every amount tied to a concrete outcome** ("₹1,100 feeds 50 people"). Giving for birthdays, death anniversaries and festivals. Local keywords in page titles ("Delhi NGO") |
| 7 | Nanhi Kali (nanhikali.org) | Home + donate | A unit cost (₹6,000 per girl per year) with a 95/5 fund disclosure |
| 8 | Teach For India (teachforindia.org) | Home + donate | Four problem statistics as the opening hook. FAQ on the donate page about tax, how money is used and when receipts arrive. Cites "Section 133 of the Income Tax Act, 2025" for the tax benefit |
| 9 | GiveIndia (giveindia.org) | Legal/financials page only | Audited accounts and registrations as downloadable PDFs |
| 10 | Milaap (milaap.org) | Home only (JavaScript-heavy) | A plain fee promise beside the main CTA ("0% platform fee"); a visible support phone number |

CRY and HelpAge India couldn't be read: one redirected, and the other's connection dropped. Ketto loads its content by JavaScript, so its text couldn't be read. None of the readable pages showed a UPI QR flow as text; most embed a gateway widget.

## What the strongest sites have in common

1. **Donate is always in the header**, and repeated in the hero and before the footer.
2. **Giving is organised by cause.** Each cause has one outcome line and one button.
3. **Amounts mean something.** "₹1,100 feeds 50 people" beats a bare "₹1,100".
4. **Trust is shown, not claimed.** Registration numbers, certificates as PDFs, a dated fund-use split, partner logos, annual reports.
5. **There are stories and updates.** Most have a stories, blog or news hub. It's also where search traffic comes from.
6. **Indian context.** WhatsApp contact, giving on occasions and festivals, 80G/10BE explained in a FAQ.

## Mistakes seen, to avoid

| Mistake | Seen on | What this site does instead |
|---|---|---|
| PAN, passport and Aadhaar asked up front | Goonj, Nanhi Kali | Ask for PAN only if the donor wants an 80G receipt, and only once 80G exists |
| Two donate buttons that go to different sites | Smile | One `/donate` page; `?cause=` pre-selects the cause |
| Payment moved to another domain | Pratham, Nanhi Kali | Donation happens on our own page |
| Impact figures that contradict each other | Smile, Bal Raksha Bharat | Figures live in one content file; no figure until it's real and dated |
| Cluttered navigation with old pages | Uday Foundation | Six top-level items at most (About, Our work, Events, Stories, Get involved, Contact) plus Donate |
| No small entry amount | Teach For India | Presets start at ₹501, with any custom amount from ₹100 |
| A broken page in production (PHP warning; images served from a test server) | Akshaya Patra, Nanhi Kali | Build checks and a launch checklist ([08](08-deployment-and-go-live.md)) |

## Design decisions for this site

| Decision | Why |
|---|---|
| Sticky header with a high-contrast **Donate** button, plus a bottom "Donate" bar on phones | Every top site keeps Donate one tap away; most Indian visitors are on phones |
| Thin trust strip above the header: "Section 8 non-profit · CIN … · 80G (when approved)" | Bal Raksha Bharat pattern; reassures donors and CSR teams immediately |
| Home page opens with a clear mission line and two CTAs (Donate, Volunteer). Next comes a "the need" band with sourced statistics | Teach For India's problem framing, without inventing our own impact numbers |
| Five cause cards, each with one outcome line and a "Donate to this cause" link | Pratham and Smile |
| Donation presets per cause, with an outcome line under each amount | Uday Foundation. The foundation must approve every outcome line before launch |
| A short, three-step donation flow: amount → details → pay by UPI | Avoids the long-form friction seen on Goonj and Nanhi Kali |
| Optional "Dedicate this donation" (birthday, in memory, festival) | Uday and Akshaya Patra; fits the foundation's cultural work |
| FAQ on the donate page covering receipt timing, tax, refunds, safety and UPI | Teach For India and Bal Raksha Bharat |
| Floating WhatsApp button | Smile and Bal Raksha Bharat; free, and how most Indians prefer to ask questions |
| Stories hub from day one, starting with a factual launch post | Every large site has one; it's the main source of search traffic |
| No impact counters until there are real, dated numbers. A "What we commit to" panel instead | Avoids the contradictions seen elsewhere, and keeps the [content rules](01-project-brief.md#content-rules) |

**Visual style (v3, premium pass):** same palette and fonts as v2, rebuilt around component libraries for a less generic feel.

| Area | Effect | Source |
|---|---|---|
| First visit | Plum bars and "Jeevansphere" rise, then sweep away (once per visit) | Vengeance UI reveal-loader |
| Whole site | Smooth inertial scrolling | Vengeance UI smooth-scroll (Lenis) |
| Hero | Full-screen dark scene. Masked line reveals and a letter-flipping rotating word. A 3D "sphere of life" with the five causes orbiting on a tilted ring (they pass behind the sphere) and mouse-tilt parallax. Cursor spotlight, aurora light and magnetic buttons. On scroll, the copy lifts away and the sphere grows and softens | Custom, with the aurora technique from Vengeance UI |
| Manifesto | Slides over the hero like a curtain. Lines sharpen from blur as you scroll, a marigold line draws itself, and stats count up | Vengeance UI gooey-text-reveal and stats-counter, Skiper UI 19 |
| Causes | Five tall panels that expand on hover or tap; a vertical accordion on phones | Skiper UI 52 |
| ₹0 gateway fees | Letters fly in and assemble as you scroll | Skiper UI 31 |
| How giving works | Three cards that stack while you scroll | Skiper UI 16 |
| Trust | Rotating conic glow borders | Vengeance UI glow-border-card |
| Events | Big editorial rows with a preview that follows the cursor | Vengeance UI image-reveal-list, Skiper UI 61 |
| Get involved / nav | Rolling-letter hover; rows fill with a sunrise gradient | Skiper UI 58 |
| Header | Turns white over dark sections, with a progressive blur underneath | Skiper UI 41 |
| Cursor | Trailing ring that grows over links and shows labels (desktop only) | Skiper UI 61 |

Previous style notes (v2):

**Visual style (v2, after review):**
- **Colours:** deep plum for structure and dark sections, marigold for action (Donate buttons have plum text on a marigold gradient), vermilion for accents, all on warm cream. Dark sections use mesh-gradient glows and a subtle film grain.
- **Fonts:** Bricolage Grotesque for headings, an Instrument Serif italic for one or two highlighted words per heading, Plus Jakarta Sans for text.
- **Shapes:** rounded rectangles throughout. No pill-shaped labels, and no small uppercase titles above headings.
- **Motion:** scroll reveals, a rotating hero word, the "sphere of life" hero with the five causes in orbit, a scrolling ticker, count-up numbers, spotlight hover on cards, animated menus and FAQ. All motion is switched off for people who choose reduced motion in their device settings.
- **Key sections:**
  - a bento grid for the causes
  - an interactive "what your gift can do" explorer
  - a phone mockup of the UPI payment
  - glass cards on dark sections
  - a sunrise-gradient call to action
- **Layout:** content width up to 1600px. Fluid type and grids, tested at 300, 360, 414, 768, 1024, 1280, 1440, 1600 and 1920px with no sideways scrolling.
- Real photos replace the patterned artwork as the foundation supplies them.

## Free traffic plan

Traffic comes from three places: search, sharing and local presence. All of it can be done at no cost.

### 1. Search (SEO)
- **Technical (built into the site):**
  - pages are generated ahead of time, so they load fast
  - a unique title and description on every page
  - `sitemap.xml` and `robots.txt`
  - structured data for search engines (`NGO`, `FAQPage`, `Event`, `Article`)
  - Open Graph images for link previews
  - canonical URLs
  - Hindi pages later, linked with `hreflang` tags
- **Keyword-led titles:** for example "Delhi NGO for Education, Healthcare & Social Welfare | Jeevansphere Foundation", and "Donate for Child Education in Delhi" on the education page. Uday Foundation ranks with exactly this local phrasing.
- **Content that people search for:**
  - one page per cause
  - one page per event; Ram Leela and festival searches peak locally every year
  - stories, at least two posts a month
  - evergreen guides such as "How to get an 80G receipt" once 80G is approved
- **Google Search Console:** submit the sitemap and check which searches bring visitors each month.

### 2. Local presence
- **Google Business Profile (free):** puts the foundation on Google Maps for searches like "NGO near me" and "NGO in Delhi". Add photos, events and posts.
- **Listings:** NGO Darpan (NITI Aayog), GuideStar India / Candid, and local Delhi directories. Each listing is also a link back to the site.
- **Events:** link every event poster and pamphlet to the site, with a QR code to `/donate` or the event page.

### 3. Sharing and community
- **WhatsApp share buttons** on the thank-you page, stories and events. Indian donors share by WhatsApp more than anywhere else.
- **Newsletter:** collected in the Sheet and sent monthly from Gmail (free at this scale).
- **Social media:** Instagram and YouTube for events and stories; LinkedIn for CSR partners. Every post links back to a page on the site, not just the home page.
- **Partners:** ask every partner, school and CSR donor to link to the foundation's page.

### 4. Free advertising, once eligible
- **Google Ad Grants:** free Google Search ads for eligible registered non-profits through Google for Nonprofits. Check eligibility once registrations such as 12A/80G are in place.
- **Meta and YouTube** non-profit programmes offer fundraising tools and support; check eligibility in India.

### Measuring
- Google Search Console: which searches and pages bring visitors.
- Vercel Web Analytics (free tier) or Google Analytics 4: visits, top pages, where visitors come from.
- The Sheet: donations and sign-ups per month. Pages carry UTM-tagged links, so the team can see which campaign a donor came from.
