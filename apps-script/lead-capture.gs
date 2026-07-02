/**
 * Visual Rhyme — Lead Capture Web App
 * ------------------------------------------------------------------
 * Receives lead submissions from the website's LeadCaptureModal,
 * appends them to a Google Sheet, and emails a notification to the
 * operator inbox.
 *
 * Deploy:
 *   1. Create a new Google Sheet (name it e.g. "Visual Rhyme — Leads").
 *      Copy its ID from the URL (the long string between /d/ and /edit).
 *      Paste it as SHEET_ID below.
 *   2. In script.google.com → New Project → paste this file's contents.
 *   3. Save. Then: Deploy → New deployment → type: Web app.
 *        - Description: "Visual Rhyme Lead Capture v1"
 *        - Execute as: "Me (katvisualrhyme@gmail.com)"
 *        - Who has access: "Anyone"
 *      Click Deploy. Authorize when prompted.
 *   4. Copy the resulting exec URL (looks like
 *      https://script.google.com/macros/s/AKfycb.../exec).
 *   5. Paste that URL into src/lib/leadCapture.js as LEAD_ENDPOINT.
 *   6. Push to master. Vercel rebuilds. Test the form on the live site.
 * ------------------------------------------------------------------
 */

// ---- CONFIG ----------------------------------------------------------------
const SHEET_ID     = 'REPLACE_WITH_YOUR_SHEET_ID';
const SHEET_TAB    = 'Leads';
const NOTIFY_EMAIL = 'katvisualrhyme@gmail.com';
const REQUIRED_FIELDS = ['name', 'email'];
const VERSION = 1;
// ----------------------------------------------------------------------------

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return _json({ ok: false, error: 'empty-body' });
    }
    const payload = JSON.parse(e.postData.contents);

    // Honeypot — silently accept known bots so they think they succeeded.
    if (payload._honey) {
      return _json({ ok: true, ignored: true });
    }

    for (var i = 0; i < REQUIRED_FIELDS.length; i++) {
      var f = REQUIRED_FIELDS[i];
      if (!payload[f] || String(payload[f]).trim() === '') {
        return _json({ ok: false, error: 'missing-field:' + f });
      }
    }

    _append(payload);
    _notify(payload);
    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return _json({
    ok: true,
    service: 'Visual Rhyme Lead Capture',
    version: VERSION
  });
}

// ---- INTERNALS -------------------------------------------------------------

function _append(p) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_TAB);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_TAB);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Name',
      'Company',
      'Email',
      'Product Interest',
      'Source',
      'User Agent',
      'Referrer'
    ]);
    sheet.getRange('A1:H1').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([
    new Date(),
    p.name || '',
    p.company || '',
    p.email || '',
    p.product_interest || '',
    p.source || 'website',
    p.user_agent || '',
    p.referrer || ''
  ]);
}

function _notify(p) {
  var subj = 'New lead — ' + (p.name || 'Anonymous') +
             (p.company ? ' · ' + p.company : '');
  var lines = [
    'A new lead just came in from the Visual Rhyme site.',
    '',
    'Source:   ' + (p.source || 'website'),
    'Name:     ' + (p.name || ''),
    'Company:  ' + (p.company || '—'),
    'Email:    ' + (p.email || ''),
    'Interest: ' + (p.product_interest || ''),
    '',
    'Referrer: ' + (p.referrer || 'direct'),
    'UA:       ' + (p.user_agent || ''),
    '',
    'Timestamp: ' + new Date().toISOString(),
    '',
    '— Visual Rhyme website (auto)'
  ];
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subj,
      body: lines.join('\n')
    });
  } catch (mailErr) {
    // Non-fatal: lead is safely in the sheet even if email quota is exhausted.
    console.warn('MailApp failed: ' + mailErr);
  }
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
