// Creates and formats the Google Sheet tabs the website writes to.
// Usage: npm run sheet:setup   (reads .env.local)
// Safe to run again: it never deletes data, only adds missing tabs/columns.

import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";

const schema = JSON.parse(readFileSync(new URL("../src/lib/sheet-schema.json", import.meta.url), "utf8"));

const SHEET_ID = process.env.GOOGLE_SHEET_ID?.trim();
const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
const KEY = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n").replace(/^"|"$/g, "");
const OWNERS = (process.env.SHEET_OWNER_EMAILS || "").split(",").map((s) => s.trim()).filter(Boolean);

if (!SHEET_ID || !SA_EMAIL || !KEY) {
  console.error(
    "Missing GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY in .env.local.\nSee docs/08-deployment-and-go-live.md, step 1.",
  );
  process.exit(1);
}

const API = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;
let accessToken = "";

async function auth() {
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: SA_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(KEY).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  if (!res.ok) throw new Error(`Google auth failed: ${await res.text()}`);
  accessToken = (await res.json()).access_token;
}

async function api(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 403 || res.status === 404) {
      throw new Error(`${res.status}: Share the spreadsheet with ${SA_EMAIL} as an Editor, and check GOOGLE_SHEET_ID.\n${text}`);
    }
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json();
}

const batch = (requests) => (requests.length ? api(":batchUpdate", { method: "POST", body: JSON.stringify({ requests }) }) : null);
const rangeOf = (title, a1) => encodeURIComponent(`'${title.replace(/'/g, "''")}'${a1 ? `!${a1}` : ""}`);

const HOW_TO = [
  ["How to use this spreadsheet"],
  [""],
  ["The website adds a new row to these tabs automatically. Please don't rename the tabs or the column headers in row 1."],
  ["You can add your own columns (for example \"Follow-up date\"), reorder columns, and use Data → Create a filter view to filter or sort."],
  [""],
  ["DONATIONS: what to do every working day"],
  ["1. Filter the Donations tab for Status = \"Payment reported\"."],
  ["2. Find the UTR and amount in the bank statement or bank app."],
  ["3. If you find it: set Status to \"Confirmed\" and write your name in \"Verified By\". The receipt is emailed automatically."],
  ["4. If you can't find it after 2 working days: set Status to \"Not received\" and contact the donor."],
  ["\"Awaiting payment\" rows are people who filled the form but haven't reported paying yet. You can ignore them, or follow up kindly after a few days."],
  [""],
  ["RECEIPTS tab: the official list of receipts issued. It is protected. Never delete rows here; it would break receipt numbering."],
  ["To cancel a receipt (e.g. a refund), ask the sheet owner to set \"Receipt Status\" to Cancelled."],
  [""],
  ["CONTACT / VOLUNTEERS / PARTNERS: reply to new rows within 2 working days, then update Status and Owner."],
  ["NEWSLETTER: people who subscribed on the website. Set Status to \"Unsubscribed\" if someone asks to stop."],
  ["SYSTEM LOG: technical log written by the website. You can ignore it."],
  [""],
  ["Monthly: File → Download → Microsoft Excel (.xlsx) and save a backup in the foundation's Drive."],
];

const STATUS_COLOURS = {
  "Awaiting payment": "#f3f4f6",
  "Payment reported": "#fef3c7",
  Confirmed: "#dbeafe",
  "Receipt sent": "#dcfce7",
  "Not received": "#fee2e2",
  New: "#fef3c7",
  Replied: "#dcfce7",
  Onboarded: "#dcfce7",
  Agreed: "#dcfce7",
  Subscribed: "#dcfce7",
  Unsubscribed: "#f3f4f6",
};

function hex(color) {
  const n = parseInt(color.slice(1), 16);
  return { red: ((n >> 16) & 255) / 255, green: ((n >> 8) & 255) / 255, blue: (n & 255) / 255 };
}

async function main() {
  await auth();
  let meta = await api("?fields=sheets(properties(sheetId,title),protectedRanges(description))");
  const titles = () => new Map(meta.sheets.map((s) => [s.properties.title, s]));

  const wanted = [...schema.tabs.map((t) => t.name), "How to use"];
  const missing = wanted.filter((name) => !titles().has(name));
  await batch(missing.map((title) => ({ addSheet: { properties: { title, gridProperties: { frozenRowCount: 1 } } } })));
  if (missing.length) console.log(`Created tabs: ${missing.join(", ")}`);
  meta = await api("?fields=sheets(properties(sheetId,title),protectedRanges(description))");

  for (const tab of schema.tabs) {
    const sheet = titles().get(tab.name);
    const sheetId = sheet.properties.sheetId;
    const current = (await api(`/values/${rangeOf(tab.name, "1:1")}`)).values?.[0] ?? [];
    const fresh = current.length === 0;
    const headers = fresh ? tab.headers : [...current, ...tab.headers.filter((h) => !current.includes(h))];
    await api(`/values/${rangeOf(tab.name, "A1")}?valueInputOption=RAW`, {
      method: "PUT",
      body: JSON.stringify({ values: [headers] }),
    });
    if (!fresh && headers.length > current.length) {
      console.log(`${tab.name}: added columns ${headers.slice(current.length).join(", ")}`);
    }

    const requests = [
      {
        repeatCell: {
          range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
          cell: {
            userEnteredFormat: {
              backgroundColor: hex("#134644"),
              textFormat: { bold: true, foregroundColor: hex("#ffffff") },
              wrapStrategy: "WRAP",
              verticalAlignment: "MIDDLE",
            },
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,wrapStrategy,verticalAlignment)",
        },
      },
      { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: "gridProperties.frozenRowCount" } },
    ];

    for (const [name, px] of Object.entries(tab.widths ?? {})) {
      const i = headers.indexOf(name);
      if (i >= 0) {
        requests.push({
          updateDimensionProperties: {
            range: { sheetId, dimension: "COLUMNS", startIndex: i, endIndex: i + 1 },
            properties: { pixelSize: px },
            fields: "pixelSize",
          },
        });
      }
    }

    const amountCol = headers.indexOf("Amount (INR)");
    if (amountCol >= 0) {
      requests.push({
        repeatCell: {
          range: { sheetId, startRowIndex: 1, startColumnIndex: amountCol, endColumnIndex: amountCol + 1 },
          cell: { userEnteredFormat: { numberFormat: { type: "NUMBER", pattern: "[$₹]#,##,##0" } } },
          fields: "userEnteredFormat.numberFormat",
        },
      });
    }

    if (tab.status) {
      const col = headers.indexOf(tab.status.column);
      const range = { sheetId, startRowIndex: 1, startColumnIndex: col, endColumnIndex: col + 1 };
      requests.push({
        setDataValidation: {
          range,
          rule: {
            condition: { type: "ONE_OF_LIST", values: tab.status.options.map((v) => ({ userEnteredValue: v })) },
            showCustomUi: true,
            strict: true,
          },
        },
      });
      if (fresh) {
        for (const option of tab.status.options) {
          const colour = STATUS_COLOURS[option];
          if (!colour) continue;
          requests.push({
            addConditionalFormatRule: {
              index: 0,
              rule: {
                ranges: [range],
                booleanRule: {
                  condition: { type: "TEXT_EQ", values: [{ userEnteredValue: option }] },
                  format: { backgroundColor: hex(colour) },
                },
              },
            },
          });
        }
      }
    }

    const alreadyProtected = (sheet.protectedRanges ?? []).some((p) => p.description === "jsf-protected");
    if (tab.protected && !alreadyProtected) {
      requests.push({
        addProtectedRange: {
          protectedRange: {
            range: { sheetId },
            description: "jsf-protected",
            warningOnly: false,
            editors: { users: [SA_EMAIL, ...OWNERS] },
          },
        },
      });
      console.log(`${tab.name}: protected (editable only by the website${OWNERS.length ? ` and ${OWNERS.join(", ")}` : " and the owner"})`);
    }

    await batch(requests);
    console.log(`✓ ${tab.name}`);
  }

  await api(`/values/${rangeOf("How to use", "A1")}?valueInputOption=RAW`, {
    method: "PUT",
    body: JSON.stringify({ values: HOW_TO }),
  });
  const howTo = titles().get("How to use").properties.sheetId;
  await batch([
    {
      repeatCell: {
        range: { sheetId: howTo, startRowIndex: 0, endRowIndex: 1 },
        cell: { userEnteredFormat: { textFormat: { bold: true, fontSize: 14 } } },
        fields: "userEnteredFormat.textFormat",
      },
    },
    {
      updateDimensionProperties: {
        range: { sheetId: howTo, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
        properties: { pixelSize: 900 },
        fields: "pixelSize",
      },
    },
  ]);
  console.log("✓ How to use");

  // Remove the default empty "Sheet1" of a brand-new spreadsheet.
  const sheet1 = titles().get("Sheet1");
  if (sheet1) {
    const values = (await api(`/values/${rangeOf("Sheet1", "A1:Z20")}`)).values;
    if (!values || values.length === 0) {
      await batch([{ deleteSheet: { sheetId: sheet1.properties.sheetId } }]);
      console.log("Removed empty Sheet1");
    }
  }

  console.log("\nDone. Open the spreadsheet and check the tabs.");
}

main().catch((err) => {
  console.error(`\n✗ ${err.message}`);
  process.exit(1);
});
