# Blog Content-to-Service Map

Created 31 August 2026, as the first step of the blog conversion/discovery upgrade
(page-upgrade-log entry #39). This is the source-of-truth mapping used to build
every contextual CTA, review section and internal link added to the 15 blog
articles. Evidence labels: [VERIFIED] = confirmed against the live file,
[EXISTING] = already correct before this task, [ADDED] = new in this task.

## Legend

* **Fare published** - does the primary service page (or the article itself)
  already show a firm number, not "Fare on WhatsApp"?
* **Review set** - an existing key in `js/reviews-data.js` whose reviews can be
  shown on this article without misrepresenting who wrote them. "None (honest)"
  means no dedicated key exists and no existing key is a defensible match, so no
  review section was added - never that reviews were faked to fill the gap.
* Only 7 of 15 keys are reused, each on exactly one article, so no set of nine
  reviews repeats across the blog. See the per-article notes for why.

## Map

| Article | Main reader intent | Primary service | Secondary service | Fare published | Review set used | WhatsApp names the trip | CTA placement |
|---|---|---|---|---|---|---|---|
| agra-airport-taxi-guide | How Kheria Airport pickup works & combos | `agra-airport-taxi/` | `agra-local-sightseeing/` | Yes (from Rs.800) | None (honest) - no airport-specific key exists | Yes - flight no./date/drop | [EXISTING] mid-article + end |
| agra-cantt-to-taj-mahal-taxi-guide | Same-day train arrival -> Taj plan | `agra-railway-station-taxi/` | `agra-local-sightseeing/`, `taj-mahal-taxi/` | Yes (from Rs.800; Rs.2,500 full day) | None (honest) - no station-specific key | Yes - train/arrival time & plan | [EXISTING] mid-article + end |
| agra-mathura-vrindavan-one-day-trip | Hour-by-hour Mathura+Vrindavan day plan | `mathura-vrindavan-tour-from-agra/` | `agra-to-mathura-taxi/`, `agra-to-vrindavan-cab/` | Yes (Rs.3,000 RT) | **agra-to-mathura-vrindavan** [ADDED] - exact route match | Yes | [EXISTING] mid + end; [ADDED] reviews before Related |
| agra-one-day-sightseeing | Cover all 5 Agra monuments in one day | `agra-local-sightseeing/` | `taj-mahal-taxi/` | Yes (Rs.2,500) | **agra-local-sightseeing** [ADDED] - exact match | Yes | [EXISTING] mid + end; [ADDED] reviews before Related |
| agra-to-jaipur-taxi-route-guide | Plan the Agra-Jaipur drive + stops | `agra-to-jaipur-taxi/` | `fatehpur-sikri/`, `agra-to-bharatpur-taxi/`, `agra-to-mehandipur-balaji-taxi/` | Fare on WhatsApp (no fixed number published) | **agra-to-jaipur** [ADDED], custom subline - file's own note explains no Jaipur-specific review exists yet | Yes - date/one-way-round/stop | [EXISTING] mid + end; [ADDED] reviews before Related |
| agra-to-mehandipur-balaji-travel-guide | Balaji darshan trip planning & customs | `agra-to-mehandipur-balaji-taxi/` | `agra-karauli-kaila-devi-balaji-tour/` | Fare on WhatsApp | None (honest) - no standalone-Balaji key; the only close key is the Karauli+KailaDevi+Balaji **combo**, already used on the closely related one-day-tour article (below) - reusing it here too would duplicate the same 9 cards | Yes - date/passengers/pickup | [EXISTING] mid + end |
| best-temples-in-vrindavan-by-cab | Which Vrindavan temples to see, and how | `agra-to-vrindavan-cab/` | `mathura-vrindavan-tour-from-agra/`, `mathura-vrindavan-barsana/` | Yes (from Rs.1,800) | **agra-to-vrindavan-cab** [ADDED] - 6 of 9 reviews in this set explicitly name Vrindavan | Yes | [EXISTING] mid + end; [ADDED] reviews before Related |
| best-time-to-visit-taj-mahal | Seasonal/timing advice, not one trip | `agra-local-sightseeing/` | `taj-mahal-taxi/` | Yes (Rs.2,500 via linked service) | None (honest) - no Taj-specific key; reusing `agra-local-sightseeing` would duplicate the set already used on agra-one-day-sightseeing | Yes - sunrise Taj visit | [EXISTING] mid + end |
| braj-yatra-from-agra-by-cab | Plan the 6-town Braj circuit (1 or 2 days) | `agra-temple-tour-by-cab/` | `mathura-vrindavan-barsana/`, `agra-to-gokul-nandgaon-taxi/`, `agra-to-govardhan-taxi/` | Yes (Rs.3,000 / Rs.3,500 ready-made tours) | **mathura-vrindavan-barsana** [ADDED], custom subline - closest existing set to a multi-town Braj day | Yes - places/date/passengers/pickup | [EXISTING] mid + end; [ADDED] reviews before Related |
| kaila-devi-mehandipur-balaji-one-day-tour-from-agra | Is the 2-temple day realistic? | `agra-karauli-kaila-devi-balaji-tour/` | `agra-to-karauli-taxi/`, `agra-to-rajasthan-temple-tour/` | Fare on WhatsApp | **agra-karauli-kaila-devi-balaji** [ADDED] - exact match, this article is literally what the key was curated for | Yes - date/passengers/pickup time | [EXISTING] mid + end; [ADDED] reviews before Related |
| kaila-devi-temple-karauli-guide | Kaila Devi darshan, fair dates, spelling variants | `agra-to-kaila-devi-temple-taxi/` | `agra-to-mehandipur-balaji-taxi/`, `agra-karauli-kaila-devi-balaji-tour/` | Fare on WhatsApp | None (honest) - no standalone Kaila Devi key; the combo key is already used on the sibling one-day-tour article above, so reusing it here would duplicate | Yes - date/passengers/pickup | [EXISTING] mid + end |
| mathura-vrindavan-travel-guide | First-timer's guide to both cities | `agra-to-mathura-taxi/` | `mathura-vrindavan-tour-from-agra/` | Yes (Rs.3,000 via linked tour) | **mathura-vrindavan-tour-from-agra** [ADDED], custom subline - the ready-made tour this guide recommends | Yes | [EXISTING] mid + end; [ADDED] reviews before Related |
| senior-citizen-temple-tours-from-agra | Route/car/pace advice for elders, spans many routes | `agra-temple-tour-by-cab/` | `agra-to-mehandipur-balaji-taxi/`, `agra-to-kaila-devi-temple-taxi/` | Mixed - table cites Rs.3,000 for one route, WhatsApp for others | None (honest) - advisory article spans multiple routes; no single existing key represents it without implying one specific trip's customers wrote it | Yes - route/date/passengers/pickup | [EXISTING] mid + end |
| taj-mahal-sunrise-by-private-cab | Sunrise-visit logistics (time, gate) | `taj-mahal-sunrise-taxi/` | `agra-local-sightseeing/` | Yes (from Rs.1,500) | None (honest) - no Taj-specific key; `agra-local-sightseeing` already used elsewhere | Yes - hotel/date/passengers | [EXISTING] mid + end |
| taj-mahal-visiting-guide | Timings, tickets, how to reach | `agra-local-sightseeing/` | `taj-mahal-taxi/` | Yes (Rs.2,500 via linked service; ticket prices Rs.50/Rs.1,100) | None (honest) - `agra-local-sightseeing` set already used on agra-one-day-sightseeing | Yes - sunrise Taj visit | [EXISTING] mid + end |

## What "CTA placement" means in practice

Every article already had, before this task, a contextual `.bcta` box placed
right after the opening paragraph (the "first major section") and a second
`.bcta` box at the end of the article body, both with route-correct WhatsApp
prefill text and a link to the strongest matching service page. This task's
job was to **verify** that pattern held on all 15 (it did, see verification
section of the log entry), add machine-readable hooks for conversion tracking,
and add the review component only where an honest set exists - not to rebuild
CTAs that were already working correctly.

## Known pre-existing gap, not touched by this task

`js/reviews-data.js` has a key literally named `'agra-to-Fatehpur-Sikri'`
(mixed case). No page in the site sets `data-page` with that exact casing, so
the key is currently unreachable dead data - a pre-existing bug, unrelated to
the blog work in this task. Flagged here for whoever next edits that file;
not fixed, since it is outside this task's stated scope.
