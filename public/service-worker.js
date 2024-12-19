self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('my-cache-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/android/android-launchericon-192x192.png',
                '/android/android-launchericon-512x512.png',
                '/vite.svg', // اگر نیاز است
                // دیگر فایل‌های موردنیاز
            ]);
        })
    );
});


self.addEventListener('activate', (event) => {
    clients.claim(); // فوراً کنترل صفحات را به دست می‌گیرد
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});