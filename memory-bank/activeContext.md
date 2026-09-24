# Active Context — SoundMemory

## Current Status
Feature-complete and accurate as of 2026-09-22.

## What's Working
- Full game loop: shuffle → click → match/mismatch → "Done!"
- Offline PWA (SW precache of all assets + 14 mp3s, skipWaiting/clientsClaim)
- Full-screen rectangular tile layout with 5% margins and pale rainbow colors, responsive on window resize (`windowResized()` → `resizeCanvas` + `redraw`, layout derived per-`draw()` from `width`/`height`)

## Recent Changes
- Tiles now have a 5% margin all around (90% of cell size) and face-down tiles use 5 cycling pale rainbow colors (`PALETTE`, `i % PALETTE.length`).
- `sw.js` cache bumped to `soundmemory-cache-v3`.
- Layout rework: rectangular tiles fill the full screen (previously square cards with padding and a reserved top title row). "Done!" renders center-screen. Text size scales with tile size.
- Memory-bank docs updated to match; added `activeContext.md` and `progress.md`.

## Open Questions / Decisions
- None pending.

## Workflow
- **Manual testing only** — the user tests changes by hand (e.g. local server + browser); do not add or run automated tests.

## Next Steps (candidates, from productContext.md gaps)
- Restart button (reuse `startGame()`)
- Move counter / timer
- Win sound
- Touch event support beyond `mousePressed`
- Fix deployed: single-tap tile response on touch devices (touchStarted + touch-action: manipulation).
