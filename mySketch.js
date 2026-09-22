// SoundMemory — a sound memory game
// Heiko Gölzer 2026

// Sound files: 14 sounds, 2 copies each = 28 cards
const FILES = [
	'Basso', 'Blow', 'Bottle', 'Frog', 'Funk', 'Glass', 'Hero', 'Morse',
	'Ping', 'Pop', 'Purr', 'Sosumi', 'Submarine', 'Tink'
];

const COLS = 4;
const ROWS = FILES.length * 2 / COLS; // 7

// 5 pale rainbow colors, cycled across tiles
const PALETTE = [
	[255, 205, 205], // pale red
	[255, 235, 200], // pale yellow
	[205, 255, 205], // pale green
	[205, 225, 255], // pale blue
	[230, 205, 255]  // pale purple
];

let sounds = {};      // name -> Audio
let mapping = [];     // card index -> sound name
let state = [];       // card index -> 'hidden' | 'up' | 'done'
let choice1 = null;   // first chosen card index
let locked = false;   // true while waiting after a mismatch

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	textAlign(CENTER, CENTER);
	for (let name of FILES) {
		sounds[name] = new Audio('sounds/' + name + '.mp3');
	}
	startGame();
	noLoop();
}

function startGame() {
	// Shuffle: each sound twice, like indices.removeAt(indices.size.rand) in the .scd
	mapping = [];
	for (let name of FILES) mapping.push(name, name);
	shuffle(mapping, true);
	state = Array(mapping.length).fill('hidden');
	choice1 = null;
	locked = false;
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

		if (state[i] === 'done') {
			fill(0, 200, 0); // green: matched
		} else if (state[i] === 'up') {
			fill(200, 0, 0); // red: current choice
		} else {
			fill(...PALETTE[i % PALETTE.length]); // pale rainbow, cycling
		}
		stroke(0);
		rect(x, y, tw, th);

		if (state[i] !== 'hidden') {
			fill(0);
			noStroke();
			text(mapping[i], x, y, cw * 0.9, ch * 0.9);
		}
	}

	if (isGameOver()) {
		fill(0);
		textSize(min(width, height) / 12);
		text('Done!', width / 2, height / 2);
	}
}

function mousePressed() {
	if (locked) return;
	let i = cardAt(mouseX, mouseY);
	if (i === null || state[i] !== 'hidden') return;

	sounds[mapping[i]].play();
	state[i] = 'up';

	if (choice1 === null) {
		choice1 = i;
	} else if (mapping[choice1] === mapping[i]) {
		// Match
		state[choice1] = 'done';
		state[i] = 'done';
		choice1 = null;
	} else {
		// Mismatch: show both briefly, then hide again
		locked = true;
		let a = choice1, b = i;
		choice1 = null;
		setTimeout(() => {
			state[a] = 'hidden';
			state[b] = 'hidden';
			locked = false;
			redraw();
		}, 1500);
	}
	redraw();
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
	redraw();
}
