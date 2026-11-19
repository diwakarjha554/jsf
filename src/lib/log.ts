import { sheetsConfigured } from "./env";
import { appendRow, TAB } from "./sheets";
import { istTimestamp } from "./utils";

/** Writes a line to the "System Log" tab. Never throws. */
export async function logEvent(source: string, event: string, reference: string, result: string, details = "") {
  if (!sheetsConfigured()) return;
  try {
    await appendRow(TAB.log, {
      Time: istTimestamp(),
      Source: source,
      Event: event,
      Reference: reference,
      Result: result,
      Details: details.slice(0, 1000),
    });
  } catch (err) {
    console.error("[log] Could not write to System Log:", err);
  }
}
