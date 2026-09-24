# Product Context — SoundMemory

## Why This Project Exists
A web-portable version of the author's SuperCollider memory game — playable anywhere as an installable PWA, offline included, with no dependencies beyond p5.js from a CDN.

## Player Experience
- Full-screen rectangular tile grid; every pixel is a card — minimal, distraction-free.
- The *audio* is the memory challenge: the card's sound name only appears once revealed.
- Immediate audio feedback on every click (chosen card's sound plays).
- Clear color language: pale rainbow = hidden, saturated rainbow = current choice, mid-rainbow flash = match celebration, vanished = done.
- Score counter (`B:bids M:matches`) in the lower-right tile position.
- "Done!" banner on completion.
- Three sound banks (Alert / Impact / Bird), switchable via a hidden triple-tap gesture on the lower-right tile before any other play.

## Known Gaps / Possible Improvements
- No restart/replay button — game ends at "Done!"; restart requires page reload.
- No "win" sound.
- Text size scales with tile size (`min(cw, ch) * 0.2`), but long names (e.g. "Submarine") can still overflow narrow tiles.
- No move counter or timer beyond the bids/matches tally.
- Hidden bank selector is a deliberate easter egg — undiscoverable without the README; acceptable per user's design choice.