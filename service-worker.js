// Selbstzerstoerender Service Worker.
// Ersetzt den alten App-Service-Worker, der frueher auf dieser Domain lief
// und Besuchern die alte MeisterDesk-App aus dem Cache ausgeliefert hat.
self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async function () {
      try {
        var keys = await caches.keys();
        await Promise.all(keys.map(function (k) { return caches.delete(k); }));
      } catch (e) {}

      try {
        await self.registration.unregister();
      } catch (e) {}

      try {
        var clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach(function (c) {
          try { c.navigate(c.url); } catch (e) {}
        });
      } catch (e) {}
    })()
  );
});

// Nichts mehr aus dem Cache bedienen - alles direkt ans Netz.
self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
});
