/**
 * Jeevansphere Foundation: Google Sheet automation (free, runs inside the Sheet).
 *
 * What it does
 *  1. When staff set a donation's Status to "Confirmed", the website emails the receipt right away.
 *  2. Adds a "Jeevansphere" menu: send pending receipts now / check bank alerts now.
 *  3. Optional: reads your bank's credit-alert emails in Gmail and auto-confirms donations whose
 *     12-digit UPI reference (UTR) and amount match what the donor reported.
 *
 * Install (once, by the Sheet owner)
 *  1. In the Sheet: Extensions → Apps Script. Delete any sample code, paste this file, save.
 *  2. Project Settings (gear icon) → Script properties → add:
 *       SITE_URL          https://www.your-domain.org        (no trailing slash)
 *       ADMIN_API_KEY     the same value as ADMIN_API_KEY in Vercel
 *       BANK_ALERT_QUERY  (optional) Gmail search for your bank's credit alerts, for example:
 *                         from:(alerts@yourbank.com) (credited OR received) newer_than:3d
 *  3. Back in the editor, choose the function "installTriggers" and click Run. Approve the permissions.
 *  4. Reload the Sheet. You'll see the "Jeevansphere" menu.
 *
 * Bank alerts must arrive in the Gmail account of the person who ran installTriggers
 * (use Gmail forwarding if they go elsewhere). Test with a small payment first.
 */

var DONATIONS_TAB = "Donations";

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Jeevansphere")
    .addItem("Send pending receipts now", "sendPendingReceipts")
    .addItem("Check bank alerts now", "checkBankAlerts")
    .addSeparator()
    .addItem("Install automatic triggers", "installTriggers")
    .addToUi();
}

function installTriggers() {
  var ss = SpreadsheetApp.getActive();
  ScriptApp.getProjectTriggers().forEach(function (t) {
    ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("onDonationEdit").forSpreadsheet(ss).onEdit().create();
  if (prop_("BANK_ALERT_QUERY")) {
    ScriptApp.newTrigger("checkBankAlerts").timeBased().everyMinutes(15).create();
  }
  ss.toast("Automatic triggers installed.", "Jeevansphere", 5);
}

/** Runs on every edit. Sends the receipt when Status becomes "Confirmed". */
function onDonationEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== DONATIONS_TAB || e.range.getRow() < 2) return;

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var statusCol = headers.indexOf("Status") + 1;
  var refCol = headers.indexOf("Ref") + 1;
  var verifiedCol = headers.indexOf("Verified By") + 1;
  var first = e.range.getColumn();
  var last = first + e.range.getNumColumns() - 1;
  if (statusCol < first || statusCol > last) return;

  for (var r = e.range.getRow(); r < e.range.getRow() + e.range.getNumRows(); r++) {
    if (sheet.getRange(r, statusCol).getValue() !== "Confirmed") continue;
    if (verifiedCol && !sheet.getRange(r, verifiedCol).getValue()) {
      var who = e.user && e.user.getEmail ? e.user.getEmail() : "";
      sheet.getRange(r, verifiedCol).setValue(who || "Staff");
    }
    var ref = sheet.getRange(r, refCol).getValue();
    if (ref) sendReceiptFor_(ref);
  }
}

function sendPendingReceipts() {
  var result = withLock_(function () {
    return callSite_({});
  });
  toastResult_(result, "pending donations");
}

/** Optional: auto-confirm donations from bank credit-alert emails. */
function checkBankAlerts() {
  var query = prop_("BANK_ALERT_QUERY");
  if (!query) {
    SpreadsheetApp.getActive().toast("Set BANK_ALERT_QUERY in Script properties first.", "Jeevansphere", 6);
    return;
  }
  var sheet = SpreadsheetApp.getActive().getSheetByName(DONATIONS_TAB);
  var data = sheet.getDataRange().getValues();
  var h = data[0];
  var c = {
    status: h.indexOf("Status"),
    utr: h.indexOf("UTR"),
    amount: h.indexOf("Amount (INR)"),
    ref: h.indexOf("Ref"),
    verified: h.indexOf("Verified By"),
  };

  var pending = {};
  for (var i = 1; i < data.length; i++) {
    var utr = String(data[i][c.utr] || "").toUpperCase();
    if (data[i][c.status] === "Payment reported" && utr) pending[utr] = i;
  }
  if (Object.keys(pending).length === 0) return;

  var confirmed = [];
  GmailApp.search(query, 0, 50).forEach(function (thread) {
    thread.getMessages().forEach(function (msg) {
      var text = msg.getSubject() + " " + msg.getPlainBody();
      var refs = text.match(/\b\d{12}\b/g) || [];
      var amountMatch = text.match(/(?:Rs\.?|INR|₹)\s?([\d,]+(?:\.\d{1,2})?)/i);
      var amount = amountMatch ? Number(amountMatch[1].replace(/,/g, "")) : null;
      refs.forEach(function (utr) {
        var row = pending[utr];
        if (row === undefined) return;
        if (amount === null || Number(data[row][c.amount]) !== amount) return; // leave mismatches for staff
        sheet.getRange(row + 1, c.status + 1).setValue("Confirmed");
        sheet
          .getRange(row + 1, c.verified + 1)
          .setValue("Auto: bank alert " + Utilities.formatDate(msg.getDate(), "Asia/Kolkata", "yyyy-MM-dd HH:mm"));
        confirmed.push(data[row][c.ref]);
        delete pending[utr];
      });
    });
  });

  confirmed.forEach(function (ref) {
    sendReceiptFor_(ref);
  });
  if (confirmed.length) {
    SpreadsheetApp.getActive().toast("Auto-confirmed: " + confirmed.join(", "), "Jeevansphere", 8);
  }
}

// ── helpers ─────────────────────────────────────────────────────────

function sendReceiptFor_(ref) {
  var result = withLock_(function () {
    return callSite_({ ref: ref });
  });
  toastResult_(result, ref);
}

function callSite_(payload) {
  var url = prop_("SITE_URL");
  var key = prop_("ADMIN_API_KEY");
  if (!url || !key) throw new Error("Set SITE_URL and ADMIN_API_KEY in Project Settings → Script properties.");
  var res = UrlFetchApp.fetch(url.replace(/\/$/, "") + "/api/admin/receipts", {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload || {}),
    headers: { Authorization: "Bearer " + key },
    muteHttpExceptions: true,
  });
  var body = {};
  try {
    body = JSON.parse(res.getContentText());
  } catch (err) {
    body = { ok: false, message: res.getContentText().slice(0, 200) };
  }
  body.httpCode = res.getResponseCode();
  return body;
}

function toastResult_(result, label) {
  var ss = SpreadsheetApp.getActive();
  if (result && result.ok) {
    var sent = (result.processed || []).map(function (p) {
      return p.receiptNo;
    });
    ss.toast(sent.length ? "Receipt sent: " + sent.join(", ") : "Nothing to send for " + label + ".", "Jeevansphere", 6);
  } else {
    var errors = (result && result.failed ? result.failed : [])
      .map(function (f) {
        return f.ref + ": " + f.error;
      })
      .join("; ");
    ss.toast("Could not send receipt (" + label + "). " + (errors || (result && result.message) || ""), "Jeevansphere", 10);
  }
}

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}

function prop_(name) {
  return PropertiesService.getScriptProperties().getProperty(name);
}
