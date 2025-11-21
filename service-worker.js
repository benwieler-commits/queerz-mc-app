const CACHE_NAME = 'queerz-mc-v1';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './campaign-manager-mc.js',
  './firebase-config.js',
  './firebase-broadcast.js',
  './manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache installation failed:', error);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the fetched resource
          caches.open(CACHE_NAME)
            .then((cache) => {
              // Don't cache Firebase requests, external URLs, or large media files
              const url = event.request.url;
              if (!url.includes('firebase') &&
                  !url.includes('firebaseio') &&
                  !url.includes('.mp3') &&
                  !url.includes('.wav') &&
                  !url.includes('.ogg') &&
                  url.startsWith(self.location.origin)) {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        }).catch(() => {
          // Network request failed, try to return cached version
          return caches.match('./index.html');
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim clients to activate immediately
  return self.clients.claim();
});

// Background sync for offline campaign changes
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-campaign-data') {
    event.waitUntil(syncCampaignData());
  }
});

async function syncCampaignData() {
  // Placeholder for syncing campaign data when back online
  console.log('Syncing campaign data...');
}

// Push notification support for MC alerts
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: 'icons/icon-192x192.png',
    badge: 'icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      }
    ]
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
