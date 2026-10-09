/*
 * Flores — servis çalışanı (yalnızca demleme rehberini çevrimdışı kullanılabilir yapmak için).
 * Sayfalar her zaman önce ağdan gelir (site güncel kalır); ağ yoksa son kaydedilen demleme rehberi açılır.
 * Ödeme, API, POST ve başka alan adlarına giden isteklere hiç dokunulmaz.
 */
const VERSION = "flores-sw-v1";
const PAGES = VERSION + "-pages";
const ASSETS = VERSION + "-assets";
const BREW = "/demleme-rehberi";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((c) => c.add(BREW))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const isBrewPage = (url) => /\/demleme-rehberi\/?$/.test(url.pathname);

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  // sayfalar: önce ağ; demleme rehberi kopyası saklanır, ağ yoksa o gösterilir
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && isBrewPage(url)) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match(BREW)).then((hit) => hit || Response.error())),
    );
    return;
  }

  // derleme çıktıları (adı içeriğe göre değişir, hiç bayatlamaz): önce önbellek
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSETS).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
