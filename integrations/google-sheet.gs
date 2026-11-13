/**
 * Receives the portfolio "Start a project" form and appends a row to the sheet.
 * Write-only: there is no doGet, so nobody can read the sheet through this URL.
 * Setup: see integrations/README.md
 */
const HEADERS = ['Received', 'Inquiry No.', 'Name', 'Email', 'Designing', 'Timing', 'Story'];
const MAX_PER_HOUR = 40; // overall cap, stops floods

function reply(ok, error) {
  return ContentService.createTextOutput(JSON.stringify(ok ? { ok: true } : { ok: false, error: error }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (!e || !e.postData || e.postData.length > 10000) return reply(false, 'bad request');
    const d = JSON.parse(e.postData.contents);

    // Hidden "website" field: humans leave it empty, bots fill it in. Pretend success, store nothing.
    if (d.website) return reply(true);

    const clean = (v) => {
      v = String(v == null ? '' : v).trim().slice(0, 2000);
      return /^[=+\-@]/.test(v) ? "'" + v : v; // never let a value run as a formula
    };
    const row = [clean(d.no), clean(d.name), clean(d.email), clean(d.type), clean(d.when), clean(d.msg)];
    if (!row[1] || !/^\S+@\S+\.\S+$/.test(row[2]) || !row[5]) return reply(false, 'missing fields');

    // Rate limit and duplicate guard
    const cache = CacheService.getScriptCache();
    const hour = 'n' + Math.floor(Date.now() / 3600000);
    const count = Number(cache.get(hour) || 0);
    if (count >= MAX_PER_HOUR) return reply(false, 'busy, try again later');
    const sig = 'd' + Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, row.join('|')));
    if (cache.get(sig)) return reply(true);
    cache.put(hour, String(count + 1), 3600);
    cache.put(sig, '1', 600);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date()].concat(row));
    return reply(true);
  } catch (err) {
    return reply(false, 'error');
  } finally {
    lock.releaseLock();
  }
}
