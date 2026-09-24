# SoundMemory

A sound-based memory game. Heiko Gölzer 2026.

## How to Play

The game starts with **Alert sounds** (system alert tones). **Triple-tap the
lower-right tile before any other play** to reveal the sound-bank selector and
switch to **Impact sounds** (Kenney impact/step effects) or **Bird sounds**
(mixkit bird calls). Each bank has 14 sounds, each appearing twice on a **4×7
grid** of 28 cards. Click (or tap) a card to hear and reveal its sound. Reveal
two cards per bid — if the sounds match, the pair celebrates with a rainbow flash
and vanishes; if not, both flip back after 500 ms. Find all 14 pairs to win. The
score counter (`B:bids M:matches`) stays in the lower-right corner.

## Tech Stack

- **p5.js 1.11.3** (CDN) — canvas, `draw`/`setup` lifecycle, `shuffle`
- **HTML5 `Audio` API** (not p5.sound) — one `Audio` element per sound, restarted
  via `pause()` + `currentTime = 0` to work around Safari/WebKit quirks
- **PWA** — `manifest.json` + service worker (`sw.js`) with cache-first fetching
  for full offline play

## Architecture

### Game State (`mySketch.js`)

| Variable   | Type            | Purpose                                           |
| ---------- | --------------- | ------------------------------------------------- |
| `mapping`  | `string[]`      | Card index → sound name (shuffled, each sound ×2) |
| `state`    | `string[]`      | Card index → `'hidden'` \| `'up'` \| `'celebrate'` \| `'done'` |
| `choice1`  | `number\|null`  | First card of the current bid                     |
| `locked`   | `boolean`       | True during 500 ms match/mismatch animation       |
| `tries`    | `number`        | Completed bids (two cards revealed)               |
| `matches`  | `number`        | Pairs found                                       |
| `tapTimes` | `number[]`      | Timestamps of taps on the secret tile (lower-right, start only) |
| `secretArmed` | `boolean`    | Hidden triple-tap armed until any other tile is played |

### Card States

```
hidden ──click──▶ up ──match──▶ celebrate (500 ms) ──▶ done (vanishes)
                     └──mismatch──▶ hidden (500 ms)
```

### Rendering

- Full-screen canvas (`windowWidth × windowHeight`); `noLoop()` — redraws only on
  interaction or animation tick.
- **5-color rainbow palette** in three intensities:
  - `PALETTE` (pale) — hidden cards
  - `PALETTE_DARK` (saturated) — currently revealed card
  - `PALETTE_MID` (mid) — celebration animation
- Tiles fill the screen with 5 % margins; sizes recompute every `draw()` so
  `windowResized()` just calls `resizeCanvas()` + `redraw()`.
- Matched (`done`) cards are skipped entirely — they disappear into the background.

### Match Animation

On a match, both cards enter `celebrate` for 500 ms. A `setInterval` ticks every
50 ms (10 frames × 5 colors = 2 full rainbow cycles), calling `redraw()` each tick.
After 500 ms the cards become `done` and `locked` releases.

### Touch Support

`touchStarted()` delegates to `mousePressed()` and returns `false` to suppress
iOS double-tap zoom.

### PWA / Offline

`sw.js` pre-caches all app assets (HTML, CSS, JS, icon, manifest, all 42 MP3s
across all three sound banks, and the p5.js CDN URL) at install. Caching is
**per-asset** — one missing file logs a warning instead of failing the whole
install. Fetch handler is **cache-first** with network fallback. Cache version
key: `soundmemory-cache-v1` — bump it when assets change.

## Files

| File                  | Role                                            |
| --------------------- | ----------------------------------------------- |
| `index.html`          | Entry page; loads p5.js, sketch, CSS, registers SW; viewport + PWA metas |
| `mySketch.js`         | Game logic: grid, shuffle, matching, rendering  |
| `style.css`           | Minimal CSS reset                               |
| `sw.js`               | Service worker (cache-first, offline support)   |
| `manifest.json`       | PWA manifest (standalone, icons)                |
| `apple-touch-icon.png`| App icon (180×180; manifest declares 512 — see backlog) |
| `sounds_alert/`       | 14 alert MP3 sound files                       |
| `sounds_impact/`      | 14 impact MP3 sound files (Kenney)             |
| `sounds_birds/`       | 14 bird MP3 sound files (mixkit)               |

## Sounds

### Alert sounds

```
Basso  Blow  Bottle  Frog   Funk  Glass  Hero
Morse  Ping  Pop     Purr   Sosumi  Submarine  Tink
```

### Impact sounds

Created/distributed by [Kenney](https://www.kenney.nl) (www.kenney.nl),
licensed under [CC0 1.0](http://creativecommons.org/publicdomain/zero/1.0/).

```
footstep_concrete_004  footstep_snow_002       impactBell_heavy_000
impactBell_heavy_001   impactGeneric_light_000 impactGlass_heavy_001
impactGlass_medium_000 impactMetal_heavy_000   impactMetal_light_003
impactPlate_heavy_001  impactPlate_light_003   impactSoft_heavy_002
impactTin_medium_003   impactWood_medium_001
```

### Bird sounds

From [mixkit](https://mixkit.co/free-sound-effects/bird).

```
mixkit-big-wild-eagle-calling-70        mixkit-bird-screeching-in-the-jungle-2436
mixkit-chickens-clucking-short-1772     mixkit-cockatoo-bird-squawk-2437
mixkit-double-little-bird-chirp-21      mixkit-forest-bird-singing-1211
mixkit-forest-birds-singing-1212        mixkit-hawk-bird-squawk-1268
mixkit-little-bird-calling-chirp-23     mixkit-melodic-songbird-chirp-67
mixkit-melodic-songbird-chirp-in-the-wild-68  mixkit-toy-whistler-bird-sound-18
mixkit-tropical-bird-squeak-27          mixkit-wild-raven-bird-calling-62
```

## Dev Notes

- `ROWS` derives from `FILES.length * 2 / COLS` (= 7); changing `COLS` or
  `FILES` automatically adjusts the grid.
- `PALETTE_MID` is computed at parse time with `Math.round` (not p5's `round`)
  because p5 globals aren't available yet.
- The game tracks **bids** (two-card attempts), not individual card clicks.
- The hidden bank selector needs **3 taps within 600 ms** on the lower-right tile
  while `secretArmed` (before any other tile is played). Taps there are consumed
  silently while counting; the gesture re-arms after each game.
