
const DEBUG = true;
const DEBUG_BOARD = false;
const SHOW_TEXTURES = true;

const CONFIG = {};

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

	CONFIG.DEFAULT_ANIMATIONS = {};
	CONFIG.DEFAULT_ANIMATIONS[animation_idle] = [
		{ox: 0, oy: 0, sprite: undefined},
		{ox: 0, oy: 0, sprite: undefined}, 
		{ox: 0, oy: 0, sprite: undefined}, 
		{ox: 0, oy: 0, sprite: undefined}
	];
	CONFIG.DEFAULT_ANIMATIONS[animation_move_up] = [
		{ox: 0, oy: .65, sprite: undefined}, 
		{ox: 0, oy: .45,  sprite: undefined}, 
		{ox: 0, oy: .25, sprite: undefined}, 
		{ox: 0, oy: .10,   sprite: undefined}
	];
	CONFIG.DEFAULT_ANIMATIONS[animation_move_right] = [
		{ox: -.65, oy: 0, sprite: undefined}, 
		{ox: -.45, oy: 0, sprite: undefined}, 
		{ox: -.25, oy: 0, sprite: undefined}, 
		{ox: -.10, oy: 0, sprite: undefined}
	];
	CONFIG.DEFAULT_ANIMATIONS[animation_move_down] = [
		{ox: 0, oy: -.65, sprite: undefined}, 
		{ox: 0, oy: -.45, sprite: undefined}, 
		{ox: 0, oy: -.25, sprite: undefined}, 
		{ox: 0, oy: -.10, sprite: undefined}
	];
	CONFIG.DEFAULT_ANIMATIONS[animation_move_left] = [
		{ox: .65, oy: 0, sprite: undefined}, 
		{ox: .45, oy: 0, sprite: undefined}, 
		{ox: .25, oy: 0, sprite: undefined}, 
		{ox: .10, oy: 0, sprite: undefined}
	];
	CONFIG.DEFAULT_ANIMATIONS[animation_roll_up] = [
		{ox: 0, oy: 1.3, sprite: undefined}, 
		{ox: 0, oy: .9, sprite: undefined}, 
		{ox: 0, oy: .5, sprite: undefined}, 
		{ox: 0, oy: .2, sprite: undefined}
	];
	CONFIG.DEFAULT_ANIMATIONS[animation_roll_right] = [
		{ox: -1.3, oy: 0, sprite: undefined}, 
		{ox: -.9, oy: 0, sprite: undefined}, 
		{ox: -.5, oy: 0, sprite: undefined}, 
		{ox: -.2, oy: 0, sprite: undefined}
	];
	CONFIG.DEFAULT_ANIMATIONS[animation_roll_down] = [
		{ox: 0, oy: -1.3, sprite: undefined}, 
		{ox: 0, oy: -.9, sprite: undefined}, 
		{ox: 0, oy: -.5, sprite: undefined}, 
		{ox: 0, oy: -.2, sprite: undefined}
	];
	CONFIG.DEFAULT_ANIMATIONS[animation_roll_left] = [
		{ox: 1.3, oy: 0, sprite: undefined}, 
		{ox: .9, oy: 0, sprite: undefined}, 
		{ox: .5, oy: 0, sprite: undefined}, 
		{ox: .2, oy: 0, sprite: undefined}
	];

	window.FLOOR = CONFIG.SQUARE_CONSTANTS.floor;
	window.WALL = CONFIG.SQUARE_CONSTANTS.wall;
	window.DOOR = CONFIG.SQUARE_CONSTANTS.door;
	window.STAIR_DOWN = CONFIG.SQUARE_CONSTANTS.stairDown;
	window.STAIR_UP = CONFIG.SQUARE_CONSTANTS.stairUp;
	window.STAIR = CONFIG.SQUARE_CONSTANTS.stair;
	window.LOOT = CONFIG.SQUARE_CONSTANTS.loot;
	window.PILLAR = CONFIG.SQUARE_CONSTANTS.pillar;

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
	TEXTURES[STAIR] = [];
	TEXTURES[STAIR][UP] = loadImage('/img/textures/stairUp.png');
	TEXTURES[STAIR][DOWN] = loadImage('/img/textures/stairDown.png');

	IMAGES[HEART] = loadImage('/img/icons/healthIndicator.png');
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
