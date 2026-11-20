/* ============================================================================
   Padma Shree Travels — motion layer + homepage v2 behaviour
   ============================================================================
   Pairs with css/motion.css. Load with `defer`. Three independent parts; each
   one checks for its own markup and does nothing on pages that lack it, so the
   same file can be added to any page.

   1. Scroll reveals   every page
   2. Fare finder      pages with <div class="ff" id="fare-finder" hidden>
   3. Route tabs       pages with a .routes--v2 section

   No fares are written in this file. The fare finder reads the route cards
   and outstation links already on the page, so a fare is edited in one place
   (the card) and the finder follows.
   ============================================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = 'https://wa.me/918720081102?text=';

  function text(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function push(name, params) { if (window.pstPushEvent) window.pstPushEvent(name, params); }
  function toNumber(s) { return parseInt(String(s).replace(/[^\d]/g, ''), 10) || 0; }
  function fmt(n) { return Math.round(n).toLocaleString('en-IN'); }

  /* Count a number from one value to another. `write` receives the formatted
     number on every frame and once more with the exact final value. */
  function tween(from, to, ms, write) {
    if (reduce || from === to) { write(fmt(to)); return; }
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / ms, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      write(fmt(from + (to - from) * eased));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* Run `fn` once, the first time `el` is on screen. */
  function onSeen(el, fn, threshold) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); }
    }, { threshold: threshold || 0.3 });
    io.observe(el);
  }

  /* ── 1. Scroll reveals ──────────────────────────────────────────────────
     Elements are tagged here (never in the HTML), so a visitor without
     JavaScript, or a browser without IntersectionObserver, sees everything. */
  function initReveals() {
    if (reduce || !('IntersectionObserver' in window)) return;

    var groups = [
      '.trust__in > .tchip',
      '.section .text-center',
      '.rtabs-wrap',
      '.rcat-label',
      '.rgrid > *',
      '.olist',
      '.incs > .inc',
      '.how > .slip',
      '.flist > .fi',
      '.xband > .container > *',
      '.cta > .container > *',
      '.seo-acc',
      /* route pages (css/landing.css) */
      '.sec .h2',
      '.sec .lede',
      '.stats > .stat',
      '.card',
      '.fare__group',
      '.steps > .step',
      '.rel-card',
      'details.faq-acc',
      '.rt__fig',
      '.ftbl-wrap'
    ];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        el.classList.add('is-in');
        /* Hand the element back to its own hover/press transitions. */
        var wait = 700 + (parseInt(el.style.getPropertyValue('--rv-d'), 10) || 0);
        setTimeout(function () {
          el.removeAttribute('data-rv');
          el.classList.remove('is-in');
          el.style.removeProperty('--rv-d');
        }, wait);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    function tag(el, delay) {
      if (el.hasAttribute('data-rv') || el.closest('.hero, [data-reviews-grid], .grx')) return;
      el.setAttribute('data-rv', '');
      if (delay) el.style.setProperty('--rv-d', delay + 'ms');
      io.observe(el);
    }

    groups.forEach(function (sel) {
      var seen = [];
      document.querySelectorAll(sel).forEach(function (el) {
        var parent = el.parentNode;
        /* A swipe row reveals as one piece: its off-screen cards would
           otherwise stay invisible until swiped to. */
        if (getComputedStyle(parent).overflowX === 'auto') { tag(parent, 0); return; }
        var i = seen.filter(function (p) { return p === parent; }).length;
        seen.push(parent);
        tag(el, Math.min(i, 5) * 60);
      });
    });
  }

  /* ── 2. Fare finder ─────────────────────────────────────────────────────── */
  var POPULAR = [
    ['agra-to-mathura-taxi', 'Mathura'],
    ['agra-to-vrindavan-cab', 'Vrindavan'],
    ['mathura-vrindavan-tour-from-agra', 'Mathura + Vrindavan'],
    ['agra-local-sightseeing', 'Agra full day'],
    ['taj-mahal-sunrise-taxi', 'Taj sunrise'],
    ['agra-airport-taxi', 'Airport']
  ];
  var GROUP_NAMES = { pilgrimage: 'Pilgrimage', sightseeing: 'Agra sightseeing', outstation: 'Outstation and transfers' };

  /* "agra-to-gwalior/", "./x/", "x/preview.html" -> "x" */
  function slugOf(href) { return (href || '').replace(/^\.?\//, '').replace(/\/?(index|preview)\.html$/, '').replace(/\/$/, ''); }

  /* Which way each trip heads from Agra: [compass bearing in degrees, road km].
     The bearing is what the mini map draws; km only picks one of three line
     lengths, so the map is honest about direction and not to scale.
     'local' trips stay in the city and show a ring round Agra instead. */
  var HEADINGS = {
    'agra-to-mathura-taxi': [316, 58],
    'agra-to-vrindavan-cab': [326, 70],
    'mathura-vrindavan-tour-from-agra': [322, 70],
    'mathura-vrindavan-barsana': [310, 100],
    'agra-to-mehandipur-balaji-taxi': [257, 115],
    'agra-to-kaila-devi-temple-taxi': [230, 170],
    'agra-karauli-kaila-devi-balaji-tour': [240, 170],
    'fatehpur-sikri': [254, 40],
    'agra-to-jaipur-taxi': [262, 240],
    'agra-to-bateshwar': [117, 70],
    'agra-to-gwalior': [171, 120],
    'agra-to-aligarh': [5, 90],
    'agra-to-etawah': [114, 125],
    'agra-to-firozabad': [95, 45],
    'agra-to-hathras': [8, 55],
    'agra-to-tundla': [82, 25],
    'agra-to-sirsaganj': [102, 80],
    'agra-to-shikohabad': [98, 65],
    'agra-local-sightseeing': 'local',
    'taj-mahal-taxi': 'local',
    'taj-mahal-sunrise-taxi': 'local',
    'agra-airport-taxi': 'local',
    'agra-railway-station-taxi': 'local'
  };

  function buildMap() {
    var NS = 'http://www.w3.org/2000/svg';
    function s(tag, attrs) {
      var n = document.createElementNS(NS, tag);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      return n;
    }
    var svg = s('svg', { viewBox: '0 0 100 100', 'class': 'ff__map', 'aria-hidden': 'true', focusable: 'false' });
    svg.appendChild(s('circle', { cx: 50, cy: 52, r: 43, 'class': 'ring' }));
    svg.appendChild(s('circle', { cx: 50, cy: 52, r: 24, 'class': 'ring ring--in' }));
    var north = s('text', { x: 50, y: 7, 'class': 'north' });
    north.textContent = 'N';
    svg.appendChild(north);
    var line = s('line', { x1: 50, y1: 52, x2: 50, y2: 52, 'class': 'line' });
    var loop = s('circle', { cx: 50, cy: 52, r: 13, 'class': 'loop' });
    var dest = s('circle', { cx: 50, cy: 52, r: 4.5, 'class': 'dest' });
    [line, loop, dest, s('circle', { cx: 50, cy: 52, r: 4, 'class': 'origin' })].forEach(function (n) { svg.appendChild(n); });

    return {
      node: svg,
      show: function (slug) {
        var h = HEADINGS[slug];
        svg.toggleAttribute('hidden', !h);
        if (!h) return;
        var local = h === 'local';
        line.style.display = dest.style.display = local ? 'none' : '';
        loop.style.display = local ? '' : 'none';
        if (!local) {
          var r = h[1] <= 60 ? 24 : (h[1] <= 130 ? 34 : 43);
          var a = h[0] * Math.PI / 180;
          var x = 50 + r * Math.sin(a), y = 52 - r * Math.cos(a);
          line.setAttribute('x2', x.toFixed(1));
          line.setAttribute('y2', y.toFixed(1));
          dest.setAttribute('cx', x.toFixed(1));
          dest.setAttribute('cy', y.toFixed(1));
          svg.style.setProperty('--len', r);
        }
        svg.classList.remove('is-draw');
        void svg.getBoundingClientRect();   /* restart the draw */
        svg.classList.add('is-draw');
      }
    };
  }

  /* "from ₹1,500" -> { from: true, amount: "₹1,500" }; "Fare on WhatsApp" -> ask */
  function parsePrice(raw) {
    var m = raw.match(/₹\s?[\d,]+/);
    if (!m) return { ask: true };
    return { amount: m[0].replace(/\s/g, ''), from: /^from/i.test(raw) };
  }

  /* Read every trip the page already lists. */
  function readTrips() {
    var trips = [], seen = {};
    function add(t) { if (t.title && t.href && !seen[t.slug]) { seen[t.slug] = 1; trips.push(t); } }

    document.querySelectorAll('.rcat-section').forEach(function (sec) {
      var group = sec.id;
      sec.querySelectorAll('div.rcard').forEach(function (card) {
        var link = card.querySelector('.rcard__acts a:not([href^="tel:"])');
        var priceEl = card.querySelector('.rcard__price');
        if (!link || !priceEl) return;
        var kind = text(priceEl.querySelector('small'));
        var raw = text(priceEl).replace(kind, '').trim();
        var meta = [];
        card.querySelectorAll('.rcard__meta span').forEach(function (s) { meta.push(text(s)); });
        var t = parsePrice(raw);
        t.title = text(card.querySelector('.rcard__dest'));
        t.href = link.getAttribute('href');
        t.slug = slugOf(t.href);
        t.kind = kind;
        t.meta = meta.join(' · ');
        t.group = group;
        add(t);
      });
      /* Outstation links: "Agra to Gwalior <span class=ptag>₹3,000 · RT</span>" */
      sec.querySelectorAll('a[href] > .ptag').forEach(function (tagEl) {
        var a = tagEl.parentNode;
        var raw = text(tagEl);
        if (!/₹|fare on whatsapp/i.test(raw)) return;   /* skips "Planning Guide" */
        var t = parsePrice(raw);
        t.title = text(a).replace(raw, '').trim();
        t.href = a.getAttribute('href');
        t.slug = slugOf(t.href);
        t.kind = /·\s*RT/i.test(raw) ? 'Round trip' : '';
        t.meta = '';
        t.group = group;
        add(t);
      });
    });
    return trips;
  }

  /* "2026-12-05" -> "5 Dec 2026", the way a customer would type it */
  function niceDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return '';
    var mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m[2] - 1];
    return +m[3] + ' ' + mon + ' ' + m[1];
  }

  function waLink(t, date) {
    date = niceDate(date);
    var fare = t.ask ? '' : (t.from ? 'from ' : '') + t.amount + (t.kind ? ' (' + t.kind + ')' : '');
    var msg = 'Hi Padma Shree Travels, I need a cab from Agra.\n\n' +
      'Route: ' + t.title + '\n' +
      (fare ? 'Fare shown on website: ' + fare + '\n' : '') +
      'Travel date: ' + (date || '') + '\n' +
      'Pickup time: \nPickup point in Agra: \nPassengers: \n\n' +
      (t.ask ? 'Please share availability and fare.' : 'Please confirm availability and fare.');
    return WA + encodeURIComponent(msg);
  }

  function initFareFinder() {
    var box = document.getElementById('fare-finder');
    if (!box) return;
    var trips = readTrips();
    if (!trips.length) return;

    var bySlug = {};
    trips.forEach(function (t) { bySlug[t.slug] = t; });

    function el(tag, cls, txt) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (txt != null) n.textContent = txt;
      return n;
    }

    var head = el('div', 'ff__head');
    head.appendChild(el('span', 'ff__title', 'Check your fixed fare'));
    head.appendChild(el('span', 'ff__sub', 'AC cab, fuel and driver included · tolls and parking extra'));

    var chips = el('div', 'ff__chips');
    chips.setAttribute('role', 'group');
    chips.setAttribute('aria-label', 'Popular trips');
    POPULAR.forEach(function (p) {
      if (!bySlug[p[0]]) return;
      var b = el('button', 'ff__chip', p[1]);
      b.type = 'button';
      b.setAttribute('data-slug', p[0]);
      b.setAttribute('aria-pressed', 'false');
      chips.appendChild(b);
    });

    var select = el('select');
    select.id = 'ff-route';
    Object.keys(GROUP_NAMES).forEach(function (g) {
      var og = document.createElement('optgroup');
      og.label = GROUP_NAMES[g];
      trips.forEach(function (t) {
        if (t.group !== g) return;
        var o = el('option', '', t.title);
        o.value = t.slug;
        og.appendChild(o);
      });
      if (og.children.length) select.appendChild(og);
    });
    var date = el('input');
    date.type = 'date';
    date.id = 'ff-date';
    date.min = new Date().toISOString().split('T')[0];

    function field(label, control, hint) {
      var f = el('label', 'ff__field');
      var s = el('span', '', label);
      if (hint) { s.appendChild(document.createTextNode(' ')); s.appendChild(el('em', '', hint)); }
      f.appendChild(s);
      f.appendChild(control);
      return f;
    }
    var row = el('div', 'ff__row');
    row.appendChild(field('Your trip', select));
    row.appendChild(field('Travel date', date, '(optional)'));

    var result = el('div', 'ff__result');
    var info = el('div', 'ff__info');
    var price = el('div', 'ff__price');
    var kind = el('div', 'ff__kind');
    var meta = el('div', 'ff__meta');
    info.appendChild(price);
    info.appendChild(kind);
    info.appendChild(meta);
    var map = buildMap();
    result.appendChild(info);
    result.appendChild(map.node);
    /* The fare counts on screen, so screen readers get one clean sentence
       here instead of every number on the way. */
    price.setAttribute('aria-hidden', 'true');
    var spoken = el('p', 'ff__sr');
    spoken.setAttribute('aria-live', 'polite');
    result.appendChild(spoken);

    var acts = el('div', 'ff__acts');
    var wa = el('a', 'btn btn--wa btn--lg');
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('data-cta', '');
    var details = el('a', 'ff__link', 'Trip details →');
    acts.appendChild(wa);
    acts.appendChild(details);

    [head, chips, row, result, acts].forEach(function (n) { box.appendChild(n); });

    var current = null, started = false, shown = null;

    function fill(t, animate) {
      price.textContent = '';
      price.classList.toggle('ff__price--ask', !!t.ask);
      if (t.ask) {
        price.textContent = 'Fare on WhatsApp';
        shown = null;
      } else {
        if (t.from) price.appendChild(el('small', '', 'from'));
        var num = el('span', '', t.amount);
        price.appendChild(num);
        var target = toNumber(t.amount);
        if (animate && shown !== null) {
          tween(shown, target, 520, function (v) { num.textContent = '₹' + v; });
        }
        shown = target;
      }
      spoken.textContent = t.title + ': ' + (t.ask ? 'fare on WhatsApp' : (t.from ? 'from ' : '') + t.amount) + (t.kind ? ', ' + t.kind : '');
      map.show(t.slug);
      kind.textContent = t.kind;
      meta.textContent = t.meta;
      meta.hidden = !t.meta;
      wa.textContent = t.ask ? 'Ask the fare on WhatsApp' : 'Book this trip on WhatsApp';
      wa.href = waLink(t, date.value);
      wa.setAttribute('data-route', t.slug);
      details.href = t.href;
      chips.querySelectorAll('.ff__chip').forEach(function (c) {
        c.setAttribute('aria-pressed', c.getAttribute('data-slug') === t.slug ? 'true' : 'false');
      });
    }

    function choose(slug, animate) {
      var t = bySlug[slug];
      if (!t) return;
      current = t;
      select.value = slug;
      fill(t, animate && !reduce);
      if (!animate || reduce) return;
      price.classList.remove('is-pulsing');
      void price.offsetWidth;            /* restart the pulse */
      price.classList.add('is-pulsing');
    }

    function interacted(how) {
      if (!started) { started = true; push('fare_finder_start', { source_component: 'hero_fare_finder' }); }
      push('fare_finder_select', { source_component: 'hero_fare_finder', route: current ? current.slug : '', method: how });
    }

    chips.addEventListener('click', function (e) {
      var c = e.target.closest('.ff__chip');
      if (!c) return;
      choose(c.getAttribute('data-slug'), true);
      interacted('chip');
    });
    select.addEventListener('change', function () { choose(select.value, true); interacted('select'); });
    date.addEventListener('change', function () { if (current) wa.href = waLink(current, date.value); });
    wa.addEventListener('click', function () {
      push('fare_finder_complete', { source_component: 'hero_fare_finder', route: current ? current.slug : '', trip_type: current ? current.kind : '' });
    });

    choose(trips[0].slug, false);
    box.hidden = false;
    var hero = box.closest('.hero');
    if (hero) hero.classList.add('hero--ff');
  }

  /* ── 3. Route tabs ──────────────────────────────────────────────────────── */
  function initRouteTabs() {
    var section = document.querySelector('.routes--v2');
    if (!section) return;
    var groups = [].slice.call(section.querySelectorAll('.rcat-section[id]'));
    if (groups.length < 2) return;

    var LABELS = { pilgrimage: 'Pilgrimage', sightseeing: 'Sightseeing', outstation: 'Outstation' };
    var wrap = document.createElement('div');
    wrap.className = 'rtabs-wrap';
    var bar = document.createElement('div');
    bar.className = 'rtabs';
    bar.setAttribute('role', 'tablist');
    bar.setAttribute('aria-label', 'Filter trips');
    var pill = document.createElement('span');
    pill.className = 'rtabs__pill';
    bar.appendChild(pill);

    var tabs = [{ id: 'all', label: 'All' }].concat(groups.map(function (g) {
      return { id: g.id, label: LABELS[g.id] || g.id };
    }));
    var buttons = tabs.map(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'rtabs__btn';
      b.textContent = t.label;
      b.setAttribute('role', 'tab');
      b.setAttribute('data-tab', t.id);
      b.setAttribute('aria-selected', 'false');
      bar.appendChild(b);
      return b;
    });
    wrap.appendChild(bar);
    groups[0].parentNode.insertBefore(wrap, groups[0]);

    function movePill(btn) {
      pill.style.width = btn.offsetWidth + 'px';
      pill.style.transform = 'translate3d(' + btn.offsetLeft + 'px,0,0)';
    }

    var active = null;
    function select(id, animate) {
      active = id;
      buttons.forEach(function (b) {
        var on = b.getAttribute('data-tab') === id;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
        if (on) movePill(b);
      });
      groups.forEach(function (g) {
        var show = id === 'all' || g.id === id;
        if (show && g.hidden && animate && !reduce) {
          g.classList.remove('is-entering');
          void g.offsetWidth;
          g.classList.add('is-entering');
        }
        g.hidden = !show;
      });
    }

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.rtabs__btn');
      if (!b) return;
      select(b.getAttribute('data-tab'), true);
      push('route_tab_select', { tab: b.getAttribute('data-tab') });
    });
    bar.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var i = buttons.indexOf(document.activeElement);
      if (i === -1) return;
      var next = buttons[(i + (e.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length];
      next.focus();
      next.click();
    });
    window.addEventListener('resize', function () {
      var b = bar.querySelector('[aria-selected="true"]');
      if (b) movePill(b);
    });

    /* A link such as /#sightseeing opens that tab, so a hidden group can
       never be the target of a menu link. */
    function fromHash() {
      var id = location.hash.replace('#', '');
      if (groups.some(function (g) { return g.id === id; })) {
        select(id, false);
        section.scrollIntoView({ block: 'start' });
        return true;
      }
      return false;
    }
    if (!fromHash()) select('all', false);
    window.addEventListener('hashchange', fromHash);
    /* Web fonts change button widths after first paint. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        var b = bar.querySelector('[aria-selected="true"]');
        if (b) movePill(b);
      });
    }
  }

  /* Any element marked data-fare-of="<route slug>" shows that route card's
     fare (the example confirmation slip uses this), so it can never disagree
     with the card. The HTML keeps a fallback for visitors without JavaScript. */
  function syncFares() {
    var marks = document.querySelectorAll('[data-fare-of]');
    if (!marks.length) return;
    var bySlug = {};
    readTrips().forEach(function (t) { bySlug[t.slug] = t; });
    marks.forEach(function (m) {
      var t = bySlug[m.getAttribute('data-fare-of')];
      if (t && t.amount) m.textContent = t.amount;
    });
  }

  /* ── 4. Outstation list: first six on a phone, the rest behind a button ──
     The hiding is CSS-only and phone-only, so every route stays in the page
     for search engines, the fare finder and wider screens. */
  function initOutstationMore() {
    document.querySelectorAll('.olist').forEach(function (list) {
      var n = list.querySelectorAll('.olist__a').length;
      if (n <= 7) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'olist__more';
      btn.textContent = 'Show all ' + n + ' routes';
      btn.setAttribute('aria-expanded', 'false');
      list.classList.add('is-short');
      list.parentNode.insertBefore(btn, list.nextSibling);
      btn.addEventListener('click', function () {
        list.classList.remove('is-short');
        btn.setAttribute('aria-expanded', 'true');
        btn.remove();
        push('outstation_show_all', {});
      });
    });
  }

  /* ── 5. Numbers count up the first time they are seen ────────────────────
     Homepage hero stats and the route pages' stats row. Only text holding a
     single number of 10 or more counts ("30+", "₹1,500"); "9–9", "₹0" and
     word stats are left alone. */
  function initCountUps() {
    if (reduce) return;
    document.querySelectorAll('.hero__sv, .stat-num:not(.is-word)').forEach(function (el) {
      var full = el.textContent;
      var nums = full.match(/\d[\d,]*/g);
      if (!nums || nums.length !== 1 || el.children.length) return;
      var n = toNumber(nums[0]);
      if (n < 10) return;
      var at = full.indexOf(nums[0]);
      var before = full.slice(0, at), after = full.slice(at + nums[0].length);
      onSeen(el, function () {
        tween(0, n, 900, function (v) { el.textContent = before + v + after; });
      }, 0.6);
    });
  }

  /* ── 6. Example confirmation: rows arrive one by one ─────────────────────── */
  function initSlip() {
    if (reduce || !('IntersectionObserver' in window)) return;
    document.querySelectorAll('.slip').forEach(function (slip) {
      slip.classList.add('slip--seq');
      onSeen(slip, function () { slip.classList.add('is-live'); }, 0.35);
    });
  }

  /* ── 7. Route pages: the Agra -> destination arrow draws itself ──────────── */
  function initRouteLine() {
    if (reduce || !('IntersectionObserver' in window)) return;
    document.querySelectorAll('.rt__line').forEach(function (line) {
      line.classList.add('m-seq');
      onSeen(line, function () { line.classList.add('is-drawn'); }, 0.6);
    });
  }

  /* ── 8. Moving strip of destination photos ──────────────────────────────
     Reuses the route photos already on the page (already downloaded or lazy),
     twice over so the loop has no seam. Decorative only. */
  function initPhotoStrip() {
    var band = document.querySelector('.xband');
    if (!band || reduce) return;
    var seen = {}, srcs = [];
    document.querySelectorAll('.rcard__thumb img').forEach(function (img) {
      var s = img.getAttribute('src');
      if (s && !seen[s]) { seen[s] = 1; srcs.push(s); }
    });
    if (srcs.length < 5) return;
    var strip = document.createElement('div');
    strip.className = 'xband__strip';
    strip.setAttribute('aria-hidden', 'true');
    var track = document.createElement('div');
    track.className = 'xband__track';
    for (var pass = 0; pass < 2; pass++) {
      srcs.forEach(function (s) {
        var img = document.createElement('img');
        img.src = s;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.width = 400;
        img.height = 225;
        track.appendChild(img);
      });
    }
    strip.appendChild(track);
    band.insertBefore(strip, band.firstChild);
  }

  function init() {
    initCountUps();
    initSlip();
    initRouteLine();
    initPhotoStrip();
    initOutstationMore();
    syncFares();
    initFareFinder();
    initRouteTabs();
    initReveals();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
