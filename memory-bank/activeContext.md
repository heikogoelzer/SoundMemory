# Active Context — SoundMemory

## Current Status
Feature-complete and accurate as of 2026-09-24.

## What's Working
- Full game loop: shuffle → click → match/mismatch → "Done!"
- Offline PWA (SW precache of all assets + 42 mp3s across three banks, skipWaiting/clientsClaim)
- Full-screen rectangular tile layout with 5% margins and pale rainbow colors, responsive on window resize (`windowResized()` → `resizeCanvas` + `redraw`, layout derived per-`draw()` from `width`/`height`)

## Recent Changes
- Code health fixes (2026-09-24): viewport + `theme-color` + `mobile-web-app-capable` metas; canvas `role="img"`/`aria-label`; `s.play().catch()`; removed dead `bankName` and duplicate `textSize`; hoisted bid logic; `MATCH_MS`/`TICK_MS` constants; `PALETTE_DARK` indentation.
- `sw.js` cache currently `soundmemory-cache-v1`; now precaches `manifest.json` and caches per-asset (one 404 no longer fails the whole install).
- Tiles have a 5% margin all around (90% of cell size) and face-down tiles use 5 cycling pale rainbow colors (`PALETTE`, `i % PALETTE.length`).
- Layout rework: rectangular tiles fill the full screen (previously square cards with padding and a reserved top title row). "Done!" renders center-screen. Text size scales with tile size.
- Touch: `touchStarted()` delegates to `mousePressed()` and returns false; `canvas { touch-action: manipulation; }` in style.css (single-tap iOS support, no double-tap zoom).

## Open Questions / Decisions
- None pending.

## Workflow
- **Manual testing only** — the user tests changes by hand (e.g. local server + browser); do not add or run automated tests.

## Next Steps (candidates, from productContext.md gaps)
- Restart button (reuse `startGame()`)
- Move counter / timer
- Win sound

## Code Health Survey (2026-09-24)
- Full survey written to `CODE_HEALTH_REPORT.md` (12 findings + strengths).
- Top fixes: viewport meta, `s.play()` catch, keyboard/ARIA accessibility, timer cleanup on restart, SW per-asset caching.
- Implemented 2026-09-24: items #1, #2, #3 (aria-label only), #5, #6, #7, #8, #9, #10, #12. Skipped #11 (SRI), deferred #4 (timer cleanup until restart button).
