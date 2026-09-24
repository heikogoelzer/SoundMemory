# Progress — SoundMemory

## Milestones
- [x] SuperCollider prototype (`SoundMemory_dev/Memory.scd`) — original game concept
- [x] Sound assets prepared: aiff → wav → mp3 (alert, impact, birds banks)
- [x] Web port: 4×7 grid, shuffle, match/mismatch logic, win state (`mySketch.js`)
- [x] PWA: `manifest.json`, `apple-touch-icon.png`, `sw.js` with full precache
- [x] memory-bank core docs: projectbrief, productContext, systemPatterns, techContext
- [x] Three sound banks with hidden selector (lower-right tile triple-tap)

## Current State
Stable and feature-complete per the project brief. No known bugs.

## Recent Work
- [x] Code health survey → `CODE_HEALTH_REPORT.md` (12 findings + strengths)
- [x] Code health fixes: viewport/theme-color/mobile-web-app-capable metas, canvas aria-label, `s.play().catch()`, removed dead code, hoisted bid logic, `MATCH_MS`/`TICK_MS` constants, `PALETTE_DARK` indentation, manifest precache, per-asset SW caching, cache bumped to `soundmemory-cache-v1`
- [x] 5% tile margins + 5 cycling pale rainbow face-down colors (`PALETTE`)
- [x] Full-screen rectangular tile layout (fills entire screen, adjusts on window resize)
- [x] 500 ms match celebration (`PALETTE_MID` rainbow flash) and 500 ms mismatch re-hide
- [x] Score counter `B:bids M:matches` at the lower-right tile position
- [x] Renamed `sounds/` → `sounds_alert/`
- [x] Added `sounds_impact/` (Kenney CC0, credited in README)
- [x] Added `sounds_birds/` (mixkit, credited in README)
- [x] `SOUND_BANKS` map + `loadBank()`; hidden bank selector (triple-tap lower-right tile, 600 ms window, re-arms each game)
- [x] `sw.js` precache extended to all 42 MP3s; cache `soundmemory-cache-v1` (current)
- [x] README + memory-bank updated to current state

## Backlog (not started)
- [ ] Restart button (reuse `startGame()`)
- [ ] Move counter / timer
- [ ] Win sound
- [ ] Real 512×512 maskable icon (manifest currently declares 512 on a 180 file)
- [ ] Fix long-name text overflow on narrow tiles (text now scales, but may still clip)

## Deployment Notes
- Serve from domain root (SW paths are root-relative) or rewrite `sw.js` + registration path
- Bump `CACHE_NAME` on any asset change

## Workflow
- Manual testing only — no automated tests; user verifies by hand (local server + browser).

## Changelog
- **2026-09-22** — Single-tap touch fix: `touchStarted()` calls `mousePressed()` and returns false; `canvas { touch-action: manipulation; }` in style.css.
- **2026-09-24** — Three sound banks (alert/impact/birds), hidden bank selector via lower-right tile triple-tap, score counter, 500 ms animations, README + memory-bank docs updated.
- **2026-09-24** — Code health fixes: viewport metas, canvas aria-label, `s.play().catch()`, dead code removal, hoisted bid logic, constants, manifest precache, per-asset SW caching, cache `soundmemory-cache-v1`.

Note: earlier cache-version mentions (v3/v4) were inaccurate; `sw.js` currently ships `soundmemory-cache-v1`.
