// Minimal Google Sheets API v4 client using a service account (no SDK needed).
import { createSign } from "node:crypto";
import schema from "./sheet-schema.json";
import { env, sheetsConfigured } from "./env";

export type TabKey = "donations" | "receipts" | "contact" | "volunteers" | "partners" | "newsletter" | "log";

export const TAB: Record<TabKey, string> = Object.fromEntries(
  schema.tabs.map((t) => [t.key, t.name]),
) as Record<TabKey, string>;

export type CellValue = string | number;
export type RowRecord = Record<string, CellValue>;
export type SheetRow = { row: number; data: Record<string, string> };

const API = "https://sheets.googleapis.com/v4/spreadsheets";

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.token;
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claims = Buffer.from(
    JSON.stringify({
      iss: env.serviceAccountEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  ).toString("base64url");
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const signature = signer.sign(env.privateKey).toString("base64url");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Google auth failed (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  if (!sheetsConfigured()) throw new Error("Google Sheets is not configured (GOOGLE_SHEET_ID / service account env vars).");
  const token = await getAccessToken();
  const res = await fetch(`${API}/${env.sheetId}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Sheets API ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

const quoteTab = (tab: string) => `'${tab.replace(/'/g, "''")}'`;
const range = (tab: string, a1?: string) => encodeURIComponent(a1 ? `${quoteTab(tab)}!${a1}` : quoteTab(tab));

export function columnLetter(index: number) {
  let n = index + 1;
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

const headerCache = new Map<string, { headers: string[]; at: number }>();

/** Header row of a tab. Columns are matched by name, so staff can reorder or add columns. */
export async function getHeaders(tab: string, fresh = false) {
  const cached = headerCache.get(tab);
  if (!fresh && cached && Date.now() - cached.at < 5 * 60_000) return cached.headers;
  const data = await api<{ values?: string[][] }>(`/values/${range(tab, "1:1")}`);
  const headers = (data.values?.[0] ?? []).map((h) => String(h).trim());
  if (!headers.length) throw new Error(`Tab "${tab}" has no header row. Run "npm run sheet:setup".`);
  headerCache.set(tab, { headers, at: Date.now() });
  return headers;
}

/** Appends a row (values stored as typed, never as formulas). Returns the new row number. */
export async function appendRow(tab: string, record: RowRecord): Promise<number> {
  const headers = await getHeaders(tab);
  const values = headers.map((h) => record[h] ?? "");
  const data = await api<{ updates?: { updatedRange?: string } }>(
    `/values/${range(tab, "A1")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: "POST", body: JSON.stringify({ values: [values] }) },
  );
  const match = data.updates?.updatedRange?.match(/![A-Z]+(\d+)/);
  if (!match) throw new Error(`Could not read the new row number for "${tab}".`);
  return Number(match[1]);
}

/** Reads every row of a tab as { header: value } objects. */
export async function readRows(tab: string): Promise<{ headers: string[]; rows: SheetRow[] }> {
  const data = await api<{ values?: string[][] }>(`/values/${range(tab)}`);
  const values = data.values ?? [];
  const headers = (values[0] ?? []).map((h) => String(h).trim());
  headerCache.set(tab, { headers, at: Date.now() });
  const rows = values.slice(1).map((cells, i) => ({
    row: i + 2,
    data: Object.fromEntries(headers.map((h, j) => [h, String(cells[j] ?? "").trim()])),
  }));
  return { headers, rows };
}

/** Updates named columns in one row. Unknown column names are ignored. */
export async function updateRow(tab: string, rowNumber: number, record: RowRecord, headers?: string[]) {
  const cols = headers ?? (await getHeaders(tab));
  const data = Object.entries(record)
    .filter(([key]) => cols.includes(key))
    .map(([key, value]) => ({
      range: `${quoteTab(tab)}!${columnLetter(cols.indexOf(key))}${rowNumber}`,
      values: [[value]],
    }));
  if (!data.length) return;
  await api(`/values:batchUpdate`, {
    method: "POST",
    body: JSON.stringify({ valueInputOption: "RAW", data }),
  });
}
