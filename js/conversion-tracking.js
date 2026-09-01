/* ============================================================================
   Padma Shree Travels — SHARED CONVERSION TRACKING
   ============================================================================
   ONE tracking layer for every landing page. Do not copy this into page files.

   ---------------------------------------------------------------------------
   WHAT THIS DOES TODAY
   ---------------------------------------------------------------------------
   Pushes conversion events into window.dataLayer. That is the standard queue
   Google Tag Manager reads, and it is safe to run with no tag installed —
   events simply queue in memory and cost nothing.

   ---------------------------------------------------------------------------
   ONE STEP LEFT (needs your account IDs — not guessable)
   ---------------------------------------------------------------------------
   Paste your Google Tag Manager container snippet into each page's <head>,
   directly above the Tailwind script:

     <!-- Google Tag Manager -->
     <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
     })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

   Replace GTM-XXXXXXX with the real container ID, then in GTM create a GA4
   event tag for each event name below. Nothing in this file needs to change.

   ---------------------------------------------------------------------------
   EVENTS PUSHED
   ---------------------------------------------------------------------------
     whatsapp_click   every WhatsApp CTA — the primary conversion
     call_click       every tap-to-call link
     scroll_depth     25 / 50 / 75 / 90 percent, once each
     reviews_view     the Google review grid became visible
     pricing_view     the fare / cab-options section became visible
     faq_toggle       a FAQ question was opened or closed

   Every event carries `page_route` (which landing page) and, for clicks,
   `cta_location` and `cta_label`. That is what tells you WHICH button
   actually earns bookings, which is the thing no one can currently see.

   Added 31 Aug 2026: every event also carries `utm_source` / `utm_medium` /
   `utm_campaign` / `gclid` when present - captured from the URL on arrival
   (e.g. a hotel-partner QR code) and persisted in localStorage so it
   survives to later clicks in the same browser. This tells you WHICH
   partner, QR stand or ad a click came from. It does not yet extend into
   `js/booking.js`'s own submission (that script captures the same URL
   params into its own localStorage keys, under the same 'pst_' prefix, but
   never reads them back into the WhatsApp message or the backend booking
   record - see docs/tracking-plan.md for that gap and the fix it needs).

   cta_location values:
     hero            the above-the-fold hero button
     header          the sticky header button
     mobile_bar      the fixed phone-only Call / WhatsApp bar
     final_cta       the last CTA on the page (closing booking section)
     floating_bubble the desktop WhatsApp bubble
     reviews         inside the Google review block
     footer          inside the footer
     section         any mid-page CTA
   ============================================================================ */

(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  /* ---------------------------- attribution -------------------------------
     Captures utm_source / utm_medium / utm_campaign / gclid from the URL on
     first arrival (e.g. a hotel-partner QR: ?utm_source=partner-clarks-shiraz
     &utm_medium=qr&utm_campaign=lobby-stand) and persists them under the
     same 'pst_' localStorage keys js/booking.js already uses, so a visitor
     who lands on a landing page first and books later stays attributed.
     Every event below carries whichever of these are present, so a partner
     QR's source is visible on the click events, not only a completed
     booking. No name, phone number or other passenger detail is ever put
     into an attribution field - only the campaign labels themselves. */
  const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'gclid'];
  const ATTR_PREFIX = 'pst_';

  function captureAttribution() {
    try {
      const params = new URLSearchParams(location.search);
      ATTR_KEYS.forEach(function (k) {
        const v = params.get(k);
        if (v) localStorage.setItem(ATTR_PREFIX + k, v);
      });
    } catch (e) { /* private-browsing storage errors must never break the page */ }
  }
  captureAttribution();

  function attribution() {
    const out = {};
    try {
      ATTR_KEYS.forEach(function (k) {
        const v = localStorage.getItem(ATTR_PREFIX + k);
        if (v) out[k] = v;
      });
    } catch (e) { /* no-op */ }
    return out;
  }

  const push = (event, params) => {
    try { window.dataLayer.push(Object.assign({ event: event }, attribution(), params || {})); }
    catch (e) { /* tracking must never break the page */ }
  };

  /* Which landing page this is. Prefers the reviews mount (already per-page),
     then the canonical URL, then the folder name. */
  function pageRoute() {
    const mount = document.querySelector('[data-reviews-grid]');
    if (mount && mount.getAttribute('data-page')) return mount.getAttribute('data-page');
    const canon = document.querySelector('link[rel="canonical"]');
    if (canon && canon.href) {
      const parts = canon.href.split('/').filter(Boolean);
      if (parts.length) return parts[parts.length - 1];
    }
    const seg = location.pathname.split('/').filter(Boolean);
    return seg.length ? seg[seg.length - 1] : 'unknown';
  }

  const ROUTE = pageRoute();

  /* The closing CTA is the last in-page WhatsApp button that is not part of a
     fixed/persistent control, so it can be reported separately from mid-page
     CTAs. Marked once at startup rather than recomputed on every click. */
  (function markFinalCta() {
    const inPage = Array.prototype.filter.call(
      document.querySelectorAll('[data-cta]'),
      el => !el.closest('.mobile-bar') && !el.closest('header') && el.id !== 'waBtn'
    );
    if (inPage.length) inPage[inPage.length - 1].setAttribute('data-cta-final', '');
  })();

  /* Where on the page the tapped control lives. */
  function ctaLocation(el) {
    if (el.closest('.mobile-bar'))            return 'mobile_bar';
    if (el.closest('header'))                 return 'header';
    if (el.closest('#hero'))                  return 'hero';
    if (el.closest('.gr-wrap'))               return 'reviews';
    if (el.closest('footer'))                 return 'footer';
    if (el.id === 'waBtn')                    return 'floating_bubble';
    if (el.hasAttribute('data-cta-final'))    return 'final_cta';
    return 'section';
  }

  function label(el) {
    const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
    return t ? t.slice(0, 80) : (el.getAttribute('aria-label') || 'unlabelled');
  }

  /* ------------------------------ click events ---------------------------- */
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';

    if (href.indexOf('wa.me') !== -1 || a.hasAttribute('data-cta') || a.id === 'waBtn') {
      push('whatsapp_click', {
        page_route: ROUTE,
        cta_location: ctaLocation(a),
        cta_label: label(a)
      });
    } else if (href.indexOf('tel:') === 0) {
      push('call_click', {
        page_route: ROUTE,
        cta_location: ctaLocation(a),
        cta_label: label(a)
      });
    }
  }, true);

  /* ------------------------------ scroll depth ---------------------------- */
  const marks = [25, 50, 75, 90];
  const fired = {};
  let ticking = false;

  function checkDepth() {
    ticking = false;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const pct = ((window.pageYOffset || doc.scrollTop) / scrollable) * 100;
    marks.forEach(m => {
      if (!fired[m] && pct >= m) {
        fired[m] = true;
        push('scroll_depth', { page_route: ROUTE, percent: m });
      }
    });
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(checkDepth); }
  }, { passive: true });

  /* ---------------------- section visibility (fires once) ----------------- */
  function watchOnce(selector, eventName) {
    const el = document.querySelector(selector);
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          push(eventName, { page_route: ROUTE });
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });
    io.observe(el);
  }

  /* --------------------------- FAQ interaction ---------------------------- */
  function watchFaq() {
    document.querySelectorAll('details.faq-acc').forEach(function (d) {
      d.addEventListener('toggle', function () {
        const q = d.querySelector('summary');
        push('faq_toggle', {
          page_route: ROUTE,
          faq_state: d.open ? 'open' : 'close',
          faq_question: q ? (q.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90) : ''
        });
      });
    });
  }

  /* The pricing band and FAQ are in the served HTML, so they can be wired
     immediately. The review grid is rendered by reviews-grid.js, so it may
     not exist yet on first run. */
  watchOnce('[data-track="pricing"]', 'pricing_view');
  watchFaq();

  if (document.querySelector('.gr-wrap')) {
    watchOnce('.gr-wrap', 'reviews_view');
  } else {
    window.addEventListener('load', function () { watchOnce('.gr-wrap', 'reviews_view'); });
  }
})();
