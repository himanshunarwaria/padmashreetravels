# Padma Shree Travels — UX Audit Implementation Report

**Date:** 12 September 2026
**Scope:** implementation of the findings in `audit/UX-AUDIT-REPORT.md`
**Status:** all independently actionable work complete. Nothing committed, pushed or deployed. Changes are local and reviewable.

---

## 1. Summary

| Outcome | Count | IDs |
|---|---|---|
| **Fixed and verified** | **11** | PST-02, 04, 05, 09, 10, 11, 14, 15, 16, 17, 24 |
| **Partially fixed** | 1 | PST-19 (driver-verification claim resolved site-wide; remainder needs owner) |
| **Not reproduced (audit false positive)** | 1 | PST-03 |
| **Pending owner input** | 7 | PST-01, 06, 07, 12, 13, 18, 23 |
| **Deferred with reason** | 4 | PST-08, 20, 21, 22 |

Two findings in my own audit were **wrong and are corrected below** (PST-03, and part of PST-19). I have not revived any of the automated false positives the audit already rejected.

Headline results:

* **Blog table headers: 1.07:1 → 19.8:1** across 37 headers in 12 articles.
* **Heading-level skips: 20 pages → 0**, with zero styling change and zero tag-integrity errors across 65 files.
* **Driver-verification claims: 8 pages → 0**, applying a decision the owner had already made.
* **Zero horizontal overflow** and **zero console errors** maintained at 360/390/768/1440.

---

## 2. Completed fixes

Each was reproduced before being changed, and verified after.

### PST-02 — Blog table headers invisible *(P1)*

**Files:** `css/style.css`

**Reproduced first.** Two rules collided:

| Rule | File | Specificity | Sets |
|---|---|---|---|
| `.dtable th` | `blog/css/blog.css:42` | (0,1,1) | `background:var(--black)` **and** `color:var(--white)` |
| `.dtable thead th` | `css/style.css:2176` | (0,1,2) | `background:var(--g50)` — **no colour** |

The higher-specificity rule replaced the dark background but not the white text, leaving **white on #F7F7F7 = 1.07:1**.

**What changed and why.** The `css/style.css` rule sits in a block commented *"No-horizontal-scroll fixes (Jul 2026)"* whose stated job was `overflow-x` — the header re-skin was scope creep. I removed the accidental `background`, `font-weight` and `font-size` overrides and kept only `white-space: nowrap`, which genuinely serves the scroll fix. The original dark-header design in `blog.css` now applies again, matching `.ftbl thead th` on the landing track.

**Validation.** 37 `th` elements across all 12 articles measured at 360/390/768/1440: **minimum 19.8:1** (body cells 10.86:1), 0 articles failing. Scroll wrapper still `overflow-x:auto`; `.ftbl` unaffected at 19.24:1; no mobile overflow. Before/after screenshots: `audit/screenshots/blog-table-invisible-headers.png`, `blog-table-FIXED.png`.

**Limitations.** Only `.dtable` was in scope; other table components were regression-checked, not redesigned.

---

### PST-04 — Broken image on two blog pages *(P1)*

**Files:** `blog/braj-yatra-from-agra-by-cab/index.html`, `blog/index.html`

**Reproduced first.** `images/about/founder-braj-plains.webp` was absent from disk and 404 live, rendering as a broken image at **750×422 above the fold** (`loading="eager"`) and 358×202 on the blog index.

**What changed and why.** Repointed both to `images/destinations/dest-govardhan-kund.webp`. I checked git history first: commit `822d8f1` records that the owner flagged AI-generated founder photos and had them **replaced with destination-only shots**. A founder portrait would have contradicted that decision, so I chose a destination-only image, and I opened the file to confirm what it depicts rather than guessing. Alt text was rewritten to describe the **new** photograph truthfully: *"Whitewashed shrine beside the water at Govardhan, one of the Braj pilgrimage stops"* — Govardhan is genuinely on the Braj route.

**Validation.** Both pages: 0 broken images. Zero remaining references to the missing file site-wide.

**Limitations.** This is a substitution, not the original intended photograph. If the owner has a Braj countryside image, it should replace this.

---

### PST-05 — Booking page missing from sitemap *(P1)*

**Files:** `sitemap.xml`

**Reproduced first.** `/book/` and `/agra-to-mathura-vrindavan/` both return 200 and are `index, follow` with canonicals, but had no `<loc>` entry.

**What changed.** Added both — `/book/` at priority 0.9 (it is the lowest-friction conversion surface), `/agra-to-mathura-vrindavan/` at 0.8.

**Validation.** 56 → 58 `<url>` entries; `<url>`/`</url>`/`<loc>` counts balanced at 58 each; `urlset` closes correctly.

---

### PST-09 — Heading-level skips on 20 pages *(P2)*

**Files:** 20 HTML pages, `css/style.css`, `blog/css/blog.css`

**Reproduced first.** 26 skips across 20 pages, in two patterns: `h2 → h4` (legacy footer columns; blog card and timeline titles) and `h1 → h3` (3 pages).

**What changed and why.** Tag-level changes only, with every affected CSS selector updated in the same pass:

| Component | Change | CSS updated |
|---|---|---|
| Footer columns `.ft__h` | `h4 → h3` (63 tags, 22 pages) | none needed — `.ft__h` sets its own `font-size` |
| `.rpost` / `.tc2` / `.btl__c` item titles | `h4 → h3` (69 tags, 16 files) | `blog/css/blog.css` — 3 selectors |
| `.rel-card` titles | `h4 → h3` (5 tags) | `css/style.css` — 1 selector |
| `contact/`, `partners/` section heads | `h3 → h2` | none |
| `route-finder` `.rcard__dest` | `h3 → h2` (32 tags) | none — class-based |

I checked **before** changing any tag whether its styling came from a class or from an element-in-selector rule, because the latter would silently lose styling.

**A regression I introduced and caught.** My first pass updated `.rel-card h4 → .rel-card h3` in CSS but converted **zero** tags (the gate I wrote only matched pages containing "Related Articles", and `about/` says "Start Here"). That left 5 headings unstyled. The same thing happened to 11 `.btl__c` headings when my bounded regex stopped at a nested `</div>`. Both were found by the post-change verification and fixed.

**Validation.** Skips **20 pages → 0**. Tag integrity: **0 mismatched open/close tags and 0 nested headings across all 65 HTML files**. Computed styling compared before/after on every affected component — `rel-card` 13.92px/700, `rpost` 13.92px/700, `btl__c` 14.4px/700, `.ft__h` 10.88px/700 ivory, `.rcard__dest` 16px/700 — **all identical**. **0 stranded `h4`** site-wide. Console clean on all 9 changed templates.

**Limitations.** The rebuilt-track footer uses `<p class="ft__h">` rather than a heading. That is a mild semantic weakness but not a *skip*, so I left it — converting `<p>` to a heading would add headings that do not exist today, which is a design decision rather than a defect fix.

---

### PST-10 / PST-11 / PST-24 — Homepage CTA consistency, attribution and prefill *(P2)*

**Files:** `index.html`

* **PST-10.** The FAQ answer's WhatsApp link was the only one on the site opening in the same tab without `rel`. Added `target="_blank" rel="noopener noreferrer"`.
* **PST-11.** 6 of 7 homepage WhatsApp CTAs lacked `data-cta`. Added. This changes **attribution quality only** — `js/conversion-tracking.js` already fired on any `wa.me` href, so no new events and no behaviour change.
* **PST-24.** The homepage prefill was a single line (`Route: ___ | Date: ___ | Passengers: ___`) while route pages send a structured template. Adopted the same structure with **Route left blank**, because the homepage is route-agnostic:

```
Hi Padma Shree Travels, I need a cab from Agra.

Route:
Travel date:
Pickup time:
Pickup point in Agra:
Passengers:
One way or round trip:

Please share availability and fare.
```

**Validation.** Rendered DOM at 360/390/768/1440: **7 of 7** homepage WhatsApp links now carry `data-cta`, `target="_blank"`, `rel=noopener` and the structured prefill. The seventh is rendered by `reviews-grid.js` from the mount's `data-wa`, which was updated with it.

**Limitations.** **No WhatsApp message was sent.** Whether the multi-line prefill renders as intended in the WhatsApp app on iOS/Android is **untested** and must be checked manually once (see §6).

---

### PST-14 / PST-15 / PST-16 / PST-17 — Contrast and target size *(P2)*

All four were reproduced by measuring the rendered element, not by trusting the scanner.

| ID | File | Before | After |
|---|---|---|---|
| PST-14 | `contact/index.html:23` | `.ctc-lbl` `--g400` = **3.19:1** | `--g500` = **5.33:1** |
| PST-15 | `route-finder/index.html:31` | pressed pill `#fff` on `--green #05944F` = **3.92:1** | `#047A41` = **5.43:1** |
| PST-16 | `css/style.css:200` | `.logo__t small` 9.12px, `--g400` = **3.19:1** | 11.2px, `--g500` = **5.33:1** |
| PST-16 (ext.) | `css/style.css:661` | `.rcard__price small` 9.9px, `--g400` = **3.19:1** | 11.2px, `--g500` = **5.33:1** |
| PST-17 | `css/landing.css` | `.link-call` 21px; `.proof__rev` 21px | **33px**; **26px** (40px at 768) |

**Notes on judgement.** For PST-15 the failing state was the **selected** pill, not the default one — I verified which state actually failed before changing anything, and used a darker shade of the existing brand green rather than introducing a new colour. The PST-16 extension to `.rcard__price small` was added because that label states *what the price means* ("One Way" / "Round Trip"), which is central to the fare clarity the audit asks to protect.

**Validation.** All measured at 360/390/768/1440. No horizontal overflow introduced; route-card height unchanged in layout terms (442–460px, price still fits); header height effectively unchanged (67px mobile / 61px desktop).

---

### PST-19 (partial) — Driver-verification claim *(P2)*

**Files:** `index.html` + 7 blog pages

**What I found.** `docs/claims-policy-audit.md` records that the owner already had **"verified drivers" removed from `index.html` and `about/`** because no evidence existed (no certificate, no process record — the supporting documents were marketing copy, which "instruct what to *say*, not records of what is *true*"). But the claim **survived on 7 blog pages and in the homepage hero**.

**What changed and why.** This is not a new claim decision — it is *consistency with a decision the owner already made*. I applied the same treatment, keeping the factual part the owner did approve ("our drivers know their routes well"):

> **Before:** "Padma Shree Travels runs this route with fixed-fare AC cabs and verified local drivers."
> **After:** "Padma Shree Travels runs this route with fixed-fare AC cabs and local drivers who know these routes."

> **Before:** "Private AC cab with a verified local driver."
> **After:** "Private AC cab with a local driver who knows the route."

**Validation.** 8 pages updated; **0 driver-verification claims remain** on any public page. The internal `image-audit.html` (noindex) was excluded.

**Two corrections to my own audit.**

1. The **"guaranteed" family (6 pages)** was flagged as claims needing verification. That was **wrong**. Building the distinct-phrasing catalogue showed they are almost all *honest hedges* — "We cannot guarantee an exact arrival time", "we cannot guarantee specific birds or numbers". These are good practice and were left alone.
2. The **"best/#1/top-rated" count (40 pages)** was inflated by innocuous phrases such as "best time to visit". It needs manual review, not a bulk edit.

**Left for the owner:** "Available 24/7" (57 pages), "Verified Google Reviews" (40 pages), "no hidden/no surge" (22 phrasings), "within minutes" (23 phrasings), "affordable" (21 pages). All are service commitments or response-time promises — see §5.

---

## 3. Changed files

| File | Fixes |
|---|---|
| `css/style.css` | PST-02, PST-09 (`.rel-card` selector), PST-16, PST-16 ext. |
| `css/landing.css` | PST-17 |
| `blog/css/blog.css` | PST-09 (3 selectors) |
| `sitemap.xml` | PST-05 |
| `index.html` | PST-09, PST-10, PST-11, PST-19, PST-24 |
| `contact/index.html` | PST-09, PST-14 |
| `route-finder/index.html` | PST-09, PST-15 |
| `partners/index.html` | PST-09 |
| `about/index.html` | PST-09 |
| `blog/index.html` | PST-04, PST-09 |
| 15 `blog/*/index.html` | PST-09, PST-19, PST-04 (one page) |
| `audit/UX-ISSUES.csv` | statuses + resolution notes |

**Explicitly not touched:** `js/reviews-data.js`, `js/main.js`, `js/booking.js`. (`js/conversion-tracking.js`, `js/reviews-grid.js` and `js/landing.js` show as modified against `HEAD`, but those changes pre-date this session — I did not edit them here.)

Baselines for all 24 files I touched were captured before editing, in the session scratchpad.

---

## 4. Production deployment recommendation

### 4.1 What I established

| Question | Finding | Confidence |
|---|---|---|
| What serves production? | **Vercel** (`Server: Vercel`, region `bom1`) — same platform as the preview. It honours `vercel.json` redirects. | High — measured |
| Does production match any commit? | **No.** Its `css/landing.css` (`531c725a09a4`) matches neither `origin/master` history nor the local `master` history (30 most recent commits touching that file scanned in both). | High — measured |
| What does the preview serve? | **`origin/master` = `23be435`** ("feat: deploy all recent website changes", 2026-09-04). `landing.css` hash `e38fad602246` matches the preview exactly. | High — measured |
| Repository state | `origin/master` (7 commits, repo *Padmashreetravels-V2*) and local `master` (89 commits, legacy history) have **no common ancestor** — two unrelated histories. The working tree content matched `origin/master` before today's edits, while local `HEAD` is a different, older legacy commit. | High — `git merge-base` returns nothing |
| Local Vercel link | `.vercel/project.json` → project **`padmashreetravels-v2`** | High |

**What production is missing** (measured on the live homepage): `conversion-tracking.js`, the premium review section, the collapsible SEO block, the teal section system, and the footer wordmark — and it still serves the retired "Verified reviews on Google" band.

### 4.2 What I could not establish

**Which Vercel project owns the `www.padmashreetravels.in` domain.** That mapping lives in the Vercel dashboard and is not readable from the repository. The evidence is consistent with the domain being attached to a **different project or a pinned older deployment**, but I am not asserting which.

### 4.3 Recommendation

**Do not** simply promote the preview because it is newer. Sequence:

1. **Confirm the domain assignment** in the Vercel dashboard: which project and which deployment currently serve `www.padmashreetravels.in`.
2. **Record the current production deployment ID** — this is the rollback target, and it must be captured *before* anything changes.
3. **Commit this working tree** to the repository that the production project builds from. The working tree — not local `HEAD` — is the source of truth: `HEAD` is on an unrelated legacy history.
4. **Deploy to a preview URL first** and run the acceptance checklist in §6 against it.
5. **Promote to production** only after the checklist passes.
6. **Rollback:** in the Vercel dashboard, promote the deployment ID captured in step 2. No code change required.

### 4.4 Readiness assessment — do not assume the whole preview is ready

| Item | Ready? | Note |
|---|---|---|
| All fixes in §2 | **Yes** | Verified at 4 viewports, console clean |
| Teal design system, premium reviews, footer | **Yes** | Verified in earlier sessions and re-checked here |
| Conversion tracking | **Yes, with a caveat** | Fires correctly, but two event vocabularies coexist (PST-12) — settle GTM tags before relying on the numbers |
| Claim wording | **No — blocking** | "Available 24/7" on 57 pages is unverified (PST-07). Deploying propagates it further |
| Cancellation / payment terms | **No** | Deliberately absent pending owner facts (PST-06) |
| Homepage performance | **Partial** | 1.6 MB, no `srcset` (PST-08 deferred) |
| Raw image folders | **Not an issue** | 366 MB in-repo but confirmed **404 live** — not deployed |

**My recommendation:** the technical fixes are ready and low-risk. The **claim wording is the one thing I would resolve before promoting**, because deploying publishes an unverified availability promise more widely than it is published today.

---

## 5. Remaining issues and dependencies

| ID | Status | Blocked on |
|---|---|---|
| PST-01 | Pending owner | Vercel dashboard access; deployment decision |
| PST-06 | Pending owner | Real cancellation/refund and payment facts (Q4, Q7, Q8) |
| PST-07 | Pending owner | Whether 24/7 is genuine (Q5) |
| PST-12 | Pending owner | GTM container access |
| PST-13 | Pending owner | Operator process decision |
| PST-18 | Pending owner | Actual km/hour allowances and overage rates (Q9, Q10) |
| PST-23 | Pending owner | Year established, GST, driver checks, insurance (Q1–Q4) |
| PST-08 | Deferred | Needs an image derivative pipeline; ~36 new binaries — should be reviewed as an asset change |
| PST-20 | Deferred | Moving 366 MB of binaries is a destructive repo operation needing explicit approval |
| PST-21, PST-22 | Deferred | Internal noindex tooling, no customer impact |

---

## 6. Manual acceptance checklist

Short, and everything on it is something I could not safely verify myself.

- [ ] **Open a WhatsApp CTA on a real phone (iOS and Android).** Confirm the multi-line prefill renders with line breaks intact and the fields are editable. *Do not send the message.* — the one thing blocking full confidence in PST-24.
- [ ] **Tap the "or call" link on a route page on a real phone.** Confirm the dialler opens with `+91 87200 81102` (target size raised from 21px to 33px in PST-17).
- [ ] **Submit the `/book/` form once on a staging copy** with side effects disabled. Validation, error announcement and success behaviour are **untested** — I did not submit.
- [ ] **Open a blog article with a data table on a phone.** Confirm headers are legible and the table scrolls inside its own box, not the page.
- [ ] **Screen-reader pass** on one route page and one blog article. My heading work was verified structurally, not with NVDA/VoiceOver.
- [ ] **Check `/route-finder/` filter pills** in the selected state on a real screen — confirm the darker green reads correctly against the brand.
- [ ] **After deploying:** `curl -s https://www.padmashreetravels.in/css/landing.css | sha256sum` and compare to the preview. They must match.

---

## 7. Owner-verification questions

The 13 questions from the audit, reconciled against `docs/claims-policy-audit.md`, which already carries 11 open owner questions. **Questions 1–4 overlap that list and are still unanswered** — they are the critical path.

| # | Question | What it unlocks | Status |
|---|---|---|---|
| **1** | What year did Padma Shree Travels begin operating? | The credentials strip (PST-23). "Operating from Agra since [YEAR]" is the single strongest legitimacy signal available, and both benchmark competitors publish it. | **Unanswered.** 0 of 59 pages state any operating history. |
| **2** | Is the business GST-registered? If so, the number — and are GST invoices available on request? | Credentials strip + a business-traveller reassurance line. Competitor `goepicindia.com` leads with "GST-registered". | **Unanswered.** Appears on 2 of 59 pages, unverified. |
| **3** | What checks are performed on drivers (licence, police verification, tenure)? Describe precisely. | Restores a driver-trust statement. Until answered, the site says only that drivers know their routes. | **Unanswered — and already open** as Q2 in `docs/claims-policy-audit.md`. I removed the last 8 unevidenced "verified driver" claims (PST-19). |
| **4** | Are the vehicles commercially insured? What cover applies to passengers? | Restores "commercially insured", removed earlier for lack of evidence. | **Unanswered — already open** as Q1 in `docs/claims-policy-audit.md`. |
| **5** | **Is unqualified 24/7 availability accurate?** If not, what are the real hours, and what notice is needed for a 04:00 sunrise or late-night airport run? | **The highest-priority answer.** Governs 57 pages plus schema copies (PST-07). Also the difference between a kept promise and a complaint on the airport journey. | **Unanswered.** Not covered by the earlier claims audit — this is a new finding. |
| **6** | What is the realistic first-response time by WhatsApp, by hour of day? | Whether "Usually replies within minutes" (21 pages) stays, or becomes hour-qualified. | **Unanswered — already open** as Q10 in `docs/claims-policy-audit.md` ("Is it realistic at 2 AM?"). |
| **7** | What payment methods are accepted, and when is payment due? | The Booking Terms block (PST-06). Currently on 11 of 59 pages. | **Unanswered.** |
| **8** | What is the cancellation window, and what is charged after it? | Booking Terms block. | **Unanswered — already open** as Q4 in `docs/claims-policy-audit.md`. The previous wording ("free cancellation up to 2 hours before") was **removed** as unverifiable, so this is a restoration decision. |
| **9** | What km/hour allowance is included in each quoted fare, and the rate beyond it? | The fare-terms component (PST-18). Turns "driver waits" into a checkable commitment. | **Unanswered.** Waiting/extra-km terms appear on 25% of pages. |
| **10** | How are night charges applied, and from what hour? | Fare-terms component; also resolves a known contradiction — internal driver material says night charges apply, while some pages imply they do not. | **Unanswered — related to Q6** in `docs/claims-policy-audit.md` ("Is there genuinely no night surcharge?"). |
| **11** | If a flight is delayed, is waiting time free, and for how long? | The airport journey's deciding question (Journey B). Currently unanswered anywhere on the site. | **Unanswered.** |
| **12** | Which languages can drivers reliably support? | International-visitor content. Mentioned on 2 of 59 pages. | **Unanswered.** |
| **13** | Are the reviews shown the complete Google set, or a selection? | Governs how they may be described, and whether "Verified Google Reviews" (40 pages) is appropriate wording. | **Unanswered.** |

**If you answer only three, answer 5, 8 and 1** — they unblock the largest number of pages and the two highest-priority pending issues.

---

## 8. Limitations

* **No real-device testing.** All viewport work was emulated in Chrome headless. Touch accuracy and iOS Safari behaviour are untested.
* **No screen-reader pass.** Heading and contrast work was verified from computed styles and DOM structure. No WCAG conformance is claimed.
* **No form submission, no WhatsApp message, no call.** Per instruction. The `/book/` form's validation and success behaviour remain untested.
* **Contrast sampling skips text over gradients and photographs** — no single background colour can be resolved there.
* **Production was characterised, not audited.** All fixes were verified against the local mirror, which was byte-identical to the preview before my edits.
* **Chromium only.** Safari and Firefox untested.

---

*Nothing was committed, pushed or deployed. Backups of all 24 edited files were taken before modification.*
