// Service Worker за Д-р Йорданов УНГ сайт
// Ultra-fast, modern caching strategy with PWA support

const CACHE_NAME = 'dr-yordanov-ung-v1';
const RUNTIME_CACHE = 'runtime-cache-v1';

// Ресурси за кеширане при инсталация
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/offline.html' // Създайте проста офлайн страница
];

// Инсталация на Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Кеш отворен');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Активиране и почистване на стари кешове
self.addEventListener('activate', event => {
    const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// Fetch стратегия - различна за различни типове ресурси
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Игнорирай заявки към други домейни (освен Google Fonts)
    if (url.origin !== location.origin && !url.origin.includes('fonts.googleapis.com') && !url.origin.includes('fonts.gstatic.com')) {
        return;
    }

    // Cache-First стратегия за статични ресурси (CSS, JS, шрифтове, изображения)
    if (request.destination === 'style' || 
        request.destination === 'script' || 
        request.destination === 'font' || 
        request.destination === 'image') {
        
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request).then(response => {
                    // Не кешираме невалидни отговори
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    const responseToCache = response.clone();
                    caches.open(RUNTIME_CACHE).then(cache => {
                        cache.put(request, responseToCache);
                    });

                    return response;
                });
            }).catch(() => {
                // Ако е изображение, върни placeholder
                if (request.destination === 'image') {
                    return new Response(
                        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#E8F4F8" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#0A2F5A">Няма връзка</text></svg>',
                        { headers: { 'Content-Type': 'image/svg+xml' } }
                    );
                }
            })
        );
        return;
    }

    // Stale-While-Revalidate за HTML страници
    if (request.destination === 'document') {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                const fetchPromise = fetch(request).then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(RUNTIME_CACHE).then(cache => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    // Ако няма мрежа и няма кеш, покажи офлайн страница
                    return caches.match('/offline.html');
                });

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // Network-First стратегия за видео и API заявки
    if (request.destination === 'video' || url.pathname.includes('/api/')) {
        event.respondWith(
            fetch(request).then(response => {
                const responseToCache = response.clone();
                caches.open(RUNTIME_CACHE).then(cache => {
                    cache.put(request, responseToCache);
                });
                return response;
            }).catch(() => {
                return caches.match(request);
            })
        );
        return;
    }

    // За всички останали заявки - Network-First
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request);
        })
    );
});

// Background Sync за обновяване на кеширано съдържание
self.addEventListener('sync', event => {
    if (event.tag === 'update-cache') {
        event.waitUntil(updateCache());
    }
});

async function updateCache() {
    const cache = await caches.open(RUNTIME_CACHE);
    const requests = await cache.keys();
    
    return Promise.all(
        requests.map(async request => {
            try {
                const response = await fetch(request);
                if (response.status === 200) {
                    await cache.put(request, response);
                }
            } catch (error) {
                console.log('Грешка при обновяване на кеш:', error);
            }
        })
    );
}

// Push Notifications поддръжка (за бъдещо разширение)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Ново известие',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [200, 100, 200]
    };

    event.waitUntil(
        self.registration.showNotification('Д-р Йорданов УНГ', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Message handling за комуникация с главната страница
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            })
        );
    }
});