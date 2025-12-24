const CACHE_PREFIX = 'guoman';
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `${CACHE_PREFIX}:static:${CACHE_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}:runtime:${CACHE_VERSION}`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './404.html',
  './favicon.svg',
  './site.webmanifest',
  './og.svg',
  './robots.txt',
  './sitemap.xml',
];

const isSameOrigin = (request) => {
  try {
    const url = new URL(request.url);
    return url.origin === self.location.origin;
  } catch {
    return false;
  }
};

const isNavigation = (request) => request.mode === 'navigate';

const cleanupOldCaches = async () => {
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter(
        (key) => key.startsWith(CACHE_PREFIX) && key !== STATIC_CACHE && key !== RUNTIME_CACHE,
      )
      .map((key) => caches.delete(key)),
  );
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => undefined),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    cleanupOldCaches()
      .then(() => self.clients.claim())
      .catch(() => undefined),
  );
});

self.addEventListener('message', (event) => {
  if (event?.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const networkFirst = async (request) => {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return (await cache.match('./index.html')) || new Response('Offline', { status: 503 });
  }
};

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    fetchPromise.then(() => undefined);
    return cached;
  }

  const fresh = await fetchPromise;
  if (fresh) return fresh;
  return (await cache.match(request)) || new Response('Offline', { status: 503 });
};

const cacheFirst = async (request) => {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await cache.match(request)) || new Response('Offline', { status: 503 });
  }
};

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (!request || request.method !== 'GET') return;
  if (!isSameOrigin(request)) return;

  if (isNavigation(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  const destination = request.destination;
  if (destination === 'script' || destination === 'style' || destination === 'worker') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (destination === 'image' || destination === 'font') {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
