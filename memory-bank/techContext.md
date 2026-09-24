# Tech Context — SoundMemory

## Stack
- **p5.js 1.11.3** via CDN (`https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.js`), global mode. Uses: `createCanvas`, `shuffle`, `redraw`/`noLoop`, `mousePressed`, `touchStarted` (single-tap touch input), `windowResized`, `resizeCanvas`, `createSelect` (bank dropdown). Canvas CSS uses `touch-action: manipulation` to avoid the iOS double-tap delay.
- **HTML5 Audio** (`new Audio('sounds_alert/<Name>.mp3')`) — no Web Audio API, no p5.sound. Playback via `pause()` + `currentTime = 0` + `.play()` (Safari-safe restart); needs a user gesture (first click satisfies this).
- **Vanilla JS**, no modules, no bundler, no package manager. Plain ES6 in a `<script>` tag.
- **Service Worker** (`sw.js`): cache-first (`caches.match` → network fallback), precaches `/` and all app assets including the p5 CDN URL and all 42 mp3s (14 alert + 14 impact + 14 birds).

## Files & Responsibilities
| File | Role |
|---|---|
| `index.html` | entry; loads p5 + sketch; SW registration |
| `mySketch.js` | entire game |
| `style.css` | margin/padding reset only |
| `sw.js` | offline cache |
| `manifest.json` | PWA install metadata; icon = `apple-touch-icon.png` |
| `sounds_alert/*.mp3` | 14 alert game sounds |
| `sounds_impact/*.mp3` | 14 Kenney impact sounds |
| `sounds_birds/*.mp3` | 14 mixkit bird sounds |

## Gotchas / Constraints
- **SW paths are root-relative** (`/index.html`, `/sounds_alert/...`) — the app must be served from the domain root, or all `sw.js` entries and the registration path need rewriting for a subdirectory deploy.
- **Cache invalidation is manual:** any asset change requires bumping `CACHE_NAME` (currently `soundmemory-cache-v0`) or clients keep serving the old version.
- **Skip waiting/clients claim** are used, so a new SW takes over immediately once installed.
- The manifest declares a 512×512 icon using a 180×180 file — masks may look soft; a real 512 asset would be better.
- `SOUND_BANKS[bank].files` names must stay in sync with filenames in each `sounds_*/` directory.

## Serving Locally
```bash
cd SoundMemory && python3 -m http.server 8000
# open http://localhost:8000
```
HTTPS or localhost is required for service worker registration.