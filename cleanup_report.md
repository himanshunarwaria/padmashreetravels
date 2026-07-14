# Website Repo — Codebase Organisation & Cleanup Report

**Date:** July 14, 2026
**Scope:** `03 Website/00 PST Main` — the live Padam Shree Travels production site (Netlify + GitHub Pages mirror)
**Status:** Complete, including final safety audit. **Nothing committed** — all changes are staged/working-tree only, pending your review.

---

## Why so little moved

This repo is deployed with `netlify.toml` → `publish = "."`, meaning **the entire git-tracked repo root is the live site** — there is no separate `src/`/`dist/` build step. Every top-level folder (`agra-to-*`, `taj-mahal-*`, `blog/`, `about/`, `book/`, `contact/`, `crm/`, `driver-app/`, `netlify/functions/`, etc.) is a real, currently-serving URL path or a path required by Netlify/GitHub Actions config. `.github/workflows/deploy.yml` also mirrors `master` → `gh-pages`, so the same constraint applies there too.

Because of this, "reorganizing" the way you would a normal source repo (grouping pages into subfolders) would **break live, indexed URLs, the driver PWA's service-worker scope, or Netlify Functions resolution** — a direct violation of "do not change website content, styling, functionality." So this cleanup only touched files that are **not** part of any served page or config path, plus the indexing/visibility hardening requested in the final audit pass below.

---

## 🟢 Kept in place (no change) — live site content & required config

- `index.html`, `about/`, `contact/`, `book/`, `blog/` — core site pages
- All 27 tour/route landing-page folders (`agra-to-*`, `taj-mahal-taxi/`, `taj-mahal-sunrise-taxi/`, `mathura-vrindavan-*`, `fatehpur-sikri/`, `jaipur-to-agra-taxi/`, `outstation-cabs-agra/`, etc.)
- `css/style.css`, `js/main.js`, `js/booking.js`, `images/logo*.png` — all actively referenced (verified via grep across every HTML file)
- `netlify/functions/` — Razorpay/Sheets/email backend, path is fixed by `netlify.toml`
- `netlify.toml`, `sitemap.xml`, `site.webmanifest`, `.nojekyll`, `package.json`, `.env.example`, `.claudeignore` — deploy/config files
- `.claude/`, `.github/workflows/deploy.yml` — tooling/CI, explicitly preserved per instructions
- `crm/pst-crm-simple.html`, `crm/google-apps-script.gs` — internal CRM; intentionally unlinked, blocked in `robots.txt`/`_redirects`, staff access via direct URL by design. Scanned for embedded secrets/API keys — none found (only an instructional comment referencing script.google.com).
- `driver-app/` — driver-facing PWA; confirmed `manifest.json` (`start_url`/`scope`: `/driver-app/`) and `sw.js` (scope comment: "does NOT touch the main website") use absolute paths, unaffected by any change made here.
- `driver-communication-helper.html`, `review-helper.html`, `reviews.json` — see indexing/sensitive-data review below.
- `claude-skills/` — a separate nested git repo (has its own `.git/`), already excluded via this repo's `.gitignore` and `.claudeignore`. Not touched.

---

## 📦 Moved to `docs/` (reorg — reference material, not live URLs)

| File | From | To | Reason |
|---|---|---|---|
| `padma-shree-travels-seo-growth-plan.md` | `public/` | `docs/` | Planning doc, zero references anywhere in repo |
| `religious-pages-copy.md` | `public/` | `docs/` | Draft content doc, zero references anywhere in repo |
| `marketing-context.md` | root | `docs/` | Reference/brief doc, zero references anywhere in repo |

`git mv` used throughout, so file history is preserved. The now-empty `public/` folder was removed.

## 🗄️ Moved to `_archive/` (superseded / stray)

| File | Reason |
|---|---|
| `httpsscript.google.commacrossAKfycb.txt` | Untracked scratch file (not in git), old Google Apps Script deployment URLs/IDs, leftover from CRM setup. Zero references anywhere. Not deleted — moved to `_archive/`. |

---

## 🔒 Final safety audit — findings and actions taken

### 1. `taj-mahal-agra-fort.html` — **no action needed, was misclassified in the first pass**

On closer inspection (reading the actual file, not just grepping for links to it), this page is **already a deliberately-configured legacy compatibility redirect**, not an accidental orphan:

- `<meta name="robots" content="noindex, nofollow">` — excluded from search indexing
- `<meta http-equiv="refresh" content="0;url=/agra-local-sightseeing/">` — instant redirect to the current live page
- `<link rel="canonical" href="https://padmashreetravels.in/agra-local-sightseeing/">` — tells any crawler that does index it that the canonical page is elsewhere

This is a standard technique: keep the legacy URL alive (in case of old bookmarks/backlinks/ad campaigns still pointing at it) while telling search engines to ignore it and sending real visitors straight to the current page. **Verdict: remains as a legacy compatibility page — it already does exactly that job correctly. No 301/`_redirects` change was made**, since replacing an already-working, deliberately-configured redirect mechanism with a different one is a functional change beyond the scope of a cleanup pass, and this file is unrelated to the earlier `docs/`/`_archive/` moves in any case.

I could not independently confirm real-world traffic/backlinks/Search Console data for this URL (no access to Padma Shree Travels' Google Analytics/Search Console from this environment) — but given the page already neutralizes both the indexing risk and the dead-link risk in code, that data isn't needed to make this call safely.

### 2. `driver-communication-helper.html` / `review-helper.html` — **already correctly protected, no action needed**

Both already have `<meta name="robots" content="noindex, nofollow">` in `<head>`. This is the *correct* mechanism here — better than a `robots.txt` Disallow, which would actually stop crawlers from ever seeing the noindex tag and risks the bare URL surfacing in search results if discovered externally. Direct-URL staff access is untouched either way (meta robots tags are invisible to browsers/users, only crawlers honor them).

Scanned both files (and `crm/google-apps-script.gs`) for secrets/API keys/tokens and driver phone numbers/PII — **none found**. `review-helper.html` only fetches the public `reviews.json` (customer testimonial text, already publicly displayed on the site elsewhere).

**No code changes were needed or made to either file.**

### 3. `.agents/SKILL.md` — **untracked from git (moved out of deployment, kept on local disk)**

Checked `.claude/settings.json` and `.claude/settings.local.json` — neither references `.agents/` in any way, and nothing in `.github/workflows/deploy.yml` or `netlify.toml` depends on it. The file itself is a generic Claude Code "caveman" communication-style skill, unrelated to the travel business, and doesn't even match Claude Code's own convention (`.claude/skills/<name>/SKILL.md`, not `.agents/SKILL.md`). Since `publish = "."`, it was being deployed live at `/.agents/SKILL.md` for no reason.

**Action taken:**
- Added `.agents/` to `.gitignore` (same pattern already used for `claude-skills/`)
- Ran `git rm -r --cached .agents` to stop tracking it — the file **remains physically on disk** at `.agents/SKILL.md` (confirmed via `ls`), so any local tool that expects to find it at that path on disk still can. It will simply no longer be included in the next Netlify/GitHub Pages deploy since both build from a git clone.

### 4. `_archive/` — **not deployed/indexed, protection added**

`_archive/` is new and inside the deployed repo root, so without protection its one file would be publicly fetchable at `/_archive/httpsscript.google.commacrossAKfycb.txt`. Added, following the exact pattern already used for `/crm/`:

- `robots.txt`: added `Disallow: /_archive/`
- `_redirects`: added `/_archive/*    /    404` (stronger than the `/crm/` rule — since nobody needs direct-URL access to archived junk, the *entire* tree 404s, not just the directory-listing guess)

Content was not deleted, only access-blocked once Netlify picks up the redirect rule.

---

## ✅ Verification performed (commands + results)

All checks below were run against a local static file server serving the repo root (`node` one-off script, port 8123) after all changes above were applied.

**Reference-scan for moved files** (grep across repo, excluding `.git/`, `claude-skills/`, `_archive/`, `docs/`):
```
grep -rl "public/\|marketing-context\.md\|seo-growth-plan\|religious-pages-copy\|httpsscript\.google" .
→ only match: cleanup_report.md (this file, expected)
```

**Core pages** — all `200`: `/`, `/book/`, `/about/`, `/contact/`, `/agra-airport-taxi/`, `/blog/`, `/fatehpur-sikri/`, `/agra-to-aligarh/`

**Internal tools** — all `200` (unaffected): `/crm/pst-crm-simple.html`, `/driver-app/`, `/driver-app/manifest.json`, `/driver-app/sw.js`, `/driver-communication-helper.html`, `/review-helper.html`, `/reviews.json`

**Assets/config** — all `200`: `/css/style.css`, `/js/main.js`, `/js/booking.js`, `/images/logo.png`, `/site.webmanifest`, `/sitemap.xml`, `/robots.txt`, `/_redirects`

**Flagged/legacy** — `200` (expected, correctly self-protects via meta tags): `/taj-mahal-agra-fort.html`

**Moved-file paths** — old paths correctly gone, new paths correctly serve:
```
404  /marketing-context.md
404  /public/religious-pages-copy.md
404  /public/padma-shree-travels-seo-growth-plan.md
200  /docs/marketing-context.md
200  /docs/religious-pages-copy.md
200  /docs/padma-shree-travels-seo-growth-plan.md
```

**Git tracking check:**
```
git ls-files | grep -i "^\.agents"
→ no output (confirmed: .agents/ no longer tracked, won't be in next deploy)
```

### ⚠️ Known limitation of this verification

The local test server is a plain static file server — it does **not** evaluate Netlify's `_redirects` file (that's Netlify-specific routing logic, not something `netlify dev` -free static hosting reproduces). So the new `/_archive/*  →  404` and existing `/crm/  →  404` rules were verified by **reading `_redirects` for correct syntax** (matches the working `/crm/` rule's format exactly) and by confirming the file has no local dependents, but **not** by an actual live-routing test. Similarly, `robots.txt` `Disallow` rules are crawler-honored conventions, not server-enforced — they were verified by content inspection only. Recommend a quick `netlify dev` or post-deploy check of `https://padmashreetravels.in/_archive/` (expect 404) once this is live.

---

## 🔍 Remaining items for manual/business decision (not code issues)

1. **`taj-mahal-agra-fort.html`** — confirmed working as designed (see above). If you'd prefer a clean server-side 301 instead of the current meta-refresh redirect, that's a deliberate SEO decision for you to make, not something this cleanup should change unilaterally.
2. **`.agents/SKILL.md`** — now excluded from deployment but still sitting in this client-project folder on disk. If it's a general-purpose skill you want available in *all* your projects, its natural home is your global Claude Code config (e.g. `~/.claude/skills/`), not a client website repo. I didn't move it there since that affects your Claude Code setup beyond this repository — your call.

**Nothing was deleted.** Everything moved is recoverable from `_archive/`, `docs/`, `git log`, or (for `.agents/SKILL.md`) local disk.
