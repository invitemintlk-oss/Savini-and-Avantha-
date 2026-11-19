// RSVP + Wishes receiver for the Savini & Avantha wedding site.
// Paste this into Extensions > Apps Script of the spreadsheet, then deploy as a web app
// (see google-apps-script/README.md).
//
// Tabs are created automatically (with styled headers) the first time they are needed:
//   RSVP   : Timestamp | Name | Attending | Guests | Invited As
//   Wishes : Timestamp | Name | Message | Invited As
// Wishes are private: they are only saved to the sheet, never shown on the website.

const SPREADSHEET_ID = "1Z98ysW8ahS56JWZzJDJexAkrxImXGT4GGEdvSl7eEzY";

const SHEETS = {
  rsvp: {
    name: "RSVP",
    headers: ["Timestamp", "Name", "Attending", "Guests", "Invited As"],
    widths: [170, 220, 110, 80, 220],
  },
  wishes: {
    name: "Wishes",
    headers: ["Timestamp", "Name", "Message", "Invited As"],
    widths: [170, 200, 420, 200],
  },
};

const HEADER_BG = "#5a1a1f";   // antique wine
const HEADER_FG = "#fdf9f3";   // cream ivory

// Run once from the editor: creates both tabs with headers. Safe to run again.
function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  getSheet_(SHEETS.rsvp);
  getSheet_(SHEETS.wishes);
  // Remove the empty default tab if it is still there
  const blank = ss.getSheetByName("Sheet1");
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (data.type === "wish") return json_(saveWish_(data));
    return json_(saveRsvp_(data));
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, message: "RSVP & Wishes endpoint is running." });
}

function saveRsvp_(data) {
  const name = clean_(data.name, 120);
  const attending = data.attending === "yes" ? "Yes" : data.attending === "no" ? "No" : "";
  if (!name || !attending) return { ok: false, error: "Name and attendance are required." };

  const guests = attending === "Yes" ? Math.min(Math.max(parseInt(data.guests, 10) || 1, 1), 20) : 0;
  const invitedAs = clean_(data.invitedAs, 120);

  getSheet_(SHEETS.rsvp).appendRow([new Date(), safe_(name), attending, guests, safe_(invitedAs)]);
  return { ok: true };
}

function saveWish_(data) {
  const name = clean_(data.name, 80);
  const message = String(data.message || "").replace(/\r\n?/g, "\n").trim().slice(0, 500);
  if (!name || !message) return { ok: false, error: "Name and message are required." };

  const invitedAs = clean_(data.invitedAs, 120);
  // Leading apostrophe stops text such as "=..." being treated as a formula
  getSheet_(SHEETS.wishes).appendRow([new Date(), safe_(name), safe_(message), safe_(invitedAs)]);
  return { ok: true };
}

// Returns the tab, creating it (with styled headers) if it is missing or empty.
function getSheet_(def) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(def.name);
  if (!sheet) sheet = ss.insertSheet(def.name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, def.headers.length).setValues([def.headers])
      .setFontWeight("bold").setBackground(HEADER_BG).setFontColor(HEADER_FG)
      .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    sheet.getRange("A:A").setNumberFormat("dd MMM yyyy, hh:mm a");
    def.widths.forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
    if (def.name === SHEETS.wishes.name) sheet.getRange("C:C").setWrap(true);
  }
  return sheet;
}

function clean_(value, max) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function safe_(text) {
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
