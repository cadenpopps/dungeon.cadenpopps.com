const DEBUG = true;
const DEBUG_BOARD = false;
const SHOW_TEXTURES = true;

const CONFIG = {};
const PLAYER_CONFIG = {};

const ADD_KEY = 0, REMOVE_KEY = 1, MOUSE_CLICK = 2;
// const MOUSE = 1;

const OPEN = 0, CLOSED = 1;

var MUSIC = [];
var TEXTURES = [];
var IMAGES = [];

function preload() {
	let settings = loadJSON('/config/config.json');
	for (let s of settings) {
		CONFIG[s.name] = s.val;
	}

	let playerConfig = loadJSON('/config/player_config.json');
	for (let s in playerConfig) {
		PLAYER_CONFIG[s] = playerConfig[s];
	}

	let pools = loadJSON('/config/roompool.json');
	CONFIG.ROOMPOOL = pools[0];
	CONFIG.STAIRROOMPOOL = pools[1];

	MUSIC.push(loadAudio('/audio/music/001_0100.wav'));
	MUSIC.push(loadAudio('/audio/music/002_0001.wav'));
	MUSIC.push(loadAudio('/audio/music/003_0101.wav'));
	MUSIC.push(loadAudio('/audio/music/004_1101.wav'));
	MUSIC.push(loadAudio('/audio/music/005_1121.wav'));
	MUSIC.push(loadAudio('/audio/music/006_2121.wav'));
	MUSIC.push(loadAudio('/audio/music/007_0200.wav'));
	MUSIC.push(loadAudio('/audio/music/008_0201.wav'));
	MUSIC.push(loadAudio('/audio/music/009_1201.wav'));
	MUSIC.push(loadAudio('/audio/music/010_1221.wav'));

	TEXTURES[FLOOR] = loadImage('/img/textures/floor0.jpg');
	TEXTURES[WALL] = loadImage('/img/textures/wall0.jpg');
	TEXTURES[DOOR] = [];
	TEXTURES[DOOR][OPEN] = loadImage('/img/textures/doorOpen.png');
	TEXTURES[DOOR][CLOSED] = loadImage('/img/textures/doorClosed.jpg');
	TEXTURES[LOOT] = [];
	TEXTURES[LOOT][OPEN] = loadImage('/img/textures/lootOpen.png');
	TEXTURES[LOOT][CLOSED] = loadImage('/img/textures/lootClosed.png');
	TEXTURES[STAIR_UP] = loadImage('/img/textures/stairUp.png');
	TEXTURES[STAIR_DOWN] = loadImage('/img/textures/stairDown.png');

	IMAGES[HEART] = loadImage('/img/icons/heart.png');


	for(let i = 0; i <= light_max; i++){
		light_level_to_shadow[i] = "rgba(" + shadow_red + "," + shadow_green + "," + shadow_blue + "," + (constrainHigh(floor(shadow_intensity * (light_max - i) * 100) / 100, shadow_max)) + ")";
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	let ticksPerSecond = 50;
	let e = new PoppsEngine(ticksPerSecond);
	document.addEventListener('contextmenu', function () {
		gm.clearInputs()
	});
}

function keyDown() { } 
function keyUp() { }
