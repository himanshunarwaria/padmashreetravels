# Padma Shree Travels - UI, UX, Conversion & Tourist-Marketing Audit

**Date:** 31 August 2026
**Scope:** All public customer-facing pages
**Status:** Audit and strategy only. **No production file was modified.**
**Audit artefacts:** `docs/audit-screenshots/` (18 screenshots)

---

## How to read this report

Every finding is labelled so you can tell fact from opinion:

| Label | Meaning |
|---|---|
| **[VERIFIED]** | Measured or read directly from the code/browser. Reproducible. |
| **[VISUAL]** | Observed in a rendered screenshot. Subjective but evidenced. |
| **[INFERENCE]** | A reasoned conclusion that goes beyond direct evidence. |
| **[RECOMMENDATION]** | A proposed change. Not a statement of fact. |
| **[OWNER DECISION]** | Requires the business owner to confirm a fact, policy or price. |

**Three notes on method, stated up front for honesty:**

1. **A false alarm I caught and discarded.** Early mobile screenshots appeared
   to show the homepage `<h1>` and body text clipped mid-word. Direct
   measurement disproved it: at a 390px viewport the `<h1>` occupies
   left=20 -> right=355 inside a 375px content box, and **zero** elements
   extend past the viewport. The clipping was an artefact of headless
   screenshot capture, not a site defect. Mobile screenshots were regenerated
   through a correctly-sized iframe host. **Do not chase this bug - it does
   not exist.**
2. **Keyword scans flag candidates; they do not decide.** Several automated
   hits turned out to be non-issues on reading (e.g. "100%" was CSS
   `width:100%`; "guaranteed" on two blog pages was an honest *negation*
   - "can't be guaranteed"; "award" on the About page was part of an honest
   disclaimer). Those are recorded as false positives, not findings.
3. **Encoding.** This document is now plain ASCII. The file was always valid
   UTF-8 with **zero byte-level corruption** - it decoded cleanly with no
   replacement characters. The mojibake a reader may have seen was an
   *editor* decoding a UTF-8 file as Windows-1252, not damage in the file.
   To make the document immune to that, all 305 non-ASCII characters (em
   dashes, arrows, the rupee sign, tick/cross glyphs) were folded to ASCII
   equivalents. It now renders identically under any encoding.

**Homepage rebuild REVERTED (31 August 2026).** A rebuilt homepage on
`css/landing.css` was delivered and then **rolled back at the owner's
request**. `index.html` is once again the legacy-design page, so **P1-1 is
OPEN** and findings HP-1 to HP-11 in section 5.1 still stand. The claims
corrections made in the separate claims phase were **retained** through the
revert. See entry 37 in `docs/page-upgrade-log.md`.

**Claims phase completed (31 August 2026).** The P0-1 claim findings in
this report have since been acted on. Twelve unsupported claim occurrences
were removed from production, a punctuality guarantee was softened, and the
two-hour cancellation policy was withdrawn from metadata and schema pending
owner confirmation. Full detail, evidence reasoning and the owner-decision
register are in **`docs/claims-policy-audit.md`**. Findings in this report
that refer to those claims are annotated inline.

**Revision note (31 August 2026).** This report was corrected after first
issue. Items changed in that pass are marked **[CORRECTED]**.

The most serious correction was the sitemap finding. The original report
stated that no `sitemap.xml` existed and labelled that claim **[VERIFIED]**.
**That was wrong.** `sitemap.xml` exists, is well-formed, and contains 54
URLs. A claim that was never checked was presented as though it had been.
The error is recorded here rather than quietly deleted, and the corrected
analysis is in section 14.

---

# 1. Executive Summary

## Scores

| Dimension | Score | One-line reason |
|---|---|---|
| **Overall UI** | **6.5 / 10** | Two complete design systems run side by side; the rebuilt 34 pages are strong, the 22 legacy pages (including the homepage) are visibly older. |
| **Overall UX** | **7.0 / 10** | Rebuilt route pages answer visitor questions unusually well; legacy pages and the homepage lag, and the homepage splits attention across three equal CTAs. |
| **Mobile experience** | **6.5 / 10** | Rebuilt pages are clean with 47px tap targets; legacy pages use 37px targets. Blog table overflow **[FIXED 31 Aug 2026 - entry #39]**: all 12 blog tables are contained in `.dtable-wrap`, verified 0 page-level overflow at 390px. |
| **Conversion** | **6.0 / 10** | Excellent prefilled WhatsApp on 34 pages; the homepage has three competing CTAs. Blog reviews/CTA gap **[LARGELY RESOLVED 31 Aug 2026 - entry #39]**: all 15 articles already had a correct, route-specific CTA (verified, not rebuilt); 7 of 15 now also carry an honestly-matched reviews section - see section 5.8. |
| **Accessibility** | **5.5 / 10** | 22 pages have no skip link, footer/small text fails contrast (3.19:1 and 3.65:1), FAQ accordions never expose `aria-expanded`, and the booking page has unfocusable-looking controls. |
| **Visual consistency** | **5.0 / 10** | Two stylesheets, two mobile CTA bars, two FAQ patterns, two navigations, two footers. |
| **Tourist readiness** | **5.0 / 10 at audit time; largely addressed 31 Aug 2026, entry #40** | International-visitor guidance added to 7 pages (2 locked pages excluded, pending an unlock decision); a Golden Triangle planning page now exists with honest scope limits; a hotel-partner page exists pending owner sign-off on commercial terms. See entry #40 and the new `docs/tourist-pitch-messaging.md` / `docs/tracking-plan.md`. |

## Main strengths

1. **[VERIFIED] 1,411 internal links checked - 0 broken.** Across all 57 public
   pages. That is unusual and genuinely good.
2. **[VERIFIED] Zero console errors** on every page tested (homepage, route,
   booking, route-finder, blog, fleet).
3. **[VERIFIED] The 34 rebuilt pages are technically excellent:** 0 images
   missing dimensions, 91 lazy-loaded, 34/34 hero preloads correctly matched
   to the hero image, skip links present, native `<details>` FAQs, contrast
   >=12.58:1, and **0 focusable elements without a visible focus ring**.
4. **[VERIFIED] The booking form works** - live pricing resolved
   `?route=agra-to-gwalior` to "approx Rs3,000 / Round Trip" with no JS errors.
5. **[VERIFIED] Fare integrity is high.** `js/booking.js` prices agree with
   every rebuilt page's headline fare across all 13 routes checked.
6. **[VISUAL] The brand photography is authentic** - real vehicles in the
   company's own livery, not stock fleet imagery.

## Main weaknesses

1. **[VERIFIED] The homepage - the most-visited page - still carries the claim
   family that was deliberately removed from all 34 rebuilt pages:**
   "sanitised before every trip", "commercially insured", "verified drivers"
   (in the meta description, the visible FAQ **and** the FAQ structured data).
2. **[VERIFIED] Two design systems.** 33 pages on `css/landing.css`, 22 on
   `css/style.css` + `js/main.js` + an unpkg Lucide CDN.
3. ~~**[VERIFIED] 17 blog pages have no reviews section and no sticky
   route CTA**~~ **[CORRECTED 31 Aug 2026 - entry #39]** Re-verified by
   reading all 15 articles: each already had a correct, route-specific
   contextual CTA and end-of-article CTA before this finding was written -
   the "no route CTA" half of this finding was inaccurate. The "no reviews"
   half was accurate; 7 of 15 articles now carry an honest, per-article
   review section reused from `js/reviews-data.js`. The remaining 8 have no
   honest review-set match and were deliberately left without one - see
   `docs/blog-content-to-service-map.md`.
4. **[VERIFIED] Accessibility failures concentrated on legacy pages**:
   no skip link (22 pages), `small` text at **3.19:1 contrast and 9.12px**,
   footer links at **3.65:1**, and FAQ accordions that never set
   `aria-expanded` (`js/main.js:13`).
5. **[VERIFIED] The homepage has no hero preload and no `fetchpriority`**
   0 of either - while all 34 rebuilt pages get this right.

## Five highest-priority actions

| # | Action | Why |
|---|---|---|
| **1** | **[RESOLVED 31 Aug 2026]** Homepage claims - "commercially insured / verified drivers / sanitised" have been **removed** from `index.html` and `about/`. No verifiable evidence existed in the project (see `docs/claims-policy-audit.md`). **[OWNER DECISION]** remains open: supply the insurance policy and driver-verification process and they can be restored. | Was the site's largest credibility contradiction. |
| **2** | **Rebuild the homepage on `landing.css`** with one primary CTA. | Biggest single UI/conversion win. A rebuild was delivered and reverted on 31 Aug; the work is preserved and can be reinstated. |
| **3** | **[CORRECTED]** **Fix the two broken forms and the blog table overflow** - contact (4/4 fields unlabelled), booking (16 controls with no focus ring), and 12 blog tables that overflow on mobile. | These are broken experiences, not enhancements. Blog reviews/CTAs are high-impact but nothing is broken there, so that work is now **P1-8**. |
| **4** | **Fix the four site-wide accessibility defects** (skip link, contrast, `aria-expanded`, booking-form focus rings). | Legal/ethical exposure and real usability loss; all are small code changes. |
| **5** | **[CORRECTED]** **Extend before building.** Add a Golden Triangle section to the existing `agra-to-jaipur-taxi/` page, build **one** genuine `/partners/` page with UTM-tagged QR codes, and audit/update the existing `sitemap.xml`. | The original report recommended new pages and a new sitemap. Existing assets already cover most of this; duplicating them would cannibalise. |

---

# 2. Website Inventory

**64 HTML files found. 7 excluded as internal (all `noindex` and unlinked): 57 public pages audited.**

**Excluded from customer-facing scoring** - `_seo/SEO-IMPLEMENTATION-REPORT.html`,
`crm/pst-crm-simple.html`, `driver-app/index.html`,
`driver-app/icons/generate-icons.html`, `driver-communication-helper.html`,
`image-audit.html`, `review-helper.html`. **[VERIFIED]** each is `noindex`
and has zero inbound links from any public page.

## Testing coverage

| Coverage | Count |
|---|---|
| Public pages inventoried | **57** |
| Fully visually tested at 4 viewports (1440/768/390/320) | **17** |
| Structurally audited (all checks, every page) | **57** |
| Screenshots captured | **18** |
| Pages evaluated by shared-template equivalence | **40** |

**Template-equivalence statement.** The 24 rebuilt route/pilgrimage pages share
one template. Representative members were visually tested at all four
viewports: `agra-to-gwalior` (long route), `agra-to-hathras` (short route),
`agra-to-bateshwar` (pilgrimage), `agra-railway-station-taxi` (transfer),
`agra-airport-taxi` (transfer). **Every** page in the group still received the
full structural check (headings, CTAs, images, schema, claims, links). Where
page-specific content could alter layout - the fare tables - the check was run
on **all** pages, not sampled.

## Inventory table

| Page | Type | Design system | Desktop | Tablet | Mobile | 320px | Main CTA | Reviews | Status |
|---|---|---|---|---|---|---|---|---|---|
| `index.html` | Homepage | **legacy** | Yes | Yes | Yes | Yes | 3 competing | Yes | WARN - Claims + CTA overload |
| `agra-local-sightseeing/` | Sightseeing | **inline (locked)** | Yes | Yes | Yes | Yes | WhatsApp | Yes | OK - Strong, but 16 KB inline CSS |
| `agra-to-jaipur-taxi/` | Route | **inline (locked)** | - | - | - | - | WhatsApp | Yes | OK - Structural only; 18 KB inline CSS |
| `agra-to-gwalior/` | Route | landing | Yes | Yes | Yes | Yes | Get Fare | Yes | OK - Reference quality |
| `agra-to-hathras/` | Route | landing | Yes | Yes | Yes | Yes | Get Fare | Yes | OK |
| `agra-to-bateshwar/` | Pilgrimage | landing | Yes | Yes | Yes | Yes | Get Fare | Yes | OK |
| `agra-airport-taxi/` | Airport | landing | Yes | Yes | Yes | Yes | Get Fare | Yes | OK |
| `agra-railway-station-taxi/` | Railway | landing | Yes | Yes | Yes | Yes | Get Fare | Yes | OK |
| `agra-to-tundla/` | Railway | landing | - | - | - | - | Book Transfer | Yes | OK - Structural |
| `outstation-cabs-agra/` | Hub | landing | Yes | Yes | Yes | Yes | Get Fare | Yes | OK |
| `agra-temple-tour-by-cab/` | Hub | landing | - | - | - | - | Get Fare | Yes | OK - Structural |
| `agra-taxi-fares/` | Fare hub | landing | Yes | Yes | Yes | Yes | Get Fare | Yes | OK |
| `fleet/` | Fleet | landing | Yes | Yes | Yes | Yes | Ask Which Cab | Yes | OK |
| `book/` | Booking | landing + form CSS | Yes | Yes | Yes | Yes | Book on WhatsApp | Yes | WARN - Focus rings |
| `about/` | About | **legacy** | Yes | Yes | Yes | Yes | 3 competing | No | WARN - Claims |
| `contact/` | Contact | **legacy** | Yes | Yes | Yes | Yes | 3 competing | No | WARN - Form labels |
| `route-finder/` | Utility | **legacy** | Yes | Yes | Yes | Yes | 3 competing | No | WARN - Tap targets |
| `blog/` | Blog index | **legacy** | Yes | Yes | Yes | Yes | 3 competing | No | WARN - No route CTA |
| `blog/taj-mahal-visiting-guide/` | Blog article | **legacy** | Yes | Yes | Yes | Yes | 3 competing | No | WARN - Table overflow |
| 15 other blog articles | Blog article | **legacy** | - | - | - | - | 3 competing | No | WARN - Template equivalence |
| `agra-to-mathura-vrindavan/` | Pilgrimage | **legacy** | Yes | Yes | Yes | Yes | 3 competing | No | WARN - Image overflow |
| 22 other rebuilt route/pilgrimage pages | Route/Pilgrimage | landing | - | - | - | - | Get Fare | Yes | OK - Structural |
| `taj-mahal-agra-fort.html` | Retired | redirect stub | Yes | - | - | - | none | No | OK - Intentional redirect |

## Shared dependencies **[VERIFIED]**

| Asset | Pages using |
|---|---|
| `css/landing.css` (29.6 KB, shared) | 33 |
| `css/style.css` (legacy) | 23 |
| Neither (2 locked pages ship CSS inline) | 2 |
| `js/main.js` (legacy) | 22 |
| `js/landing.js` | 33 |
| `js/reviews-data.js` + `js/reviews-grid.js` | 36 |
| `js/conversion-tracking.js` | 35 |
| `js/booking.js` | 1 |
| `js/route-images.js` | 1 |
| **unpkg.com Lucide CDN** (third-party render dependency) | **21** |
| GTM container | 57 |

**[VERIFIED] Duplicated CSS.** `agra-local-sightseeing/` (16.1 KB) and
`agra-to-jaipur-taxi/` (18.2 KB) carry the design system **inline**. All 78 of
their class selectors also exist in `css/landing.css`. That is a private,
uncacheable copy of a shared stylesheet, shipped on every page view.

---

# 3. Site-Wide UI Findings

## What works

* **[VISUAL] Authentic brand imagery.** The night fleet banner shows the
  company's own branded vehicles. This is a real differentiator against
  competitors using stock photos.
* **[VERIFIED] Consistent 9-item navigation across 35 pages**, with
  `aria-current="page"` marking the active section.
* **[VISUAL] The rebuilt page template has genuine visual rhythm**
  alternating white/navy/dark-mesh bands prevent the "endless white page"
  problem on 1,800-2,000-word pages.
* **[VERIFIED] Fare tables are correctly contained.** On every rebuilt page
  the table sits inside an `.ftbl-wrap` horizontal scroller; the wrapper's
  right edge measures 355px inside a 375px viewport. The table's own cells
  extend beyond - which is the intended, contained behaviour, not a bug.

## What is inconsistent

| # | Finding | Evidence | Severity | Recommendation |
|---|---|---|---|---|
| UI-1 | **Two design systems** | **[VERIFIED]** 33 pages `landing.css`; 22 pages `style.css`+`main.js`+unpkg | **High** | Migrate the 22 legacy pages; homepage first |
| UI-2 | **Two mobile CTA bars** | **[VERIFIED]** legacy `.mcta-bar` = 3 actions at **102x37/134x37/106x37px**; rebuilt `.mobile-bar` = 2 actions at **188x47px** | **High** | Standardise on the 2-action 47px bar |
| UI-3 | **Two FAQ patterns** | **[VERIFIED]** legacy `<button class="fi__q">` + JS; rebuilt native `<details>` | **Medium** | Standardise on `<details>` |
| UI-4 | **Two header CTA strategies** | **[VERIFIED]** legacy header = "Call Now" (phone); rebuilt = "Get Fare"/"Ask Which Cab" (WhatsApp) | **Medium** | **[OWNER DECISION]** pick the primary channel |
| UI-5 | **Two typography scales** | **[VERIFIED]** legacy H1 54.4px desktop -> 30.4px mobile; rebuilt 42.4px -> 25.6px | **Low** | Adopt one scale |
| UI-6 | **Dead 2.1 MB asset** | **[VERIFIED]** `images/Banners/B.png` referenced by no page/CSS/JS | **Low** | Remove from repo |

> **[PARTIALLY RESOLVED 31 August 2026 - see log entry #38]** UI-1's
> *navigation* is no longer inconsistent: every page (both tracks) now uses
> the same 4 categories (Pilgrimage/Sightseeing/Outstation/Fares & Tools),
> the same items, and the same desktop-dropdown + mobile-drawer pattern -
> implemented natively in each track's own CSS (no new dependency, no
> migration of either track onto the other's stylesheet). UI-1's broader
> recommendation - migrating the 22 legacy pages onto `landing.css`
> entirely - remains open, as do UI-2 (CTA bars), UI-3 (FAQ pattern), UI-4
> (header CTA copy, still an open **[OWNER DECISION]**) and UI-5
> (typography scale). The `.ham` mobile-menu button (legacy track) was also
> resized from 36x30px to 44x44px as an incidental fix while touching this
> area.

## Imagery

* **[VERIFIED] Rebuilt pages: 123 images, 0 missing width/height, 91 lazy.**
  Legacy pages: **87 images, 57 missing dimensions (66%)** - layout-shift risk.
* **[VISUAL] Image honesty is well handled on rebuilt pages.** Where no genuine
  photograph of a destination exists, road/fleet imagery is used with alt text
  that makes no locational claim. Where a building is identifiable (Gwalior
  Fort, Prem Mandir, Buland Darwaza) it is named.
* **[VERIFIED] `images/fleet/fleet-sanitising.webp` is used on the About page**
  captioned "Sanitised and inspected before every trip" - tied to claim CL-1
  below.

## Design quality

* **[VISUAL] Does it feel trustworthy?** On rebuilt pages, yes - published
  fares, explicit exclusions, and honest limitations ("we do not track
  trains", "this is not a sightseeing route") read as a real operator.
* **[VISUAL] Do older pages conflict with upgraded pages?** Yes, visibly. A
  visitor landing on the homepage then clicking to a route page moves between
  two different visual languages - different button shapes, type scale, FAQ
  behaviour and bottom bar.
* **[INFERENCE]** The homepage currently sets a *lower* quality expectation
  than the pages it links to, which is the wrong way round for a funnel.

---

# 4. Site-Wide UX Findings

## Navigation

* **[VERIFIED] Strong:** identical 9-item nav on 35 pages; 1,411 internal
  links with **0 broken**; `aria-current="page"` present.
* **[VERIFIED] Gap:** four routes with published fares and rebuilt pages
  **Shikohabad, Sirsaganj, Tundla, Bateshwar** - are **absent from the
  Outstation dropdown**, which appears on every page.
* **[INFERENCE]** Route discoverability depends heavily on the fare hub and
  route-finder; a visitor browsing the dropdown cannot find four live services.

## Content findability

**[VERIFIED]** On rebuilt pages, a visitor can find distance, duration, fare
basis, cab choice, pickup details, stop policy, booking steps, FAQs and
related routes - all present and consistently placed. This is the site's
strongest UX asset.

~~**[VERIFIED]** On the 17 blog pages, none of this exists: no reviews, no
sticky route CTA, no fare context.~~ **[CORRECTED 31 Aug 2026, entry #39]**
Re-reading all 15 articles found this overstated: every article already had a
route-specific CTA and, where a fare exists, states it plainly in its Quick
Facts box and/or CTA copy. Reviews were the genuine gap, now closed on 7 of
15 - see section 5.8.

## Conversion journey

* **[VERIFIED] The WhatsApp prefill is genuinely good** on rebuilt pages - it
  names the route and asks for travel date, pickup address, drop point,
  passengers and cab type. Example (Hathras) even asks *"who is travelling, if
  not you"*.
* **[VERIFIED] First CTA is immediately visible** - measured at y=12px on
  every rebuilt page.
* **[VERIFIED] Sticky bars do not cover content.** Rebuilt: bar 49px, body
  padding-bottom 54px. Legacy: bar 74px, padding 88px. Both clear.
* **[VISUAL] The homepage hero presents three CTAs of near-equal weight**
  "Get Fare on WhatsApp" (green), "Call +91 87200 81102" (white), "Book
  Online" (dark ghost). The third has poor contrast against the dark vehicle
  photograph behind it.

## Trust

* **[VERIFIED] Strong:** real Google reviews on 36 pages, business address,
  phone, and a link to the Google review profile.
* **[VERIFIED] Notably honest content exists and should be protected:** the
  About page states *"We don't make claims we can't back up - no fake review
  counts, no unverifiable awards"*; `fleet/` says the Tempo Traveller is
  *"subject to confirmation... please confirm before you plan around it"*.
* **[VERIFIED] Undermined by CL-1** (homepage/About claims) - the site
  simultaneously promises honesty and makes unverified safety claims.

## Content length

**[VERIFIED]** Mobile page heights: homepage **19,323px**,
`agra-local-sightseeing` **19,373px**, `route-finder` **10,842px**. At ~800px
per screen that is 24 screens of scrolling on the homepage.
**[INFERENCE]** A first-time visitor on a phone must scroll a long way before
seeing service options.

---

# 5. Page-by-Page Audit

## 5.1 Homepage - `index.html`

**Purpose:** Entry point for all traffic. **Audience:** every segment.
**Screenshots:** `01-homepage-desktop.png`, `02-homepage-mobile.png`, `16-homepage-narrow-320.png` (the live page); `19-homepage-rebuilt-desktop.png`, `20-homepage-rebuilt-mobile.png` (the reverted rebuild, kept for reference)

> **[REBUILD REVERTED 31 August 2026]** A rebuilt version of this page was
> delivered and then **rolled back at the owner's request**. The live page is
> the legacy-design homepage again, so **HP-4 to HP-12 below are still live**.
>
> **Three findings remain fixed** because they were corrected in the separate
> claims phase, not the rebuild, and survived the revert: **HP-1, HP-2 and
> HP-3** - the "commercially insured", "verified drivers" and "sanitised
> before every trip" claims are gone from the live page, along with the
> "guarantees a clean, on-time AC car" wording.
>
> **One finding not previously recorded is now visible.** The live FAQ still
> advises booking ahead *"to guarantee availability"* - a
> guaranteed-availability claim. It was missed by the claims-phase scan
> (the regex looked for "guaranteed availability" and "availability
> guaranteed", not the verb form "to guarantee availability") and was only
> corrected inside the rebuild, so the revert brought it back. Logged as
> **HP-13** below.

**What works**
* **[VISUAL]** Strong branded hero; descriptive H1 covering all main services.
* **[VISUAL]** Micro-trust line under the CTAs: *"Fixed fare confirmed in
  writing - Driver details shared before pickup - Usually replies quickly"*.
* **[VISUAL]** Reviews placed immediately below the hero - good trust position.
* **[VERIFIED]** Stats band: "30+ routes", "Rs1,500 AC cab one way", "24/7".

**Problems**

| ID | Finding | Label | Severity |
|---|---|---|---|
| HP-1 | Visible FAQ **and** FAQ schema state *"All vehicles are clean, well-maintained, **sanitised before every trip**, and **commercially insured**"* | **[VERIFIED]** | **Critical (trust)** |
| HP-2 | Meta description, og: and twitter: all say *"Fixed fares, **verified drivers**"* | **[VERIFIED]** | **Critical (trust)** |
| HP-3 | Hero subhead: *"Private AC cab with a **verified local driver**"* | **[VERIFIED]** | **Critical (trust)** |
| HP-4 | **No skip link** | **[VERIFIED]** | Serious (a11y) |
| HP-5 | FAQ accordions never set `aria-expanded` (`js/main.js:13` toggles a class only) | **[VERIFIED]** | Serious (a11y) |
| HP-6 | `small` text at **3.19:1 contrast, 9.12px**; footer links **3.65:1** | **[VERIFIED]** | Serious (a11y) |
| HP-7 | **No hero preload, no `fetchpriority`** (0 of each) | **[VERIFIED]** | Serious (perf) |
| HP-8 | Three hero CTAs of near-equal weight; "Book Online" is a dark ghost button on a dark photo | **[VISUAL]** | High (conversion) |
| HP-9 | Mobile bar has 3 actions at **37px height** | **[VERIFIED]** | Medium (mobile) |
| HP-10 | At 320px, 6 element types extend past the content edge (`hero__sv`, `hero__sl`, `rcard__price`, `SMALL`, `mcta-bar__a`) | **[VERIFIED]** | Medium |
| HP-11 | Mobile page height **19,323px** | **[VERIFIED]** | Medium |
| HP-12 | "Rs1,500 AC CAB, ONE WAY" - no destination named | **[VISUAL]** | Medium (clarity) |
| HP-13 | FAQ advises booking ahead **"to guarantee availability"** - a guaranteed-availability claim. Missed by the claims-phase scan (verb form, not the noun form the regex matched); fixed only inside the reverted rebuild, so it is live again | **[VERIFIED]** | **Serious (claim)** |

**Recommended fix:** rebuild on `landing.css` using the proven route-page
template - this resolves HP-1 through HP-11 in one pass.

**Conversion opportunity:** reduce to one primary CTA ("Get Fare on WhatsApp")
with phone as a subordinate text link, matching the rebuilt pages.

**Tourist pitch opportunity:** the homepage currently sells *routes*. It should
sell *the Agra visit* - add three segment doors: "Here for the Taj",
"Here on pilgrimage", "Passing through / Golden Triangle".

---

## 5.2 Rebuilt route pages (24 pages) - reference: `agra-to-gwalior/`

**Screenshots:** `03-route-major-desktop.png`, `04-route-major-mobile.png`, `05-route-short-mobile.png`

**What works - this is the site's best work**
* **[VERIFIED]** No overflow at 1440/768/390/320 except the intentionally
  contained fare table.
* **[VERIFIED]** Skip link, one H1, no heading skips, contrast >=12.58:1,
  **0 elements without a focus ring**, native `<details>` FAQs.
* **[VERIFIED]** Hero preload matches hero image on 34/34 pages.
* **[VISUAL]** Clear hierarchy: H1 -> price -> key facts in bold -> one green
  primary CTA -> subordinate underlined phone link.
* **[VERIFIED]** Route-specific WhatsApp prefill on every CTA.

**Problems**

| ID | Finding | Label | Severity |
|---|---|---|---|
| RT-1 | H1 and its price subtitle render at the same size on mobile (both 25.6px) | **[VISUAL]** | Low |
| RT-2 | Header shows only the "PS" mark on mobile, no brand name | **[VISUAL]** | Low |
| RT-3 | No `prefers-reduced-motion` support | **[VERIFIED]** | Minor |
| RT-4 | 4 routes missing from the Outstation dropdown | **[VERIFIED]** | Medium |

**Conversion opportunity:** these pages convert on fare clarity. Add a
one-line "what happens next" reassurance beside the CTA - *"We reply on
WhatsApp, usually within minutes, with the fare in writing."*

---

## 5.3 Locked pages - `agra-local-sightseeing/`, `agra-to-jaipur-taxi/`

**Screenshot:** `06-sightseeing-desktop.png`

* **[VERIFIED] Content quality is high** - 2,704 and 2,127 words, full FAQ
  coverage, 12 `<details>` accordions, reviews, skip link.
* **[VERIFIED] `agra-local-sightseeing/` is the only page on the site with
  `prefers-reduced-motion` support.**
* **[VERIFIED] Both ship 16.1 KB / 18.2 KB of inline CSS** whose 78 selectors
  are entirely duplicated in `css/landing.css`.
* **[VERIFIED] Mobile height 19,373px.**
* **[OWNER DECISION]** These are marked read-only. Converting them to the
  shared stylesheet requires unlocking them.

---

## 5.4 Booking page - `book/`

**Screenshot:** `12-booking-mobile.png`

**What works**
* **[VERIFIED] The form works.** Loading `/book/?route=agra-to-gwalior`
  produced a live price of **"approx Rs3,000"** labelled **"Round Trip"**, all
  fields present, toggle functions defined, **0 JS errors**.
* **[VERIFIED]** Shortest mobile page on the site (6,847px) - appropriately
  focused.
* **[VERIFIED]** No floating WhatsApp and no sticky bar - a deliberate choice
  so nothing competes with the form's own submit button.
* **[VERIFIED]** States "No advance payment" and "Free cancellation (2 hrs before)".

**Problems**

| ID | Finding | Label | Severity |
|---|---|---|---|
| BK-1 | **16 of 40 focusable elements show no visible focus indicator.** `.bk-toggle__btn` has no `:focus` rule and the page contains no `focus-visible` at all | **[VERIFIED]** | **Serious (a11y)** |
| BK-2 | 2 form fields have no associated `<label>` | **[VERIFIED]** | Serious (a11y) |
| BK-3 | `.bk-policy` text at **3.19:1, 10.72px** | **[VERIFIED]** | Moderate |
| BK-4 | `MAPS_KEY` is empty - Google Places autocomplete on pickup/drop never activates | **[VERIFIED]** | Medium |
| BK-5 | The SUV advisory quotes **Rs3,800-Rs4,500**, a range that appears only here and on `agra-to-bateshwar/` | **[VERIFIED]** | **[OWNER DECISION]** |

---

## 5.5 Fleet page - `fleet/`

**Screenshot:** `11-fleet-desktop.png`

* **[VERIFIED] The most honest page on the site.** It already hedges in every
  way this audit would otherwise recommend: *"or similar"*, *"luggage figures
  are typical... depend on the exact vehicle"*, *"photos show the vehicle
  category and are representative... arranged through trusted local
  operators"*, and the Tempo Traveller is *"subject to confirmation... confirm
  before you plan around it"*.
* **[VERIFIED]** 5 images, 0 missing dimensions, FAQ 7/7 matching schema.
* **[INFERENCE]** This page is a template for how to describe a service you
  don't fully control. **Protect this wording.**
* **Problem: [VERIFIED]** publishes no fares (correct - fares are route-based)
  but that forces a comparison-shopping visitor to jump to the fare hub.
  **[RECOMMENDATION]** add a "from RsX" column linking to the fare list.

---

## 5.6 Fare hub - `agra-taxi-fares/`

**Screenshot:** `10-fare-page-mobile.png`

* **[VERIFIED]** Table correctly contained in its scroller at 375px and 320px.
* **[VERIFIED]** 51 of 68 interactive elements below 40px at mobile - this is
  a dense table of route links.
* **[RECOMMENDATION]** increase row link padding on mobile; add a search/filter
  box. **[INFERENCE]** this page is likely a high-intent landing page from
  "agra taxi fare" searches and deserves the strongest CTA treatment.

---

## 5.7 Legacy support pages - `about/`, `contact/`, `route-finder/`

**Screenshots:** `13-about-legacy-desktop.png`, `14-route-finder-mobile.png`, `18-contact-legacy-mobile.png`

| ID | Finding | Label | Severity | Page |
|---|---|---|---|---|
| LG-1 | *"Our vehicles are **commercially insured**, our drivers are **verified**"* + *"**Sanitised** and inspected before every trip"* | **[VERIFIED]** | **Critical (trust)** | about |
| LG-2 | **4 of 4 form fields have no `<label>`** | **[VERIFIED]** | **Serious (a11y)** | contact |
| LG-3 | 1 form field without a label | **[VERIFIED]** | Serious | route-finder |
| LG-4 | **96 of 98 interactive elements under 40px at mobile (98%)** | **[VERIFIED]** | **Serious (mobile)** | route-finder |
| LG-5 | No skip link; contrast 3.19:1 / 3.65:1; no `aria-expanded` | **[VERIFIED]** | Serious | all three |
| LG-6 | No reviews section | **[VERIFIED]** | Medium (conversion) | all three |

**[VERIFIED] Positive to protect:** the About page's honest disclaimer about
fake reviews and unverifiable awards. **[INFERENCE]** it is undercut by LG-1
on the same page.

---

## 5.8 Blog - index + 16 articles

**Screenshots:** `15-blog-article-mobile.png`, `17-blog-index-desktop.png`

| ID | Finding | Label | Severity |
|---|---|---|---|
| BL-1 | ~~17 blog pages: no reviews section, no sticky route CTA~~ **[CORRECTED 31 Aug 2026]** CTAs were already correct on all 15 (see entry #39); 7/15 now also carry an honest reviews section. See `docs/blog-content-to-service-map.md`. | **[VERIFIED]** | Resolved / n-a |
| BL-2 | ~~Tables overflow horizontally at 390px and 320px~~ **[FIXED / re-verified 31 Aug 2026]** All 12 blog tables sit in `.dtable-wrap` (`overflow-x:auto`); confirmed 0 page-level overflow at 390px, including the two-table Taj Mahal guide. This finding was already stale when written or was fixed in an earlier, uncross-referenced pass - `.dtable-wrap` predates entry #39. | **[VERIFIED]** | Resolved |
| BL-3 | **12 blog tables have no `<caption>` and no `scope` on headers** - **not addressed**, outside this task's scope (conversion/discovery, not table markup) | **[VERIFIED]** | Serious (a11y), still open |
| BL-4 | Heading level skips on 16 of 17 blog pages - **not addressed on the 15 articles** (out of scope: no article body was restructured). `blog/index.html` itself was corrected as part of entry #39: card titles moved from `<h2>` to `<h3>` under new `<h2>` category headers, giving a clean H1->H2->H3 hierarchy on the index specifically. | **[VERIFIED]** | Moderate, partially open |
| BL-5 | "Affordable" in the footer of every blog page - **not addressed**, outside this task's scope | **[VERIFIED]** | Low (claim), still open |
| BL-6 | No skip link, `aria-expanded` missing on FAQ accordions - **not addressed**. The blog's FAQ still uses the legacy `.fi`/`.fi__q` + `main.js` toggle, not `<details class="faq-acc">`; `conversion-tracking.js`'s `faq_toggle` event is therefore not wired on the blog (noted in entry #39). | **[VERIFIED]** | Serious, still open |

**[VERIFIED] False positives - no action needed:** "guaranteed" on two blog
pages is honest negation (*"exact road timing can't be guaranteed"*, *"rather
than a guaranteed spectacle"*). This is good, careful writing.

**[INFERENCE]** The blog is the site's largest content asset and its weakest
converter. It is also the most likely entry point for LLM/AI recommendations
and long-tail search.

---

## 5.9 `agra-to-mathura-vrindavan/` - legacy pilgrimage page

* **[VERIFIED]** Image strip (`rstrip__item`, `IMG`) overflows at 390px and 320px.
* **[VERIFIED]** Legacy system, no reviews, "affordable" in footer.
* **[INFERENCE]** This is a high-value pilgrimage route sitting on the old
  template while its siblings were rebuilt - likely the highest-priority
  legacy route page to migrate.

## 5.10 `taj-mahal-agra-fort.html` - retired

* **[VERIFIED]** `noindex, nofollow`, canonical to `/agra-local-sightseeing/`,
  zero inbound links, redirect tested and lands correctly.
* **Status:** correctly retired. **[RECOMMENDATION]** leave as-is.

---

# 6. Mobile Audit

| Area | Rebuilt (34 pages) | Legacy (22 pages) |
|---|---|---|
| **Sticky bar** | **[VERIFIED]** `.mobile-bar`, 2 actions, **188x47px**, body padding 54px - no overlap | **[VERIFIED]** `.mcta-bar`, 3 actions, **~102-134x37px**, body padding 88px - no overlap |
| **Floating WhatsApp** | Correctly hidden on mobile when bar is present | Hidden on mobile |
| **Navigation** | Full nav collapses; `aria-current` present | Hamburger + `.mnav` with `aria-expanded` **[VERIFIED]** correctly managed by `main.js:42-43` |
| **Tables** | Contained in `.ftbl-wrap` scroller | **[VERIFIED] Blog tables overflow - no wrapper** |
| **Galleries** | Contained | **[VERIFIED]** `agra-to-mathura-vrindavan` image strip overflows |
| **CTA visibility** | First CTA at y=12px | First CTA at y=0 (header) |
| **Text size** | 16px body | 16px body, but `small` at **9.12px** |
| **Tap targets** | ~29/43 below 40px (mostly footer/nav text links) | **route-finder: 96/98 below 40px** |
| **Overflow** | None at 320px | **[VERIFIED]** homepage: 6 element types past edge at 320px |
| **Content density** | 8,000-15,600px tall | Homepage **19,323px** |

**[INFERENCE] on tap targets:** many sub-40px elements on both systems are
inline footer/nav text links, where WCAG 2.2 AA (24x24 CSS px) may still pass.
The genuine concern is `route-finder` at 98% and the legacy bottom bar at 37px
height, which is below the 44px comfortable-touch guideline.

---

# 7. Accessibility Findings

## Critical
*None found.* No page is unusable by keyboard, and no content is entirely
inaccessible.

## Serious

| ID | Finding | Affected pages | Evidence |
|---|---|---|---|
| A11Y-1 | **FAQ accordions never expose state.** `js/main.js:13` toggles a CSS class; `aria-expanded` is set only for nav (lines 42-71). Screen-reader users cannot tell if an answer is open. | **22 legacy pages** | **[VERIFIED]** |
| A11Y-2 | **No skip-to-content link** | **22 legacy pages** | **[VERIFIED]** |
| A11Y-3 | **Small text at 3.19:1 contrast, 9.12px** (fails WCAG AA 4.5:1) | 22 legacy pages | **[VERIFIED]** |
| A11Y-4 | **Footer links at 3.65:1** | 22 legacy pages | **[VERIFIED]** |
| A11Y-5 | **Form fields without labels** - contact 4/4, book 2/8, route-finder 1/1 | 3 pages | **[VERIFIED]** |
| A11Y-6 | **No visible focus indicator on 16 of 40 controls**; `.bk-toggle__btn` has no `:focus` rule and the page has no `focus-visible` | `book/` | **[VERIFIED]** |
| A11Y-7 | **Blog tables have no `<caption>` and no `scope`** | 12 blog pages | **[VERIFIED]** |

## Moderate

| ID | Finding | Affected | Evidence |
|---|---|---|---|
| A11Y-8 | Heading level skips | 20 pages | **[VERIFIED]** |
| A11Y-9 | `.bk-policy` 3.19:1 at 10.72px | `book/` | **[VERIFIED]** |
| A11Y-10 | Tap targets below 44px | legacy bar (37px), route-finder (98%) | **[VERIFIED]** |
| A11Y-11 | ~~Blog table horizontal overflow forces two-axis scrolling~~ **[FIXED / re-verified 31 Aug 2026]** all 12 in `.dtable-wrap`, 0 overflow at 390px | 12 blog pages | **[VERIFIED]** resolved |

## Minor

| ID | Finding | Affected | Evidence |
|---|---|---|---|
| A11Y-12 | **No `prefers-reduced-motion` support** on 56 of 57 pages (only `agra-local-sightseeing/` has it) | 56 pages | **[VERIFIED]** |
| A11Y-13 | 4-7 focusables without focus ring on legacy pages | 22 pages | **[VERIFIED]** |

## Passing - worth recording

* **[VERIFIED]** Exactly one `<h1>` on **all 57 pages**.
* **[VERIFIED]** **0 images missing `alt`** across the entire site.
* **[VERIFIED]** `lang` attribute present on all pages.
* **[VERIFIED]** Rebuilt pages: 0 controls without focus rings; all contrast >=12.58:1.
* **[VERIFIED]** Mobile nav `aria-expanded` correctly managed on legacy pages.

---

# 8. Conversion Audit

## CTA consistency **[VERIFIED]**

| | Rebuilt (34) | Legacy (22) |
|---|---|---|
| Header CTA | "Get Fare" / "Ask Which Cab" -> WhatsApp | "Call Now" -> phone |
| Hero CTAs | 1 primary + 1 subordinate text link | 3 near-equal buttons |
| Sticky bar | 2 actions, 47px | 3 actions, 37px |
| Prefill | Route-specific, structured | Generic |

**[INFERENCE]** The two systems disagree about the primary conversion channel.
A visitor arriving on the homepage is pushed to *phone*; the same visitor on a
route page is pushed to *WhatsApp*. **[OWNER DECISION]** required.

## WhatsApp journey

* **[VERIFIED] Excellent on rebuilt pages.** Prefills name the route and
  request date, time, pickup address, drop point, passengers and cab type.
* **[VERIFIED] Link hygiene is near-perfect:** across all public pages, only
  **1** WhatsApp link is missing `target="_blank"` (homepage) and **0** are
  missing `rel="noopener"`. **2** links have no prefill (`book/`, `route-finder/`).
* **[VERIFIED] No external action was triggered during this audit** - links
  were validated structurally only.

## Phone journey

* **[VERIFIED]** `tel:` links present on 56 of 57 pages; all point to the same
  number, +91-87200-81102. **[VERIFIED]** 0 pages use a different number.

## Trust placement

* **[VERIFIED, updated 31 Aug 2026]** 43 pages now carry the reviews
  component (36 + 7 blog articles added in entry #39). **14 still do not** -
  8 blog articles with no honest review-set match (by design, see
  `docs/blog-content-to-service-map.md`), about, contact, route-finder, and
  the retired stub.
* **[VISUAL]** On rebuilt pages reviews appear immediately after the stats
  band and before the fare table - i.e. before the price decision. Good.

## Fare communication

* **[VERIFIED] Strong.** Published fares on 14+ routes, corroborated across
  three independent sources (fare hub, route page, `booking.js`) with **13/13
  agreement**.
* **[VERIFIED]** Exclusions consistently stated: tolls and parking paid at
  actuals.
* **[VERIFIED] Gap:** no one-way fare is published for Firozabad, Etawah,
  Shikohabad, Sirsaganj, Hathras or Tundla. Every such enquiry costs a
  WhatsApp round trip.

## Cancellation policy - exact locations **[CORRECTED, re-verified]**

The original report said the policy "appears on only 2 of 57 pages". A full
re-check across visible HTML, metadata, JSON-LD schema, scripts, stylesheets
and developer comments confirms **that count was correct**, and can now be
stated precisely.

**Pages where a customer can actually see or consume the policy - 2:**

| Page | Visible text | Meta description | JSON-LD schema |
|---|---|---|---|
| `book/index.html` | Yes - "Free cancellation (2 hrs before)" | Yes | Yes - `FAQPage` "What is your cancellation policy?" |
| `agra-to-sirsaganj/index.html` | Yes - proof strip, day-plan list and FAQ | Yes | Yes - `FAQPage` **and** the `Service` description |

**Zero pages state the policy only in a developer comment.** Both instances
are genuinely customer-facing, in three zones each.

**Three false positives, excluded after reading them in context:**

1. **`agra-to-tundla/index.html`** contains the word "cancel", but it is
   **not a cancellation policy**. It is a trust message built on a customer
   review - the heading *"Bookings That Do Not Get Cancelled"* and the
   reviewer's account of an app driver cancelling on him. That is about
   drivers not cancelling on customers, which is the opposite subject.
2. **`js/reviews-data.js`** - the same review text (`review-014`), not a
   policy.
3. **`css/style.css`** - a layout comment (*"cancel the .container gutter"*).

**[INFERENCE]** The policy is therefore near-invisible: it appears on the
booking page and on one arbitrary route page, but on none of the other 33
rebuilt route pages where a visitor decides whether to enquire.
**[RECOMMENDATION]** subject to owner confirmation (section 17, item 2), state
it consistently wherever a fare is quoted.

---

# 9. Tourist Segment Strategy

| # | Segment | Primary goal | Main anxiety | Info needed before contact | Best service to present | Strongest trust signal | Best CTA | Channel | Likely objection | Response | Cross-sell | Claims to avoid |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **First-time international visitor** | See the Taj without being scammed | Being overcharged or taken to shops | Fixed price in writing, English contact, what's included | Sunrise Taj transfer + half-day Agra | Fixed fare confirmed in writing; Google reviews | "Get fare on WhatsApp" | WhatsApp | "Will the driver pressure me into shops?" | State plainly: no unrequested shopping stops **[OWNER DECISION]** | Fatehpur Sikri en route to Jaipur | Any safety/insurance claim not documented |
| 2 | **Domestic leisure traveller** | Efficient sightseeing at a fair price | Hidden extras | Fare, inclusions, toll policy | Full-day Agra sightseeing | Published fare list | "See full fare list" | WhatsApp/Phone | "Is this cheaper than an app?" | Compete on *fixed* not *cheap* | Mathura-Vrindavan add-on | "cheapest" |
| 3 | **Family with children** | Everyone comfortable in one vehicle | Cramped car, no flexibility | Seats, luggage, stop flexibility | Ertiga/Innova full-day | Fleet page seat/luggage table | "Ask which cab fits" | WhatsApp | "Will we all fit with bags?" | Fleet page states typical luggage per category | Bateshwar/Fatehpur Sikri | Exact vehicle model promises |
| 4 | **Senior-citizen traveller** | Minimal walking, unhurried pace | Being rushed; physical difficulty | Terrain, waiting policy, door-to-door | Bateshwar (flat ground) or Agra sightseeing | "Driver waits as long as you need" | "Call us" | **Phone first** | "Can we go at our own pace?" | Driver waits at every stop | Temple circuits | Mobility claims that can't be met |
| 5 | **Pilgrimage traveller** | Complete darshan properly | Rushed by driver; wrong timings | Circuit, waiting, temple timings | Braj circuit / temple tours hub | Reviews naming temple trips | "Plan my yatra" | WhatsApp | "Will the driver wait during darshan?" | Reviews confirm it | Multi-day circuits | Temple timings we don't control |
| 6 | **Solo traveller** | Safe, predictable transport | Safety, reliability | Driver details, fare | Sedan transfers | Driver name/number/plate before pickup | "Get fare" | WhatsApp | "Is it safe?" | Share driver details in advance - **only what is operationally true** | Day trips | "safest" |
| 7 | **Couple** | Romantic/efficient Taj visit | Missing sunrise | Timing, pickup | Taj sunrise transfer | Early-start capability | "Book sunrise pickup" | WhatsApp | "Will you get us there for sunrise?" | 24/7, no night surcharge **[OWNER DECISION]** | Mehtab Bagh sunset | Sunrise guarantees |
| 8 | **Small group (5-7)** | One vehicle, one price | Vehicle too small | Seats, luggage | Ertiga/Innova | Fleet comparison table | "Ask which cab fits" | WhatsApp | "Will 6 of us fit with bags?" | Fleet page is explicit | Full-day tours | Overstating capacity |
| 9 | **Larger group (Tempo Traveller)** | Group travel together | Vehicle not available | Availability, capacity | Tempo Traveller | **Existing honest wording**: "subject to confirmation" | "Check availability" | **Phone** | "Can you actually get one?" | Say availability is confirmed per trip | Group pilgrimage | Guaranteed availability |
| 10 | **Hotel guest** | Reliable cab now | Hotel markup; unknown driver | Price, arrival time | Local sightseeing / transfers | Fixed fare vs hotel desk | "WhatsApp us" | WhatsApp/QR | "Why not the hotel desk?" | Transparent published fares | Onward transfers | Commission claims |
| 11 | **Railway passenger** | Make/meet a train | Missing the train | Station, timing, buffer | Station transfers, Tundla | *"We do not track trains... we'd rather you waited on the platform"* | "Book station transfer" | WhatsApp | "What if my train is late?" | Share train number; we plan around it | Same-day sightseeing | Train tracking |
| 12 | **Airport passenger** | Reliable pickup | Driver cancels | Flight time, fare | Airport transfers | Review: *"driver shows up, no cancellations"* | "Book airport transfer" | WhatsApp | "Will you actually turn up?" | Driver details before pickup | Delhi airport runs | Cancellation guarantees |
| 13 | **Golden Triangle traveller** | Delhi-Agra-Jaipur leg | Being stuck with a bad driver all day | One-way fare, stops, duration | **Agra->Jaipur with Fatehpur Sikri stop** | Locked Jaipur page content | "Get one-way fare" | WhatsApp | "Can we stop on the way?" | Fatehpur Sikri stop is standard | Multi-day | Itinerary times we can't hold |
| 14 | **Agra + Mathura/Vrindavan** | Braj darshan from Agra | Too much in one day | Realistic timing | Mathura-Vrindavan-Barsana full day | Honest "this makes a long day" advice | "Plan the day" | WhatsApp | "Can we do it all?" | Say honestly when it's too much | Govardhan, Gokul | Unrealistic itineraries |
| 15 | **One-way intercity** | Get from A to B | Paying for the return | One-way price | One-way outstation | Published round-trip fares | "Get one-way fare" | WhatsApp | "Why no one-way price?" | **[OWNER DECISION]** - publish them | Onward transfers | Invented one-way prices |

---

# 10. Tourist Messaging and Pitch Plan

## Core brand proposition **[RECOMMENDATION]**

> **The fare we quote on WhatsApp is the fare you pay. Agra pickup, a private
> AC cab, and a driver who waits while you actually finish.**

**[INFERENCE]** This is defensible because every element already exists on the
site: published fares, written confirmation, door-to-door pickup, and an
explicit waiting policy. It avoids "best", "cheapest" and "safest" entirely.

## Pitch matrix

| # | Pitch | Audience | Problem solved | Core promise | Evidence needed | Headline | Supporting message | CTA | Landing page | Follow-up |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Homepage** | All | "Who do I trust in Agra?" | Fixed fare, private cab, local operator | Existing reviews + fare list | *"Agra taxi at a fixed fare - confirmed in writing before you travel"* | Three doors: Taj / Pilgrimage / Onward travel | Get fare on WhatsApp | `/` | Save number |
| 2 | **Route page** | Route searchers | "What does this cost?" | Published fare + inclusions | Existing | *"Agra to X - RsY round trip, AC sedan"* | Distance, duration, what's included/excluded | Get X fare on WhatsApp | route page | Quote in writing |
| 3 | **Sightseeing** | Leisure | "How do I see Agra in a day?" | One driver all day | Locked page content | *"One driver, one fixed fare, all day in Agra"* | Itinerary + waiting at each monument | Plan my day | `/agra-local-sightseeing/` | Suggest sunrise |
| 4 | **Pilgrimage** | Devotees | "Will I get proper darshan?" | Driver waits through darshan | Review evidence | *"Darshan at your pace - the driver waits"* | Circuit options, realistic timings | Plan my yatra | `/agra-temple-tour-by-cab/` | Offer circuits |
| 5 | **Airport** | Flyers | "Will the cab show up?" | Details before pickup | review-014 | *"Your driver's name and car number, before pickup"* | 24/7, no night surcharge **[OWNER DECISION]** | Book transfer | `/agra-airport-taxi/` | Confirm night before |
| 6 | **Railway** | Train passengers | "Will I make my train?" | Planned around your train | Existing honest wording | *"Send your train number - we plan the pickup around it"* | We don't track trains; buffer advised | Book transfer | `/agra-railway-station-taxi/` | Confirm evening before |
| 7 | **Hotel partner** | Hotels | "Reliable cab for guests" | Consistent service, no haggling | Service levels **[OWNER DECISION]** | *"A fixed-fare cab desk for your guests"* | QR code, direct WhatsApp, written fares | Partner with us | **one new `/partners/` page** (see P3-3) | Monthly check-in |
| 8 | **International** | Overseas visitors | "Will I be scammed?" | Written fare, no surprises | Existing fare pages | *"The price is agreed before you get in the car"* | Tolls explained, no unrequested shopping stops **[OWNER DECISION]** | Get fare on WhatsApp | **new page needed** | Itinerary help |
| 9 | **Domestic** | Indian travellers | "Is this fair?" | Transparent fares | Fare list | *"Every route, every fare, in one list"* | No surge, no festival premium | See fare list | `/agra-taxi-fares/` | Save number |
| 10 | **Family/senior** | Families | "Will everyone be comfortable?" | Right vehicle, unhurried | Fleet page | *"Tell us who's travelling - we'll tell you which cab fits"* | Seats, luggage, flat-ground options | Ask which cab fits | `/fleet/` | Suggest vehicle |
| 11 | **Golden Triangle** | Circuit travellers | "Agra->Jaipur leg" | One-way with a stop | Locked Jaipur page | *"Agra to Jaipur, with Fatehpur Sikri on the way"* | Duration, stop, one-way pricing | Get one-way fare | **extend `agra-to-jaipur-taxi/`** (see P3-1) | Offer Delhi leg |
| 12 | **WhatsApp enquiry** | All | "What do I send?" | Structured reply | Existing prefills | *"Send your date and pickup - we reply with the fare"* | Prefilled template | Send message | all | Reply in minutes |
| 13 | **Review request** | Past customers | Social proof | Honest ask | Google profile | *"If the trip went well, a Google review helps us a lot"* | Direct link, **no incentive and no gating** - ask every customer, not only happy ones | Leave a review | post-trip | Thank + respond |
| 14 | **Repeat/referral** | Past customers | Retention | Same driver/service | Booking history **[OWNER DECISION]** | *"Travelling again? We have your details."* | Save the number | WhatsApp | post-trip | Seasonal note |

---

# 11. Tourist Journey and Funnel Plan

## Journey A - Google search -> route page -> WhatsApp

**Strengths [VERIFIED]:** route pages answer the fare question immediately;
reviews sit before the price decision; prefill is route-specific.

**Drop-off risks [INFERENCE]:**
1. No one-way fare on 6 routes -> visitor must ask, may not.
2. No "what happens next" beside the CTA.
3. Mobile page height 8,000-15,600px pushes FAQs far down.

**Recommended UI changes:** add expected reply time next to every primary CTA;
publish one-way fares; add a sticky mini fare summary on scroll.
**Tracking:** `cta_whatsapp_click` with route + position. **[VERIFIED]**
`conversion-tracking.js` is present on 35 pages - extend to legacy pages.

## Journey B - Google Business Profile -> website -> booking

**Strengths [VERIFIED]:** NAP consistent; Google review link on 36 pages.

**Drop-off risks:** GBP likely points at the homepage, which is the weakest
converting page (3 competing CTAs, legacy system, unverified claims).

**Recommendation:** point the GBP website link at `/agra-local-sightseeing/`
or `/agra-taxi-fares/` with UTM tags until the homepage is rebuilt.

## Journey C - Blog / LLM recommendation -> guide -> service page

**Strengths [VERIFIED]:** 16 substantial guides; honest hedging ("can't be
guaranteed") makes them credible and quotable by AI assistants.

~~**Drop-off risks [VERIFIED]:** **no reviews, no sticky CTA, no fare context on
any blog page**; tables overflow on mobile.~~ **[CORRECTED 31 Aug 2026, entry
#39]** Overstated - a CTA and fare context already existed on every article.
The genuine risks were: no reviews (now closed on 7/15) and table overflow
(now verified fixed - see P0-3/A11Y-11).

**[STATUS 31 Aug 2026]** The reviews/CTA/table gaps below are resolved. Still
open in this journey: no `<caption>`/`scope` on blog tables (BL-3), heading
skips inside the 15 article bodies (BL-4), and the legacy FAQ accordion's
missing `aria-expanded` (BL-6) - none of these were in this task's scope.

**Recommended changes [CORRECTED, DONE 31 Aug 2026]:**

* ~~**P0** - wrap the overflowing tables in a scroller.~~ **DONE** - re-verified
  already correct; see P0-3.
* ~~**P1-8** - for each article, add the two or three reviews relevant to that
  article's subject... and one CTA pointing at the single most relevant
  service page.~~ **DONE**, with one disclosed deviation: the shared review
  component is a fixed 9-card grid (not a 2-3-review mode), so honesty was
  applied at the review-**set** level - see the "Implemented" note under
  P1-8's caution above and `docs/blog-content-to-service-map.md`.

## Journey D - Hotel recommendation -> QR -> booking

**Current state [VERIFIED]:** no hotel-partner page exists; no QR
destination; no partner-attributable link.

**Recommended [CORRECTED]:** build **one** genuine `/partners/` page and
attribute individual hotels with **UTM-tagged QR codes**
(`/partners/?utm_source=hotel&utm_medium=qr&utm_campaign=<hotel-name>`) rather
than with per-hotel pages. **[VERIFIED]** `js/booking.js` already captures UTM
parameters.

**[RECOMMENDATION]** Do not mass-produce hotel-specific landing pages - near-
identical pages differing only by hotel name are doorway pages and put the
whole domain at risk. A hotel-specific page is justified only where a real
partnership exists **and** the page carries genuinely unique content (that
property's pickup point, agreed service levels, directions). Full reasoning
under P3-3. **[OWNER DECISION]** commission model, and it must be visible to
the guest.

---

# 12. Service and Package Plan

**No prices are invented below.** Where a fare exists it is already published;
where it does not, the offer says "fare on WhatsApp".

| Offer | Intended visitor | Included | Optional additions | Important exclusions | Ideal page | CTA | Info needed to quote | Evidence/photography needed |
|---|---|---|---|---|---|---|---|---|
| **Taj Mahal transfer** | Segments 1, 6, 7 | Hotel<->Taj private AC cab, driver waits | Agra Fort add-on | Monument tickets, guide | `/taj-mahal-taxi/` | Get fare | Date, time, pickup | Have |
| **Taj sunrise pickup** | 1, 7 | Pre-dawn pickup, waiting | Mehtab Bagh sunset | Tickets | `/taj-mahal-sunrise-taxi/` | Book sunrise | Date, hotel | Have |
| **Agra half-day** | 2, 10 | Taj + Agra Fort, driver waits | Baby Taj | Tickets, guide | **new** | Plan half day | Date, passengers | Have |
| **Agra full-day** | 2, 3, 10 | Full sightseeing, one driver | Fatehpur Sikri | Tickets, guide | `/agra-local-sightseeing/` | Plan my day | Date, passengers | Have |
| **Fatehpur Sikri extension** | 2, 13 | Add to full day or Jaipur leg | - | Tickets | `/fatehpur-sikri/` | Add to trip | Route, date | Have |
| **Agra-Mathura-Vrindavan** | 5, 14 | Braj temples, driver waits | Barsana, Govardhan | Temple offerings | `/mathura-vrindavan-barsana/` | Plan the day | Date, temples | Have |
| **Golden Triangle transfer** | 13 | Agra->Jaipur one-way | Fatehpur Sikri stop | Tickets, meals | **extend `agra-to-jaipur-taxi/` first**; a separate page only for a distinct Delhi-Agra-Jaipur itinerary (P3-1) | Get one-way fare | Date, passengers, stop | Need road/route photos |
| **Airport transfers** | 12 | Kheria/Delhi pickup-drop | Meet & greet | Parking, tolls | `/agra-airport-taxi/`, `/agra-to-delhi-airport-taxi/` | Book transfer | Flight, date | Have |
| **Railway transfers** | 11 | Cantt/Fort/Tundla | Same-day sightseeing | Platform tickets | `/agra-railway-station-taxi/`, `/agra-to-tundla/` | Book transfer | Train no., time | Have |
| **Pilgrimage circuits** | 5 | Multi-temple, driver waits | Overnight | Offerings, state taxes | `/agra-temple-tour-by-cab/` | Plan my yatra | Dates, temples | Have |
| **One-way outstation** | 15 | A->B private cab | Stops en route | Tolls, parking | route pages | Get one-way fare | Route, date | **[OWNER DECISION]** publish fares |
| **Family vehicle package** | 3, 8 | Ertiga/Innova + waiting | Child seat **[OWNER DECISION]** | Tickets | `/fleet/` | Ask which cab | Passengers, bags | Have |
| **Group / Tempo Traveller** | 9 | 12-15 seater, arranged per trip | Multi-day | Availability not guaranteed | `/fleet/` | Check availability | Group size, dates | Have |

---

# 13. Hotel and Partner Pitch Plan

**No partner was contacted and no commitment was created during this audit.**

## Partner value proposition **[RECOMMENDATION]**

> Your guests get a fixed fare agreed in writing before they travel, and a
> driver whose name and car number arrive before pickup. You get one number to
> call and no complaints at checkout.

## Partner types and handoff

| Partner | Tourist benefit | Handoff | Collateral |
|---|---|---|---|
| Hotels | No haggling at the desk | **[CORRECTED]** QR at reception -> `/partners/?utm_source=hotel&utm_campaign=<hotel-name>` - **one shared page, per-hotel UTM**, not a page per hotel | Card + QR standee |
| Homestays/guest houses | Trusted local cab | Direct WhatsApp with hotel name | Printed card |
| Tour guides | Reliable vehicle | Guide books directly | Rate sheet **[OWNER DECISION]** |
| Travel planners | Consistent transfers | Email/WhatsApp with itinerary | Service-level sheet |
| Attraction partners | Onward transport | Link/QR | Poster |

## Example WhatsApp template (draft - **not sent**)

> *Namaste [Hotel], this is Padma Shree Travels, an Agra-based taxi service.
> We provide private AC cabs with fares confirmed in writing before travel and
> driver details shared before pickup. If it is useful, we can give you a card
> and a QR code so guests can message us directly - no cost to the hotel. May
> we drop one at reception?*

**[OWNER DECISION] required before any outreach:**
* Commission or referral arrangement, if any - and it must be disclosed, never
  hidden from the guest.
* Guaranteed response time for partner bookings.
* Whether partner rates differ from public rates.

**[RECOMMENDATION]** Avoid any arrangement the guest cannot see. If a
commission exists, the guest should still pay the published fare.

## Tracking

UTM-tagged QR per partner (`?utm_source=hotel&utm_medium=qr&utm_campaign=<name>`).
**[VERIFIED]** `js/booking.js` already captures UTM parameters - the
infrastructure exists.

---

# 14. Google Business Support Plan

| Area | Current **[VERIFIED]** | Recommendation |
|---|---|---|
| **NAP consistency** | Address, phone, email identical across all rebuilt pages | Verify byte-match with GBP |
| **Review link** | `g.page/r/...` on 36 pages | Add to the remaining 21 |
| **Service relevance** | 34 route pages match likely GBP services | Add GBP services matching page names |
| **Local pickup info** | "Pickup from any Agra address including Agra Cantt, Agra Fort station, Kheria Airport" on rebuilt pages | Mirror in GBP description |
| **Photos** | Authentic own-fleet photography | Upload the same fleet images to GBP |
| **Review acquisition** | No on-site review request | Add a post-trip WhatsApp ask (no incentive, no gating) |
| **Review response** | Not assessable from the site | Respond to all reviews, positive and negative |
| **Posts** | None | Weekly post per route/season |
| **FAQ alignment** | Rebuilt pages have strong FAQs | Reuse in GBP Q&A |
| **Website link** | Destination not verifiable from the codebase | See "GBP website destination" below |
| **UTM** | Infrastructure exists (`js/booking.js` already captures UTM parameters) | Tag the GBP link |
| **Sitemap** | **`sitemap.xml` exists** - 54 URLs, referenced by `robots.txt` | Audit and update - see below |

## GBP website destination **[CORRECTED]**

The original report recommended pointing the Google Business Profile link at a
rebuilt page "until the homepage is fixed". That was stated too much like an
instruction. Corrected position:

* **The long-term priority is fixing the homepage** (P1-1). The homepage is
  the correct destination for a Google Business Profile: it is the page a
  visitor expects, it carries the brand, and it is where the business should
  invest. Redirecting around it is a workaround, not a strategy.
* **Changing the GBP destination is a temporary, tracked
  [OWNER DECISION]** - not something to action automatically. If the owner
  chooses to do it while the homepage is being rebuilt, then:
  - it should be **explicitly time-boxed** to the homepage rebuild;
  - the replacement URL should carry **UTM tags** so the effect is measurable;
  - **before/after enquiry volume should be compared** so the change can be
    judged, and reverted if it performs worse.
* **[INFERENCE]** The homepage's weaknesses (three competing CTAs, unverified
  claims, no hero preload) are the reason this was raised at all. Fixing them
  removes the question entirely.

## Sitemap audit **[CORRECTED]**

**The original report said "no sitemap exists" and labelled it [VERIFIED].
That was false.** `sitemap.xml` exists at the project root, is 10,968 bytes,
and `robots.txt` correctly references it
(`Sitemap: https://www.padmashreetravels.in/sitemap.xml`).

**Structural health - all [VERIFIED]:**

| Check | Result |
|---|---|
| `<url>` entries | **54** |
| Well-formed `<urlset>` with correct `xmlns` | Yes |
| Duplicate `<loc>` values | **0** |
| URLs resolving to a real file (404 risk) | **54 / 54 - none broken** |
| `noindex` or cross-canonical URLs wrongly included | **0** |
| Retired `taj-mahal-agra-fort.html` correctly excluded | Yes |

The sitemap is in better shape than the original report implied. It contains
no dead URLs, no duplicates, and does not list the retired redirect stub.

**Two real gaps - both [VERIFIED]:**

1. **Coverage: one page missing.** There are **55** canonical, indexable
   public pages; **54** are listed. The omission is **`book/`** - which is
   `index, follow`, self-canonical, and the site's only booking page. It
   should be listed.
2. **`lastmod` is systematically stale.** **53 of 54** entries carry a
   `lastmod` earlier than the file's actual modification date:

   | `lastmod` in sitemap | URLs |
   |---|---|
   | 2026-07-03 | 27 |
   | 2026-07-04 | 14 |
   | 2026-05-16 | 10 |
   | 2026-07-25 | 3 |

   The newest actual file modification among those pages is **2026-08-30**.
   **[INFERENCE]** The sitemap predates the 35-page rebuild, so it is telling
   search engines that substantially rewritten pages have not changed since
   May-July.

**[RECOMMENDATION] Audit and update the sitemap** (not create one):

* add `book/`;
* refresh every `lastmod` to the true last-modified date;
* re-check `changefreq`/`priority` values, or drop them - Google ignores them;
* regenerate the sitemap whenever pages are rebuilt, so `lastmod` stays true;
* **[OWNER DECISION]** whether to submit the refreshed sitemap in Search
  Console to prompt a recrawl of the rebuilt pages.

**`sitemap.xml` was not modified during this audit** - it was read only.

**Explicitly not recommended:** fake locations, keyword-stuffed business names,
review gating, purchased or incentivised reviews, fake customer photos, or
duplicate profiles.

---

# 15. Prioritized Improvement Roadmap

## P0 - Conversion-blocking or trust-critical

| ID | Problem | Pages | Change | Benefit | Difficulty | Risk | Dependency | Verify |
|---|---|---|---|---|---|---|---|---|
**[CORRECTED] Reclassification.** P0 is now reserved for unsupported claims,
broken forms and serious accessibility failures - i.e. things that are
*broken or misleading*, not things that could convert better. The blog
reviews/CTA item was a conversion **enhancement**, not a demonstrated broken
experience, so it has moved to **P1-8**. The blog table overflow stays in P0
because a measured, reproducible mobile failure *was* demonstrated. The
contact form has been **promoted into P0** because 4 of 4 fields have no
label, which is a broken form.

| ID | Problem | Pages | Change | Benefit | Difficulty | Risk | Dependency | Verify |
|---|---|---|---|---|---|---|---|---|
| **P0-1** | ~~Unverified safety claims: "sanitised", "commercially insured", "verified drivers"~~ **DONE 31 Aug 2026** - 12 occurrences removed across `index.html` and `about/`; a punctuality guarantee softened; "unlimited waiting" bounded; the 2-hour cancellation policy withdrawn from metadata and schema. See `docs/claims-policy-audit.md`. | `index.html`, `about/` | Completed | Credibility contradiction removed | Low | **[OWNER DECISION]** to restore any claim | Owner confirmation | **Verified:** claim scan returns 0; 17 JSON-LD blocks valid; schema/visible diffs 0 |
| **P0-2** | **Contact form: 4 of 4 fields have no `<label>`** - the form cannot be reliably completed with a screen reader | `contact/` | Associate a `<label>` with every field | A primary contact route becomes usable | Low | Low | none | Every field has a label; keyboard-only submission works |
| **P0-3** | ~~Blog tables overflow on mobile~~ **[DONE - re-verified 31 Aug 2026, entry #39]** All 12 blog tables sit in `.dtable-wrap`; 0 page-level overflow confirmed at 390px | 12 blog pages | Completed | Tables readable on a phone | Low | Low | none | **Verified:** wrapper `clientWidth` <= viewport, table `scrollWidth` scrolls internally, `document.documentElement.scrollWidth` == viewport width on all 6 sampled pages |
| **P0-4** | Booking form: 16 controls with no focus indicator; 2 unlabelled fields | `book/` | Add `:focus-visible`; add labels | Keyboard users can complete the form | Low | Low | none | 0 unfocusable; labels associated |

## P1 - High impact

| ID | Problem | Pages | Change | Benefit | Difficulty | Risk | Dependency | Verify |
|---|---|---|---|---|---|---|---|---|
| **P1-1** | Homepage on legacy system: no skip link, no preload, 3 competing CTAs, 37px bar | `index.html` | Rebuild on `landing.css` | Fixes ~10 findings at once | **High** | Medium - highest-traffic page | P0-1 | Full audit re-run. **Note:** a rebuild was delivered on 31 Aug and reverted at the owner's request; the working file is kept for reuse. |
| **P1-2** | *(moved to P0-2 - a broken form is not an enhancement)* | - | - | - | - | - | - | - |
| **P1-3** | No skip link on 22 pages | legacy | Add shared skip link | Keyboard navigation | Low | Low | none | Present + focusable |
| **P1-4** | Contrast 3.19:1 / 3.65:1 | 22 legacy | Darken small/footer text | WCAG AA | Low | Low | none | >=4.5:1 |
| **P1-5** | `aria-expanded` never set on FAQ | 22 legacy | Set in `main.js:13` | Screen-reader state | Low | Low | none | Toggles true/false |
| **P1-6** | 4 routes missing from nav dropdown | all | Add Shikohabad, Sirsaganj, Tundla, Bateshwar | Discoverability | Low | Low | none | Present in nav |
| **P1-7** | No one-way fares on 6 routes | 6 routes | Publish | Removes an enquiry step | Low | **[OWNER DECISION]** | Owner | Fares shown |
| **P1-8** | ~~17 blog pages have no reviews and no route CTA~~ **[DONE 31 Aug 2026, entry #39]** Verified all 15 articles already had a contextually-relevant CTA before this task (built earlier, never cross-referenced in this audit); added an honest reviews section to 7 of 15 where an existing curated set genuinely matches, plus `conversion-tracking.js` hooks (`data-cta`, `data-track="pricing"`, `id="waBtn"`) on all 15 so clicks are now attributable per article. | blog | Completed | Converts the largest content asset; per-article click data now flows | Medium | Low - reused existing, already-vetted components | none | **Verified:** 0/16 structural issues, 1,501 links checked/0 broken, 9-card reviews render only on the 7 mapped articles, 0 page-level table overflow at 390px |
| **P1-9** | **[CORRECTED]** Sitemap is stale: `book/` missing, and 53 of 54 `lastmod` dates precede the actual file dates | `sitemap.xml` | Audit and update (see section 14) | Search engines learn the rebuilt pages changed | Low | Low | none | 55/55 pages listed; `lastmod` matches file dates |

### Caution on P1-8 - reviews and CTAs must be contextual **[CORRECTED]**

The original report recommended adding "the reviews component" to all 17 blog
pages. Taken literally that would drop **the same review set onto every
page**, which is the wrong outcome for three reasons:

1. **[INFERENCE]** Identical testimonials repeated site-wide read as
   decoration rather than evidence, and lose persuasive force.
2. The site already has better practice to follow. `js/reviews-data.js`
   supports **per-page curated review keys**, and the rebuilt pages use them -
   the Bateshwar page leads with the review that names Bateshwar, the fleet
   page leads with reviews about the *car*. **[VERIFIED]**
3. A generic CTA on a specific article wastes the intent. A reader of
   *"Best time to visit the Taj Mahal"* wants a Taj transfer, not a generic
   "Book a cab" button.

**[RECOMMENDATION]** For each blog article, choose:
* the **two or three reviews most relevant to that article's subject**, using
  the existing per-page key mechanism; and
* **one CTA pointing at the single most relevant service page** - Taj
  articles to the Taj transfer, Braj articles to the Mathura-Vrindavan tour,
  Jaipur articles to the Agra-Jaipur route.

Where no genuinely relevant review exists, **[RECOMMENDATION]** show fewer
reviews rather than padding with unrelated ones. The rebuilt pages already
set this precedent by stating honestly when no review names a route.

**[IMPLEMENTED 31 Aug 2026, entry #39 - one deviation from the recommendation
above, disclosed.]** The CTA-per-article half was already true before this
task (verified, not built). For reviews, `reviews-grid.js` is a fixed
nine-card component used unchanged everywhere else on the site - there is no
"show two or three reviews" mode, and building one would mean a second review
component, which conflicts with this task's own "use shared CSS/JS" and
"don't duplicate the review UI" constraints. The honesty requirement was
therefore met at the **review-set level** instead of the individual-review
level: each of 7 articles reuses one existing, already-vetted 9-review key
whose reviews are a genuine topical match (documented per article in
`docs/blog-content-to-service-map.md`), each key used on exactly one blog
article so no set repeats, and 8 articles with no honest set match get no
review section at all - which does satisfy the "show fewer rather than pad"
principle, just at the whole-section granularity rather than per-card.

## P2 - Consistency

| ID | Problem | Pages | Change | Difficulty | Verify |
|---|---|---|---|---|---|
| **P2-1** | Two mobile CTA bars | 22 legacy | Standardise on 2-action 47px bar | Medium | Uniform markup |
| **P2-2** | 57 legacy images without dimensions | 21 legacy | Add width/height | Low | 0 missing |
| **P2-3** | unpkg Lucide on 21 pages | legacy | Inline SVG | Medium | 0 external icon requests |
| **P2-4** | 16/18 KB duplicated inline CSS | 2 locked | Move to `landing.css` | Low | **[OWNER DECISION]** unlock |
| **P2-5** | route-finder: 98% sub-40px targets | route-finder | Increase padding | Low | <40px count falls |
| **P2-6** | Dead 2.1 MB `Banners/B.png` | repo | Remove | Low | File gone |
| **P2-7** | Heading skips | 20 pages | Correct order | Low | 0 skips |

## P3 - Enhancement

| ID | Enhancement | Rationale |
|---|---|---|
| **P3-1** | ~~Golden Triangle: extend `agra-to-jaipur-taxi/` first~~ **[DONE 31 Aug 2026, entry #40]** `agra-to-jaipur-taxi/` remains locked (the blocker named below was never lifted), so context was added to `jaipur-to-agra-taxi/` and `agra-to-delhi-airport-taxi/` instead, and `golden-triangle-agra-jaipur-delhi/` was built as the "genuinely distinct itinerary" page this section itself said would be justified. | Content for this segment already exists; a second page would cannibalise it |
| **P3-2** | ~~International-visitor page~~ **[DONE DIFFERENTLY, 31 Aug 2026, entry #40]** Analysis in entry #40 concluded a dedicated hub page would either duplicate or cannibalise page-specific content, so instead 7 pages (`index.html`, `taj-mahal-taxi/`, `taj-mahal-sunrise-taxi/`, `fatehpur-sikri/`, `agra-airport-taxi/`, `agra-to-delhi-airport-taxi/`, `jaipur-to-agra-taxi/`) each gained their own international-visitor section, including the "no unrequested shopping stops" claim named in row 8 of the finding table below (already a live, owner-confirmed claim on `about/` and `agra-karauli-kaila-devi-balaji-tour/` before this task - not newly invented). The 2 locked pages were excluded pending an unlock decision. | No page addresses the scam anxiety |
| **P3-3** | ~~**One** genuine `/partners/` page with UTM-tagged QR~~ **[DONE, pending owner sign-off, 31 Aug 2026, entry #40]** `partners/index.html` built exactly as recommended - one page, no per-hotel pages. Commercial terms (commission, exclusivity) are marked open on the page itself pending owner confirmation. | Journey D has no landing point; per-hotel pages are a doorway-page risk |
| **P3-4** | **[CORRECTED]** Sitemap already exists - moved to **P1-9** as "audit and update" | The original "create a sitemap" recommendation was based on a false finding |
| **P3-5** | `prefers-reduced-motion` | 56 of 57 pages lack it |
| **P3-6** | Homepage segment doors | Replace route-first with visitor-first |
| **P3-7** | "From RsX" column on fleet page | Closes the vehicle->price loop |
| **P3-8** | Google Places key for booking form | **[VERIFIED]** `MAPS_KEY` empty; code inert |

### P3-1 - Golden Triangle: extend before you build **[CORRECTED]**

The original report recommended a **new** Golden Triangle page. That was too
quick. **[VERIFIED]** `agra-to-jaipur-taxi/` already exists, is 2,127 words,
covers the Agra-Jaipur leg, and mentions the Fatehpur Sikri stop. A new page
targeting "Agra to Jaipur taxi" would compete directly with it.

**[RECOMMENDATION] - in this order:**

1. **Extend the existing page first.** Add a Golden Triangle section to
   `agra-to-jaipur-taxi/`: where the leg sits in a Delhi-Agra-Jaipur
   itinerary, the Fatehpur Sikri stop, luggage for onward travel, and typical
   timing. This captures the segment with **no cannibalisation risk** and no
   new page to maintain.
2. **Only build a separate page for a genuinely distinct itinerary** - a
   full **Delhi-Agra-Jaipur multi-leg or multi-day service** that the
   existing page does not describe. That is a different product (different
   origin, more than one leg, possibly overnight), not a re-cut of the same
   route.
3. **If a new page is built, differentiate it explicitly:** the existing page
   keeps single-leg "Agra to Jaipur taxi" intent; the new page targets
   "Golden Triangle tour transport". Cross-link them and give them distinct
   H1s, titles and itineraries.

**Blocker: [OWNER DECISION]** - `agra-to-jaipur-taxi/` is currently one of the
two locked read-only pages. Step 1 cannot proceed until it is unlocked.
**[INFERENCE]** This is the same constraint that forced the retirement of
`taj-mahal-agra-fort.html`: content cannot be differentiated from a page that
cannot be edited.

### P3-3 - Partner pages: one real page, not a template farm **[CORRECTED]**

The original report proposed "`/partners/` + per-hotel landing pages". The
per-hotel part carries real risk and is revised.

**[RECOMMENDATION] Build exactly one genuine `/partners/` page first.** It
should carry the partner proposition, what the hotel's guests get, how the
handoff works, and a single point of contact. One page, real content,
maintained.

**Track partners with UTM-tagged QR codes, not with pages.** A per-hotel QR
pointing at
`/partners/?utm_source=hotel&utm_medium=qr&utm_campaign=<hotel-name>` gives
full per-partner attribution **without creating a single extra page**.
**[VERIFIED]** `js/booking.js` already captures UTM parameters, so the
infrastructure exists today.

**[RECOMMENDATION] Do not mass-produce hotel-specific pages.** Twenty near-
identical pages differing only by hotel name are **doorway pages** - thin,
templated content built for search rather than for readers. Search engines
treat that pattern as spam, and the risk lands on the whole domain, including
the 34 pages just rebuilt.

**A hotel-specific page is justified only when both are true:**

1. **A real partnership exists** - a signed or agreed arrangement, not a
   prospect list; and
2. **The page has genuinely unique content** - that hotel's pickup point,
   agreed service levels, directions from that property, and a fare basis
   specific to the arrangement. If the page would read the same with the
   hotel's name swapped, it should not exist.

**[OWNER DECISION]** Commission or referral terms, and whether partner rates
differ from public rates. Any arrangement must be visible to the guest - the
guest should still pay the published fare.

---

# 16. Testing Plan

**Re-run after each change:**

1. **Structural** - one H1; no heading skips; alt text; width/height; skip link;
   table caption/scope; label association.
2. **Viewport** - 1440/768/390/320. Pass = `scrollWidth == clientWidth` with no
   element past the edge except fare tables inside `.ftbl-wrap`.
3. **Accessibility** - every control shows a focus ring; contrast >=4.5:1 for
   body text; `aria-expanded` toggles; keyboard-only completion of the booking
   and contact forms.
4. **Conversion** - every WhatsApp link has `target="_blank"`, `rel="noopener"`
   and a route-specific prefill; validate links **without sending messages**.
5. **Performance** - hero preload matches the hero image; 0 console errors;
   LCP image under ~200 KB.
6. **Regression** - after any shared CSS/JS change, re-test one page per
   template family.
7. **Fare integrity** - `agra-taxi-fares/`, the route page and
   `js/booking.js` must agree. **[VERIFIED]** currently 13/13.

**Acceptance for P0-1:** `sanitis`, `commercially insured`, `verified driver`
return **0** in live markup site-wide, including JSON-LD.

---

# 17. Business-Owner Decisions Required

| # | Decision | Why it matters | Blocking |
|---|---|---|---|
| **1** | **Are vehicles commercially insured? Are drivers verified? Are cars sanitised before every trip?** | **Claims now REMOVED from production** (31 Aug 2026) because no verifiable evidence exists in the project - the only supporting document was auto-generated from the website itself. Supply the policy/process and they can be restored. | **P1-1**; see `docs/claims-policy-audit.md` |
| **2** | **Is "free cancellation up to 2 hours before" the real policy?** | Stated on exactly **2 of 57 public pages** - `book/` and `agra-to-sirsaganj/` - in visible text, meta description **and** FAQ schema on both. Strong conversion argument if it is genuinely site-wide. See the verification below. | P1 |
| **3** | **Is there genuinely no night surcharge?** | Stated repeatedly on transfer pages | P1 |
| **4** | **Publish one-way fares?** (Firozabad, Etawah, Shikohabad, Sirsaganj, Hathras, Tundla) | Every enquiry currently costs a WhatsApp exchange | P1-7 |
| **5** | **Confirm SUV range Rs3,800-Rs4,500** | Appears on `book/` and `agra-to-bateshwar/` only | P0 |
| **6** | **Unlock the two locked pages?** | 34 KB duplicated inline CSS; blocks a Taj-specific page. **[UPDATED 31 Aug 2026]** Also now the reason `agra-local-sightseeing/` and `agra-to-jaipur-taxi/` did not receive the entry #40 international-visitor section or Golden Triangle context every comparable page received. | P2-4, P3-1, entry #40 |
| **7** | **Primary channel: WhatsApp or phone?** | The two systems disagree | P1-1 |
| **8** | ~~"No unrequested shopping stops" - can this be committed to?~~ **[ANSWERED - already yes]** Verified 31 Aug 2026: this claim is already live on `about/index.html` and `agra-karauli-kaila-devi-balaji-tour/index.html`, both pre-dating entry #40. It was extended to 7 more pages' international-visitor sections in entry #40 on that basis - not a new commitment, an existing one applied more widely. | P3-2, entry #40 |
| **9** | **Hotel commission model** | Must be disclosed, never hidden. **[UPDATED 31 Aug 2026]** `partners/index.html` now exists with this, and four related terms, explicitly listed as open on the page itself - see entry #40 Part C and its owner-decision list. Do not promote the page to any hotel before these are settled. | P3-3, entry #40 |
| **10** | **Add a Google Maps API key?** | `MAPS_KEY` empty; autocomplete code inert | P3-8 |
| **11** | **Is child-seat provision available?** | Family segment asks | P3 |
| **13** | **"To guarantee availability"** on the homepage FAQ (HP-13). Recommended replacement, needing no owner input: *"advance booking is recommended during busy periods"*. Flagged rather than changed, because the instruction was to revert the homepage, not to edit it. | Live guaranteed-availability claim on the highest-traffic page | P0 |
| **12** | **Confirm "driver details before pickup" holds every time** | Used as the primary trust signal across the site | P0-1 |

---

## Appendix A - Corrections log (31 August 2026)

Every change made to this report after first issue, and why.

| # | Original statement | Status | Corrected to |
|---|---|---|---|
| 1 | "`sitemap.xml` - **[VERIFIED]** none exists for a 57-page site" | **Factually wrong, and wrongly labelled [VERIFIED]** | `sitemap.xml` exists (10,968 bytes, 54 URLs, referenced by `robots.txt`). Full audit added to section 14; roadmap item moved from P3-4 "create" to **P1-9 "audit and update"**. |
| 2 | Report used 305 non-ASCII characters | Not corrupt, but fragile | File was always valid UTF-8 with zero byte-level mojibake. All non-ASCII folded to ASCII so the document is immune to editor encoding settings. |
| 3 | "Cancellation policy appears on only 2 of 57 pages" | **Count was correct**; precision added | Named exactly: `book/` and `agra-to-sirsaganj/`, each in visible text, meta description and JSON-LD. Three false positives documented (`agra-to-tundla/`, `js/reviews-data.js`, `css/style.css`). |
| 4 | Blog reviews/CTA listed as **P0-2** | Misclassified | Moved to **P1-8**. It is a conversion enhancement; no broken experience was demonstrated. |
| 5 | Contact form (4/4 unlabelled fields) listed as **P1-2** | Under-prioritised | Promoted to **P0-2**. A form that cannot be completed with a screen reader is a broken form. |
| 6 | "Add the reviews component to all 17 blog pages" | Would produce identical reviews site-wide | Reviews and CTAs must be **contextually relevant per article**, using the existing per-page key mechanism. Show fewer reviews rather than padding with unrelated ones. |
| 7 | "Build a Golden Triangle page" | Cannibalisation risk | **Extend `agra-to-jaipur-taxi/` first.** A new page only for a genuinely distinct Delhi-Agra-Jaipur itinerary. Blocked by that page's locked status. |
| 8 | "`/partners/` + per-hotel landing pages" | Doorway-page risk | **One** genuine `/partners/` page; attribute hotels with **UTM-tagged QR codes**. A hotel-specific page requires a real partnership *and* unique content. |
| 9 | "Point the GBP link at a rebuilt page until the homepage is fixed" | Stated as an instruction | **Fixing the homepage is the long-term priority.** Changing the GBP destination is a **temporary, tracked [OWNER DECISION]** - time-boxed, UTM-tagged, and measured before/after. |

**Unchanged and re-confirmed:** the false-alarm note about phantom mobile
clipping, all viewport measurements, the 1,411-link / 0-broken result, the
13/13 fare agreement, and every accessibility measurement.

**Scope of the correction pass:** `docs/ui-ux-tourist-marketing-audit.md` only.
**No production HTML, CSS, JavaScript, image, redirect or configuration file
was read-modified.** `sitemap.xml` and `robots.txt` were **read only**.

---

## Appendix B - Audit evidence index

| Screenshot | Shows |
|---|---|
| `01-homepage-desktop.png` | Three competing hero CTAs; low-contrast "Book Online" |
| `02-homepage-mobile.png` | Correct mobile render; 3-action 37px bar |
| `03/04-route-major-*.png` | Reference-quality route template |
| `05-route-short-mobile.png` | Short-route template consistency |
| `06-sightseeing-desktop.png` | Locked page quality |
| `07-pilgrimage-desktop.png` | Pilgrimage template |
| `08-railway-transfer-mobile.png` | Transfer page mobile |
| `09-outstation-hub-desktop.png` | Hub page |
| `10-fare-page-mobile.png` | Fare table containment |
| `11-fleet-desktop.png` | Honest vehicle disclaimers |
| `12-booking-mobile.png` | Working booking form |
| `13-about-legacy-desktop.png` | Legacy system |
| `14-route-finder-mobile.png` | 98% sub-40px tap targets |
| `15-blog-article-mobile.png` | Blog article; table overflow |
| `16-homepage-narrow-320.png` | 320px behaviour |
| `17-blog-index-desktop.png` | Blog index; no reviews/CTA |
| `18-contact-legacy-mobile.png` | Contact page; unlabelled fields |

**End of audit.**
