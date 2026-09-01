/* ============================================================================
   Padma Shree Travels — small shared behaviour for css/landing.css pages
   ============================================================================
   The two locked reference pages (agra-to-jaipur-taxi/, agra-local-sightseeing/)
   each carry the same 4-line inline <script> to stamp the current year into
   their footer. That is exactly the kind of duplicated JS logic the shared-
   system rules ask new pages to avoid repeating, so it moved here. The locked
   pages are unmodified and keep their own inline copy — this file is for
   every page upgraded AFTER them.

   USAGE
     <footer>...&copy; <span data-year>2026</span> Padma Shree Travels...</footer>
     <script src="../js/landing.js" defer></script>
     (root-level pages: src="js/landing.js")

   A real year ships in the markup (data-year's own text content) so the page
   is correct even with JavaScript disabled or before this script runs; this
   only keeps it current.

   ---------------------------------------------------------------------------
   2. LOCAL-PARTNER PHOTO ROTATION  (added 31 Aug 2026)
   ---------------------------------------------------------------------------
   The "Your Local Travel Partner In Agra" band (.lp in css/landing.css) shows
   one photograph from images/about/. Every consuming page ships a real,
   working <img> in its markup, so the section is correct with JavaScript
   disabled or blocked; this script swaps that one image for another from the
   curated pool below on each load, so the section does not look identical on
   every page and every visit.

   Rules this implementation follows:
     * ONE curated list, here — never duplicated into a page.
     * Only photographs that have actually been looked at, with alt text that
       describes what is genuinely in the frame. No photo in the pool depicts
       a monument, destination or vehicle it is captioned as, because none of
       them is captioned as a place at all.
     * The person shown is NOT named or given a role. Nothing published on
       this site identifies him, so the alt text says only what can be seen:
       a member of the team, with the company's own branded vehicles.
     * Exactly one image is ever requested — the pool is not preloaded.
     * Every candidate is 1080x1440, and .lp__img fixes the box with
       aspect-ratio, so swapping cannot move the layout.
     * The path prefix is derived from the fallback image already in the
       markup, so the same script works from any directory depth.
     * If the band appears more than once on a page, each instance gets a
       different photograph.
     * The photo the visitor saw last is skipped, so a refresh actually
       changes something.
   ============================================================================ */
(function () {
  'use strict';

  /* ------------------------------- footer year --------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --------------------- local-partner photo rotation -------------------- */

  /* Curated pool. `file` is relative to images/about/. Spaces are encoded so
     the src is a valid URL. Every entry was opened and described by hand. */
  var PHOTOS = [
    { file: 'PadmaShree%20(1).jpg',
      alt: 'A Padma Shree Travels branded sedan and minibus parked together, with a member of the team standing beside the car' },
    { file: 'PadmaShree%20(3).jpg',
      alt: 'A member of the Padma Shree Travels team standing in front of the company minibus and a sedan at dusk' },
    { file: 'PadmaShree%20(4).jpg',
      alt: 'A member of the Padma Shree Travels team beside a company car, with the Padma Shree Travels name on the door' },
    { file: 'PadmaShree%20(5).jpg',
      alt: 'A member of the Padma Shree Travels team standing between two branded company cars' },
    { file: 'PadmaShree%20(6).jpg',
      alt: 'A member of the Padma Shree Travels team resting against a branded company car, with the minibus alongside' },
    { file: 'PadmaShree%20(7).jpg',
      alt: 'A member of the Padma Shree Travels team beside a branded company car in evening light' },
    { file: 'PadmaShree%20(8).jpg',
      alt: 'A member of the Padma Shree Travels team walking past the company cars and minibus' },
    { file: 'PadmaShree%20(10).jpg',
      alt: 'A member of the Padma Shree Travels team standing in front of the company minibus and cars' },
    { file: 'PadmaShree%20(11).jpg',
      alt: 'A member of the Padma Shree Travels team beside a branded company car, looking out along the road' },
    { file: 'PadmaShree%20(15).jpg',
      alt: 'Portrait of a member of the Padma Shree Travels team' },
    { file: 'PadmaShree%20(17).jpg',
      alt: 'Studio portrait of a member of the Padma Shree Travels team' }
  ];

  /* Every images/about/ photo in the pool is exactly this size. */
  PHOTOS.forEach(function (p) { p.w = 1080; p.h = 1440; });

  /* ---------------------- fare-band banner rotation ----------------------
     The banner behind the fare breakdown (.fare-* in css/landing.css).
     These are the company's own fleet photographed at night; each entry
     carries its true intrinsic size, because unlike the about/ photos they
     are NOT all the same dimensions.

     DELIBERATELY EXCLUDED: images/Banners/B4.jpg. It is a genuine company
     banner, but a floodlit Agra monument is visible through the gateway
     behind the cars. This band appears on Gwalior, Jaipur, Delhi and other
     non-Agra route pages, where a recognisable Agra landmark could read as
     the destination. The four below are location-neutral, so no page can
     misrepresent where it goes.

     `desc` is curator documentation of what each frame actually shows — it
     is NOT rendered as alt text, because these are decorative backgrounds
     behind live text. `w`/`h` are the true intrinsic sizes, kept so the
     pool stays auditable and so a future consumer can use them. */
  var BANNERS = [
    { file: 'B1.jpg', w: 2391, h: 1080,
      desc: 'Sedan, MPV and minibus parked together at night under a lit portico' },
    { file: 'B2.jpg', w: 2391, h: 1080,
      desc: 'The three vehicles at night on wet, reflective paving' },
    { file: 'B3.jpg', w: 2391, h: 1080,
      desc: 'Cars and minibus at night beside a warmly lit stone and timber wall' },
    { file: 'B%20(2).jpg', w: 2499, h: 941,
      desc: 'The fleet at night beside a lit stone pillar; widest of the four' }
  ];

  /* ------------------------- shared rotation core ------------------------
     One implementation for every pool. It picks the images; how a chosen
     image is applied is the caller's business, because the two components
     consume it differently — the trust band swaps an <img>, the fare band
     swaps a CSS background. Only the chosen file is ever requested; the
     rest of the pool is never fetched. */
  function rotate(o) {
    var mounts = document.querySelectorAll(o.selector);
    if (!mounts.length || !o.pool.length) return;

    var last = null;
    try { last = sessionStorage.getItem(o.lastKey); } catch (e) { /* ignore */ }

    /* Drop whatever was shown last time, so a refresh actually changes. */
    var candidates = o.pool.filter(function (p) { return p.file !== last; });
    if (!candidates.length) candidates = o.pool.slice();

    /* Fisher–Yates — several bands on one page then get different images. */
    for (var i = candidates.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = candidates[i]; candidates[i] = candidates[j]; candidates[j] = t;
    }

    Array.prototype.forEach.call(mounts, function (el, index) {
      var prefix = o.prefix(el);
      if (prefix === null) return;          /* unexpected markup — leave the fallback alone */
      var pick = candidates[index % candidates.length];

      o.apply(el, pick, prefix + o.dir + pick.file);

      if (index === 0) {
        try { sessionStorage.setItem(o.lastKey, pick.file); } catch (e) { /* ignore */ }
      }
    });
  }

  /* How far up to images/ from this page. The trust band reads it off the
     fallback <img> it is about to replace. The fare band has no <img>, so it
     reads it off the stylesheet link every consuming page already carries —
     correct at any directory depth, with nothing to add per page. */
  function prefixFromSrc(dir) {
    return function (img) {
      var src = img.getAttribute('src') || '';
      var i = src.indexOf(dir);
      return i === -1 ? null : src.slice(0, i);
    };
  }
  function prefixFromStylesheet() {
    var link = document.querySelector('link[rel="stylesheet"][href*="css/landing.css"]');
    var href = link ? link.getAttribute('href') : '';
    var i = href.indexOf('css/landing.css');
    return i === -1 ? '' : href.slice(0, i);
  }

  rotate({
    selector: '[data-lp-photo]', dir: 'images/about/', pool: PHOTOS,
    lastKey: 'pst_lp_last', prefix: prefixFromSrc('images/about/'),
    apply: function (img, pick, url) {
      img.setAttribute('src', url);
      img.setAttribute('alt', pick.alt);
      img.setAttribute('width', pick.w);
      img.setAttribute('height', pick.h);
    }
  });

  /* The fare band's photo is decorative — every fact in that band is live
     text — so it is set as a background, with no alt text to mislead and no
     second element downloading the same file. */
  rotate({
    selector: '[data-fare-bg]', dir: 'images/Banners/', pool: BANNERS,
    lastKey: 'pst_fare_last', prefix: prefixFromStylesheet,
    apply: function (el, pick, url) {
      el.style.setProperty('--fare-bg', 'url("' + url + '")');
    }
  });
})();
