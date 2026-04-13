/**
 * SendGrid email helper.
 *
 * Required env vars:
 *   SENDGRID_API_KEY       — SendGrid API key (starts with SG.)
 *   SENDGRID_FROM_EMAIL    — Verified sender email
 *   SENDGRID_FROM_NAME     — Sender display name (default: Padma Shree Travels)
 *   ADMIN_NOTIFICATION_EMAIL — Where admin alerts go
 */

const sgMail = require('@sendgrid/mail');

function init() {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) throw new Error('SENDGRID_API_KEY not configured.');
  sgMail.setApiKey(key);
}

const FROM = {
  email: process.env.SENDGRID_FROM_EMAIL || 'travels.padamshree@gmail.com',
  name: process.env.SENDGRID_FROM_NAME || 'Padma Shree Travels',
};

function formatINR(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

/**
 * Customer booking confirmation email.
 */
async function sendCustomerConfirmation(booking) {
  init();

  const msg = {
    to: { email: booking.email, name: booking.name },
    from: FROM,
    replyTo: { email: 'travels.padamshree@gmail.com', name: 'Padma Shree Travels' },
    subject: `Booking Confirmed — ${booking.routeLabel} | Padma Shree Travels`,
    text: [
      `Hi ${booking.name},`,
      '',
      'Your booking with Padma Shree Travels is confirmed!',
      '',
      `Route       : ${booking.routeLabel}`,
      `Travel Date : ${booking.date}`,
      `Time        : ${booking.time}`,
      `Amount Paid : ${formatINR(booking.amountInr)}`,
      `Payment ID  : ${booking.paymentId}`,
      `Order ID    : ${booking.orderId}`,
      '',
      'Our driver will contact you before your trip.',
      'For any changes or questions, reach us at:',
      '  📞 +91-87200 81102',
      '  💬 https://wa.me/918720081102',
      '  ✉️  travels.padamshree@gmail.com',
      '',
      'Thank you for choosing Padma Shree Travels!',
      'Safe travels,',
      'Team Padma Shree Travels',
    ].join('\n'),
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Booking Confirmed</title></head>
<body style="margin:0;padding:0;background:#f6f6f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6;padding:32px 16px">
<tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">

    <!-- Header -->
    <tr><td style="background:#000;padding:28px 32px">
      <p style="margin:0;color:#fff;font-size:20px;font-weight:700">Padma Shree Travels</p>
      <p style="margin:4px 0 0;color:#aaa;font-size:13px">Agra Taxi Service</p>
    </td></tr>

    <!-- Green success bar -->
    <tr><td style="background:#05944F;padding:14px 32px">
      <p style="margin:0;color:#fff;font-size:15px;font-weight:600">✓ Booking Confirmed</p>
    </td></tr>

    <!-- Body -->
    <tr><td style="padding:28px 32px">
      <p style="margin:0 0 20px;font-size:15px;color:#404040">Hi <strong>${booking.name}</strong>,<br>
      Your cab is booked! Here are your details:</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden;margin-bottom:24px">
        <tr style="background:#f6f6f6"><td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b6b6b;text-transform:uppercase;letter-spacing:.06em">Route</td>
            <td style="padding:10px 16px;font-size:14px;color:#000;font-weight:600">${booking.routeLabel}</td></tr>
        <tr><td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b6b6b;text-transform:uppercase;letter-spacing:.06em;border-top:1px solid #eee">Travel Date</td>
            <td style="padding:10px 16px;font-size:14px;color:#000;border-top:1px solid #eee">${booking.date}</td></tr>
        <tr style="background:#f6f6f6"><td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b6b6b;text-transform:uppercase;letter-spacing:.06em;border-top:1px solid #eee">Pickup Time</td>
            <td style="padding:10px 16px;font-size:14px;color:#000;border-top:1px solid #eee">${booking.time}</td></tr>
        <tr><td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b6b6b;text-transform:uppercase;letter-spacing:.06em;border-top:1px solid #eee">Amount Paid</td>
            <td style="padding:10px 16px;font-size:15px;color:#000;font-weight:700;border-top:1px solid #eee">${formatINR(booking.amountInr)}</td></tr>
        <tr style="background:#f6f6f6"><td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b6b6b;text-transform:uppercase;letter-spacing:.06em;border-top:1px solid #eee">Payment ID</td>
            <td style="padding:10px 16px;font-size:13px;color:#404040;font-family:monospace;border-top:1px solid #eee">${booking.paymentId}</td></tr>
      </table>

      <p style="margin:0 0 8px;font-size:14px;color:#404040">Our driver will call you before your trip. Questions?</p>
      <p style="margin:0;font-size:14px;color:#404040">
        📞 <a href="tel:+918720081102" style="color:#000;font-weight:600">+91-87200 81102</a><br>
        💬 <a href="https://wa.me/918720081102" style="color:#25D366;font-weight:600">WhatsApp us</a>
      </p>
    </td></tr>

    <!-- Footer -->
    <tr><td style="background:#f6f6f6;padding:20px 32px;border-top:1px solid #eee">
      <p style="margin:0;font-size:12px;color:#8a8a8a;text-align:center">
        Padma Shree Travels · Agra, Uttar Pradesh ·
        <a href="https://padmashreetravels.netlify.app" style="color:#8a8a8a">padmashreetravels.netlify.app</a>
      </p>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`,
  };

  await sgMail.send(msg);
}

/**
 * Admin new-booking notification email.
 */
async function sendAdminNotification(booking) {
  init();

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || FROM.email;

  const msg = {
    to: adminEmail,
    from: FROM,
    subject: `[NEW BOOKING] ${booking.routeLabel} — ${formatINR(booking.amountInr)} — ${booking.name}`,
    text: [
      '─── NEW BOOKING CONFIRMED ───',
      '',
      `Name       : ${booking.name}`,
      `Email      : ${booking.email}`,
      `Phone      : ${booking.phone}`,
      '',
      `Route      : ${booking.routeLabel} (${booking.routeKey})`,
      `Date       : ${booking.date}`,
      `Time       : ${booking.time}`,
      `Amount     : ${formatINR(booking.amountInr)}`,
      '',
      `Order ID   : ${booking.orderId}`,
      `Payment ID : ${booking.paymentId}`,
      `Status     : ${booking.status}`,
      '',
      '─── Attribution ───',
      `UTM Source  : ${booking.utmSource || '—'}`,
      `UTM Medium  : ${booking.utmMedium || '—'}`,
      `UTM Campaign: ${booking.utmCampaign || '—'}`,
      `GCLID       : ${booking.gclid || '—'}`,
      `Source Page : ${booking.sourcePage || '—'}`,
      `User Agent  : ${booking.userAgent || '—'}`,
      '',
      `Timestamp  : ${new Date().toISOString()}`,
    ].join('\n'),
  };

  await sgMail.send(msg);
}

module.exports = { sendCustomerConfirmation, sendAdminNotification };
