# Project Brief — SoundMemory

## Core Purpose
A sound-based memory game (PWA): three selectable sound banks (alert, impact, birds), each with 14 sounds appearing twice on a 4×7 grid of 28 cards. Click a card to hear and reveal its sound; find all matching pairs to win.

## Core Requirements
- 4×7 grid of 28 rectangular tiles filling the entire screen (no reserved title row); 5% margin around each tile
- Face-down tiles cycle through 5 pale rainbow colors (`PALETTE`); current choice uses saturated `PALETTE_DARK`
- Click plays the card's sound and reveals it; matched pairs celebrate with a 500 ms rainbow flash (`PALETTE_MID`) then vanish; mismatches hide again after 500 ms
- Score counter `B:bids M:matches` pinned to the lower-right tile position
- Sound-bank selector: **triple-tap the lower-right tile before any other play** reveals a dropdown (Alert / Impact / Bird); game starts on Alert immediately
- "Done!" message when all pairs are found
- Offline-capable PWA (service worker + manifest + app icon); SW pre-caches all 42 MP3s