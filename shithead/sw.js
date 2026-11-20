// Shithead app cache: network first so updates arrive straight away; cached copy when offline (solo works offline).
const VERSION = 'shithead-cc-1';
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(['./', './index.html'])).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(VERSION).then(k => k.put(r, c)); } return res; })
    .catch(() => caches.match(r, { ignoreSearch: true }).then(x => x || caches.match('./index.html'))));
});
