# Active Context — SoundMemory

## Current Status
Feature-complete and accurate as of 2026-09-24.

## What's Working
- Full game loop: shuffle → click → match/mismatch → "Done!"
- Offline PWA (SW precache of all assets + 42 mp3s across three banks, skipWaiting/clientsClaim)
- Full-screen rectangular tile layout with 5% margins and pale rainbow colors, responsive on window resize (`windowResized()` → `resizeCanvas` + `redraw`, layout derived per-`draw()` from `width`/`height`)

## Recent Changes
- Tiles now have a 5% margin all around (90% of cell size) and face-down tiles use 5 cycling pale rainbow colors (`PALETTE`, `i % PALETTE.length`).
- `sw.js` cache currently `soundmemory-cache-v0`.
- Layout rework: rectangular tiles fill the full screen (previously square cards with padding and a reserved top title row). "Done!" renders center-screen. Text size scales with tile size.
- Memory-bank docs updated to match; added `activeContext.md` and `progress.md`.
- Touch: `touchStarted()` delegates to `mousePressed()` and returns false; `canvas { touch-action: manipulation; }` in style.css (single-tap iOS support, no double-tap zoom).

## Open Questions / Decisions
- None pending.

## Workflow
- **Manual testing only** — the user tests changes by hand (e.g. local server + browser); do not add or run automated tests.

## Next Steps (candidates, from productContext.md gaps)
- Restart button (reuse `startGame()`)
- Move counter / timer
- Win sound
