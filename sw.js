const CACHE = "stxcl-directory-v2";

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
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(name) {
            return name !== CACHE;
          })
          .map(function(name) {
            return caches.delete(name);
          })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event) {

  const url = new URL(event.request.url);

  if (url.pathname.endsWith("/directory.json")) {

    event.respondWith(
      fetch(event.request, {
        cache: "no-store"
      })
        .then(function(response) {

          const copy = response.clone();

          caches.open(CACHE).then(function(cache) {
            cache.put(event.request, copy);
          });

          return response;

        })
        .catch(function() {

          return caches.match("./directory.json");

        })
    );

    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request);
    })
  );

});
