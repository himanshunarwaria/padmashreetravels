# On-Site Tracking Plan

Created 31 August 2026, Part E of the tourist-acquisition phase (page-upgrade-log
entry #40). Covers what is implemented, what is documented-only pending a
decision, and one verified gap in the existing pipeline.

## Governing rule

No passenger's name, phone number, pickup address, drop address, flight
number, train number, or any other trip detail is ever sent to analytics.
Every event below carries only: which page, which UI element, which
marketing source, and a coarse label (e.g. a FAQ question's own text, which
is public content, not personal data). This was true of `js/conversion-tracking.js`
before this task and remains true after it.

## 1. What already exists (built in earlier phases, verified working)

* **`js/conversion-tracking.js`**, loaded on 34 rebuilt-track pages plus,
  after this task, the 15 blog articles, `golden-triangle-agra-jaipur-delhi/`
  and `partners/`. Pushes `whatsapp_click`, `call_click`, `scroll_depth`
  (25/50/75/90%), `reviews_view`, `pricing_view`, `faq_toggle` (native
  `<details class="faq-acc">` only) into `window.dataLayer`, ready for a GTM
  container once one is configured (`GTM-NWDQLKM9` is already on every page,
  but no tags are yet built for these events - that is an account-side task,
  not a code task).
* **`js/booking.js`**, on `book/`: reads `?route=` to resolve a live price,
  and separately captures `utm_source` / `utm_medium` / `utm_campaign` /
  `gclid` from the URL into `localStorage` (`pst_utm_source` etc.) on page
  load.

## 1a. Homepage coverage and the two parallel event vocabularies

Added 2 Sep 2026: `index.html` now loads `js/conversion-tracking.js` with
`defer`, bringing the homepage to 39 pages total. Two things a future
maintainer must know before building GTM tags.

**The classifier was widened, not changed.** `ctaLocation()` previously knew
only rebuilt-track selectors, so four separate homepage CTAs all reported
`cta_location:"section"`. Each test now names both design systems' class for
the same control (`.mobile-bar, .mcta-bar` / `#hero, .hero` /
`.gr-wrap, .grx` / `#waBtn` or `.waf`). Every pair is a superset: rebuilt
pages carry both names on the same element, and `agra-to-mathura-taxi`,
`taj-mahal-taxi` and `agra-airport-taxi` were re-measured after the change -
header, hero, floating_bubble, mobile_bar and footer all still resolve
exactly as before, one event per click.

**Eight pages report the same tap under two vocabularies.** On any page that
loads `js/main.js` as well (the homepage, the blog, `book/`, `fleet/`,
`about/`, `contact/`, `route-finder/`, `agra-to-mathura-vrindavan/`), a
single tap produces:

| Tap | From `conversion-tracking.js` | From `main.js` (pre-existing) |
|---|---|---|
| WhatsApp CTA | `whatsapp_click` (+ `cta_location`, `cta_label`) | `whatsapp_enquiry` (+ `source_component`) and `whatsapp_booking` (the live Google Ads conversion, `AW-18103087307`) |
| Phone link | `call_click` (+ `cta_location`, `cta_label`) | `phone_click` (+ `call_number`) |

Measured, not assumed: each **name** fires exactly once per click, so nothing
is duplicated at the dataLayer level. Double-counting only appears if someone
builds GA4 tags on *both* names for the same action - so pick one vocabulary
per action when configuring the container. This pairing predates the homepage
change; it was already live on 18 pages.

## 2. What this task added (implemented, not just documented)

**Attribution now flows into every conversion-tracking.js event.**
`js/conversion-tracking.js` was extended (append-only; no existing event
shape changed) to:
* capture the same four URL parameters (`utm_source`, `utm_medium`,
  `utm_campaign`, `gclid`) into the same `pst_` -prefixed `localStorage` keys
  `js/booking.js` already uses, so a visitor who lands on any tracked page
  first stays attributed if they book later; and
* attach whichever of those four are present to **every** event the script
  pushes - `whatsapp_click`, `call_click`, `scroll_depth`, `reviews_view`,
  `pricing_view`, `faq_toggle`.

This is what makes a hotel-partner QR code or a paid-ad campaign traceable
to a click, not only to a completed booking: tag a link
`?utm_source=partner-<slug>&utm_medium=qr&utm_campaign=lobby-stand` and any
WhatsApp or call click on the page that visitor lands on now carries that
source in the dataLayer event, once a GTM tag is built to read it.

Verified: `node --check js/conversion-tracking.js` passes; the change is
purely additive (new function, new fields merged into the existing `push()`
call) and does not alter `page_route`, `cta_location`, `cta_label`, or any
other existing field.

## 3. A verified gap - not fixed in this task, flagged for a dedicated pass

**`js/booking.js` captures UTM parameters but never reads them back.**
Confirmed by reading the full file: `captureAttribution()` writes
`pst_utm_source` etc. to `localStorage`, but no other code in the file calls
`localStorage.getItem` for those keys. Separately, `netlify/functions/_helpers/email.js`
and `sheets.js` expect a `booking.utmSource` / `utmMedium` / `utmCampaign`
field on the booking record, but nothing in `booking.js` populates those
fields before the record is built - so today, a completed booking's UTM
fields in the email/sheet log will always read as blank, even though the
click that led to it was correctly tagged.

**Why this was not fixed in this task:** `js/booking.js` drives the live
payment-adjacent booking form on the site's highest-intent page. This
engagement's standing practice treats changes to shared, critical files as
their own dedicated, carefully-tested pass (the nav mega-menu rebuild in
entry #38 is the precedent: a script edited three times before it was
right, and only landing pages, not the booking flow, were at stake there).
Given the size of this task's other four parts, extending the safe,
side-effect-free `conversion-tracking.js` (done above) was the right scope
for this pass; touching the booking submission path was not.

**Recommended fix, for a dedicated follow-up:** in `js/booking.js`, at the
point the WhatsApp message and/or backend payload is assembled, read
`localStorage.getItem('pst_utm_source')` (etc.) and include the values in
both the outgoing WhatsApp text (as a hidden-from-the-guest but visible-to-you
suffix, or a short "Source: partner-x" line) and the fields
`email.js`/`sheets.js` already expect. This should be built and tested on
its own, verifying a real end-to-end booking with a tagged URL before it
ships.

**Operational consequence for Part C (hotel partners):** do not rely on
automatic attribution for partner bookings until this fix lands. The
`partners/index.html` page already discloses this honestly and names asking
every caller/WhatsApp enquiry "how did you hear about us" as the reliable
fallback in the meantime.

## 3a. Two different QR destinations - do not conflate them

`partners/index.html` and this plan both need to be precise about *which*
page a printed QR code should point to, because the audience differs:

* **Guest-facing QR** (placed in a hotel room, lobby stand, or key-card
  sleeve, for a traveller to scan): should point to **`book/`**, with a
  route pre-selected if the property mostly needs one service (e.g.
  `?route=agra-airport-taxi`), plus the UTM tags identifying the property -
  for example:
  `https://www.padmashreetravels.in/book/?route=agra-local-sightseeing&utm_source=partner-<hotel-slug>&utm_medium=qr&utm_campaign=guest-room`
  A guest wants to book a cab, not read about the referral arrangement.
* **Partner-recruitment QR** (on a card or flyer aimed at a hotel *manager*
  who has not yet agreed to anything): should point to **`partners/`**,
  since that is the page explaining the arrangement itself - for example:
  `https://www.padmashreetravels.in/partners/?utm_source=outreach&utm_medium=qr&utm_campaign=<context>`

Both patterns are captured correctly today by `conversion-tracking.js` on
every rebuilt-track page (including `book/` and `partners/`), per section 2
above. Pick the one matching who is actually holding the phone.

## 4. Tracking by task-requested category

| Category | Status | How |
|---|---|---|
| Tourist-segment CTA clicks | **Implemented (event-level)** | `cta_label` and `cta_location` on every `whatsapp_click`/`call_click` already identify which button; a segment-specific page (e.g. `taj-mahal-sunrise-taxi/`) is identified by `page_route`. No separate "segment" field exists or is needed - the page + button combination already answers "which tourist segment clicked what." |
| Partner QR source | **Implemented (click-level), gap at booking-record level** | See sections 2 and 3 above. |
| GBP (Google Business Profile) traffic | **Documented, not newly instrumented** | Every `proof__rev` / "Read our reviews on Google" link across the site already points to the one public profile (`https://g.page/r/CUjtXu1x_3bPEBM`), so GBP-to-site traffic is visible today only as referral traffic in standard web analytics (GA4/Search Console), not as a custom event - there is no on-site action to "arrive from GBP" beyond a normal pageview. No fabricated event was added for this; a real one would need a GA4 property actually connected, which is outside this task (no analytics account access exists in this engagement). |
| Blog-to-service clicks | **Implemented in entry #39** | Every blog article's `.bcta` buttons carry `data-cta`, and the shared script's existing `cta_location`/`cta_label` fields distinguish a blog article's contextual CTA from its end-of-article CTA. Unchanged by this task. |
| WhatsApp CTA position | **Implemented (pre-existing mechanism, extended in scope)** | `ctaLocation()` in `conversion-tracking.js` already classifies a click as `header`, `hero`, `mobile_bar`, `final_cta`, `floating_bubble`, `reviews`, `footer`, or `section`. The two new pages (`golden-triangle-agra-jaipur-delhi/`, `partners/`) use the same `data-cta`/`id="waBtn"` markup so this classification works on them unchanged. |
| Booking completion handoff | **Documented only - no new code** | The actual "booking completed" moment is a WhatsApp message send, which happens outside the browser (in the WhatsApp app) and cannot be observed by any on-site script - this is a structural limit of a WhatsApp-based booking flow, not a gap this task can close. The closest on-site proxy already exists: `js/booking.js`'s form-fill and submit-button flow on `book/`, which is a separate, already-built system from `conversion-tracking.js` and was not modified here beyond the attribution note in section 3. |

## 5. What was deliberately not built

* **No new analytics account, tag, or third-party script.** GTM's container
  is already present site-wide; configuring actual tags inside the GTM
  account is an account-access task, not a code task, and no such access
  exists in this engagement.
* **No passenger-identifying field added to any event.** Every field listed
  above is either a UI location, a button label (public button text, not
  user input), a page identifier, or a marketing-campaign label the
  business itself chose - never a name, phone number, or address.
* **No fix to the `js/booking.js` attribution gap** - see section 3 for why,
  and the recommended fix for whoever picks it up next.
