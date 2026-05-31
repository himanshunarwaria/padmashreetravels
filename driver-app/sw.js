/* ============================================================
   Padma Shree Driver Helper — Service Worker
   Scope: /driver-app/ ONLY — does NOT touch the main website
   Cache: padma-driver-helper-v1
   ============================================================ */

const CACHE_NAME = 'padma-driver-helper-v1';

// Core app files guaranteed to exist — pre-cached on install
const PRECACHE_URLS = [
  '/driver-app/',
  '/driver-app/index.html',
  '/driver-app/manifest.json',
];

// Icon files — cached lazily (may not exist until generated)
const ICON_URLS = [
  '/driver-app/icons/icon-192.png',
  '/driver-app/icons/icon-512.png',
  '/driver-app/icons/icon-maskable-512.png',
  '/driver-app/icons/icon.svg',
  '/driver-app/icons/icon-maskable.svg',
];

/* ── INSTALL: pre-cache core app files ──────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Core files — required, fail loudly if missing
      await cache.addAll(PRECACHE_URLS);

      // Icon files — optional, silently skip if not yet generated
      await Promise.allSettled(
        ICON_URLS.map(url =>
          fetch(url)
            .then(r => { if (r.ok) cache.put(url, r); })
            .catch(() => { /* icon not yet generated — skip */ })
        )
      );
    })
  );
  self.skipWaiting();
});

/* ── ACTIVATE: clean up old caches for this app only ────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key =>
            key.startsWith('padma-driver-helper-') && key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ── FETCH: only intercept /driver-app/ requests ────────────── */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Passthrough: let the browser handle anything outside our scope
  if (!url.pathname.startsWith('/driver-app/')) return;

  // Passthrough: non-GET (POST, etc.) — do not intercept
  if (event.request.method !== 'GET') return;

  // Navigation requests (e.g. direct URL bar access) — network-first, fallback to index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/driver-app/index.html'))
    );
    return;
  }

  // All other /driver-app/ assets — cache-first, lazy-cache on network hit
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Only cache valid, same-origin responses
        if (
          response &&
          response.status === 200 &&
          response.type !== 'opaque'
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
