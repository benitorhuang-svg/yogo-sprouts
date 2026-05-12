const CACHE_NAME = 'yogo-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './about.html',
  './css/style.css',
  './js/app.js',
  './js/data.js',
  './js/shop.js',
  './js/cart.js',
  './js/detailModal.js',
  './js/checkoutModal.js',
  './js/scrollSpy.js',
  './js/admin.js',
  './js/toast.js',
  './js/favorites.js',
  './js/search.js',
  './img/brand/logo.png',
  './img/brand/about-banner.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
