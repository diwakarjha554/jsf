# Jeevansphere Foundation website

The website of Jeevansphere Foundation, a Section 8 non-profit in Delhi. It is built with Next.js 16, Tailwind CSS 4 and TypeScript, and hosted on Vercel's free plan. Google Sheets is the data store and Gmail SMTP sends the email. Donations come in by UPI at zero cost.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Every page and the donation flow work without any configuration. Until Google Sheets and SMTP are set up, form submissions are printed in the terminal.

## Where to change things

| What | File |
|---|---|
| Organisation details, UPI ID, bank details, 80G switch, suggested amounts | `src/content/site.ts` |
| Focus areas, page text and **donation impact lines** | `src/content/causes.ts` |
| Events, stories, team, FAQs | `src/content/events.ts`, `stories.ts`, `team.ts`, `faqs.ts` |
| Menus | `src/content/navigation.ts` |
| Colours and fonts | `src/app/globals.css`, `src/app/layout.tsx` |
| Email wording | `src/emails/templates.ts` |
| Sheet tabs and columns | `src/lib/sheet-schema.json` |

Search the code for `[TBD]` to find every placeholder that still needs real content.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run sheet:setup` | Creates and formats the Google Sheet tabs (needs `.env.local`) |

## Docs

The full documentation is in [`docs/`](docs/README.md):
- [Donations](docs/04-donations.md): how UPI donations, confirmation and receipts work
- [Google Sheet](docs/05-google-sheet.md): tabs, the Apps Script, and the staff routine
- [Deployment and go-live](docs/08-deployment-and-go-live.md): setup steps and the launch checklist
- [UI research and traffic plan](docs/09-ui-research-and-growth.md)
