# Production Claim & Policy Consistency Audit

**Date:** 31 August 2026
**Scope:** 57 public production pages (7 internal/`noindex` pages excluded)
**Method:** HTML comments **and** JS/CSS comments stripped before scanning, so
developer notes never create a false positive. JSON-LD deliberately preserved
during stripping so schema claims are still caught.

**Outcome:** 34 replacements across **5 files**. 12 claim occurrences removed,
20 softened, and the rest retained with evidence.

---

## How to read this

| Label | Meaning |
|---|---|
| **[VERIFIED]** | Measured or read directly from the code. Reproducible. |
| **[EVIDENCE]** | Supporting material found inside the project. |
| **[NO EVIDENCE]** | Searched for; nothing verifiable found. |
| **[OWNER]** | Requires the business owner to confirm before it can be republished. |

---

# 1. The central evidence finding

Three claims - **commercially insured**, **verified drivers**, **sanitised
before every trip** - were removed. The reason matters, because at first sight
the project *does* appear to support them.

**[VERIFIED]** The claims appear in three project documents:

| Document | What it says |
|---|---|
| `docs/marketing-context.md` | "All vehicles sanitised before every trip, commercially insured." |
| `docs/padma-shree-travels-seo-growth-plan.md` | Proposes "Commercially insured cabs" and "verified drivers" as copy |
| `docs/religious-pages-copy.md` | "Commercially insured cabs, verified drivers." |

**None of these is evidence.** All three are **marketing copy documents** -
they instruct what to *say*, not records of what is *true*. And
`docs/marketing-context.md` carries this header:

> *"Auto-drafted from website scan - May 2026 - Review and correct anything
> that's wrong"*

**[VERIFIED]** It was generated **from the website itself**. The website said
the vehicles were insured, so the document recorded that the website said it.
Citing it back as proof is circular.

**[NO EVIDENCE]** A search for a verifiable artefact - insurance certificate,
policy number, driver-verification record, compliance file - returned
**nothing**. The only near-match is
`images/01 Fleet/Taxi_permit_stickers_on_windshield.png`, a **photograph of
windshield stickers**, which is not documentation of anything.

**Conclusion.** These are safety, insurance and legal representations with no
verifiable support inside the project. Under the implementation rule they were
removed from public view and flagged for owner confirmation. **They can be
restored immediately** if the owner supplies the underlying documents - the
wording is preserved in section 6.

---

# 2. Claims REMOVED

| Claim | Pages | Occurrences | Zones | Replaced with |
|---|---|---|---|---|
| **"commercially insured"** | `index.html`, `about/` | **3** | visible + FAQPage schema | Removed. Fleet sentence now: *"All vehicles are air-conditioned, cleaned before every trip and regularly maintained."* |
| **"verified drivers"** | `index.html`, `about/` | **5** | meta description, og:description, twitter:description, visible badge, visible body | *"Fixed fares, driver details before pickup."* Badge: *"Driver Details Before Pickup"* |
| **"sanitised before every trip"** | `index.html`, `about/` | **4** | visible + FAQPage schema + figure caption | *"cleaned before every trip"* / *"Cleaned between trips"* |

**Detail - `index.html`:**
* Fleet answer appeared **twice**, identically, in the visible FAQ **and** in
  the `FAQPage` structured data. Both replaced together so schema and visible
  still agree. **[VERIFIED]** 2 occurrences of the new wording.
* `verified drivers` sat in **all three social/meta descriptions**. All three
  replaced. **[VERIFIED]** 3 occurrences of the new wording.

**Detail - `about/`:** *"Our vehicles are commercially insured, our drivers are
verified and know their routes well"* became *"Our drivers know their routes
well"* - the route-knowledge part is ordinary and was kept.

**Note on `about/`:** the page still uses the image file
`images/fleet/fleet-sanitising.webp`, but its `alt` text ("Cab interior being
cleaned between trips") and caption ("Cleaned between trips") no longer make a
sanitisation claim. **[OWNER]** the *filename* is cosmetic and was not renamed,
because renaming a production asset is outside this phase.

---

# 3. Claims SOFTENED

## 3.1 Punctuality guarantee - and a resolved contradiction

**[VERIFIED]** `index.html` said:

> *"Our Agra airport taxi service **guarantees** a clean, **on-time** AC car at
> arrivals."*

**[VERIFIED]** `agra-to-delhi-airport-taxi/index.html` said the opposite, in
visible text **and** schema:

> *"**We cannot guarantee** an exact arrival time in unpredictable traffic, so
> extra buffer is always safer."*

Two production pages contradicted each other on the same subject. Traffic is
not something the business controls, so the guarantee was the side that had to
give.

**Now:** *"Our Agra airport taxi service provides a clean AC car, with the
pickup planned around your arrival time."*

The Delhi airport page was **left untouched** - its honest wording was already
correct.

## 3.2 "Unlimited waiting" -> bounded to the booked day

**[VERIFIED]** `agra-karauli-kaila-devi-balaji-tour/` used *"unlimited
waiting"* in 6 places - but its own schema and FAQ already bounded it as
*"within the tour day"*. The page contradicted itself.

**Now consistently:** *"waiting at both temples **within the booked tour
day**"*, and the stat label *"2 Temples, Driver Waits"*. This matches the
bound the page already stated, so nothing was invented.

## 3.3 Cancellation policy - removed from metadata and schema

Per instruction, the two-hour policy is **not** published site-wide until
confirmed, and has been withdrawn from promotional metadata and structured
data.

**[VERIFIED] Before:** 14 occurrences across 2 pages, in meta description,
og:description, `Service` schema, `FAQPage` schema and visible text.

| Page | Zone | Before | After |
|---|---|---|---|
| `book/` | meta description | "No advance payment, free cancellation up to 2 hours before." | "No advance payment for most bookings." |
| `book/` | og:description | "...and free cancellation up to 2 hours before pickup." | "No advance payment for most bookings." |
| `book/` | FAQPage schema + visible | "Free cancellation up to 2 hours before pickup..." | "**Ask us about cancellation before confirming your booking**, and we will tell you where you stand..." |
| `book/` | visible trust chip | "Free cancellation (2 hrs before)" | "Ask us about cancellation" |
| `book/` | visible step | "...Free cancellation up to 2 hours before pickup if plans change." | "...If your plans change, ask us about cancellation before you confirm." |
| `agra-to-sirsaganj/` | meta + twitter description | "...free cancellation up to 2 hours before." | "...fixed in writing before you travel." |
| `agra-to-sirsaganj/` | `Service` schema | "...and free cancellation up to 2 hours before pickup." | Clause removed |
| `agra-to-sirsaganj/` | FAQPage schema + visible | "Free cancellation up to 2 hours before pickup..." | "**Ask us about cancellation before confirming your booking**..." |
| `agra-to-sirsaganj/` | proof strip | "Free Cancellation, 2 Hrs Before" | "Ask Us About Cancellation" |
| `agra-to-sirsaganj/` | why-us card | "Free Cancellation - Up to 2 hours before pickup" | "No Advance Payment - ...ask us about cancellation before you confirm." |
| `agra-to-sirsaganj/` | final CTA | "Free cancellation 2 hrs before." | "No advance payment for most bookings." |

**"No advance" was not over-stated.** The replacement wording keeps the
existing site-wide hedge - *"for **most** bookings"* - and never implies that
all bookings are advance-free. **[VERIFIED]** all 80 occurrences of the
no-advance claim across 32 pages carry that hedge.

**[VERIFIED]** Visible text and schema now match exactly on both pages
(answer diffs: 0).

---

# 4. Claims RETAINED, with evidence

| Claim | Pages | Occ. | Why retained |
|---|---|---|---|
| **Driver details before pickup** | 34 | 123 | **[EVIDENCE]** Corroborated by a customer review in `js/reviews-data.js` (`review-014`: *"Confirmed fare, driver shows up, no cancellations"*) and stated identically across the whole rebuilt set. It is also now the *replacement* for "verified drivers" - it describes a practice, not a vetting standard. **[OWNER]** confirm it holds every time. |
| **No advance payment for most bookings** | 32 | 80 | Hedged with "for most" everywhere. Consistent with `book/`, which takes no payment. |
| **No surge / no hidden fees** | 20 | 34 | Consistent with published fixed fares corroborated across three sources (fare hub, route page, `js/booking.js`). |
| **Cleaned before every trip** | several | - | Ordinary operational statement, not a health/sanitisation claim. Deliberately kept as the softer replacement. |
| **Vehicle availability - "subject to confirmation"** | `fleet/`, `book/` | 8 | **[EVIDENCE]** This is already the honest form: *"larger vehicles are arranged per trip... confirm availability and fare before you plan around it."* Model wording; left exactly as-is. |
| **Holiday/festival availability** | 15 | 35 | Stated as availability ("we run every day including festivals"), not as guaranteed capacity. **[OWNER]** confirm; consider adding "advance booking is recommended during busy periods". |
| **Response time - "usually replies within minutes"** | 28 | 51 | Hedged with "usually". **[OWNER]** confirm it is realistic. |
| **No unnecessary stops** | `agra-to-shikohabad/` | 3 | **[EVIDENCE]** Attributed to a named customer review, not asserted by the business. |
| **"We cannot guarantee an exact arrival time"** | `agra-to-delhi-airport-taxi/` | 3 | Honest limitation. Protected - do not "tidy" this away. |
| **"however long it takes"** (waiting) | `agra-to-bateshwar/`, `agra-to-shikohabad/` | 2 | **Deliberately NOT changed.** Unlike the Karauli page, these do not contradict anything on their own page, and the phrase is bounded by the single-day trip being described. Changing it would be over-reach. **[OWNER]** confirm there is no hour cap. |

**Zero occurrences found** for: guaranteed availability, cheapest / best price
/ number-one / top-rated superlatives. **[VERIFIED]** The site is already clean
of superlative claims.

---

# 5. False positives - scanned, read, and correctly left alone

Stripping comments before scanning mattered. **[VERIFIED]** these pages
mention the claims **only inside developer comments** and are not
customer-facing:

| Family | Comment-only pages |
|---|---|
| commercially insured | **18** |
| sanitised | **13** |
| verified drivers | **11** |
| safety claims | 4 |
| guaranteed punctuality | 1 |

Those are the page-header notes recording *why* a claim was removed during the
earlier rebuild. Had comments not been stripped, this audit would have
"found" 18 insurance claims and damaged its own documentation.

**Other verified false positives:**

* **`css/style.css`** - *"cancel the .container gutter"* is a layout comment.
* **`js/reviews-data.js`** - *"driver cancelled last minute"* is review text.
* **`agra-to-tundla/`** - the heading *"Bookings That Do Not Get Cancelled"*
  is a **trust message about drivers not cancelling**, the opposite subject to
  a cancellation policy. Not a policy statement; correctly untouched.
* **`book/` "Child seat"** - appears only as a form **placeholder** suggesting
  what to type. It is not an availability claim. **[OWNER]** confirm whether
  child seats can actually be provided; if not, the placeholder should change.

---

# 6. Owner decisions required

Nothing below is published today. Each item can be restored or amended once
confirmed.

| # | Question | If confirmed, restore | Risk if wrong |
|---|---|---|---|
| **1** | **Are the vehicles commercially insured?** Please supply the policy. | "Commercially insured" may return to `index.html` and `about/` | Insurance misrepresentation |
| **2** | **Are drivers verified, and by what process?** (police verification, licence check, in-house?) | "Verified drivers" may return - but state *what* verification means | Safety misrepresentation |
| **3** | **Are vehicles sanitised, or cleaned?** The page now says "cleaned". | "Sanitised" may return with a description of the process | Health claim |
| **4** | **Is "free cancellation up to 2 hours before pickup" the real policy?** | Restore across metadata, schema and visible text - and apply it **site-wide**, not on 2 pages | Contract term |
| **5** | **Does "driver details before pickup" hold every time?** It now carries the trust load that "verified drivers" used to. | - | It is now the site's primary trust signal |
| **6** | **Is there genuinely no night surcharge?** Stated 12 times on 2 pages. | Extend site-wide if true | Pricing term |
| **7** | **Is waiting bounded by the booked day** on the Karauli tour? Wording now says so. | - | Service term |
| **8** | **"No shopping or commission stops"** on the Karauli tour - operationally committed? | Extend site-wide if true - it is the strongest international-visitor signal available | Service term |
| **9** | **Can child seats be provided?** Currently only a form placeholder. | Add as a real service | Family-segment expectation |
| **10** | **Is "usually replies within minutes" realistic** at 2 AM? | Consider "usually within minutes during the day" | Response expectation |
| **11** | **Festival capacity** - availability is claimed, capacity is not. | Consider adding "advance booking recommended during busy periods" | Availability expectation |

---

# 7. Files changed

| File | Lines changed | What |
|---|---|---|
| `index.html` | +8 / -8 | Insurance, sanitisation, verification (meta x3, badge, FAQ x2 zones), punctuality guarantee |
| `about/index.html` | +2 / -2 | Insurance + verification sentence, sanitisation caption |
| `book/index.html` | +7 / -7 | Cancellation removed from meta x2, schema, visible x3 |
| `agra-to-sirsaganj/index.html` | +8 / -8 | Cancellation removed from meta x2, `Service` schema, `FAQPage` schema, visible x4 |
| `agra-karauli-kaila-devi-balaji-tour/index.html` | +12 / -12 | "Unlimited waiting" bounded x6; FAQ schema resynced to visible text |

**Total: 5 files, +37 / -37 lines, 34 replacements.**

**[VERIFIED] Not changed:** the two locked reference pages
(`agra-to-jaipur-taxi/`, `agra-local-sightseeing/`) retain their 29 August
timestamps and were not edited. No other production page, stylesheet, script,
image, redirect or configuration file was modified. `sitemap.xml` and
`robots.txt` were not touched.

---

# 8. Verification performed

| Check | Result |
|---|---|
| Claim scan re-run after changes | **0 targeted claims remain** in live markup |
| Comment false positives | Confirmed: 18/13/11 comment-only pages correctly excluded and **not** edited |
| JSON-LD validity | **17 blocks across 5 pages, all parse. 0 invalid.** |
| Visible vs schema agreement | `index.html` 10/10, `book/` 6/6, `agra-to-sirsaganj/` 8/8, `agra-karauli...` 8/8 - **answer diffs: 0 on every page** |
| Metadata | description / og / twitter re-read on all 3 pages with metadata edits; no claim residue |
| Desktop 1440 | All 5 pages: no overflow, 0 non-table elements past edge, exactly one `<h1>` |
| Mobile 390 | All 5 pages: no overflow, 0 non-table elements past edge, exactly one `<h1>` |
| Console errors | **0** on all 5 edited pages |
| Diff review | +37 / -37 lines, all surgical exact-string swaps |
| Unrelated pages | **[VERIFIED]** only the 5 intended HTML files have changed mtimes |

**One correction found during verification.** The first pass left 4
schema/visible mismatches on the Karauli page. On inspection **3 of them
pre-existed this audit** (apostrophe and dash drift from that page's original
build) and only 1 touched my edit. The `FAQPage` block was rebuilt from the
visible accordions, bringing all 8 to 0 diffs.

**One false alarm discarded.** An initial check reported 3 schema/visible
mismatches on `index.html`. They were **an artefact of my own comparison
tool**, which did not decode numeric HTML entities - the schema held a literal
`-` where the visible text held `&#8211;`, which decode identically. Verified
against the pre-edit backup: the same 3 "diffs" existed before any change.
With a complete decoder, **`index.html` reports 0 diffs**. No content problem
existed and none was "fixed".

---

## Appendix - claim family scan results (57 pages)

| Family | Production pages | Occurrences | Action |
|---|---|---|---|
| commercially insured | 2 | 3 | **Removed** |
| verified drivers | 2 | 5 | **Removed** |
| sanitised | 2 | 4 | **Removed** |
| guaranteed punctuality | 2 | 4 | **1 softened**, 1 retained (honest limitation) |
| unlimited waiting | 3 | 11 | **6 bounded**; 2 retained as descriptive prose |
| free cancellation (2 hr) | 2 | 14 | **Withdrawn from meta + schema + visible** |
| driver details before pickup | 34 | 123 | Retained |
| no advance payment | 32 | 80 | Retained (hedged "for most") |
| no surge pricing | 20 | 34 | Retained |
| holiday/festival availability | 15 | 35 | Retained, flagged |
| no waiting charge | 16 | 37 | Retained, flagged |
| response time | 28 | 51 | Retained (hedged "usually") |
| safety claims | 23 | 30 | Retained - generic "trusted partner" footer puffery |
| no shopping/commission stops | 4 | 8 | Retained, flagged |
| vehicle availability | 2 | 8 | Retained - already honest |
| child seat | 1 | 1 | Form placeholder only, flagged |
| no night surcharge | 2 | 12 | Retained, flagged |
| guaranteed availability | 0 | 0 | None found |
| cheapest / best / number one | 0 | 0 | None found |

**End of claims and policy audit.**
