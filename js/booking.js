/**
 * booking.js — Padma Shree Travels
 *
 * Responsibilities:
 *  1. Capture + persist UTM params and GCLID on every page load
 *  2. Prefill route dropdown from ?route= query param
 *  3. Show live price when route is selected
 *  4. Form validation
 *  5. createOrder → Razorpay Checkout → verifyPayment flow
 *     → Falls back to WhatsApp booking if API is not configured
 *  6. Fire Google Ads conversion after verified success
 *  7. Show success state
 */

(function () {
  'use strict';

  // ── Route pricing (mirrors server — display only, server is authoritative) ──
  const ROUTE_PRICES = {
    'agra-local-sightseeing': 2500,
    'fatehpur-sikri': 2500,
    'agra-to-mathura-vrindavan': 3000,
    'agra-to-mathura-taxi': 3000,
    'agra-to-vrindavan-cab': 3000,
    'mathura-vrindavan-tour': 3000,
    'mathura-vrindavan-barsana': 3500,
    'agra-to-aligarh': 3000,
    'agra-to-hathras': 2000,
    'agra-to-sirsaganj': 3000,
    'agra-to-etawah': 3500,
    'agra-to-gwalior': 3000,
    'agra-to-firozabad': 2500,
    'agra-to-bateshwar': 3000,
    'agra-to-tundla': 2000,
    'agra-to-shikohabad': 3000,
  };

  const ROUTE_LABELS = {
    'agra-local-sightseeing': 'Agra Local Sightseeing',
    'fatehpur-sikri': 'Fatehpur Sikri Tour',
    'agra-to-mathura-vrindavan': 'Agra to Mathura & Vrindavan',
    'agra-to-mathura-taxi': 'Agra to Mathura Taxi',
    'agra-to-vrindavan-cab': 'Agra to Vrindavan Cab',
    'mathura-vrindavan-tour': 'Mathura Vrindavan Tour from Agra',
    'mathura-vrindavan-barsana': 'Mathura, Vrindavan & Barsana',
    'agra-to-aligarh': 'Agra to Aligarh',
    'agra-to-hathras': 'Agra to Hathras',
    'agra-to-sirsaganj': 'Agra to Sirsaganj',
    'agra-to-etawah': 'Agra to Etawah',
    'agra-to-gwalior': 'Agra to Gwalior',
    'agra-to-firozabad': 'Agra to Firozabad',
    'agra-to-bateshwar': 'Agra to Bateshwar',
    'agra-to-tundla': 'Agra to Tundla',
    'agra-to-shikohabad': 'Agra to Shikohabad',
  };

  // Trip type labels shown in the price badge
  const ROUTE_TYPE = {
    'agra-local-sightseeing': 'Full Day',
    'fatehpur-sikri': 'Full Day',
    'agra-to-mathura-vrindavan': 'Round Trip',
    'agra-to-mathura-taxi': 'Round Trip',
    'agra-to-vrindavan-cab': 'Round Trip',
    'mathura-vrindavan-tour': 'Full Day Tour',
    'mathura-vrindavan-barsana': 'Full Day Tour',
    'agra-to-aligarh': 'Round Trip',
    'agra-to-hathras': 'Round Trip',
    'agra-to-sirsaganj': 'Round Trip',
    'agra-to-etawah': 'Round Trip',
    'agra-to-gwalior': 'Round Trip',
    'agra-to-firozabad': 'Round Trip',
    'agra-to-bateshwar': 'Round Trip',
    'agra-to-tundla': 'Round Trip',
    'agra-to-shikohabad': 'Round Trip',
  };

  // ── 1. UTM / GCLID capture ────────────────────────────────────────────────

  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'gclid'];
  const LS_PREFIX = 'pst_';

  function captureAttribution() {
    const params = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) localStorage.setItem(LS_PREFIX + k, v);
    });
  }

  function getAttribution() {
    const out = {};
    UTM_KEYS.forEach((k) => {
      out[k] = localStorage.getItem(LS_PREFIX + k) || '';
    });
    return {
      utmSource: out['utm_source'],
      utmMedium: out['utm_medium'],
      utmCampaign: out['utm_campaign'],
      gclid: out['gclid'],
    };
  }

  captureAttribution();

  // ── 2. Booking form logic ─────────────────────────────────────────────────

  const form = document.getElementById('payBookingForm');
  if (!form) return; // Not on booking page — stop here

  const routeSelect = document.getElementById('pb-route');
  const priceDisplay = document.getElementById('pb-price-display');
  const priceAmount = document.getElementById('pb-price-amount');
  const submitBtn = document.getElementById('pb-submit');
  const loadingEl = document.getElementById('pb-loading');
  const errorEl = document.getElementById('pb-error');
  const successEl = document.getElementById('pb-success');
  const passengersSelect = document.getElementById('pb-passengers');
  const suvNote = document.getElementById('pb-suv-note');
  const groupNote = document.getElementById('pb-group-note');
  const priceTypeEl = document.getElementById('pb-price-type');

  // Prefill route from ?route= query param
  const urlRoute = new URLSearchParams(window.location.search).get('route');
  if (urlRoute && routeSelect) {
    routeSelect.value = urlRoute;
    showPrice(urlRoute);
  }

  // Show price on route change
  routeSelect && routeSelect.addEventListener('change', () => {
    showPrice(routeSelect.value);
  });

  function showPrice(routeKey) {
    const price = ROUTE_PRICES[routeKey];
    if (price && priceDisplay && priceAmount) {
      priceAmount.textContent = `₹${price.toLocaleString('en-IN')}`;
      if (priceTypeEl) priceTypeEl.textContent = (ROUTE_TYPE[routeKey] || 'AC Sedan');
      priceDisplay.hidden = false;
    } else if (priceDisplay) {
      priceDisplay.hidden = true;
    }
  }

  // Show SUV/group advisory based on passenger count
  passengersSelect && passengersSelect.addEventListener('change', () => {
    const val = passengersSelect.value;
    if (suvNote) suvNote.hidden = (val !== '5-6');
    if (groupNote) groupNote.hidden = (val !== '7+');
  });

  // Set today as minimum date
  const dateInput = document.getElementById('pb-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // ── 3. Validation ─────────────────────────────────────────────────────────

  function fieldError(fieldId, msg) {
    const fg = document.getElementById(fieldId)?.closest('.fg');
    if (!fg) return;
    fg.classList.add('has-error');
    document.getElementById(fieldId).classList.add('error');
    const errEl = fg.querySelector('.ferr');
    if (errEl) errEl.textContent = msg;
  }

  function clearErrors() {
    form.querySelectorAll('.fg').forEach((fg) => {
      fg.classList.remove('has-error');
      fg.querySelectorAll('.finput').forEach((i) => i.classList.remove('error'));
      const ferr = fg.querySelector('.ferr');
      if (ferr) ferr.textContent = '';
    });
    if (errorEl) { errorEl.textContent = ''; errorEl.hidden = true; }
  }

  function validateForm() {
    clearErrors();
    let valid = true;

    const name = document.getElementById('pb-name')?.value.trim();
    const email = document.getElementById('pb-email')?.value.trim();
    const phone = document.getElementById('pb-phone')?.value.trim();
    const route = document.getElementById('pb-route')?.value;
    const pickup = document.getElementById('pb-pickup')?.value.trim();
    const date = document.getElementById('pb-date')?.value;
    const time = document.getElementById('pb-time')?.value;
    const passengers = document.getElementById('pb-passengers')?.value;

    if (!name || name.length < 2) {
      fieldError('pb-name', 'Please enter your full name'); valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fieldError('pb-email', 'Please enter a valid email address'); valid = false;
    }
    if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/[\s\-+]/g, ''))) {
      fieldError('pb-phone', 'Please enter a valid 10-digit Indian mobile number'); valid = false;
    }
    if (!route) {
      fieldError('pb-route', 'Please select a route'); valid = false;
    }
    if (!pickup || pickup.length < 4) {
      fieldError('pb-pickup', 'Please enter your pickup location'); valid = false;
    }
    if (!date) {
      fieldError('pb-date', 'Please select a travel date'); valid = false;
    } else {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (new Date(date) < today) {
        fieldError('pb-date', 'Travel date cannot be in the past'); valid = false;
      }
    }
    if (!time) {
      fieldError('pb-time', 'Please select a pickup time'); valid = false;
    }
    if (!passengers) {
      fieldError('pb-passengers', 'Please select number of passengers'); valid = false;
    }

    return valid;
  }

  // ── 4. UI helpers ─────────────────────────────────────────────────────────

  function setLoading(on) {
    if (submitBtn) submitBtn.disabled = on;
    if (loadingEl) loadingEl.hidden = !on;
    if (submitBtn) {
      submitBtn.textContent = on ? 'Processing…' : 'Book & Pay Now →';
    }
  }

  function showGlobalError(msg) {
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function fmtDate(ds) {
    const d = new Date(ds + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  function fmtTime(ts) {
    const [h, m] = ts.split(':').map(Number);
    const ap = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ap}`;
  }

  function showSuccess(paymentId, routeLabel, amountInr, date, time, pickup) {
    form.closest('.bform') && (form.closest('.bform').hidden = true);
    if (successEl) {
      successEl.hidden = false;
      const pidEl = document.getElementById('pb-success-pid');
      const routeEl = document.getElementById('pb-success-route');
      const amtEl = document.getElementById('pb-success-amount');
      const dateEl = document.getElementById('pb-success-date');
      const timeEl = document.getElementById('pb-success-time');
      const pickupEl = document.getElementById('pb-success-pickup');
      if (pidEl) pidEl.textContent = paymentId;
      if (routeEl) routeEl.textContent = routeLabel;
      if (amtEl) amtEl.textContent = `₹${Number(amountInr).toLocaleString('en-IN')}`;
      if (dateEl && date) dateEl.textContent = fmtDate(date);
      if (timeEl && time) timeEl.textContent = fmtTime(time);
      if (pickupEl && pickup) pickupEl.textContent = pickup;
      successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ── 5. WhatsApp fallback ───────────────────────────────────────────────────
  // Used when Razorpay is not configured or payment is not needed.

  function fallbackToWhatsApp(name, phone, route, date, time, pickup, passengers, notes) {
    const routeLabel = ROUTE_LABELS[route] || route;
    const price = ROUTE_PRICES[route] ? `₹${ROUTE_PRICES[route].toLocaleString('en-IN')}` : '';
    const msg = [
      'Hi! I want to book a cab.',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Route: ${routeLabel}${price ? ' \u2014 ' + price : ''}`,
      pickup ? `Pickup: ${pickup}` : null,
      `Date: ${date}`,
      `Time: ${time}`,
      passengers ? `Passengers: ${passengers}` : null,
      notes ? `Note: ${notes}` : null,
    ].filter(Boolean).join('\n');
    // Show success-like UI first, then open WhatsApp
    form.closest('.bform') && (form.closest('.bform').hidden = true);
    if (successEl) {
      successEl.hidden = false;
      const pidEl = document.getElementById('pb-success-pid');
      const routeEl = document.getElementById('pb-success-route');
      const amtEl = document.getElementById('pb-success-amount');
      const dateEl = document.getElementById('pb-success-date');
      const timeEl = document.getElementById('pb-success-time');
      const pickupEl = document.getElementById('pb-success-pickup');
      const h2 = successEl.querySelector('h2');
      const p = successEl.querySelector('p');
      if (h2) h2.textContent = 'Request Sent!';
      if (p) p.textContent = 'We\u2019ll confirm your booking on WhatsApp within minutes.';
      if (pidEl) { pidEl.textContent = 'Via WhatsApp'; pidEl.style.fontFamily = 'inherit'; }
      if (routeEl) routeEl.textContent = routeLabel;
      if (amtEl) amtEl.textContent = price || '\u2014';
      if (dateEl && date) dateEl.textContent = fmtDate(date);
      if (timeEl && time) timeEl.textContent = fmtTime(time);
      if (pickupEl && pickup) pickupEl.textContent = pickup;
      successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(function () {
      window.open('https://wa.me/918720081102?text=' + encodeURIComponent(msg), '_blank');
    }, 800);
  }

  // ── 6. Google Ads conversion ───────────────────────────────────────────────

  let conversionFired = false;
  function fireConversion(paymentId, amountInr) {
    if (conversionFired) return;
    conversionFired = true;

    if (typeof gtag !== 'function') return;

    const adsId = document.documentElement.dataset.googleAdsId;
    const label = document.documentElement.dataset.googleAdsConversionLabel;
    if (!adsId || !label || adsId.includes('REPLACE') || label.includes('REPLACE')) return;

    gtag('event', 'conversion', {
      send_to: `${adsId}/${label}`,
      value: amountInr,
      currency: 'INR',
      transaction_id: paymentId,
    });
  }

  // ── 7. Main form submit flow ───────────────────────────────────────────────

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const name = document.getElementById('pb-name').value.trim();
    const email = document.getElementById('pb-email').value.trim();
    const phone = document.getElementById('pb-phone').value.trim();
    const route = document.getElementById('pb-route').value;
    const pickup = document.getElementById('pb-pickup')?.value.trim() || '';
    const date = document.getElementById('pb-date').value;
    const time = document.getElementById('pb-time').value;
    const passengers = document.getElementById('pb-passengers')?.value || '';
    const notes = document.getElementById('pb-notes')?.value.trim() || '';
    const attr = getAttribution();

    setLoading(true);
    clearErrors();

    // ── Step A: Create Razorpay order ────────────────────────────────────────
    let orderData;
    try {
      const res = await fetch('/.netlify/functions/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, route, pickup, date, time, passengers, notes, ...attr }),
      });
      orderData = await res.json();

      // If API returns a config/setup error, fall back to WhatsApp gracefully
      if (!orderData.ok) {
        const errMsg = (orderData.error || '').toLowerCase();
        const isConfigError = errMsg.includes('not configured') || errMsg.includes('missing') ||
          errMsg.includes('credentials') || res.status >= 500;
        if (isConfigError) {
          setLoading(false);
          fallbackToWhatsApp(name, phone, route, date, time, pickup, passengers, notes);
          return;
        }
        throw new Error(orderData.error || 'Order creation failed');
      }
    } catch (err) {
      // Network error (e.g. function not deployed) — fall back to WhatsApp
      if (err.name === 'TypeError' || err.message.includes('fetch') || err.message.includes('Failed')) {
        setLoading(false);
        fallbackToWhatsApp(name, phone, route, date, time, pickup, passengers, notes);
        return;
      }
      setLoading(false);
      showGlobalError(`Could not start payment: ${err.message}`);
      return;
    }

    // ── Step B: Open Razorpay Checkout ────────────────────────────────────────
    if (typeof Razorpay === 'undefined') {
      setLoading(false);
      // Razorpay SDK didn't load — fall back to WhatsApp
      fallbackToWhatsApp(name, phone, route, date, time, pickup, passengers, notes);
      return;
    }

    const rzpOptions = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: 'Padma Shree Travels',
      description: orderData.routeLabel,
      image: '/images/logo.png',
      prefill: orderData.prefill,
      notes: {
        route,
        pickup,
        date,
        time,
        passengers,
        notes: notes || '',
        utmSource: attr.utmSource,
        gclid: attr.gclid,
      },
      theme: { color: '#000000' },

      handler: async function (rzpResponse) {
        // ── Step C: Verify payment on server ─────────────────────────────────
        let verifyData;
        try {
          const res = await fetch('/.netlify/functions/verifyPayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature: rzpResponse.razorpay_signature,
              name, email, phone, route, pickup, date, time, passengers, notes,
              ...attr,
              sourcePage: window.location.href,
            }),
          });
          verifyData = await res.json();
          if (!verifyData.ok) throw new Error(verifyData.error || 'Verification failed');
        } catch (err) {
          setLoading(false);
          showGlobalError(`Payment received but verification failed: ${err.message}. Please contact us with payment ID: ${rzpResponse.razorpay_payment_id}`);
          return;
        }

        setLoading(false);
        fireConversion(verifyData.paymentId, verifyData.amountInr);
        showSuccess(verifyData.paymentId, verifyData.routeLabel, verifyData.amountInr, date, time, pickup);
      },

      modal: {
        ondismiss: function () {
          setLoading(false);
          showGlobalError('Payment was cancelled. You have not been charged.');
        },
      },
    };

    const rzp = new Razorpay(rzpOptions);
    rzp.open();
  });

})();
