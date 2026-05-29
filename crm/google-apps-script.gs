// ═══════════════════════════════════════════════════════════════════
//  Padma Shree Travels CRM — Google Apps Script
//  HOW TO DEPLOY:
//  1. Go to script.google.com → open your project (or create new one
//     bound to your Google Sheet)
//  2. Delete ALL existing code
//  3. Paste this entire file
//  4. Click Deploy → Manage Deployments → edit the existing deployment
//     (or New Deployment if first time)
//     · Execute as: Me
//     · Who has access: Anyone
//  5. Copy the Web App URL → paste it in CRM Admin Settings
// ═══════════════════════════════════════════════════════════════════

function doGet(e) {
  try {
    var raw  = e.parameter.payload;
    var data = raw ? JSON.parse(raw) : {};
    return writeToSheet(data);
  } catch(err) {
    return respond("error", err.toString());
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    return writeToSheet(data);
  } catch(err) {
    return respond("error", err.toString());
  }
}

function writeToSheet(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var rec   = data.record || {};
  var stamp = data.submittedAt || new Date().toISOString();
  var sheet;

  // ── Passenger ────────────────────────────────────────────────────
  if (data.type === "passenger") {
    sheet = ss.getSheetByName("Passengers") || ss.insertSheet("Passengers");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Submitted At","Name","Phone","Route","Travel Date","Status","Created"]);
      sheet.getRange(1,1,1,7).setFontWeight("bold");
    }
    sheet.appendRow([
      stamp,
      rec.name       || "",
      rec.phone      || "",
      rec.route      || "",
      rec.travelDate || "",
      rec.status     || "",
      rec.created    || ""
    ]);
    return respond("ok", "passenger saved");
  }

  // ── Driver ───────────────────────────────────────────────────────
  if (data.type === "driver") {
    sheet = ss.getSheetByName("Drivers") || ss.insertSheet("Drivers");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Submitted At","Name","Phone","Car Type","Car Number",
        "Availability","Main Route","Driver Quality","Notes","Created"]);
      sheet.getRange(1,1,1,10).setFontWeight("bold");
    }
    sheet.appendRow([
      stamp,
      rec.name         || "",
      rec.phone        || "",
      rec.carType      || "",
      rec.carNumber    || "",
      rec.availability || "",
      rec.route        || "",
      rec.quality      || "",
      rec.notes        || "",
      rec.created      || ""
    ]);
    return respond("ok", "driver saved");
  }

  // ── Test ping ────────────────────────────────────────────────────
  if (data.type === "test") {
    sheet = ss.getSheetByName("Test") || ss.insertSheet("Test");
    sheet.appendRow([stamp, "CRM connection test OK"]);
    return respond("ok", "test ping saved");
  }

  return respond("ok", "no type matched");
}

function respond(status, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: status, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
