# Padma Shree Travels — UX, Conversion, Trust & Accessibility Audit

**Audited build:** `https://padmashreetravels-v2.vercel.app/`
**Audit date:** 12 September 2026
**Auditor role:** travel UX research · conversion strategy · brand design · accessibility · frontend QA
**Nature of this document:** expert inspection and heuristic judgement. It is **not** user research, and it contains **no measured conversion data**. Every estimate of booking impact is labelled as a hypothesis.

---

## 0. Read this first — two facts that frame everything

### 0.1 The build I audited is not the build your customers see

You asked me to audit `padmashreetravels-v2.vercel.app`. I did. But that is a **preview deployment**, and it is **not** what a real customer reaches.

| | Preview (audited) | Production (`www.padmashreetravels.in`) |
|---|---|---|
| `css/landing.css` | `e38fad602246…` | `531c725a09a4…` — **differs** |
| `css/style.css` | `f39d6246fb12…` | `c1ab3b7384be…` — **differs** |
| `js/reviews-grid.js` | `82b9aac7e792…` | `92b35f77319f…` — **differs** |
| Premium review section | present | **absent** |
| Retired "Verified reviews on Google" band | removed | **still live** |
| Sitemap entries | 56 | 54 |

Both domains return HTTP 200. Canonicals on the preview correctly point at `www.padmashreetravels.in`, so the preview will not be indexed separately — that part is set up correctly.

**Consequence:** every improvement in this report, and every improvement already built into the preview, is invisible to paying customers until production is redeployed from the same source. This is logged as **PST-01 (P0)** — not because anything is broken, but because the work is not reaching the people it was made for.

*Verification method: `sha256sum` of each asset fetched from both hosts, plus HTML content probes, 12 Sep 2026.*

### 0.2 Where automated contrast scanning misled me, and what survived

My first pass flagged **2,387 contrast failures on all 58 pages**. That number is wrong, and I want to be explicit about why, because it is the kind of figure that gets pasted into a roadmap unchallenged.

On manual verification:

| Flagged | Reported ratio | Reality |
|---|---|---|
| WhatsApp CTA label | 1.98–2.55:1 | **5.48–12.08:1.** The scanner compared the button's label to the *section* background instead of the button's own green. Not a defect. |
| Contact phone number | 3.0:1 | **19.8:1.** Wrong element resolved. Not a defect. |
| "PadmaShree" footer wordmark | 1.43:1 | Decorative, `aria-hidden="true"`, intentionally faint. Not a defect. |
| Review star glyphs, quote marks | 1.16–2.28:1 | Decorative, `aria-hidden`, with accessible text alternatives. Not a defect. |
| Floating WhatsApp bubble | "empty label" | Has `aria-label="WhatsApp"` on **all 56 pages**. Not a defect. |
| **Blog table headers** | **1.07:1** | **Real, severe, reproducible — see PST-02.** |
| `p.ctc-lbl` on /contact/ | 3.19:1 | **Real**, minor (PST-14). |
| `button.rf-pill` on /route-finder/ | 3.92:1 | **Real**, minor (PST-15). |

I also nearly filed two false P1s: a "missing `css/blog.css`" (it exists at `blog/css/blog.css` — my 404 probe used the wrong path) and a "broken homepage hero image" (the CSS `url()` resolves relative to the stylesheet, so `../images/` correctly resolves to `/images/` — verified 200, 155 KB).

**Everything asserted below has been individually verified.** Where I could not verify, I say so.

---

## 1. Executive assessment

This is a **well-built site with a genuinely differentiated commercial proposition that it under-defends**.

The engineering quality is above the category average: zero horizontal overflow across 58 pages × 4 viewports, one `<h1>` per page on all 59, `alt` text on every image, a skip link, visible focus rules on both design tracks, a 4-field booking form with correct `inputmode`/`autocomplete`, structured route-specific WhatsApp prefills, and a fast server (median TTFB 195 ms). That is a stronger foundation than either competitor I inspected.

The commercial proposition — **per-car fixed fares confirmed in writing, with tolls and parking named separately** — is the single most valuable thing here. The nearest benchmark (`goepicindia.com`) quotes **per person** and displays broken placeholder statistics ("0+ Happy Travelers", "0+ Years Experience"). Per-car pricing is a real advantage for the family and group segments this business serves.

The gap is **not** design quality. It is that the site asserts a great deal and evidences comparatively little, and that the operational facts a cautious stranger needs before messaging an unknown WhatsApp number are largely absent:

- **Cancellation/refund terms: 3 of 59 pages (5%)**
- **Payment methods: 11 of 59 pages (19%)**
- **Driver verification: 2 of 59 pages (3%)**
- **Insurance: 6 of 59 pages (10%)**
- **Years in operation: 0 of 59 pages**
- **GST / registration: 2 of 59 pages (3%)**

Meanwhile "Available 24/7" appears on **58 of 59 pages** and "verified" on 44 — claims the site makes confidently while omitting the checkable facts that would justify them. Both benchmark competitors lead with exactly those facts ("GST-registered… since 2009"; "For more than 15 years").

**The strategic recommendation is a swap: publish fewer adjectives and more verifiable specifics.** That is also the cheapest change available, because it is mostly writing, not engineering.

### The 10 highest-priority obstacles

| # | Obstacle | Why it ranks here | ID |
|---|---|---|---|
| 1 | Production serves an older build than the one audited | Nothing else in this report reaches customers until fixed | PST-01 |
| 2 | Blog table headers invisible (1.07:1) across 12 articles | Destroys the fare/itinerary tables that carry the transparency message | PST-02 |
| 3 | Cancellation & payment terms almost entirely absent | Highest-frequency pre-enquiry question with no on-site answer | PST-06 |
| 4 | "Available 24/7" on 58 pages, unverified and internally contradicted | Load-bearing promise for airport + sunrise journeys | PST-07 |
| 5 | Operating history, driver checks, insurance, GST absent | The exact facts a solo/international visitor checks before messaging | PST-23 |
| 6 | Homepage is 1.6 MB (1.55 MB images), no `srcset` | Served to the highest-intent journey: in-market, slow mobile | PST-08 |
| 7 | `/book/` absent from sitemap | Lowest-friction conversion surface, excluded from crawl hints | PST-05 |
| 8 | Fare overage rules thin (waiting 25%, night 14%, driver allowance 15%) | Primary cause of hesitation and of end-of-trip disputes | PST-18 |
| 9 | Broken/placeholder images on blog trust content | `your-image.jpg` with `alt="..."` shipping publicly | PST-03/04 |
| 10 | Enquiries cannot be tied to bookings | Optimising on WhatsApp clicks can grow noise, not revenue | PST-13 |

---

## 2. Strengths worth preserving

Do not let a redesign erode these.

1. **Per-car fixed-fare positioning with named exclusions.** Genuinely better than the benchmark set. Protect the wording.
2. **Structured WhatsApp prefills on route pages.** Route pages send a multi-line template: `Travel date: / Pickup time: / Pickup point in Agra: / Passengers: / Cab type: / One way or round trip: / Temple stops wanted:`. This simultaneously tells the visitor what to say and gives the operator a complete enquiry first time. This is the best conversion asset on the site. (The homepage does not do it — PST-24.)
3. **A 4-field booking form.** Name, phone, passengers, notes — 3 required. `type="tel"`, `inputmode="numeric"`, `autocomplete="tel"`, every field labelled, zero placeholder-only labels. Most competitors ask for more and get less.
4. **Review provenance done honestly.** Reviews are attributed to Google with a profile link, and the site does not fabricate an aggregate rating. Keep resisting that temptation.
5. **Technical hygiene.** Zero horizontal overflow at 360/390/768/1440 across 58 pages. One `<h1>` everywhere. Every image has `alt`. Skip link present. Focus-visible rules on both tracks.
6. **Fast origin.** Median TTFB 195 ms on live.
7. **Honest no-JavaScript fallback** on the review section.

---

## 3. Heuristic scorecard

Expert judgement on stated criteria. **Not** measured conversion performance. 1 = poor, 5 = excellent.

| Dimension | Score | Criteria applied | Basis |
|---|---|---|---|
| First impression & visual quality | **4.0** | Hierarchy, typography, spacing, photography, consistency at 4 viewports | Coherent premium teal system; real fleet/destination photography; strong mobile composition |
| Trust & legitimacy | **2.5** | Identity, contact consistency, verifiable credentials, review authenticity | Reviews handled honestly; but 0/59 pages state operating history, 3% mention driver checks |
| Pricing & trip clarity | **3.0** | Per-car basis, inclusions/exclusions, overage rules, payment/cancellation | Strong on toll/parking (83%) and AC (83%); weak on cancellation (5%), payment (19%), night (14%) |
| International visitor experience | **2.5** | Plain English, INR clarity, arrival planning, non-WhatsApp alternatives | Dedicated international content exists; language support mentioned on 2 pages; no non-WhatsApp/phone path |
| Booking & conversion | **4.0** | CTA clarity, prefill quality, form friction, context preservation | Excellent prefills and a genuinely short form; homepage prefill is the weak link |
| Content & discovery | **3.5** | Navigation, route discovery, FAQ, blog→service journeys | Good internal linking and route finder; 12 blog fare tables are unreadable |
| Accessibility | **3.5** | Contrast, keyboard, targets, headings, alt, zoom | Strong fundamentals; one severe contrast defect, 20 pages with heading skips, sub-24px targets |
| Performance | **3.0** | Weight, images, render blocking | Fast TTFB; homepage 1.6 MB with no `srcset` and no LCP preload |
| Measurement | **2.5** | Event coverage, attribution, enquiry→booking link | GTM/GA4/Ads all live and firing; two competing vocabularies; no booking reconciliation |

**Weighted overall: 3.2 / 5** — a strong build whose weakest dimensions (trust evidence, measurement, international support) are the ones that most directly gate bookings.

---

## 4. Findings by tourist journey

Expert walkthroughs from entry page to **the point immediately before an enquiry is sent**. No messages were sent, no calls placed, no forms submitted. Observations are marked **[O]**; behavioural inferences are marked **[H] hypothesis**.

### Journey A — First-time international visitor booking Agra sightseeing
**Entry:** `/agra-local-sightseeing/` or `/` · **Intent:** "Can I trust this operator, and what will it actually cost?"

**Needs answered:** who operates this; is the price per car or per person; what is excluded; how do I pay; what if my plans change; will the driver speak English.

- **[O] Works well:** per-car framing, named exclusions (tolls/parking), monument-by-monument itinerary, dedicated international content on 7 pages.
- **[O] Obstacle:** no operating history, GST/registration, insurance or driver-verification statement anywhere on the page or site (0%, 3%, 10%, 3% of pages respectively).
- **[O] Obstacle:** entry-ticket treatment appears on only 41% of pages — for a monument city this is the most-asked cost question.
- **[O] Obstacle:** English-language support is mentioned on 2 of 59 pages.
- **[H]** A first-time visitor comparing three operators will choose the one that states its registration and years of operation, because that is the only legitimacy signal available before payment.
- **Recommended CTA:** `Get your written fare — reply within working hours` (sets an honest expectation rather than "instantly").

### Journey B — Delhi Airport → Agra pickup
**Entry:** `/agra-to-delhi-airport-taxi/` · **Intent:** "Will someone reliably meet me after a long-haul flight?"

- **[O] Works well:** the airport prefill is the best on the site — it asks for `Flight number:` and `Arrival or departure date/time:`, which is exactly right.
- **[O] Obstacle:** no stated meeting-point procedure (which terminal door, what sign, what if the flight is late), and no timezone anchoring for a traveller booking from abroad.
- **[O] Obstacle:** the "24/7" claim carries the most weight on this journey and is the least substantiated.
- **[H]** Flight-delay handling is the deciding question for airport transfers; its absence pushes travellers to aggregators who state it explicitly.
- **Recommended CTA:** `Send your flight number — we'll confirm the meeting point in writing`.

### Journey C — Indian family planning Mathura–Vrindavan
**Entry:** `/agra-to-mathura-taxi/`, `/mathura-vrindavan-tour-from-agra/` · **Intent:** "One car, whole family, temples covered, no arguments at the end."

- **[O] Works well:** the strongest journey on the site. Per-car pricing, "driver waits during darshan", temple-stop field in the prefill, clear one-way vs round-trip.
- **[O] Obstacle:** waiting/extra-km terms on 25% of pages, so "driver waits" has no stated limit.
- **[H]** Families self-select into round trips when the round-trip price is shown beside the one-way price; 12 blog pages show fares without that pairing.

### Journey D — Senior travellers
**Entry:** `/blog/senior-citizen-temple-tours-from-agra/` · **Intent:** "Will this be physically manageable, and can I speak to a person?"

- **[O] Obstacle:** the phone link — the primary path for this group — is **21 px tall** (`a.link-call`, measured at 390 px), below the 24 px minimum target size (PST-17).
- **[O] Obstacle:** this article is one of the 12 with **invisible table headers** (PST-02); its itinerary table is exactly the content this audience needs.
- **[O] Works well:** genuinely useful content on pacing and temple access.
- **Recommended CTA:** make the phone number a primary button, not a text link, on senior-focused pages.

### Journey E — Solo traveller assessing safety
**Entry:** `/about/`, `/fleet/` · **Intent:** "Is this a real, accountable business?"

- **[O] Obstacle:** the decisive journey for the trust gap. Driver verification 3%, insurance 10%, years operating 0%, GST 3%. `/about/` also has 2 heading-level skips.
- **[O] Works well:** real fleet photography; named vehicles (Dzire, Innova, Ertiga); a physical address in the footer; honest Google review attribution.
- **[H]** A solo traveller — particularly a solo woman — looks for driver-verification wording specifically. Its absence is a silent exit with no analytics signature.

### Journey F — In Agra, slow mobile connection
**Entry:** `/` on 3G/390 px · **Intent:** "Book a cab in the next ten minutes."

- **[O] Obstacle:** the highest-intent visitor is served the **heaviest page: 1,603 KB, of which 1,546 KB is imagery**, with `srcset` on 0 of 15 images and no LCP preload.
- **[O] Obstacle:** the homepage WhatsApp prefill is the weakest on the site (a single `Route: ___ | Date: ___` line versus the route pages' structured template).
- **[O] Works well:** fixed mobile CTA bar with Call / WhatsApp / Book Online, with body padding reserved so it never covers content (verified at 390 and 320).
- **[H]** On a congested Agra mobile network, a 1.5 MB image payload delays the CTA for the visitor most likely to convert today.

---

## 5. Findings by template

| Template | Pages | Principal findings |
|---|---|---|
| Legacy homepage (`css/style.css`) | 1 | 1.6 MB weight (PST-08); weakest prefill (PST-24); 1 of 7 CTAs has `data-cta` (PST-11); FAQ link missing `target`/`rel` (PST-10) |
| Rebuilt route pages (`css/landing.css`) | 37 | Strongest template. Structured prefills, consistent CTAs, zero overflow. Fare overage terms thin (PST-18) |
| Blog articles (`blog/css/blog.css`) | 16 | **Invisible table headers (PST-02)**; heading skips; 2 broken images (PST-03/04); fares shown without one-way/round-trip pairing |
| Utility (`/about/`, `/contact/`, `/fleet/`, `/route-finder/`, `/book/`) | 5 | Best-in-class booking form; contrast misses on `/contact/` and `/route-finder/` (PST-14/15) |
| Internal (noindex) | 6 | Excluded from audit. One orphan icon generator (PST-22) |

---

## 6. Proposed homepage section order

Each section states its job, the proof it must carry, and its CTA. This is a **re-sequencing and evidence proposal**, not a redesign — the existing visual system is good.

| # | Section | Purpose | Required proof | CTA |
|---|---|---|---|---|
| 1 | Hero | Say what, where, and on what terms | Fixed per-car fare, Agra-based, written confirmation | `Get your written fare on WhatsApp` |
| 2 | Credentials strip *(new)* | Answer "are you real?" before anything else | **Year established · registration/GST · driver-check statement · insurance status** — all owner-verified | — |
| 3 | Popular routes | Let visitors self-identify | From-fare per car, duration, one-way vs round-trip | `See route & fare` |
| 4 | How booking works | Remove process uncertainty | 3 steps; name what is confirmed in writing | `Start on WhatsApp` |
| 5 | What the fare covers | The differentiator | Included vs paid-separately, **plus km/hour allowance and the rate beyond it** | `Ask about your route` |
| 6 | Reviews | Third-party validation | Google-sourced, linked, no invented aggregate | `Read reviews on Google` |
| 7 | Fleet | Match car to group | Capacity, luggage, AC, named models | `Ask which cab fits` |
| 8 | International visitors | Reduce first-time-in-India friction | INR clarity, airport meeting point, **language support** | `Plan from abroad` |
| 9 | Booking terms *(new)* | Remove the final objection | **Payment methods, when payment is due, cancellation window, refund handling** | `Read full terms` |
| 10 | FAQ | Catch residual questions | Existing FAQPage schema | — |
| 11 | Final CTA | Convert | Restate fixed fare + written confirmation | `Get your fare` |

The two new sections (2 and 9) are the highest-value additions on the site and require **no design work** — only owner-verified facts.

---

## 7. Improved mobile enquiry journey

**Today:** Homepage → scroll → tap WhatsApp → app opens with `Route: ___ | Date: ___ | Passengers: ___` → visitor types freeform → operator asks 3 follow-up questions.

**Proposed:**

1. **Hero CTA** → `Get your written fare on WhatsApp`
2. **Route chooser before handoff.** A one-tap route list (Mathura / Vrindavan / Taj sunrise / Delhi airport / Other) so the prefill can name the route.
3. **Structured prefill adopted from route pages:**
   ```
   Hi Padma Shree Travels, I need a cab from Agra.

   Route:
   Travel date:
   Pickup time:
   Pickup point in Agra:
   Passengers:
   One way or round trip:
   ```
4. **Keep the fallback.** The fixed bar retains Call for visitors who will not use WhatsApp, plus `/book/` for those who use neither.
5. **Set an honest expectation** next to the CTA — replace "within minutes" with owner-confirmed working hours.

**Why this should work [H]:** the structured template already exists and demonstrably produces complete enquiries on route pages. Extending it to the highest-traffic entry point is a copy change, not a build.

---

## 8. Exact before/after copy

Each requires owner confirmation where marked.

**8.1 The 24/7 claim** *(58 pages — PST-07)*
> **Before:** "Available 24/7."
> **After (if unqualified availability cannot be evidenced):** "Call or message us to check availability for your travel time — we confirm before you book."

**8.2 Response time** *(30 pages — PST-19)*
> **Before:** "We confirm within minutes."
> **After:** "We usually reply during working hours, [OWNER: state hours]. You'll have your fare in writing before you commit."

**8.3 Hidden charges** *(21 pages)*
> **Before:** "No hidden charges. No surge pricing."
> **After:** "Your fare is agreed in writing before travel. Tolls and parking are charged at actual cost and shown separately — nothing else is added."

**8.4 Driver claim** *(44 pages use "verified")*
> **Before:** "Private AC cab with a verified local driver."
> **After (only if evidenced):** "Private AC cab with a local driver we've worked with for [N] years. [OWNER: state what checks are performed.]"
> **After (if not evidenced):** "Private AC cab with an experienced local driver. Driver name, mobile number and car number are shared before pickup."
> *The second version is already true — the site says it elsewhere — and is stronger because it is checkable.*

**8.5 New credentials strip** *(all fields require owner verification)*
> "Padma Shree Travels has operated from Agra since [YEAR]. [Registration/GST: NUMBER]. Our cabs are commercially registered and insured. Driver name, mobile number and vehicle number reach you before every pickup."

**8.6 New booking terms block**
> "**Paying:** [OWNER: methods]. No advance is required for most bookings. **Changing or cancelling:** tell us at least [OWNER: window] before pickup and there is no charge. **After that:** [OWNER: policy]."

---

## 9. Owner-verification questions

Nothing below should be published until answered. These are the facts that would most improve trust, and I could not find evidence for any of them on the site.

1. What year did Padma Shree Travels begin operating?
2. Is the business GST-registered? If so, the number, and are GST invoices available on request?
3. What checks are performed on drivers (licence, police verification, tenure)? Please describe precisely, without overstating.
4. Are the vehicles commercially registered and insured? What cover applies to passengers?
5. **Is unqualified 24/7 availability accurate?** If not, what are the real hours, and what notice is needed for a 04:00 sunrise or a late-night airport run?
6. What is the realistic first-response time by WhatsApp, by hour of day?
7. What payment methods are accepted, and when is payment due?
8. What is the cancellation window, and what (if anything) is charged after it?
9. What km/hour allowance is included in each quoted fare, and what is the rate beyond it?
10. How are night charges applied, and from what hour?
11. What happens if a flight is delayed — is waiting time free, and for how long?
12. Which languages can drivers reliably support?
13. Are the reviews shown on site the complete Google set, or a selection? (Affects how they may be described.)

---

## 10. Measurement plan and testable hypotheses

**Current state [O]:** GTM `GTM-NWDQLKM9`, GA4 `G-P3WJ9FXDF2` and Google Ads `AW-18103087307` are all present and firing. `js/conversion-tracking.js` emits `whatsapp_click`, `call_click`, `scroll_depth`, `reviews_view`, `pricing_view`, `faq_toggle`. `js/main.js` independently emits `whatsapp_enquiry` + `whatsapp_booking` and `phone_click`. Measured: one WhatsApp tap produces 3 dataLayer entries; one phone tap produces 2. Each *name* fires once, so nothing double-counts at dataLayer level — but a GTM tag built on both names for one action would.

**Fix first**
1. Pick one vocabulary per action in GTM; document the authoritative one (PST-12).
2. Add `data-cta` to all homepage WhatsApp CTAs so `cta_location` is meaningful (PST-11).
3. Track `/book/` form starts, validation failures and successful submissions — currently only `fare_finder_start`/`complete` exist.

**Separate intent from revenue (PST-13)**
A WhatsApp click is intent. Recommended minimum: add a short per-page booking reference to the prefill (e.g. `Ref: MAT-07`) and have the operator record it on confirmation. That yields enquiry→booking conversion **by page** without collecting any additional personal data.

**Testable hypotheses** — each falsifiable, none with an invented uplift figure:

| # | Hypothesis | Change | Primary metric | Guardrail |
|---|---|---|---|---|
| H1 | A credentials strip increases enquiry rate from first-time international visitors | Add section 2 | `whatsapp_click` rate on international-entry pages | No drop in overall enquiries |
| H2 | Structured homepage prefill increases *complete* first messages | PST-24 | Operator-logged follow-up questions per enquiry | Enquiry volume stable |
| H3 | Publishing cancellation/payment terms reduces pre-enquiry abandonment | PST-06 | Scroll-to-CTA rate on `/book/` | Cancellation rate |
| H4 | Halving homepage image weight improves mobile enquiry rate | PST-08 | `whatsapp_click` at ≤414 px | LCP, bounce |
| H5 | A phone *button* on senior pages outperforms a text link | PST-17 | `call_click` on those pages | Total enquiries |

---

## 11. Sequenced implementation plan

### Immediate (this week) — defects and delivery
1. **PST-01** Redeploy production from the audited source; add a parity check.
2. **PST-02** One-line CSS fix for blog table headers (12 articles).
3. **PST-03/04** Remove `your-image.jpg`; restore or repoint `founder-braj-plains.webp`.
4. **PST-05** Add `/book/` and `/agra-to-mathura-vrindavan/` to `sitemap.xml`.
5. **PST-10** Add `target`/`rel` to the FAQ WhatsApp link.

### Next sprint — trust and clarity (the highest-value block)
6. **PST-07 / PST-19** Resolve claim wording once the owner answers §9.
7. **PST-23** Publish the credentials strip.
8. **PST-06 / PST-18** Publish booking terms and fare-overage terms; link from every fare surface.
9. **PST-24** Adopt the structured prefill on the homepage.
10. **PST-11 / PST-12** Fix attribution and settle the event vocabulary.

### Later — performance, accessibility polish, measurement maturity
11. **PST-08** Responsive images and LCP preload.
12. **PST-09** Heading-order corrections (20 pages).
13. **PST-14/15/16/17** Remaining contrast and target-size fixes.
14. **PST-13** Enquiry→booking reconciliation.
15. **PST-20/21/22** Repo hygiene.

---

## 12. Benchmarks

Inspected 12 September 2026. Kept deliberately secondary. No competitor conversion data is available and none is invented.

| Site | Worth adopting | Worth avoiding |
|---|---|---|
| [tajmahalcabs.com — Agra sightseeing fares](https://tajmahalcabs.com/agra/agra-local-sightseeing-taxi-fare/) | Explicit **"fare is per vehicle"** statement; a vehicle × capacity × fare table (Hatchback 1–3 ₹2,200 → Mini Coach 6–12 ₹6,800); separate **Included** and **Excluded** lists; prompts the reader to confirm km limits | Fares only "from"; no GST/tax breakdown; 81 Google reviews shown without a profile link |
| [goepicindia.com](https://goepicindia.com/) | Leads with "GST-registered… operating since 2009" — exactly the credentials Padma Shree omits | **Per-person** pricing; broken placeholder stats ("0+ Happy Travelers", "0 Google Rating"); "#1 Rated" with no substantiation; no inclusions/exclusions |
| [tajtaxiagra.com](https://www.tajtaxiagra.com/) | Broad service taxonomy (local, one-way, outstation, airport, railway) mirroring how visitors search | Generic trust language |

**Adapt, specifically:** tajmahalcabs' vehicle×capacity×fare table and its Included/Excluded lists — Padma Shree already has the underlying facts and states them better, but scatters them. Consolidating into one reusable component would put this site ahead of both.

---

## 13. Limitations and untested areas

Stated plainly so nothing here is over-read.

**Tested:** 58 of 59 public pages rendered at **360 × 800, 390 × 844, 768 × 1024 and 1440 × 900** (Chrome headless 152, local mirror verified byte-identical to the preview deployment). Static parse of all 65 HTML files. Live HTTP checks against both the preview and production hosts. Link integrity across the repository. Live page-weight and TTFB measurement.

**Not tested — do not infer these are sound:**
- **No real device testing.** All viewport work was emulated. Touch accuracy, iOS Safari behaviour, and Android keyboard overlap are **untested**.
- **No screen-reader pass.** Accessibility findings are from computed styles and DOM structure only. No NVDA/JAWS/VoiceOver session was run. **An automated scan cannot establish WCAG conformance, and none is claimed.**
- **No form submission.** `/book/` was inspected structurally; validation messages, error announcement and success behaviour are **untested**, per your instruction not to submit live enquiries.
- **No WhatsApp or call testing.** Deep links were read, never activated. Whether the prefill renders correctly in WhatsApp on iOS/Android is **untested**.
- **No field performance data.** All performance figures are lab measurements from one connection on one machine. There is **no CrUX/real-user data**, and lab numbers do not predict field metrics.
- **Contrast sampling is partial.** Text over gradients and photographs was deliberately skipped (no reliable single background colour). Those areas are **unverified**.
- **Production was not fully audited** — only enough to establish that it differs from the preview. Findings apply to the **preview build**.
- **No cross-browser testing.** Chromium only; Safari and Firefox **untested**.
- **Reviews were not independently verified** against the Google profile.
- **Business facts could not be verified.** Everything in §9 is unknown to me and must come from the owner.

---

## 14. The first 10 changes I would make, in order

1. **Redeploy production** (PST-01). Nothing else matters until the site customers reach is the site you have been improving. It is also the cheapest item here.
2. **Fix the blog table headers** (PST-02). A one-line CSS change repairs 50 invisible headers across 12 articles. Highest repair-value-per-minute on the list.
3. **Answer the 13 owner questions** (§9). This unblocks items 4, 5 and 6 and is the true critical path — it needs the owner, not a developer, so start it early.
4. **Publish the credentials strip** (PST-23). The largest trust gap, addressable with facts you already possess. Both competitors do this; you do not.
5. **Publish booking terms** (PST-06). Cancellation and payment are on 5% and 19% of pages. This is the last objection before an enquiry.
6. **Resolve the 24/7 claim** (PST-07). Currently asserted on 58 pages and contradicted by your own driver material. It is both a trust risk and an operational one.
7. **Remove the broken/placeholder images** (PST-03/04). `your-image.jpg` with `alt="..."` is the single most damaging detail on the site for a "real local operator" positioning.
8. **Add `/book/` to the sitemap** (PST-05). Two lines; makes your lowest-friction conversion surface discoverable.
9. **Adopt the structured prefill on the homepage** (PST-24). Copy-only change that extends your best-performing asset to your highest-traffic page.
10. **Publish fare-overage terms** (PST-18). Turns "driver waits" from a promise into a specific, checkable commitment — and pre-empts end-of-trip disputes.

Items 1, 2, 7 and 8 are a day's work combined. Items 3–6 are writing, gated on the owner. Only items 9–10 touch the conversion path, and both are copy rather than engineering — which is the strongest signal in this audit: **the highest-value work remaining here is editorial, not technical.**

---

*Artifacts: `audit/UX-ISSUES.csv` (24 issues), `audit/PAGE-COVERAGE.csv` (65 rows), `audit/screenshots/`. No production code, content, configuration or deployment was modified.*
