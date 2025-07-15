const CACHE_NAME = 'payment-tracker-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/constants.js',
    '/api.js',
    '/utils.js',
    '/components.js',
    '/icon-192.png',
    '/icon-512.png',
    'https://cdn.jsdelivr.net/npm/react@18/umd/react.development.js',
    'https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.development.js',
    'https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

// Install event: open a cache and add all the specified assets to it.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event: serve cached content when offline.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // If the request is in the cache, return the cached response.
                if (response) {
                    return response;
                }
                // If the request is not in the cache, fetch it from the network.
                return fetch(event.request);
            })
    );
});

// Activate event: clean up old caches.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});