


const DEBUG = true;
const DEBUG_BOARD = false;
const DEBUG_SIGHT = false;

const CONFIG = {};

const ADD_KEY = 0, REMOVE_KEY = 1, MOUSE_CLICK = 2;;
// const MOUSE = 1;

var gm;

function preload() {
    let settings = loadJSON('/config/config.json');
    for (let s of settings) {
        CONFIG[s.name] = s.val;
    }
    window.FLOOR = CONFIG.SQUARE_CONSTANTS.floor;
    window.WALL = CONFIG.SQUARE_CONSTANTS.wall;
    window.DOOR = CONFIG.SQUARE_CONSTANTS.door;
    window.STAIRDOWN = CONFIG.SQUARE_CONSTANTS.stairDown;
    window.STAIRUP = CONFIG.SQUARE_CONSTANTS.stairUp;
    window.LOOT = CONFIG.SQUARE_CONSTANTS.loot;
    window.PILLAR = CONFIG.SQUARE_CONSTANTS.pillar;

    let pools = loadJSON('/config/roompool.json');
    CONFIG.ROOMPOOL = pools[0];
    CONFIG.STAIRROOMPOOL = pools[1];
}

function setup() {

    createCanvas(windowWidth, windowHeight);

    init();
    loop();
}

function init() {
    gm = new GameManager();
}

function draw() {
    background(10, 10, 10);
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