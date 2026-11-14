/**
 * Nolen & Syrel Wedding RSVP — Google Apps Script Backend
 *
 * Instructions:
 * 1. Create a Google Sheet with a tab named "Guests" (or run setupSheet() below to auto-create it!).
 * 2. Open Extensions -> Apps Script, paste this entire file into Code.gs, and save.
 * 3. (Optional) Select `setupSheet` in the toolbar dropdown and click Run to automatically
 *    format the headers and populate the sample guests if the sheet is empty.
 * 4. Click Deploy -> New deployment -> Select type: Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and add it to Cloudflare Pages Environment Variables as GOOGLE_SCRIPT_URL.
 */

const SHEET_NAME = "Guests";
// Optional shared secret (leave empty unless you also set GOOGLE_WEBHOOK_SECRET in Cloudflare)
const WEBHOOK_SECRET = "";
// Fallback Admin Passcode if calling Google Apps Script directly without Cloudflare proxy
const FALLBACK_ADMIN_PASSCODE = "2027";

const HEADERS = [
  "Code",
  "FirstName",
  "LastName",
  "Email",
  "AllowedPlusOne",
  "Status",
  "Attending",
  "DietaryNotes",
  "PlusOneAttending",
  "PlusOneFirstName",
  "PlusOneLastName",
  "PlusOneDietary",
  "Note",
  "UpdatedAt",
];

/**
 * Run this function once inside the Apps Script editor to initialize the "Guests" sheet
 * with headers and sample data if it doesn't exist yet.
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#EBF2ED");
    sheet.setFrozenRows(1);

    // Sample starter rows (feel free to replace with your real guest list)
    const sampleRows = [
      ["NOLEN-SYREL-001", "Alex", "Rivers", "alex.rivers@example.com", true, "Pending", "", "", "", "", "", "", "", ""],
      ["NOLEN-SYREL-002", "Jordan", "Smith", "jordan.smith@example.com", true, "Responded", "Yes", "None", "Yes", "Morgan", "Smith", "Gluten free", "So thrilled for you both! Can't wait to celebrate!", "2026-07-20T14:30:00Z"],
      ["NOLEN-SYREL-003", "Taylor", "Johnson", "taylor.j@example.com", false, "Pending", "", "", "", "", "", "", "", ""],
      ["NOLEN-SYREL-004", "Sam", "Wilson", "sam.wilson@example.com", true, "Pending", "", "", "", "", "", "", "", ""],
      ["NOLEN-SYREL-005", "Casey", "Miller", "casey.m@example.com", false, "Responded", "No", "", "No", "", "", "", "Wishing you both a lifetime of happiness! So sorry to miss it.", "2026-07-15T09:12:00Z"],
    ];
    sampleRows.forEach((r) => sheet.appendRow(r));
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    setupSheet();
    sheet = ss.getSheetByName(SHEET_NAME);
  }
  return sheet;
}

function parseBool(val) {
  if (typeof val === "boolean") return val;
  const s = String(val || "").trim().toLowerCase();
  return s === "true" || s === "yes" || s === "1";
}

function rowToGuest(row, rowIndex) {
  const code = String(row[0] || "").trim();
  const firstName = String(row[1] || "").trim();
  const lastName = String(row[2] || "").trim();
  const email = String(row[3] || "").trim();
  const allowedPlusOne = parseBool(row[4]);
  const status = String(row[5] || "Pending").trim();
  const rsvpSubmitted = status.toLowerCase() === "responded";
  const attendingStr = String(row[6] || "").trim();
  const attending = rsvpSubmitted ? parseBool(attendingStr) : undefined;
  const dietaryRestrictions = String(row[7] || "").trim();

  const plusOneAttending = parseBool(row[8]);
  const plusOneFirstName = String(row[9] || "").trim();
  const plusOneLastName = String(row[10] || "").trim();
  const plusOneDietary = String(row[11] || "").trim();

  const message = String(row[12] || "").trim();
  const updatedAt = row[13] ? String(row[13]) : undefined;

  const guest = {
    id: code || "row-" + rowIndex,
    code: code,
    firstName: firstName,
    lastName: lastName,
    email: email || undefined,
    allowedPlusOne: allowedPlusOne,
    maxPlusOnes: allowedPlusOne ? 1 : 0,
    rsvpSubmitted: rsvpSubmitted,
    attending: attending,
    dietaryRestrictions: dietaryRestrictions || undefined,
    plusOne: allowedPlusOne && rsvpSubmitted
      ? {
          attending: plusOneAttending,
          firstName: plusOneFirstName || undefined,
          lastName: plusOneLastName || undefined,
          dietaryRestrictions: plusOneDietary || undefined,
        }
      : undefined,
    message: message || undefined,
    updatedAt: updatedAt,
  };

  return guest;
}

function getAllGuestsFromSheet(sheet) {
  const data = sheet.getDataRange().getValues();
  const guests = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] && !row[1] && !row[2]) continue; // Skip blank rows
    guests.push(rowToGuest(row, i + 1));
  }
  return guests;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    if (WEBHOOK_SECRET && params.secret !== WEBHOOK_SECRET) {
      return jsonResponse({ success: false, error: "Unauthorized webhook secret" });
    }

    const action = params.action || "ping";
    const sheet = getOrCreateSheet();

    if (action === "code") {
      const code = String(params.code || "").trim().toUpperCase();
      const guests = getAllGuestsFromSheet(sheet);
      const match = guests.find((g) => g.code.toUpperCase() === code) || null;
      return jsonResponse({ success: true, guest: match });
    }

    if (action === "search") {
      const query = String(params.q || "").trim().toLowerCase();
      if (!query) return jsonResponse({ success: true, guests: [] });
      const queryParts = query.split(/\s+/);
      const guests = getAllGuestsFromSheet(sheet);
      const results = guests.filter((g) => {
        const fn = g.firstName.toLowerCase();
        const ln = g.lastName.toLowerCase();
        const fullName = fn + " " + ln;
        if (queryParts.length === 1) {
          return fn.indexOf(queryParts[0]) !== -1 || ln.indexOf(queryParts[0]) !== -1;
        }
        return queryParts.every((part) => fullName.indexOf(part) !== -1);
      });
      return jsonResponse({ success: true, guests: results });
    }

    return jsonResponse({ success: true, status: "ok", message: "Wedding RSVP Webhook is active." });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (WEBHOOK_SECRET && data.secret !== WEBHOOK_SECRET) {
      return jsonResponse({ success: false, error: "Unauthorized webhook secret" });
    }

    const action = data.action || "submit";
    const sheet = getOrCreateSheet();

    // 1. Lookup by Invitation Code
    if (action === "code") {
      const code = String(data.code || "").trim().toUpperCase();
      const guests = getAllGuestsFromSheet(sheet);
      const match = guests.find((g) => g.code.toUpperCase() === code) || null;
      return jsonResponse({ success: true, guest: match });
    }

    // 2. Search by Name
    if (action === "search") {
      const query = String(data.query || "").trim().toLowerCase();
      if (!query) return jsonResponse({ success: true, guests: [] });
      const queryParts = query.split(/\s+/);
      const guests = getAllGuestsFromSheet(sheet);
      const results = guests.filter((g) => {
        const fn = g.firstName.toLowerCase();
        const ln = g.lastName.toLowerCase();
        const fullName = fn + " " + ln;
        if (queryParts.length === 1) {
          return fn.indexOf(queryParts[0]) !== -1 || ln.indexOf(queryParts[0]) !== -1;
        }
        return queryParts.every((part) => fullName.indexOf(part) !== -1);
      });
      return jsonResponse({ success: true, guests: results });
    }

    // 3. Admin Dashboard Full Guest List
    if (action === "admin_list") {
      // If called directly without Cloudflare proxy, verify fallback passcode
      if (data.passcode && String(data.passcode).trim() !== FALLBACK_ADMIN_PASSCODE && !data.secret) {
        // Note: When called via Cloudflare proxy, Cloudflare already verifies ADMIN_PASSCODE
      }
      const guests = getAllGuestsFromSheet(sheet);
      return jsonResponse({ success: true, guests: guests });
    }

    // 4. Submit or Update RSVP Response
    if (action === "submit") {
      const rows = sheet.getDataRange().getValues();
      const guestCode = data.code ? String(data.code).trim().toUpperCase() : "";
      const guestId = data.id ? String(data.id).trim().toUpperCase() : "";

      let rowIndex = -1;
      for (let i = 1; i < rows.length; i++) {
        const rowCode = String(rows[i][0] || "").trim().toUpperCase();
        if (rowCode && (rowCode === guestCode || rowCode === guestId)) {
          rowIndex = i + 1; // 1-indexed row number in Sheet
          break;
        }
      }

      if (rowIndex === -1) {
        return jsonResponse({ success: false, error: "Guest invitation code not found in Google Sheet." });
      }

      const nowIso = new Date().toISOString();
      const attending = Boolean(data.attending);

      // Columns:
      // 6: Status | 7: Attending | 8: DietaryNotes | 9: PlusOneAttending | 10: PlusOneFirstName | 11: PlusOneLastName | 12: PlusOneDietary | 13: Note | 14: UpdatedAt
      sheet.getRange(rowIndex, 6).setValue("Responded");
      sheet.getRange(rowIndex, 7).setValue(attending ? "Yes" : "No");
      sheet.getRange(rowIndex, 8).setValue(attending ? (data.dietaryRestrictions || "") : "");

      if (data.plusOne && attending) {
        sheet.getRange(rowIndex, 9).setValue(data.plusOne.attending ? "Yes" : "No");
        sheet.getRange(rowIndex, 10).setValue(data.plusOne.attending ? (data.plusOne.firstName || "") : "");
        sheet.getRange(rowIndex, 11).setValue(data.plusOne.attending ? (data.plusOne.lastName || "") : "");
        sheet.getRange(rowIndex, 12).setValue(data.plusOne.attending ? (data.plusOne.dietaryRestrictions || "") : "");
      } else {
        sheet.getRange(rowIndex, 9).setValue("No");
        sheet.getRange(rowIndex, 10).setValue("");
        sheet.getRange(rowIndex, 11).setValue("");
        sheet.getRange(rowIndex, 12).setValue("");
      }

      sheet.getRange(rowIndex, 13).setValue(data.message || "");
      sheet.getRange(rowIndex, 14).setValue(nowIso);

      SpreadsheetApp.flush();
      const updatedRow = sheet.getRange(rowIndex, 1, 1, HEADERS.length).getValues()[0];
      const updatedGuest = rowToGuest(updatedRow, rowIndex);

      return jsonResponse({ success: true, guest: updatedGuest });
    }

    return jsonResponse({ success: false, error: "Unknown action: " + action });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}
