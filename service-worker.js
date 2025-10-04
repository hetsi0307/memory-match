const CACHE = 'mm-v3';  // bump version to force update
const ASSETS = [
  './',
  './index.html',
  './aigameglass.html',
  './manifest.json',
  './icon.192.png',
  './icon.512.png'
];

// Install
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).catch(() => {
        if (e.request.mode === 'navigate') {
          // fallback to landing page
          return caches.match('./index.html');
        }
      })
    )
  );
});
