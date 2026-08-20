// アプリシェル(HTML/CSS/JS)をキャッシュし、ホーム画面追加時にオフラインでも開けるようにする。
// GitHub APIやGoogle Fontsなど外部オリジンへのリクエストはキャッシュせず、常にネットワークへ流す。
const CACHE_NAME = "signal-shell-v30";
const APP_SHELL = [
  "./",
  "index.html",
  "exercises.html",
  "style.css?v=30",
  "sync.js?v=30",
  "app.js?v=30",
  "exercises.js?v=30",
  "manifest.json",
  "favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// stale-while-revalidate: キャッシュがあればまず即返しつつ、裏でネットワークから
// 取得して次回分を更新する。オフライン時はネットワーク失敗をキャッシュ結果で吸収する。
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin || event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
