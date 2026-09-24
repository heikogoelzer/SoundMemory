// SoundMemory — a sound memory game
// Heiko Gölzer 2026

// Sound banks: each has 14 sounds, 2 copies each = 28 cards
const SOUND_BANKS = {
	alert: {
		dir: 'sounds_alert',
		files: [
			'Basso', 'Blow', 'Bottle', 'Frog', 'Funk', 'Glass', 'Hero', 'Morse',
			'Ping', 'Pop', 'Purr', 'Sosumi', 'Submarine', 'Tink'
		]
	},
	impact: {
		dir: 'sounds_impact',
		files: [
			'footstep_concrete_004', 'footstep_snow_002', 'impactBell_heavy_000',
			'impactBell_heavy_001', 'impactGeneric_light_000', 'impactGlass_heavy_001',
			'impactGlass_medium_000', 'impactMetal_heavy_000', 'impactMetal_light_003',
			'impactPlate_heavy_001', 'impactPlate_light_003', 'impactSoft_heavy_002',
			'impactTin_medium_003', 'impactWood_medium_001'
		]
	},
	birds: {
		dir: 'sounds_birds',
		files: [
			'mixkit-big-wild-eagle-calling-70', 'mixkit-bird-screeching-in-the-jungle-2436',
			'mixkit-chickens-clucking-short-1772', 'mixkit-cockatoo-bird-squawk-2437',
			'mixkit-double-little-bird-chirp-21', 'mixkit-forest-bird-singing-1211',
			'mixkit-forest-birds-singing-1212', 'mixkit-hawk-bird-squawk-1268',
			'mixkit-little-bird-calling-chirp-23', 'mixkit-melodic-songbird-chirp-67',
			'mixkit-melodic-songbird-chirp-in-the-wild-68', 'mixkit-toy-whistler-bird-sound-18',
			'mixkit-tropical-bird-squeak-27', 'mixkit-wild-raven-bird-calling-62'
		]
	}
};

let bankName = 'alert';
let FILES = SOUND_BANKS[bankName].files;

const COLS = 4;
let ROWS = FILES.length * 2 / COLS; // 7

// 5 pale rainbow colors, cycled across tiles
const PALETTE = [
	[255, 205, 205], // pale red
	[255, 235, 200], // pale yellow
	[205, 255, 205], // pale green
	[205, 225, 255], // pale blue
	[230, 205, 255]  // pale purple
];

// Saturated/darker counterpart of each PALETTE color (same hue order)
const PALETTE_DARK = [
[200, 60, 60],   // red
[225, 170, 40],  // yellow
[60, 180, 60],   // green
[60, 110, 200],  // blue
[140, 60, 220]   // purple
];

// Mid-saturation rainbow: halfway between PALETTE and PALETTE_DARK
// (Math.round, not p5's round: this runs at parse time, before p5 globals exist)
const PALETTE_MID = PALETTE.map((c, i) =>
	c.map((v, k) => Math.round((v + PALETTE_DARK[i][k]) / 2))
);

let sounds = {};      // name -> Audio
let mapping = [];     // card index -> sound name
let state = [];       // card index -> 'hidden' | 'up' | 'done' | 'celebrate'
let choice1 = null;   // first chosen card index
let locked = false;   // true while waiting after a mismatch
let tries = 0;        // number of bids (two cards revealed)
let matches = 0;      // number of found pairs

let bankSelect = null; // sound-bank dropdown shown at start
let tapTimes = [];      // timestamps of taps on the secret tile (start only)
let secretArmed = true; // hidden triple-tap active until any other tile is played

const TAP_WINDOW = 600; // ms allowed for the triple-tap

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	textAlign(CENTER, CENTER);

	// Start as before: alert bank plays immediately. The bank selector is hidden —
	// triple-tap the lower-right tile before any other play to reveal it.
	loadBank('alert');
	noLoop();
}

// Size and center the bank dropdown; width auto-fits the longest option text.
function layoutBankSelect() {
	let fs = Math.max(16, Math.round(min(width, height) * 0.045));
	let pad = Math.max(8, Math.round(fs * 0.6));
	bankSelect.style('font-size', fs + 'px');
	bankSelect.style('padding', pad + 'px');
	bankSelect.style('text-align', 'center');
	bankSelect.style('border-radius', '12px');
	bankSelect.center();
}

function showBankSelect() {
	bankSelect = createSelect();
	bankSelect.option('Choose sound bank', '');
	bankSelect.option('Alert sounds', 'alert');
	bankSelect.option('Impact sounds', 'impact');
	bankSelect.option('Bird sounds', 'birds');
	bankSelect.changed(() => {
		let name = bankSelect.value();
		if (!name) return; // placeholder still selected
		bankSelect.remove();
		bankSelect = null;
		loadBank(name);
	});
	layoutBankSelect();
	redraw();
}

function loadBank(name) {
	bankName = name;
	FILES = SOUND_BANKS[name].files;
	ROWS = FILES.length * 2 / COLS;
	sounds = {};
	for (let f of FILES) {
		sounds[f] = new Audio(SOUND_BANKS[name].dir + '/' + f + '.mp3');
	}
	startGame();
}

function startGame() {
	// Shuffle: each sound twice, like indices.removeAt(indices.size.rand) in the .scd
	mapping = [];
	for (let name of FILES) mapping.push(name, name);
	shuffle(mapping, true);
	state = Array(mapping.length).fill('hidden');
	choice1 = null;
	locked = false;
	tries = 0;
	matches = 0;
	secretArmed = true; // re-arm the hidden bank-selector gesture
	tapTimes = [];
	redraw();
}

function draw() {
	background(200);
	// Rectangular tiles filling the full screen; sizes derive from width/height
	// each draw(), so windowResized() just needs resizeCanvas + redraw().
	let cw = width / COLS, ch = height / ROWS;
	let tw = cw * 0.9, th = ch * 0.9; // tiles with 5% margin all around
	textSize(min(cw, ch) * 0.2);

	for (let i = 0; i < mapping.length; i++) {
		let x = (i % COLS + 0.5) * cw;
		let y = (floor(i / COLS) + 0.5) * ch;

		if (state[i] === 'done') continue; // matched: tile vanishes into the background
		if (state[i] === 'celebrate') {
			// Rainbow celebration on a match: 2 mid-saturation cycles in 500 ms
			fill(...PALETTE_MID[(frameCount + i) % PALETTE_MID.length]);
		} else if (state[i] === 'up') {
			fill(...PALETTE_DARK[i % PALETTE_DARK.length]); // dark rainbow: current choice
		} else {
			fill(...PALETTE[i % PALETTE.length]); // pale rainbow, cycling
		}
		stroke(0);
		rect(x, y, tw, th);
	}

	// Legend: bids and found matches, always visible at the lower-right tile position
	fill(0);
	textSize(min(cw, ch) * 0.2);
	text('B:' + tries + ' M:' + matches, (COLS - 0.5) * cw, (ROWS - 0.5) * ch);

	if (mapping.length && isGameOver()) {
		fill(0);
		textSize(min(width, height) / 12);
		text('Done in ' + tries + ' bids!', width / 2, height / 2);
	}
}

function mousePressed() {
	if (locked) return;
	if (bankSelect) return; // bank selector open: ignore tile clicks
	let i = cardAt(mouseX, mouseY);

	// Hidden gesture: triple-tap the lower-right tile before any other play
	// reveals the sound-bank selector. Taps here are consumed silently.
	if (secretArmed && mapping.length && i === mapping.length - 1) {
		let now = Date.now();
		tapTimes = tapTimes.filter(t => now - t < TAP_WINDOW);
		tapTimes.push(now);
		if (tapTimes.length >= 3) {
			tapTimes = [];
			secretArmed = false;
			showBankSelect();
		}
		return;
	}
	secretArmed = false; // any other first click disarms the hidden gesture

	if (i === null || state[i] !== 'hidden') return;

	// Rewind so a second play of the same Audio restarts instead of being ignored.
	// pause() first: Safari/WebKit won't reliably honor currentTime on a
	// still-playing element, so play() would be a no-op on the matching click.
	let s = sounds[mapping[i]];
	s.pause();
	s.currentTime = 0;
	s.play();
	state[i] = 'up';

	if (choice1 === null) {
		choice1 = i;
	} else if (mapping[choice1] === mapping[i]) {
		// Match: celebrate with a 500 ms rainbow cycle, then vanish into the background
		tries++; // a bid = two cards revealed
		matches++;
		locked = true;
		let a = choice1, b = i;
		state[a] = 'celebrate';
		state[b] = 'celebrate';
		choice1 = null;
		let tick = setInterval(() => {
			frameCount++;
			redraw();
		}, 50); // 50 ms step x 5 colors = 250 ms per cycle -> 2 cycles in 500 ms
		setTimeout(() => {
			clearInterval(tick);
			state[a] = 'done';
			state[b] = 'done';
			locked = false;
			redraw();
		}, 500);
	} else {
		// Mismatch: show both briefly, then hide again
		tries++; // a bid = two cards revealed
		locked = true;
		let a = choice1, b = i;
		choice1 = null;
		setTimeout(() => {
			state[a] = 'hidden';
			state[b] = 'hidden';
			locked = false;
			redraw();
		}, 500);
	}
	redraw();
}

// Single-tap response on touch devices (iOS fires touch events, not clicks;
// returning false also suppresses the browser's double-tap-zoom default).
function touchStarted() {
	if (bankSelect) return true; // let iOS handle the native dropdown
	mousePressed();
	return false;
}

// Map a click position to a card index, or null
function cardAt(px, py) {
	let cw = width / COLS, ch = height / ROWS;
	let col = floor(px / cw);
	let row = floor(py / ch);
	if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
	return row * COLS + col;
}

function isGameOver() {
	return state.every(s => s === 'done');
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	if (bankSelect) layoutBankSelect();
	redraw();
}
