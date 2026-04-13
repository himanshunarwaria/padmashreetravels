# Padma Shree Travels — Website & Booking System

Static website + Netlify Functions booking and payment system for Padma Shree Travels, Agra.

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Plain HTML / CSS / Vanilla JS |
| Hosting | Netlify (static) |
| Backend | Netlify Functions (Node.js 18) |
| Payments | Razorpay Standard Checkout |
| Lead storage | Google Sheets (service account auth) |
| Email | SendGrid |
| Ads tracking | Google Ads (gtag conversion) |

---

## Project Structure

```
.
├── book/index.html                  ← Payment-enabled booking page (/book/)
├── contact.html                     ← Contact/enquiry page
├── blog/                            ← Blog articles with ?route= CTA links
├── js/
│   ├── main.js                      ← Existing site JS (nav, FAQ, etc.)
│   └── booking.js                   ← UTM capture, Razorpay checkout, GA conversion
├── css/style.css                    ← Site-wide styles
├── netlify/
│   └── functions/
│       ├── createOrder.js           ← POST: creates Razorpay order
│       ├── verifyPayment.js         ← POST: verifies sig, writes Sheets, sends emails
│       └── _helpers/
│           ├── pricing.js           ← Central route pricing config
│           ├── sheets.js            ← Google Sheets append helper
│           ├── email.js             ← SendGrid customer + admin emails
│           └── respond.js           ← HTTP response helpers
├── netlify.toml                     ← Build + functions config
├── package.json                     ← npm dependencies for functions
├── .env.example                     ← Environment variable template
└── _redirects                       ← Netlify URL routing rules
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# then edit .env with real values
```

---

## Environment Variables

Set all in **Netlify → Site → Environment Variables** for production.

### Razorpay

1. Dashboard → Settings → API Keys → Generate key pair
2. Use **test keys** (rzp_test_...) during development

```
RAZORPAY_KEY=rzp_live_XXXXXXXXXXXXXXXX
RAZORPAY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### SendGrid

1. Verify sender email: Settings → Sender Authentication
2. Create API key: Settings → API Keys → Mail Send permission

```
SENDGRID_API_KEY=SG.XXXXXXXX...
SENDGRID_FROM_EMAIL=travels.padamshree@gmail.com
SENDGRID_FROM_NAME=Padma Shree Travels
ADMIN_NOTIFICATION_EMAIL=travels.padamshree@gmail.com
```

### Google Sheets (service account)

1. Google Cloud Console → Enable **Google Sheets API**
2. IAM & Admin → Service Accounts → Create → download JSON key
3. From JSON: copy `client_email` and `private_key`
4. Create a Google Sheet → Share it with the service account email (Editor)
5. Add a tab named `Bookings`
6. Copy the spreadsheet ID from the URL

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=sheets-writer@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
GOOGLE_SHEETS_TAB_NAME=Bookings
```

Headers are written automatically on the first booking.

### Google Ads

1. Get account ID from Google Ads dashboard (AW-XXXXXXXXXX)
2. Tools → Conversions → New conversion → Website → copy conversion label
3. Replace all `REPLACE_WITH_AW-XXXXXXXXXX` and `REPLACE_WITH_LABEL` in `book/index.html`

```
GOOGLE_ADS_ID=AW-XXXXXXXXXX
GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXXXXXXXXXXXXXX
```

### Site URL

```
SITE_URL=https://padmashreetravels.netlify.app
```

---

## Local Development

```bash
npm install -g netlify-cli
netlify login
netlify link
netlify dev        # http://localhost:8888
```

---

## Deployment

```bash
netlify deploy --prod
```

Or push to GitHub — Netlify auto-deploys on the linked branch.

---

## Booking Flow

```
User visits /book/?route=taj-mahal-agra-fort
    │
    ├── UTM/GCLID captured into localStorage
    ├── Route prefilled from ?route= param
    └── Price shown from ROUTE_PRICES lookup
    │
    ▼ (submit)
POST /.netlify/functions/createOrder
    ├── Server validates fields
    ├── Looks up authoritative price by route key
    ├── Creates Razorpay order
    └── Returns { orderId, amount, keyId, prefill }
    │
    ▼
Razorpay Checkout (client-side SDK opens)
    │
    ▼ (payment success)
POST /.netlify/functions/verifyPayment
    ├── HMAC-SHA256 signature verified
    ├── Payment status confirmed via Razorpay API (must be "captured")
    ├── Row appended to Google Sheets (non-fatal)
    ├── Customer confirmation email sent (non-fatal)
    ├── Admin notification email sent (non-fatal)
    └── Returns { ok: true, paymentId, routeLabel, amountInr }
    │
    ▼
Google Ads conversion fired → success UI shown
```

---

## Changing Route Prices

Edit **`netlify/functions/_helpers/pricing.js`** — server is authoritative.
Also update the dropdown in `book/index.html` and the `ROUTE_PRICES` object in `js/booking.js`.

---

## Testing Checklist

**Pre-launch:**
- [ ] All env vars set in Netlify dashboard
- [ ] Replace `REPLACE_WITH_AW-XXXXXXXXXX` and `REPLACE_WITH_LABEL` in `book/index.html`
- [ ] Test with Razorpay test keys first
- [ ] SendGrid sender email verified
- [ ] Google Sheet shared with service account email (Editor)
- [ ] `Bookings` tab exists in the spreadsheet

**Functional tests:**
- [ ] `/book/` loads without errors
- [ ] `/book/?route=taj-mahal-agra-fort` prefills route + shows price
- [ ] Form shows errors for invalid input
- [ ] Razorpay modal opens on valid submit
- [ ] Test payment completes (card: 4111 1111 1111 1111, any CVV/expiry)
- [ ] Success UI shows with payment ID
- [ ] Google Sheet has new row
- [ ] Customer email received
- [ ] Admin email received
- [ ] Blog CTAs point to `/book/?route=...` with correct route keys

**UTM test:**
- [ ] Open `/book/?utm_source=google&utm_medium=cpc&utm_campaign=test&gclid=abc`
- [ ] Complete booking
- [ ] Google Sheet row has UTM columns populated

---

## Notes

- Email + Sheets failures are **non-fatal** — payment verification still returns success. Check function logs in Netlify dashboard.
- Pricing is **server-authoritative** — the frontend never sends an amount to the functions.
- Google Ads conversion fires **only once** per page session.
- Razorpay signature verification uses **HMAC-SHA256** and runs before any storage operations.
