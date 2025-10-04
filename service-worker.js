// ===========================
// Glass Memory Match Service Worker
// ===========================

const CACHE_NAME = 'mm-v3';  // update version to force refresh
const ASSETS = [
  './',
  './index.html',
  './aigameglass.html',
  './manifest.json',
  './icon.192.png',
  './icon.512.png',
  './style.css',  // if you have external CSS
  './script.js'   // if you have external JS
];

// Install event – cache all assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
      .catch(err => console.error('SW install error:', err))
  );
});

// Activate event – delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys.filter((key) => key !== CACHE_NAME)
              .map((key) => caches.delete(key))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event – respond from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cached) => {
        if (cached) return cached;
        return fetch(event.request).catch(() => {
          // fallback to homepage for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
