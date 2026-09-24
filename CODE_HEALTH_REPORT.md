# SoundMemory — Code Health Survey

Date: 2026-09-24 · Scope: `index.html`, `mySketch.js`, `style.css`, `sw.js`, `manifest.json`, `README.md`

## Recommended fixes

### High
1. **Add viewport meta to `index.html`** — without `<meta name="viewport" content="width=device-width, initial-scale=1">`, mobile browsers render at ~980px CSS width: tiles stay tiny and `windowWidth` is wrong for a touch-first PWA.
2. **Catch `s.play()` promise** (`mySketch.js` ~line 211) — `play()` rejects on autoplay/decode errors; currently an unhandled rejection. Add `.catch()`.
3. **Keyboard + ARIA accessibility** — game is pointer-only and the canvas is unlabeled. Add `role="img"`/`aria-label` to the canvas; consider keyboard input (arrows + Enter/Space) for parity.

### Medium
4. **Clear pending timers on `startGame()`** — the 500 ms `setTimeout` and 50 ms `setInterval` aren't tracked. Safe today (dropdown only appears pre-play), but any restart button will corrupt state unless IDs are stored and cleared. Also prefer a local tick counter over mutating p5's `frameCount` in the celebration interval.
5. **SW install is all-or-nothing** — one missing asset fails `cache.addAll` and blocks the new SW. Cache per-asset with `.catch()` so updates survive a single 404.
6. **Dead/redundant code** —
   - `bankName` is read once at init, never after (`loadBank` doesn't need it).
   - `textSize(...)` at `draw()` line 152 is overwritten at line 173 before any text is drawn.
7. **Hoist duplicated bid logic** — `tries++` and `choice1 = null` appear in both match and mismatch branches; move above the if/else.

### Low / polish
8. **Name magic numbers** — 500 ms match/mismatch, 50 ms celebration tick → constants.
9. **Precache `manifest.json`** in `sw.js`; the file's own comment ("no icon and manifest") is stale — it caches the icon but not the manifest.
10. **PWA meta** — add `<meta name="theme-color">` and `mobile-web-app-capable` (modern `apple-mobile-web-app-capable` replacement).
11. **CDN integrity** — SRI hash + `crossorigin` on the p5.js script tag.
12. **Indentation** — `PALETTE_DARK` block is misaligned.

## Strengths
- Event-driven `noLoop()`/`redraw()` — efficient, no wasted frames.
- Safari-safe audio restart (`pause()` → `currentTime = 0`) documented and correct.
- Layout derived from `width`/`height` each draw — resize-safe with trivial `windowResized()`.
- Minimal stack, no build step, clear state model.