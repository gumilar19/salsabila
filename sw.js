const CACHE_NAME = 'salsabila-pwa-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json', '/css/style.css', '/js/main.js', '/js/dzikir.js', '/js/prayer.js', '/js/quran.js', '/js/asma.js', '/js/kalender.js', '/js/qibla.js', '/js/theme.js', '/js/pwa.js'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(cache => {
      if (cache !== CACHE_NAME) return caches.delete(cache);
    }));
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
    if (clientList.length > 0) return clientList[0].focus();
    return clients.openWindow('/');
  }));
});