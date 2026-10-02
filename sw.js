const CACHE = "stxcl-directory-v1";

self.addEventListener("install", function(event) {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./directory.json"
      ]);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    self.clients.claim()
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request);
    })
  );
});