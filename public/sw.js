// Servis çalışanı (service worker): uygulamanın telefona yüklenebilmesini
// ve internet yokken de açılabilmesini sağlar.
// Uygulamayı güncellediğinde SURUM'ü bir artır, eski önbellek silinsin.
const SURUM = 'wellness-v2';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SURUM).then((c) => c.addAll(['./', './index.html', './manifest.webmanifest'])));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((anahtarlar) => Promise.all(anahtarlar.filter((a) => a !== SURUM).map((a) => caches.delete(a))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const istek = e.request;
  if (istek.method !== 'GET' || new URL(istek.url).origin !== self.location.origin) return;

  // Sayfalar: önce internetten dene (ve en yeni hâlini sakla), olmazsa önbellekten aç
  if (istek.mode === 'navigate') {
    e.respondWith(
      fetch(istek)
        .then((cevap) => {
          const kopya = cevap.clone();
          caches.open(SURUM).then((c) => c.put('./index.html', kopya));
          return cevap;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Diğer dosyalar (JS, CSS, resim): önce önbellek, yoksa internetten al ve sakla
  e.respondWith(
    caches.match(istek).then((kayitli) =>
      kayitli ||
      fetch(istek).then((cevap) => {
        const kopya = cevap.clone();
        caches.open(SURUM).then((c) => c.put(istek, kopya));
        return cevap;
      })
    )
  );
});
