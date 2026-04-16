/**
 * Central route pricing configuration.
 * The server is the authoritative source — frontend prices are display-only.
 * Amount is in INR (rupees). Razorpay receives paise (amount * 100).
 */

const ROUTES = {
  // ── Agra Local ──────────────────────────────────────────────────────────
  'agra-local-sightseeing': {
    label: 'Agra Local Sightseeing',
    amount: 2500,
    duration: 'Full day',
  },
  'fatehpur-sikri': {
    label: 'Fatehpur Sikri Tour',
    amount: 2500,
    duration: 'Half day',
  },

  // ── Mathura / Vrindavan ─────────────────────────────────────────────────
  'agra-to-mathura-vrindavan': {
    label: 'Agra to Mathura & Vrindavan',
    amount: 3000,
    duration: 'Full day round trip',
  },
  'agra-to-mathura-taxi': {
    label: 'Agra to Mathura Taxi',
    amount: 3000,
    duration: 'One way / round trip',
  },
  'agra-to-vrindavan-cab': {
    label: 'Agra to Vrindavan Cab',
    amount: 3000,
    duration: 'One way / round trip',
  },
  'mathura-vrindavan-tour': {
    label: 'Mathura Vrindavan Tour from Agra',
    amount: 3000,
    duration: 'Full day',
  },
  'mathura-vrindavan-barsana': {
    label: 'Mathura, Vrindavan & Barsana',
    amount: 3500,
    duration: 'Full day',
  },

  // ── Outstation ──────────────────────────────────────────────────────────
  'agra-to-aligarh': {
    label: 'Agra to Aligarh',
    amount: 3000,
    duration: 'One way',
  },
  'agra-to-hathras': {
    label: 'Agra to Hathras',
    amount: 2000,
    duration: 'One way',
  },
  'agra-to-sirsaganj': {
    label: 'Agra to Sirsaganj',
    amount: 3000,
    duration: 'One way',
  },
  'agra-to-etawah': {
    label: 'Agra to Etawah',
    amount: 3500,
    duration: 'One way',
  },
  'agra-to-gwalior': {
    label: 'Agra to Gwalior',
    amount: 3000,
    duration: 'One way',
  },
  'agra-to-firozabad': {
    label: 'Agra to Firozabad',
    amount: 2500,
    duration: 'One way',
  },
  'agra-to-bateshwar': {
    label: 'Agra to Bateshwar',
    amount: 3000,
    duration: 'One way',
  },
  'agra-to-tundla': {
    label: 'Agra to Tundla',
    amount: 2000,
    duration: 'One way',
  },
  'agra-to-shikohabad': {
    label: 'Agra to Shikohabad',
    amount: 3000,
    duration: 'One way',
  },
};

/**
 * Look up a route by key.
 * @param {string} key - route slug, e.g. 'agra-local-sightseeing'
 * @returns {{ label, amount, duration } | null}
 */
function getRoute(key) {
  if (!key || typeof key !== 'string') return null;
  return ROUTES[key.trim().toLowerCase()] || null;
}

/**
 * Amount in paise for Razorpay (INR * 100).
 * @param {string} key
 * @returns {number | null}
 */
function getPaise(key) {
  const r = getRoute(key);
  return r ? r.amount * 100 : null;
}

/** All route keys — used to validate incoming requests. */
function validRouteKeys() {
  return Object.keys(ROUTES);
}

module.exports = { ROUTES, getRoute, getPaise, validRouteKeys };
