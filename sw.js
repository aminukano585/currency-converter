const staticAssets = [
    './',
    './assets/css/styles.css',
    './assets/js/scripts.js'
];

self.addEventListener('install', async event => {
    const cache = await caches.open('currencies-static');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if (url.origin == location.origin) {
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkFirst(req));
    }
});

async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open('currencies-dynamic');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (e) {
        return await cache.match(req);
    }
}