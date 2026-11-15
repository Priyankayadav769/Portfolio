/**
 * Receives the portfolio "Start a project" form and appends a row to the sheet.
 * Setup: see integrations/README.md
 */
const HEADERS = ['Received', 'Inquiry No.', 'Name', 'Email', 'Designing', 'Timing', 'Story'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    // Trim, cap length and stop values being read as formulas
    const clean = (v) => {
      v = String(v == null ? '' : v).trim().slice(0, 2000);
      return /^[=+\-@]/.test(v) ? "'" + v : v;
    };
    sheet.appendRow([
      new Date(),
      clean(d.no), clean(d.name), clean(d.email),
      clean(d.type), clean(d.when), clean(d.msg),
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
