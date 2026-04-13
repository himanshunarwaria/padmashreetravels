/**
 * POST /.netlify/functions/verifyPayment
 *
 * 1. Cryptographically verifies the Razorpay payment signature.
 * 2. Fetches payment details from Razorpay API (double-confirms status = 'captured').
 * 3. Appends the booking row to Google Sheets.
 * 4. Sends customer confirmation + admin notification emails via SendGrid.
 * 5. Returns { ok: true } so the frontend can show success UI.
 *
 * Email and Sheets failures are logged but do NOT fail the response —
 * the payment is already verified at that point.
 *
 * Request body (JSON):
 *   {
 *     razorpay_order_id, razorpay_payment_id, razorpay_signature,
 *     // Booking details (echoed from createOrder form values)
 *     name, email, phone, route, date, time,
 *     utmSource, utmMedium, utmCampaign, gclid, sourcePage
 *   }
 */

const crypto = require('crypto');
const Razorpay = require('razorpay');
const { getRoute } = require('./_helpers/pricing');
const { appendBooking } = require('./_helpers/sheets');
const { sendCustomerConfirmation, sendAdminNotification } = require('./_helpers/email');
const { ok, badRequest, serverError, options } = require('./_helpers/respond');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return options();
  if (event.httpMethod !== 'POST') return badRequest('Method not allowed');

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return badRequest('Invalid JSON body');
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    name, email, phone, route, date, time,
    utmSource, utmMedium, utmCampaign, gclid, sourcePage,
  } = body;

  // ── Require all three Razorpay fields ─────────────────────────────────────
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return badRequest('Missing Razorpay payment fields');
  }

  // ── Validate route ─────────────────────────────────────────────────────────
  const routeData = getRoute(route);
  if (!routeData) {
    return badRequest(`Invalid route: "${route}"`);
  }

  // ── Verify signature ───────────────────────────────────────────────────────
  const keySecret = process.env.RAZORPAY_SECRET;
  if (!keySecret) {
    console.error('[verifyPayment] RAZORPAY_SECRET not set.');
    return serverError('Payment service misconfigured.');
  }

  const expectedSig = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSig !== razorpay_signature) {
    console.warn(`[verifyPayment] Signature mismatch for order ${razorpay_order_id}`);
    return badRequest('Payment verification failed — signature mismatch');
  }

  // ── Confirm payment status via Razorpay API ────────────────────────────────
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: keySecret,
  });

  let payment;
  try {
    payment = await razorpay.payments.fetch(razorpay_payment_id);
  } catch (err) {
    console.error('[verifyPayment] Could not fetch payment from Razorpay:', err.message);
    return serverError('Could not verify payment with Razorpay. Please contact support.');
  }

  if (payment.status !== 'captured') {
    console.warn(`[verifyPayment] Payment ${razorpay_payment_id} not captured, status: ${payment.status}`);
    return badRequest(`Payment not captured. Status: ${payment.status}`);
  }

  // ── Build booking record ───────────────────────────────────────────────────
  const userAgent = event.headers['user-agent'] || '';
  const booking = {
    name: name || '',
    email: email || '',
    phone: phone || '',
    routeKey: route,
    routeLabel: routeData.label,
    date,
    time,
    amountInr: routeData.amount,
    currency: 'INR',
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    status: 'verified',
    utmSource: utmSource || '',
    utmMedium: utmMedium || '',
    utmCampaign: utmCampaign || '',
    gclid: gclid || '',
    sourcePage: sourcePage || '',
    userAgent,
  };

  console.log(`[verifyPayment] Verified booking: ${razorpay_payment_id} | ${routeData.label} | ₹${routeData.amount}`);

  // ── Google Sheets (non-fatal) ──────────────────────────────────────────────
  try {
    await appendBooking(booking);
    console.log('[verifyPayment] Booking appended to Google Sheets.');
  } catch (err) {
    console.error('[verifyPayment] Sheets append failed:', err.message);
    // Continue — payment is verified; don't block the success response
  }

  // ── Send emails (non-fatal) ────────────────────────────────────────────────
  const emailResults = { customer: false, admin: false };

  try {
    await sendCustomerConfirmation(booking);
    emailResults.customer = true;
    console.log(`[verifyPayment] Customer confirmation sent to ${email}`);
  } catch (err) {
    console.error('[verifyPayment] Customer email failed:', err.message);
  }

  try {
    await sendAdminNotification(booking);
    emailResults.admin = true;
    console.log('[verifyPayment] Admin notification sent.');
  } catch (err) {
    console.error('[verifyPayment] Admin email failed:', err.message);
  }

  return ok({
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    routeLabel: routeData.label,
    amountInr: routeData.amount,
    emails: emailResults,
  });
};
