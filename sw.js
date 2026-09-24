const CACHE_NAME = 'soundmemory-cache-v1';

// Add all the files your app needs to run offline
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/mySketch.js',
  '/manifest.json',
  '/apple-touch-icon.png',
  '/sounds_alert/Basso.mp3',
  '/sounds_alert/Blow.mp3',
  '/sounds_alert/Bottle.mp3',
  '/sounds_alert/Frog.mp3',
  '/sounds_alert/Funk.mp3',
  '/sounds_alert/Glass.mp3',
  '/sounds_alert/Hero.mp3',
  '/sounds_alert/Morse.mp3',
  '/sounds_alert/Ping.mp3',
  '/sounds_alert/Pop.mp3',
  '/sounds_alert/Purr.mp3',
  '/sounds_alert/Sosumi.mp3',
  '/sounds_alert/Submarine.mp3',
  '/sounds_alert/Tink.mp3',
  '/sounds_impact/footstep_concrete_004.mp3',
  '/sounds_impact/footstep_snow_002.mp3',
  '/sounds_impact/impactBell_heavy_000.mp3',
  '/sounds_impact/impactBell_heavy_001.mp3',
  '/sounds_impact/impactGeneric_light_000.mp3',
  '/sounds_impact/impactGlass_heavy_001.mp3',
  '/sounds_impact/impactGlass_medium_000.mp3',
  '/sounds_impact/impactMetal_heavy_000.mp3',
  '/sounds_impact/impactMetal_light_003.mp3',
  '/sounds_impact/impactPlate_heavy_001.mp3',
  '/sounds_impact/impactPlate_light_003.mp3',
  '/sounds_impact/impactSoft_heavy_002.mp3',
  '/sounds_impact/impactTin_medium_003.mp3',
  '/sounds_impact/impactWood_medium_001.mp3',
  '/sounds_birds/mixkit-big-wild-eagle-calling-70.mp3',
  '/sounds_birds/mixkit-bird-screeching-in-the-jungle-2436.mp3',
  '/sounds_birds/mixkit-chickens-clucking-short-1772.mp3',
  '/sounds_birds/mixkit-cockatoo-bird-squawk-2437.mp3',
  '/sounds_birds/mixkit-double-little-bird-chirp-21.mp3',
  '/sounds_birds/mixkit-forest-bird-singing-1211.mp3',
  '/sounds_birds/mixkit-forest-birds-singing-1212.mp3',
  '/sounds_birds/mixkit-hawk-bird-squawk-1268.mp3',
  '/sounds_birds/mixkit-little-bird-calling-chirp-23.mp3',
  '/sounds_birds/mixkit-melodic-songbird-chirp-67.mp3',
  '/sounds_birds/mixkit-melodic-songbird-chirp-in-the-wild-68.mp3',
  '/sounds_birds/mixkit-toy-whistler-bird-sound-18.mp3',
  '/sounds_birds/mixkit-tropical-bird-squeak-27.mp3',
  '/sounds_birds/mixkit-wild-raven-bird-calling-62.mp3',
  'https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.js' // p5js lib
];

// 1. Install Event: Cache all critical files.
// Cache per-asset so one missing file doesn't fail the whole install.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app assets...');
      return Promise.all(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => console.warn('Failed to cache', url, err))
        )
      );
    }).then(() => self.skipWaiting()) // Force the waiting service worker to become active
  );
});

// 2. Activate Event: Clean up old caches if you update the version
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache...');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of open pages immediately
  );
});

// 3. Fetch Event: Intercept requests and serve from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return the cached file if found, otherwise try the network
      return cachedResponse || fetch(event.request).catch(() => {
        // Fallback or error handling if both fail (offline and not cached)
        console.log('Network failed and asset not in cache:', event.request.url);
      });
    })
  );
});