
const DEBUG = true;
const DEBUG_BOARD = false;
const SHOW_TEXTURES = true;
const SUPER_POWERS = false;

const CONFIG = {};

const ADD_KEY = 0, REMOVE_KEY = 1, MOUSE_CLICK = 2;
// const MOUSE = 1;

const OPEN = 0;
const CLOSED = 1;

var gm;
var MUSIC = [];
var TEXTURES = [];

function preload() {
    let settings = loadJSON('/config/config.json');
    for (let s of settings) {
        CONFIG[s.name] = s.val;
    }

    window.FLOOR = CONFIG.SQUARE_CONSTANTS.floor;
    window.WALL = CONFIG.SQUARE_CONSTANTS.wall;
    window.DOOR = CONFIG.SQUARE_CONSTANTS.door;
    window.STAIR_DOWN = CONFIG.SQUARE_CONSTANTS.stairDown;
    window.STAIR_UP = CONFIG.SQUARE_CONSTANTS.stairUp;
    window.LOOT = CONFIG.SQUARE_CONSTANTS.loot;
    window.PILLAR = CONFIG.SQUARE_CONSTANTS.pillar;

    if (SUPER_POWERS) {
        CONFIG.MIN_MOVE_SPEED = 1;
        CONFIG.MOVE_DELAY_DECREASE = .2;
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


}

function setup() {

	createCanvas(windowWidth, windowHeight);

	init();
	loop();
}

function init() {
	gm = new GameManager();
	document.addEventListener('contextmenu', function () {
		gm.clearInputs()
	});
}

function draw() {
	background(0, 0, 0);
	gm.display();
}

function mousePressed() {
	gm.mouse(mouseX, mouseY);
}

function keyDown() {
	gm.input(ADD_KEY, key.toLowerCase());
}

function keyUp() {
	gm.input(REMOVE_KEY, key.toLowerCase());
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
