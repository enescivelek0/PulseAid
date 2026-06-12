const CACHE_NAME = 'pulseaid-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'assets/css/style.css',
  'assets/js/data.js',
  'assets/js/app.js'
];

// Install Event - cache core local assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('PulseAid SW: Caching core assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - clean up legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('PulseAid SW: Clearing legacy cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - cache-first with network fallback strategy, plus dynamic caching of CDN scripts/fonts
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // If response is valid, clone and cache it dynamically for CDN/fonts
          if (networkResponse && networkResponse.status === 200) {
            const requestUrl = event.request.url;
            
            // Cache remote scripts, CSS, and fonts (e.g. Tailwind CDN, Google Fonts)
            if (
              requestUrl.startsWith('http') && 
              (requestUrl.includes('tailwindcss') || 
               requestUrl.includes('gstatic') || 
               requestUrl.includes('googleapis'))
            ) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
          }
          return networkResponse;
        })
        .catch((err) => {
          console.log('PulseAid SW: Fetch failed, offline mode.', err);
          // Return default offline content if indexing root or index.html
          if (event.request.mode === 'navigate') {
            return caches.match('index.html');
          }
        })
    })
  );
});
