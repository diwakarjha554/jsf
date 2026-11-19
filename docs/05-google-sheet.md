# 05 · Google Sheet

One spreadsheet holds everything the site collects. The website writes to it, and staff work in it. The tab and column definitions live in `src/lib/sheet-schema.json`, which both the website and the setup script read.

## Setup (once)

1. Create the spreadsheet **in the foundation's Google account**, named "Jeevansphere Foundation – Website Data".
2. Create a Google Cloud project and a service account, then share the spreadsheet with the service account as an Editor. Steps are in [08](08-deployment-and-go-live.md#1-google-cloud-and-the-sheet).
3. Put the Sheet ID, the service account's email and its private key in `.env.local`, then run `npm run sheet:setup`. It is safe to run again, as it never deletes data. The script:
   - creates any missing tabs, including a **How to use** tab for staff
   - writes the header rows; if staff have added their own columns, it adds any missing built-in columns at the end
   - styles and freezes the header row, sets column widths, and formats amounts as ₹
   - adds Status dropdowns, colour-coded on first run
   - protects `Receipts` and `System Log`, so only the website, the owner and anyone in `SHEET_OWNER_EMAILS` can change them
   - removes the empty default "Sheet1"
4. Install the Apps Script (see [below](#apps-script)) so receipts go out the moment staff confirm a payment.
5. Share the spreadsheet with staff by name. Make people who verify donations or follow up Editors, and everyone else Viewers. Don't use "Anyone with the link".

## How the website writes

- Each new submission is added as a row at the bottom.
- The site finds columns **by their header name**, not by position. Staff can reorder columns and add their own, such as "Follow-up date". **Don't rename or delete the built-in headers**, or the site will stop filling that column.
- Values are stored as plain text and numbers (`RAW`), so nothing typed into a form can turn into a formula.
- Times are in IST, in the format `2026-11-15 14:03`.

## Tabs

In the tables below, `Site` means the website fills the column and `Team` means staff fill it.

### `Donations`: every donation, from pledge to receipt

| Column | Filled by | Notes |
|---|---|---|
| Ref | Site | `JSF-261115-7K3Q`. Also written in the UPI payment note |
| Created At | Site | When the donor entered their details |
| Status | Site, then Team | See the workflow below |
| Amount (INR) | Site | |
| Cause | Site | Where it's needed most, or one of the five focus areas |
| Donor Name · Email · Phone | Site | |
| PAN · Address · City · State · Pincode | Site | Only when 80G is on and the donor asked for an 80G receipt |
| Wants 80G | Site | Yes / No |
| Citizen Declared | Site | Always Yes; the form requires it |
| Dedication | Site | For example "In memory of Ramesh Gupta" |
| Paid Via | Site | UPI / Bank transfer |
| UTR | Site | The transaction ID the donor reported |
| Reported At | Site | When the donor reported paying |
| Verified By | Team | The staff member's name, or "Auto: bank alert …" |
| Receipt No | Site | `JSF/2026-27/00042`, filled when the receipt is issued |
| Receipt Sent At | Site | Empty means not sent yet |
| Staff Notes | Team | |

**Status workflow:**

```
Awaiting payment ──(donor enters UTR)──► Payment reported ──(staff check bank)──► Confirmed ──(site emails receipt)──► Receipt sent
                                                     └──► Not received / Duplicate          Refunded / Void (by staff, any time)
```

| Status | Meaning | Who sets it |
|---|---|---|
| Awaiting payment | Filled in the form but hasn't reported paying yet | Site |
| Payment reported | Says they've paid and gave a UTR. **Needs checking** | Site |
| Confirmed | Staff found the money in the bank. The receipt goes out automatically | Staff, or the bank-alert script |
| Receipt sent | Receipt emailed | Site |
| Not received | No matching credit after 2 working days. Contact the donor | Staff |
| Duplicate / Refunded / Void | Self-explanatory. Tell the sheet owner to cancel the receipt if one was issued | Staff |

### `Receipts`: the official receipt register (protected)
The website adds one row per receipt; staff can't edit this tab. The CA uses it for Form 10BD.

Columns: Receipt No · Issued At · Donation Ref · Date Received · Amount (INR) · Donor Name · Email · PAN · Address · Paid Via · UTR · Cause · Donation Type · Receipt Status.

- **Receipt numbers come from the row number, so rows here must never be deleted.**
- To cancel a receipt, the owner sets `Receipt Status` to `Cancelled`.
- `Donation Type` defaults to "Others". The owner can change it to Corpus or Specific grant before filing 10BD.

### `Contact`
Columns: Submitted At · Name · Email · Phone · Subject · Message · **Status** · Owner · Staff Notes.

Status options: New / In progress / Replied / Closed.

### `Volunteers`
Columns: Submitted At · Name · Email · Phone · City · Age Group · Type · Interests · Availability · Skills · Message · Guardian Consent · **Status** · Owner · Staff Notes.

Status options: New / Contacted / Onboarded / On hold / Not a fit.

### `Partners`
Columns: Submitted At · Organisation · Organisation Type · Contact Person · Designation · Email · Phone · Website · Interest · Message · **Status** · Owner · Staff Notes.

Status options: New / In discussion / Agreed / Closed.

### `Newsletter`
Columns: Subscribed At · Email · Name · Source Page · **Status**.

Status options: Subscribed / Unsubscribed. If someone subscribes twice, the second sign-up is ignored.

### `System Log` (protected)
Columns: Time · Source · Event · Reference · Result · Details.

The website writes here when receipts are sent or fail, payments are reported, and the daily check runs. Staff can ignore it; it's for troubleshooting.

### `How to use`
Plain-language instructions for staff, written by the setup script.

## Apps Script

`google-apps-script/Code.gs` runs inside the Sheet for free and does three things:

| Feature | How it works |
|---|---|
| Instant receipts | An installable "on edit" trigger. When a `Donations` Status cell becomes `Confirmed`, it fills `Verified By` (if empty) and calls `/api/admin/receipts` with that reference |
| Jeevansphere menu | "Send pending receipts now", "Check bank alerts now", "Install automatic triggers" |
| Bank-alert auto-confirm (optional) | Every 15 minutes it searches Gmail with `BANK_ALERT_QUERY`, matches 12-digit UTRs and amounts against `Payment reported` rows, and confirms the exact matches |

To install it (sheet owner, once):
1. In the Sheet, open Extensions → Apps Script. Paste `Code.gs` and save.
2. Under Project Settings → Script properties, add `SITE_URL`, `ADMIN_API_KEY` (the same value as in Vercel), and optionally `BANK_ALERT_QUERY`.
3. Run `installTriggers` once and approve the permissions. Reload the Sheet to see the menu.

## Routines for staff

| When | What |
|---|---|
| Every working day (5 minutes) | In `Donations`, filter Status = **Payment reported**. Check each UTR and amount in the bank app, then set **Confirmed** or **Not received**. In the other tabs, reply to rows with Status **New** and update Status and Owner. |
| Weekly | Compare the week's bank credits with the `Receipts` total. Look for `Confirmed` rows without a `Receipt Sent At`; the daily email also flags these. |
| Monthly | Download a backup (File → Download → .xlsx) to the foundation's Drive. Review who has access. |
| Each April–May | Give the CA the `Receipts` tab, filtered by financial year, for Form 10BD, then issue Form 10BE to donors. |

**Do**
- Filter and sort with *Data → Create a filter view*. It doesn't change what other people see.
- Mark mistakes with a Status such as `Void`, and add a note.
- Add your own columns if they help.

**Don't**
- Delete rows in `Receipts`; it breaks receipt numbering. Avoid deleting rows in `Donations` too.
- Rename the built-in column headers or tabs.
- Share the Sheet publicly, or download it to personal devices.

## Limits

- A spreadsheet holds up to 10 million cells. At this site's size, that is decades of submissions.
- The Sheets API allows about 60 requests a minute for the service account, far above what a small NGO needs.
- File → Version history can restore the Sheet after a mistake.
