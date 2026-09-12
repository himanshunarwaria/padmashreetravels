# Owner-Confirmed Updates — Implementation Report

**Date:** 12 September 2026
**Scope:** the four owner-confirmed answers (support hours, established year, cancellation, official logo)
**Status:** all four implemented and verified. Nothing committed, pushed or deployed.

---

## 1. Summary

| # | Update | Result |
|---|---|---|
| 1 | Support hours → daily 9 AM–9 PM IST | **0 availability absolutes remain** on any of 59 public pages |
| 2 | Established 2025 | Visible on homepage + About; `foundingDate` in **77 schema nodes / 41 pages** |
| 3 | Cancellation → free 12 h before departure | Published on **38 pages** |
| 4 | Official logo everywhere | **37 text monograms replaced**, 37 footers gained the logo, 0 monograms left |

Verified at **360 / 390 / 768 / 1440 px**: zero horizontal overflow, zero CTA overflow, zero console errors on 13 changed templates, **0 HTML tag-integrity problems across 65 files**, and all **230 `ld+json` blocks still parse**.

**There is no template engine or generator** in this repository — pages are hand-authored static HTML. Changes were therefore applied to every generated page directly, plus the three shared stylesheets. Nothing needs to survive a rebuild because there is no build step.

---

## 2. Support hours

**The important decision here was refusing to treat all "24/7" claims as one thing.** The owner confirmed *support* hours and explicitly warned against inferring that vehicle operations are limited to them. So every claim was classified by rendered context **before** any edit:

| Type | Distinct phrasings | Treatment |
|---|---|---|
| **SUPPORT** — answering calls/WhatsApp | 6 (57 pages) | Replaced with the confirmed hours |
| **OPERATIONS** — pickups, vehicles running | 17 | **De-absolutised** |
| **AMBIGUOUS** — chips, stats, badges | 17 | Classified individually, then treated as support or operations |

**Support wording now used:** *"Call or WhatsApp us daily, 9 AM–9 PM IST."*
Chips and headings use the short form (hero chip "Support daily, 9 AM–9 PM IST"; contact heading "Get in Touch — Daily, 9 AM–9 PM IST"; stat blocks "9–9 / Support Daily, IST").

**Operations wording** had to avoid two opposite errors — promising round-the-clock pickups, and implying pickups stop at 9 PM. The replacement states the request model the site actually runs on:

> **Before:** "We run 24 hours a day, every day of the year including holidays and festivals."
> **After:** "Tell us your pickup time — including early-morning or late-night — and we confirm availability in writing before you book."

> **Before:** "We operate 24/7 for airport pickups and drops, including late-night arrivals and early-morning departures."
> **After:** "Tell us your flight time — including late-night arrivals and early-morning departures — and we confirm availability in writing before you book."

FAQ answers to "Is the taxi available for early morning or late night?" now answer honestly without a guarantee: *"Yes — early-morning and late-night journeys are arranged on request. Tell us your pickup time and we confirm availability in writing before you book."*

**Verified:** 113 replacements in the first pass + 16 in a targeted second pass. **0 rendered occurrences** of `24/7`, `24 hours a day`, `around the clock` or `always available` across all 59 public pages. **58 pages carry the confirmed hours** (the 59th is `driver-app/icons/generate-icons.html`, the orphan internal tool already deferred as PST-22).

**Flagged, not changed:** 12 occurrences survive inside HTML editorial comments. They are invisible to visitors and preserve the maintainer record of what a page once claimed. Say the word if you want them rewritten too.

**Still unconfirmed:** whether pickups are genuinely available at any hour, and what notice a 04:00 sunrise or late-night airport run needs. Nothing on the site now asserts either way.

---

## 3. Established year

* **Homepage:** *"Padma Shree Travels has been serving travellers since 2025, a taxi and cab booking service based in Agra…"*
* **About:** *"Padma Shree Travels has been serving travellers since 2025. We are a local taxi and cab booking service based in Shamsabad, Agra…"*
* **Structured data:** `"foundingDate":"2025"` added to **77 LocalBusiness nodes across 41 pages**.

**No conflicting operating-history claim existed** — the only match for "Founded by" was "Founded by Srila Prabhupada", which refers to a temple, not the business, and was correctly left alone.

**Verified:** all 230 `ld+json` blocks parse; pages carrying multiple blocks share one `@id`, so the repeated `foundingDate` is consistent rather than duplicated within a node.

---

## 4. Cancellation

**Policy published:** *"Cancel free of charge at least 12 hours before your scheduled departure."*

| Surface | Treatment |
|---|---|
| `book/` | FAQ answer, visible + FAQPage schema, plus the existing trust chip → "Free cancellation 12 hrs before departure" |
| `agra-to-sirsaganj/` | FAQ answer, visible + schema, plus two inline reassurance lines |
| Homepage | **New FAQ added** — "Can I cancel my booking?" — visible + FAQPage schema kept in sync (now 11 questions) |
| 36 route pages | One concise line under the final CTA: *"Free cancellation up to 12 hours before departure."* |

**38 pages total.** The route-page line uses a new `.cta-reassure` class — a quiet line, deliberately not a badge, so the CTA band stays uncrowded. Measured **5.27:1** on the teal band at every viewport.

**A conflict I found and resolved.** `agra-to-sirsaganj/` carried a maintainer note recording the old figure and warning: *"If the owner says the real policy is something else, BOTH pages must change together — do not 'fix' one of them alone."* The old figure was **2 hours**; the confirmed policy is **12 hours**. Both pages were updated together, and the note replaced with the confirmed policy. The matching note in `book/` was updated too.

**Deliberately absent:** late-cancellation charges, no-show terms and advance-refund handling. Nothing implies cancellation inside 12 hours is free — the FAQ says *"If you need to cancel closer to departure, tell us as early as you can and we will confirm where you stand."*

---

## 5. Official logo

**Asset used:** `images/logo.png` — 510×292, transparent, the file the homepage already used. It was **not** redrawn, regenerated, recoloured, distorted or replaced.

**What was actually wrong:** 37 rebuilt-track pages rendered a **text monogram** — `<span class="hdr__mark">PS</span>`, a green square with black letters — not the logo at all. Their footers had **no logo whatsoever**.

| Surface | Before | After |
|---|---|---|
| Rebuilt header (37) | `<span>PS</span>` green square | Official logo, 42×24 → 45×26 |
| Rebuilt footer (37) | text only | Official logo, 70×40 |
| Legacy header (22) | already correct | unchanged |
| Legacy footer (22) | already correct | unchanged |

**Dark backgrounds.** The mark is black on transparent, so on the dark header it uses `filter: brightness(0) invert(1)` — a *display* treatment, and the same one `css/style.css` already applied to this exact asset in the legacy footer. `logo2.png` and `logo3.png` were **rejected**: both have a baked-in background and would have lost transparency.

**Proportions.** Height is fixed and width `auto`, so the 1.747 aspect can never be squashed. Verified within 0.08 of intrinsic at **all four viewports on both tracks**.

**Two locked pages needed extra work.** `agra-to-jaipur-taxi/` and `agra-local-sightseeing/` carry page-level inline `<style>` blocks that redefined `.hdr__mark` with the old 28×28 square rule, so the logo rendered **square (aspect 1.0)** even with correct markup. My first verification caught this; both inline blocks were corrected. This was a claim/brand correction the owner mandated site-wide, so it supersedes the earlier design lock — flagging it since those pages were previously restricted.

**An accessibility bug found along the way.** The rebuilt header link had **no accessible name below 640px**, because `.hdr__name` was `display:none`. It is now visually hidden instead of removed, so the link is named *"Padma Shree Travels"* at every width.

**Favicons:** 16/32/48/svg/ico/apple-touch all present and confirmed to be the same mark, inverted for small-size legibility — already aligned, no change needed.
**Structured data:** `logo` present; the homepage already carried it as an `ImageObject`, which my first check missed because it only matched the string form.

---

## 6. The 50-vs-37 reconciliation

The audit reported **50** table headers; the implementation measured and fixed **37**. **37 is correct.**

```
grep -o '<th'      →  50
grep -o '<thead'   →  13
grep -oE '<th[ >]' →  37        37 + 13 = 50
```

The audit's pattern `<th` also matched the `<th` prefix of every `<thead>` tag. There are 13 `<thead>` elements across the 12 articles (one article has two tables). Independently confirmed: 37 rendered `<th>`, all inside `.dtable` `<thead>`, none in comments, none in other tables.

---

## 7. Changed files

| File | Changes |
|---|---|
| **59 public HTML pages** | support hours, operations wording, logo markup, `foundingDate`, cancellation |
| `css/landing.css` | `.hdr__mark` as logo, `.hdr__name` visually hidden, `.ft__logo`, `.cta-reassure` |
| `css/style.css` | (earlier passes; untouched this round beyond prior fixes) |
| `sitemap.xml` | (earlier pass) |
| `agra-to-jaipur-taxi/`, `agra-local-sightseeing/` | inline `.hdr__mark` overrides corrected |
| `docs/claims-policy-audit.md` | **new section 9** recording all four answers as owner-confirmed |
| `audit/UX-ISSUES.csv` | PST-06, PST-07, PST-23 statuses updated |
| `audit/screenshots/` | `logo-header-rebuilt.png`, `logo-footer-rebuilt.png` |

---

## 8. Verification results

| Check | Result |
|---|---|
| Availability absolutes (rendered) | **0 / 59 pages** |
| Confirmed support hours present | 58 / 59 (59th = orphan internal tool) |
| Official logo referenced | 58 / 59 |
| Text monograms remaining | **0** |
| Logo aspect at 360/390/768/1440, both tracks | **all within 0.08 of 1.747** |
| Header link accessible name | present at **every** width (was missing <640px) |
| `foundingDate` in schema | 77 nodes / 41 pages |
| Cancellation coverage | 38 pages |
| `.cta-reassure` contrast on teal | **5.27:1** |
| Horizontal overflow | **none** at any viewport |
| CTA overflow / wrapping | **none** |
| Console errors (13 templates) | **none** |
| HTML tag integrity | **0 problems / 65 files** |
| `ld+json` validity | **230 blocks, 0 invalid** |

---

## 9. Remaining owner questions

Four answers resolved three audit items and part of two more. Still open:

| # | Question | Unlocks |
|---|---|---|
| 1 | **Are pickups genuinely available at any hour?** What notice does a 04:00 sunrise or late-night airport run need? | Lets operations wording become specific instead of "on request" |
| 2 | Are the vehicles commercially insured? | Credentials strip (PST-23) |
| 3 | What driver checks are performed, and by whom? | Restores a driver-trust statement |
| 4 | Is the business GST-registered? Number, and are invoices available? | Credentials strip |
| 5 | What payment methods are accepted, and when is payment due? | Completes Booking Terms (PST-06) |
| 6 | Late-cancellation charge, no-show terms, advance-refund handling | Completes the cancellation policy |
| 7 | Realistic first-response time **within** 9 AM–9 PM | Whether "usually replies within minutes" (21 pages) stays |
| 8 | km/hour allowance included, and the rate beyond it | Fare-terms component (PST-18) |
| 9 | Night charges — applied from what hour? | Resolves a known internal contradiction |
| 10 | Flight-delay waiting policy | The airport journey's deciding question |
| 11 | Languages drivers reliably support | International-visitor content |

**Most valuable next answer: #1.** Operations wording is currently the vaguest thing on the site, and it governs the two highest-intent journeys (airport and sunrise).

---

## 10. Limitations

* No real-device testing; all viewport work emulated in Chrome headless.
* No screen-reader pass — the header accessible-name fix was verified structurally, not with NVDA/VoiceOver.
* No WhatsApp message, call or form submission was made.
* 12 availability references remain inside HTML comments (invisible to visitors) — flagged rather than changed.
* Chromium only.

*Changes are local and reviewable. Nothing committed, pushed or deployed.*
