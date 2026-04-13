/**
 * POST /.netlify/functions/createOrder
 *
 * Creates a Razorpay order server-side.
 * The client never sends an amount — pricing is 100% server-authoritative.
 *
 * Request body (JSON):
 *   { name, email, phone, route, date, time,
 *     utmSource, utmMedium, utmCampaign, gclid }
 *
 * Response (JSON):
 *   { orderId, amount, currency, keyId, prefill: { name, email, contact } }
 */

const Razorpay = require('razorpay');
const { getRoute, getPaise } = require('./_helpers/pricing');
const { ok, badRequest, serverError, options } = require('./_helpers/respond');

// Simple field validators
function isNonEmpty(v) { return typeof v === 'string' && v.trim().length > 0; }
function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isPhone(v) { return /^[6-9]\d{9}$/.test(v.replace(/[\s\-+]/g, '')); }

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return options();
  if (event.httpMethod !== 'POST') return badRequest('Method not allowed');

  // ── Parse body ────────────────────────────────────────────────────────────
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return badRequest('Invalid JSON body');
  }

  const {
    name, email, phone, route, date, time,
    utmSource, utmMedium, utmCampaign, gclid,
  } = body;

  // ── Validate required fields ───────────────────────────────────────────────
  const errors = {};
  if (!isNonEmpty(name) || name.trim().length < 2)
    errors.name = 'Full name is required (min 2 characters)';
  if (!isNonEmpty(email) || !isEmail(email))
    errors.email = 'Valid email address is required';
  if (!isNonEmpty(phone) || !isPhone(phone))
    errors.phone = 'Valid 10-digit Indian mobile number is required';
  if (!isNonEmpty(date))
    errors.date = 'Travel date is required';
  if (!isNonEmpty(time))
    errors.time = 'Pickup time is required';

  // ── Validate route & price ─────────────────────────────────────────────────
  const routeData = getRoute(route);
  if (!routeData) {
    errors.route = `Unknown route: "${route}". Please select a valid route.`;
  }

  if (Object.keys(errors).length > 0) {
    return badRequest('Validation failed', errors);
  }

  // ── Validate travel date is not in the past ────────────────────────────────
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const travelDate = new Date(date);
  if (isNaN(travelDate) || travelDate < today) {
    return badRequest('Travel date cannot be in the past');
  }

  // ── Check Razorpay credentials ─────────────────────────────────────────────
  const keyId = process.env.RAZORPAY_KEY;
  const keySecret = process.env.RAZORPAY_SECRET;
  if (!keyId || !keySecret) {
    console.error('[createOrder] Razorpay credentials missing from environment.');
    return serverError('Payment service not configured. Please contact support.');
  }

  // ── Create Razorpay order ──────────────────────────────────────────────────
  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const amountPaise = getPaise(route);

  let order;
  try {
    order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `pst_${Date.now()}`,
      notes: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        route,
        date,
        time,
        utmSource: utmSource || '',
        utmMedium: utmMedium || '',
        utmCampaign: utmCampaign || '',
        gclid: gclid || '',
      },
    });
  } catch (err) {
    console.error('[createOrder] Razorpay order creation failed:', err.message);
    return serverError('Could not create payment order. Please try again.');
  }

  console.log(`[createOrder] Order created: ${order.id} | route: ${route} | amount: ₹${routeData.amount}`);

  return ok({
    orderId: order.id,
    amount: amountPaise,
    currency: 'INR',
    keyId,
    routeLabel: routeData.label,
    amountInr: routeData.amount,
    prefill: {
      name: name.trim(),
      email: email.trim(),
      contact: phone.trim(),
    },
  });
};
