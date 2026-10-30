// VERA Service Worker 2026-10-30.3: network-first, bei Netzfehler letzte gecachte Version (App laedt auch offline mit letzten Daten)
const C = "vera-2026-10-30.3";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(["./", "index.html", "manifest.webmanifest", "icon-180.png"])).catch(() => {})); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  const key = r.url.split("?")[0];
  e.respondWith(fetch(r, { cache: "no-store" }).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(key, cp)); } return res; })
    .catch(() => caches.match(key).then(m => m || Promise.reject(new Error("offline")))));
});
