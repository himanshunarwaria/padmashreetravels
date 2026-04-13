/**
 * Google Sheets helper — appends one booking row.
 *
 * Auth: Google service account (server-side, no OAuth popup needed).
 *
 * Required env vars:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL  — e.g. sheets-writer@project.iam.gserviceaccount.com
 *   GOOGLE_PRIVATE_KEY            — full RSA private key (with \n newlines)
 *   GOOGLE_SHEETS_SPREADSHEET_ID  — the ID from the spreadsheet URL
 *   GOOGLE_SHEETS_TAB_NAME        — sheet tab name, default "Bookings"
 */

const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TAB = process.env.GOOGLE_SHEETS_TAB_NAME || 'Bookings';

// Column headers — order must match the row array in appendBooking()
const HEADERS = [
  'Timestamp',
  'Full Name',
  'Email',
  'Phone',
  'Route Key',
  'Route Label',
  'Travel Date',
  'Travel Time',
  'Amount (INR)',
  'Currency',
  'Razorpay Order ID',
  'Razorpay Payment ID',
  'Verification Status',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'GCLID',
  'Source Page',
  'User Agent',
];

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error('Google service account credentials not configured in environment variables.');
  }

  // Netlify stores multi-line env vars with literal \n — convert to real newlines
  const privateKey = rawKey.replace(/\\n/g, '\n');

  return new google.auth.JWT(email, null, privateKey, SCOPES);
}

/**
 * Ensures the header row exists in the sheet (row 1).
 * Idempotent — only writes if row 1 is empty.
 */
async function ensureHeaders(sheets, spreadsheetId) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${TAB}!A1:A1`,
  });
  const firstCell = res.data.values?.[0]?.[0];
  if (!firstCell) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${TAB}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADERS] },
    });
  }
}

/**
 * Append a verified booking to the Google Sheet.
 * @param {Object} booking
 */
async function appendBooking(booking) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not set.');

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  await ensureHeaders(sheets, spreadsheetId);

  const row = [
    new Date().toISOString(),          // Timestamp
    booking.name || '',
    booking.email || '',
    booking.phone || '',
    booking.routeKey || '',
    booking.routeLabel || '',
    booking.date || '',
    booking.time || '',
    booking.amountInr || '',
    booking.currency || 'INR',
    booking.orderId || '',
    booking.paymentId || '',
    booking.status || 'verified',
    booking.utmSource || '',
    booking.utmMedium || '',
    booking.utmCampaign || '',
    booking.gclid || '',
    booking.sourcePage || '',
    booking.userAgent || '',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${TAB}!A1`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });
}

module.exports = { appendBooking };
