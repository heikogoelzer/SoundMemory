# System Patterns — SoundMemory

## Architecture
Single static page, no build step:

```
index.html ── loads ──> p5.js (CDN) + mySketch.js
   └── registers sw.js (cache-first offline)
```

All game logic lives in `mySketch.js` (p5 global-mode sketch). DOM is essentially empty; canvas is the whole UI. The only DOM element is the bank-selector dropdown (`createSelect()`), created on demand by the hidden triple-tap gesture.

## Sound Banks
`SOUND_BANKS` maps bank name → `{ dir, files[14] }`. `loadBank(name)` sets `bankName`, `FILES`, `ROWS`, rebuilds `sounds{}`, and calls `startGame()`.

| Bank | Dir | Source |
|---|---|---|
| `alert` | `sounds_alert/` | system alert tones (Basso…Tink) |
| `impact` | `sounds_impact/` | Kenney CC0 impact/step sounds |
| `birds` | `sounds_birds/` | mixkit bird calls |

## State Model (mySketch.js)
Parallel arrays indexed by card index `i` (0..27, row-major over 4 cols × 7 rows):

| Variable | Role |
|---|---|
| `SOUND_BANKS` | bank name → `{ dir, files }` (const) |
| `bankName`, `FILES` | active bank; 14 sound names |
| `sounds{}` | name → HTML5 `Audio` element, rebuilt per `loadBank()` |
| `mapping[]` | card index → sound name; each name twice, `shuffle(mapping, true)` |
| `state[]` | card index → `'hidden'` \| `'up'` \| `'celebrate'` \| `'done'` |
| `choice1` | index of first flipped card, or `null` |
| `locked` | true during the 500 ms match/mismatch animation |
| `tries`, `matches` | bid and pair counters |
| `bankSelect` | dropdown element, or `null` |
| `tapTimes[]`, `secretArmed` | hidden triple-tap gesture state |

## Key Flows
- **Setup:** `setup()` creates canvas, loads the alert bank immediately (`loadBank('alert')`), then `noLoop()` — the sketch is event-driven; every change ends with `redraw()`.
- **Bank selector:** triple-tap (3 taps within `TAP_WINDOW` = 600 ms) on the lower-right tile (`mapping.length - 1`) while `secretArmed` (before any other tile is played) reveals the dropdown. Taps there are consumed silently. `showBankSelect()` → `changed()` → `loadBank(name)`. Selecting the placeholder does nothing. While the dropdown is open, `mousePressed()` ignores tile clicks.
- **Deal:** `startGame()` doubles `FILES`, shuffles, resets state (`tries`, `matches`, `choice1`, `locked`, `secretArmed`, `tapTimes`), redraws.
- **Click:** `mousePressed()` → if `bankSelect` open, return; if secret tile & armed, count the tap; else `cardAt(px, py)` maps pixel to index (simple `floor(px/cw)`, `floor(py/ch)` cell mapping) → `pause()` + `currentTime = 0` + `play()` (Safari-safe restart), set `'up'` → match: both `'celebrate'` (500 ms rainbow), then `'done'`; mismatch: both re-hide after 500 ms. `tries` increments per bid, `matches` per pair.
- **Win:** `isGameOver()` = all `'done'` → "Done!" text in `draw()`.

## Rendering
- `rectMode(CENTER)`, `textAlign(CENTER, CENTER)`; rectangular tiles at 90% of cell size (`cw * 0.9`, `ch * 0.9` — 5% margin all around) centered in each `width/COLS` × `height/ROWS` cell.
- Three rainbow intensities: `PALETTE` (pale, hidden), `PALETTE_DARK` (saturated, current choice), `PALETTE_MID` (celebration flash), cycled by card index `i % length`.
- Text size scales with `min(cw, ch) * 0.2`.
- `windowResized()` → `resizeCanvas` + `redraw()` (layout recomputed each `draw()` from `width`/`height`); also repositions the open dropdown.
- Score counter `B:bids M:matches` drawn at the lower-right tile position.

## Patterns to Preserve
- Event-driven redraw (`noLoop()`/`redraw()`), not a frame loop.
- Pure functions derived from constants (`ROWS` computed from `FILES.length * 2 / COLS`).
- Match/mismatch timeouts must capture indices (`a`, `b`) before nulling `choice1` — keep that pattern.
- Input: `touchStarted()` handles single taps on iOS; `touch-action: manipulation` kills double-tap-zoom delay.
- Sound restart: `pause()` before `currentTime = 0`, else Safari/WebKit may ignore the seek on a still-playing element.