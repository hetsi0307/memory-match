const CACHE = 'mm-v2';  // bump version to force update
const ASSETS = [
  './',
  './index.html',
  './aigameglass.html',
  './manifest.json',
  './icon-192.png',   // ← root paths
  './icon-512.png'    // ← root paths
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('./index.html');
      })
    )
  );
});
