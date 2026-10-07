/**
 * Qualixe quote form → Google Sheet
 *
 * Receives the JSON posted by src/app/(landing)/_components/QuoteForm.tsx and
 * appends one row per lead to a sheet named "Leads".
 *
 * SETUP
 * 1. Create a Google Sheet (any name). Open Extensions → Apps Script.
 * 2. Delete the sample code, paste this whole file, and save.
 * 3. Deploy → New deployment → type "Web app".
 *      Execute as:      Me
 *      Who has access:  Anyone
 *    Authorise when asked, then copy the Web app URL (it ends in /exec).
 * 4. Paste that URL into GOOGLE_SHEET_WEBHOOK_URL in
 *    src/app/(landing)/landing.config.ts and redeploy the site.
 * 5. Submit the form once. The "Leads" tab and its header row are created
 *    automatically on the first submission.
 *
 * After editing this script you must publish it again:
 * Deploy → Manage deployments → edit (pencil) → Version: "New version" → Deploy.
 * The URL stays the same.
 */

var SHEET_NAME = 'Leads';

// Must match the last option of "কবে শুরু করতে চান?" in QuoteForm.tsx.
var COLD_TIMELINE = 'শুধু জানতে চাই';
// "low" is the tier of the cheapest budget option in landing.config.ts.
var COLD_BUDGET_TIER = 'low';

// Columns filled straight from the form payload, in sheet order.
var FIELDS = [
  'submitted_at',
  'name',
  'whatsapp',
  'business_name',
  'business_link',
  'business_type',
  'service_needed',
  'platform',
  'product_count',
  'budget',
  'budget_tier',
  'timeline',
  'message',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'page_url'
];

var HEADERS = FIELDS.concat(['Lead Quality', 'Status']);

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Two leads arriving at once must not write to the same row.
    lock.waitLock(20000);

    var data = JSON.parse(e.postData.contents);
    var sheet = getLeadsSheet_();

    var quality =
      data.budget_tier === COLD_BUDGET_TIER || data.timeline === COLD_TIMELINE ? 'Cold' : 'Hot';

    var row = FIELDS.map(function (field) {
      return toCell_(data[field]);
    });
    row.push(quality, 'New');

    // Plain-text format keeps phone numbers intact (leading 0, leading +).
    sheet
      .getRange(sheet.getLastRow() + 1, 1, 1, row.length)
      .setNumberFormat('@')
      .setValues([row]);

    return json_({ result: 'success' });
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the /exec URL in a browser to confirm the deployment is live.
function doGet() {
  return json_({ result: 'ok', message: 'Qualixe leads webhook is running.' });
}

function getLeadsSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Visitors control these values, so never let one be evaluated as a formula.
function toCell_(value) {
  var text = value === undefined || value === null ? '' : String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON
  );
}
