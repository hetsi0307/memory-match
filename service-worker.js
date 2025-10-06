// ===========================
// Glass Memory Match Service Worker
// ===========================
const CACHE_NAME = 'mm-v6';  // bump this to force updates

// Only include files that actually exist in your repo root
const ASSETS = [
  './',
  './index.html',
  './aigameglass.html',
  './manifest.json',
  './icon.192.png',
  './icon.512.png'
  // add './screenshot1.png' here if you want it cached offline
];

// Install: precache core assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for static; network with HTML fallback for navigation
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Treat as a navigation request if mode is navigate OR Accept includes HTML
  const isNav =
    req.mode === 'navigate' ||
    (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'));

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req).catch(() => {
        if (isNav) return caches.match('./index.html'); // offline fallback
      });
    })
  );
});
