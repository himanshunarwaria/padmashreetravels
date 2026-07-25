/**
 * booking.js — Padma Shree Travels
 * Handles: UTM capture · route matching · live price · validation · WhatsApp booking · GTM conversion
 */
(function () {
  'use strict';

  // Self-contained analytics push (no PII), independent of main.js load order.
  function pushEvent(name, params) {
    window.dataLayer = window.dataLayer || [];
    var e = { event: name, page_path: location.pathname };
    if (params) { for (var k in params) { if (params[k] !== '' && params[k] != null) e[k] = params[k]; } }
    window.dataLayer.push(e);
  }

  // ── Route data ────────────────────────────────────────────────────────────
  const ROUTE_PRICES = {
    'agra-local-sightseeing':    2500,
    'fatehpur-sikri':            2500,
    'agra-to-mathura-vrindavan': 3000,
    'agra-to-mathura-taxi':      3000,
    'agra-to-vrindavan-cab':     3000,
    'mathura-vrindavan-tour':    3000,
    'mathura-vrindavan-barsana': 3500,
    'agra-to-aligarh':           3000,
    'agra-to-hathras':           2000,
    'agra-to-sirsaganj':         3000,
    'agra-to-etawah':            3500,
    'agra-to-gwalior':           3000,
    'agra-to-firozabad':         2500,
    'agra-to-bateshwar':         3000,
    'agra-to-tundla':            2000,
    'agra-to-shikohabad':        3000,
  };

  const ROUTE_LABELS = {
    'agra-local-sightseeing':    'Agra Local Sightseeing',
    'fatehpur-sikri':            'Fatehpur Sikri Tour',
    'agra-to-mathura-vrindavan': 'Agra to Mathura & Vrindavan',
    'agra-to-mathura-taxi':      'Agra to Mathura',
    'agra-to-vrindavan-cab':     'Agra to Vrindavan',
    'mathura-vrindavan-tour':    'Mathura + Vrindavan Tour',
    'mathura-vrindavan-barsana': 'Mathura + Vrindavan + Barsana',
    'agra-to-aligarh':           'Agra to Aligarh',
    'agra-to-hathras':           'Agra to Hathras',
    'agra-to-sirsaganj':         'Agra to Sirsaganj',
    'agra-to-etawah':            'Agra to Etawah',
    'agra-to-gwalior':           'Agra to Gwalior',
    'agra-to-firozabad':         'Agra to Firozabad',
    'agra-to-bateshwar':         'Agra to Bateshwar',
    'agra-to-tundla':            'Agra to Tundla',
    'agra-to-shikohabad':        'Agra to Shikohabad',
  };

  const ROUTE_TYPE = {
    'agra-local-sightseeing':    'Full Day',
    'fatehpur-sikri':            'Full Day',
    'agra-to-mathura-vrindavan': 'Round Trip',
    'agra-to-mathura-taxi':      'Round Trip',
    'agra-to-vrindavan-cab':     'Round Trip',
    'mathura-vrindavan-tour':    'Full Day Tour',
    'mathura-vrindavan-barsana': 'Full Day Tour',
    'agra-to-aligarh':           'Round Trip',
    'agra-to-hathras':           'Round Trip',
    'agra-to-sirsaganj':         'Round Trip',
    'agra-to-etawah':            'Round Trip',
    'agra-to-gwalior':           'Round Trip',
    'agra-to-firozabad':         'Round Trip',
    'agra-to-bateshwar':         'Round Trip',
    'agra-to-tundla':            'Round Trip',
    'agra-to-shikohabad':        'Round Trip',
  };

  // ── UTM / GCLID capture ───────────────────────────────────────────────────
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'gclid'];
  const LS_PREFIX = 'pst_';

  function captureAttribution() {
    const params = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) localStorage.setItem(LS_PREFIX + k, v);
    });
  }
  captureAttribution();

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const form         = document.getElementById('payBookingForm');
  if (!form) return;

  // fare_finder_start — first meaningful interaction with the enquiry form
  let ffStarted = false;
  form.addEventListener('input', function () {
    if (!ffStarted) { ffStarted = true; pushEvent('fare_finder_start', { source_component: 'booking_page' }); }
  });

  const dropInput    = document.getElementById('pb-drop');
  const priceDisplay = document.getElementById('pb-price-display');
  const priceAmount  = document.getElementById('pb-price-amount');
  const priceTypeEl  = document.getElementById('pb-price-type');
  const submitBtn    = document.getElementById('pb-submit');
  const loadingEl    = document.getElementById('pb-loading');
  const errorEl      = document.getElementById('pb-error');
  const successEl    = document.getElementById('pb-success');
  const formMain     = document.getElementById('bk-form-main');
  const locsEl       = document.getElementById('bk-locs');
  const passengersEl = document.getElementById('pb-passengers');
  const suvNote      = document.getElementById('pb-suv-note');
  const groupNote    = document.getElementById('pb-group-note');
  const waRetry      = document.getElementById('bk-wa-retry');

  // ── Route matching from free-text drop ────────────────────────────────────
  let _matchedRouteKey = '';
  let _lastSelectedRoute = '';

  function bkMatchRoute(text) {
    const t = (text || '').toLowerCase();
    let key = '';

    if      (t.includes('barsana'))                                      key = 'mathura-vrindavan-barsana';
    else if (t.includes('fatehpur') || t.includes('sikri'))              key = 'fatehpur-sikri';
    else if (t.includes('mathura') && t.includes('vrindavan'))           key = 'agra-to-mathura-vrindavan';
    else if (t.includes('mathura'))                                       key = 'agra-to-mathura-taxi';
    else if (t.includes('vrindavan'))                                     key = 'agra-to-vrindavan-cab';
    else if (t.includes('local') || t.includes('sightseeing') ||
             t.includes('taj') || t.includes('fort'))                    key = 'agra-local-sightseeing';
    else if (t.includes('aligarh'))                                       key = 'agra-to-aligarh';
    else if (t.includes('hathras'))                                       key = 'agra-to-hathras';
    else if (t.includes('sirsaganj'))                                     key = 'agra-to-sirsaganj';
    else if (t.includes('etawah'))                                        key = 'agra-to-etawah';
    else if (t.includes('gwalior'))                                       key = 'agra-to-gwalior';
    else if (t.includes('firozabad'))                                     key = 'agra-to-firozabad';
    else if (t.includes('bateshwar'))                                     key = 'agra-to-bateshwar';
    else if (t.includes('tundla'))                                        key = 'agra-to-tundla';
    else if (t.includes('shikohabad'))                                    key = 'agra-to-shikohabad';

    _matchedRouteKey = key;
    showPriceBadge(key);
    if (key && key !== _lastSelectedRoute) {
      _lastSelectedRoute = key;
      pushEvent('route_selected', { route: key, route_name: ROUTE_LABELS[key] || '', trip_type: ROUTE_TYPE[key] || '', source_component: 'booking_page' });
    }
  }
  window.bkMatchRoute = bkMatchRoute;

  function showPriceBadge(key) {
    const price = ROUTE_PRICES[key];
    if (price && priceDisplay && priceAmount) {
      priceAmount.textContent = 'approx ₹' + price.toLocaleString('en-IN');
      if (priceTypeEl) priceTypeEl.textContent = ROUTE_TYPE[key] || 'Round Trip';
      priceDisplay.hidden = false;
    } else if (priceDisplay) {
      priceDisplay.hidden = true;
    }
  }
  window.showPriceBadge = showPriceBadge;

  // ── ?route= prefill ───────────────────────────────────────────────────────
  const urlRoute = new URLSearchParams(window.location.search).get('route');
  if (urlRoute && ROUTE_LABELS[urlRoute] && dropInput) {
    dropInput.value = ROUTE_LABELS[urlRoute];
    bkMatchRoute(ROUTE_LABELS[urlRoute]);
  }

  // ── Passenger advisory ────────────────────────────────────────────────────
  passengersEl && passengersEl.addEventListener('change', () => {
    const v = passengersEl.value;
    if (suvNote)   suvNote.hidden   = (v !== '5-6');
    if (groupNote) groupNote.hidden = (v !== '7+');
  });

  // ── Validation helpers ────────────────────────────────────────────────────
  function fieldError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('error');
    const fg = el.closest('.fg');
    if (fg) {
      fg.classList.add('has-error');
      const ferr = fg.querySelector('.bk-ferr, .ferr');
      if (ferr) ferr.textContent = msg;
    }
    if (locsEl && (id === 'pb-pickup' || id === 'pb-drop')) {
      locsEl.classList.add('error');
    }
  }

  function clearErrors() {
    const scope = document.getElementById('bk-form-main') || form;
    scope.querySelectorAll('.fg').forEach((fg) => {
      fg.classList.remove('has-error');
      fg.querySelectorAll('.bk-input, .bk-loc-in').forEach((i) => i.classList.remove('error'));
      const ferr = fg.querySelector('.bk-ferr, .ferr');
      if (ferr) ferr.textContent = '';
    });
    if (locsEl) locsEl.classList.remove('error');
    if (errorEl) { errorEl.textContent = ''; errorEl.hidden = true; }
  }

  function validateForm() {
    clearErrors();
    let valid = true;

    const name       = document.getElementById('pb-name')?.value.trim();
    const phone      = document.getElementById('pb-phone')?.value.trim();
    const pickup     = document.getElementById('pb-pickup')?.value.trim();
    const drop       = document.getElementById('pb-drop')?.value.trim();
    const passengers = document.getElementById('pb-passengers')?.value;
    const timing     = document.getElementById('pb-timing')?.value || 'now';
    const date       = document.getElementById('pb-date')?.value;
    const time       = document.getElementById('pb-time')?.value;

    if (!name || name.length < 2) {
      fieldError('pb-name', 'Please enter your full name'); valid = false;
    }
    if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/[\s\-+]/g, ''))) {
      fieldError('pb-phone', 'Please enter a valid 10-digit mobile number'); valid = false;
    }
    if (!pickup || pickup.length < 3) {
      fieldError('pb-pickup', 'Please enter your pickup location'); valid = false;
    }
    if (!drop || drop.length < 2) {
      fieldError('pb-drop', 'Please enter your drop location'); valid = false;
    }
    if (!passengers) {
      fieldError('pb-passengers', 'Please select number of passengers'); valid = false;
    }
    if (timing === 'schedule') {
      if (!date) {
        fieldError('pb-date', 'Please select a travel date'); valid = false;
      } else {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (new Date(date) < today) {
          fieldError('pb-date', 'Date cannot be in the past'); valid = false;
        }
      }
      if (!time) {
        fieldError('pb-time', 'Please select a pickup time'); valid = false;
      }
    }

    return valid;
  }

  // ── UI state ──────────────────────────────────────────────────────────────
  const WA_ICON = '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';

  function setLoading(on) {
    if (submitBtn) submitBtn.disabled = on;
    if (loadingEl) loadingEl.hidden = !on;
    if (submitBtn) {
      submitBtn.innerHTML = on
        ? '<span class="bk-spin"></span> Preparing…'
        : WA_ICON + ' Book on WhatsApp';
    }
  }

  function fmtDate(ds) {
    const d = new Date(ds + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  function fmtTime(ts) {
    const [h, m] = ts.split(':').map(Number);
    return (h % 12 || 12) + ':' + String(m).padStart(2, '0') + ' ' + (h >= 12 ? 'PM' : 'AM');
  }

  // ── WhatsApp booking ──────────────────────────────────────────────────────
  function doWhatsAppBooking(name, phone, pickup, drop, timing, date, time, passengers, notes) {
    const tripTypeVal = document.getElementById('pb-trip-type')?.value || 'roundtrip';
    const tripLabel   = tripTypeVal === 'oneway'
      ? 'One Way'
      : (_matchedRouteKey ? (ROUTE_TYPE[_matchedRouteKey] || 'Round Trip') : 'Round Trip');

    const price    = _matchedRouteKey ? ROUTE_PRICES[_matchedRouteKey] : null;
    const priceStr = price ? 'approx ₹' + price.toLocaleString('en-IN') : '';
    const whenStr  = timing === 'schedule'
      ? fmtDate(date) + ' at ' + fmtTime(time)
      : 'As soon as possible';

    const lines = [
      'Hi! I want to book a cab.',
      '',
      'Trip Type: '  + tripLabel,
      'Pickup: '     + pickup,
      'Drop: '       + drop,
      'When: '       + whenStr,
      'Passengers: ' + passengers,
    ];
    if (priceStr) lines.push('Est. Fare: ' + priceStr);
    lines.push('', 'Name: ' + name, 'Phone: ' + phone);
    if (notes) lines.push('Note: ' + notes);

    const waUrl = 'https://wa.me/918720081102?text=' + encodeURIComponent(lines.join('\n'));

    if (waRetry) waRetry.href = waUrl;

    if (formMain) formMain.hidden = true;
    if (successEl) {
      successEl.hidden = false;
      const get = (id) => document.getElementById(id);
      if (get('pb-s-pickup')) get('pb-s-pickup').textContent = pickup;
      if (get('pb-s-drop'))   get('pb-s-drop').textContent   = drop;
      if (get('pb-s-when'))   get('pb-s-when').textContent   = whenStr;
      if (get('pb-s-pax'))    get('pb-s-pax').textContent    = passengers;
      if (get('pb-s-fare'))   get('pb-s-fare').textContent   = priceStr || '—';
      successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(function () {
      window.open(waUrl, '_blank', 'noopener');
    }, 600);
  }

  // ── GTM conversion ────────────────────────────────────────────────────────
  let conversionFired = false;
  function fireConversion() {
    if (conversionFired) return;
    conversionFired = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'whatsapp_booking',
      conversion_id: 'AW-18103087307',
      conversion_label: 'XY8MCNfs7Z4CEMvhnLhD',
    });
  }

  // ── Form submit ───────────────────────────────────────────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const scope    = document.getElementById('bk-form-main') || form;
      const firstErr = scope.querySelector('.fg.has-error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const name       = document.getElementById('pb-name').value.trim();
    const phone      = document.getElementById('pb-phone').value.trim();
    const pickup     = document.getElementById('pb-pickup').value.trim();
    const drop       = document.getElementById('pb-drop').value.trim();
    const timing     = document.getElementById('pb-timing')?.value || 'now';
    const date       = document.getElementById('pb-date')?.value   || '';
    const time       = document.getElementById('pb-time')?.value   || '';
    const passengers = document.getElementById('pb-passengers').value;
    const notes      = document.getElementById('pb-notes')?.value.trim() || '';

    const tripTypeEl = document.getElementById('pb-trip-type');
    pushEvent('fare_finder_complete', {
      source_component: 'booking_page',
      trip_type: (tripTypeEl && tripTypeEl.value) || '',
      passenger_band: passengers || '',
      route: _matchedRouteKey || ''
    });

    setLoading(true);
    fireConversion();
    doWhatsAppBooking(name, phone, pickup, drop, timing, date, time, passengers, notes);
    setLoading(false);
  });

})();
