self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('assets-v1').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/logo.png',
          '/main.js',
          '/style.css',
          // Add other assets to cache here
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
    );
  });