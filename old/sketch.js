var GAME_MANAGER;
const FRAMETIME = floor(1000 / 48);
const ANIMATION_TIMESCALE = FRAMETIME;
const ANIMATION_STAGES = 4;
const INPUT_RATE = ANIMATION_TIMESCALE * ANIMATION_STAGES + 30;

var staticLoop = true;
var activeLoop = false;
var interruptLoop = false;
var lastLoopTime = 0;

var inputs = [];
var inputTimeout;
var animationCounter = 0;
var animating = false;
var animationInterval = undefined;

var debug = false;

const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;
const TO_MOUSE = 4;
const MAGICAL_ATTACK = 5;
const PHYSICAL_ATTACK = 6;
const PATH_MOVE = 7;
const RIGHT_CLICK = 8;

const STATE_LEFT = [0, 1, 2, 3];
const STATE_RIGHT = [10, 11, 12, 13];
const STATE_UP = [20, 21, 22, 23];
const STATE_DOWN = [30, 31, 32, 33];
const STATE_PHYSICAL_ATTACK = [40, 41, 42, 43];

// var numFont0, numFont1, numFont2, numFont2, numFont3, numFont4, numFont5, numFont6, numFont7, numFont8, numFont9;
// var numberFont;
// var font;

// var doorSounds = [];
// var doorSqueaks = [];
// var magicSounds = [];
// var lockSounds = [];
// var monsterSounds = [];
// var playerHurtSounds = [];
// var playerWalkingSounds = [];
// var playerWalkingSoundsWood = [];
// var waterDropSounds = [];

const DUNGEON_SIZE = 45;
const ROOM_TRIES = DUNGEON_SIZE + 20;

const LOOT = 1;
const WALL = -1;
const PATH = 0;
const STAIRDOWN = -2;
const STAIRUP = -3;
const DOOR = -5;

const PLAYER_VISION_RANGE = 18;
const MOB_VISION_RANGE = 12;

const SCALE = floor(window.innerWidth / 200);
const SQUARE_SIZE = floor(10 * SCALE);
const PLAYER_SIZE = SQUARE_SIZE;
const PLAYER_WIDTH = SQUARE_SIZE / 4 * 3;
const MOB_SIZE = floor(6 * SCALE);
const OFFSET_CONST = Math.round(100 / ANIMATION_STAGES) / 100 * SQUARE_SIZE;
const DEBUG_BOARD = false;
const CHECK_CORNER_CASE = true;

WALL_TEXTURES = [];
PATH_TEXTURES = [];
var CHEST_CLOSED_TEXTURE, CHEST_OPEN_TEXTURE, DOOR_CLOSED_TEXTURE, DOOR_OPEN_TEXTURE, STAIR_UP_TEXTURE, STAIR_DOWN_TEXTURE;

PLAYER_TEXTURES = [];

function preload() {
    WALL_TEXTURES.push(loadImage('/img/textures/wall0.jpg'));
    WALL_TEXTURES.push(loadImage('/img/textures/wall1.jpg'));
    WALL_TEXTURES.push(loadImage('/img/textures/wall2.jpg'));
    WALL_TEXTURES.push(loadImage('/img/textures/wall3.jpg'));
    WALL_TEXTURES.push(loadImage('/img/textures/wall4.jpg'));
    WALL_TEXTURES.push(loadImage('/img/textures/wall5.jpg'));
    WALL_TEXTURES.push(loadImage('/img/textures/wall6.jpg'));

    PATH_TEXTURES.push(loadImage('/img/textures/path0.jpg'));
    PATH_TEXTURES.push(loadImage('/img/textures/path1.jpg'));
    PATH_TEXTURES.push(loadImage('/img/textures/path2.jpg'));
    PATH_TEXTURES.push(loadImage('/img/textures/path3.jpg'));
    PATH_TEXTURES.push(loadImage('/img/textures/path4.jpg'));
    PATH_TEXTURES.push(loadImage('/img/textures/path5.jpg'));
    PATH_TEXTURES.push(loadImage('/img/textures/path6.jpg'));

    STAIR_UP_TEXTURE = loadImage('/img/textures/stairUp.png');
    // STAIR_DOWN_TEXTURE = loadImage('/img/textures/stairDown.png');

    DOOR_OPEN_TEXTURE = loadImage('/img/textures/doorOpen.png');
    DOOR_CLOSED_TEXTURE = loadImage('/img/textures/doorClosed.jpg');

    CHEST_CLOSED_TEXTURE = loadImage('/img/textures/chestClosed.png');
    CHEST_OPEN_TEXTURE = loadImage('/img/textures/chestOpen.png');


    // skeletonSpriteSheet = loadImage('/img/sprites/skeletonSpriteSheet.png');

    playerSpriteSheet = loadImage('/img/sprites/playerSpriteSheet.png');


    // 	doorSounds.push(loadSound('data/audio/sounds/doorSound0.wav'));
    // 	doorSqueaks.push(loadSound('data/audio/sounds/doorSqueak0.wav'));
    // 	doorSqueaks.push(loadSound('data/audio/sounds/doorSqueak1.wav'));
    // 	magicSounds.push(loadSound('data/audio/sounds/fireBall0.wav'));
    // 	lockSounds.push(loadSound('data/audio/sounds/lock0.wav'));
    // 	lockSounds.push(loadSound('data/audio/sounds/lock1.wav'));
    // 	monsterSounds.push(loadSound('data/audio/sounds/monsterGrunt0.wav'));
    // 	playerHurtSounds.push(loadSound('data/audio/sounds/playerHurt0.wav'));
    // 	playerHurtSounds.push(loadSound('data/audio/sounds/playerHurt1.wav'));
    // 	playerWalkingSounds.push(loadSound('data/audio/sounds/walking0.wav'));
    // 	playerWalkingSounds.push(loadSound('data/audio/sounds/walking1.wav'));
    // 	playerWalkingSoundsWood.push(loadSound('data/audio/sounds/walkingWood0.wav'));
    // 	playerWalkingSoundsWood.push(loadSound('data/audio/sounds/walkingWood1.wav'));
    // 	// playerWalkingSounds.push(loadSound('data/audio/sounds/walking2.wav'));
    // 	// playerWalkingSounds.push(loadSound('data/audio/sounds/walking3.wav'));
    // 	waterDropSounds.push(loadSound('data/audio/sounds/waterDrop0.wav'));
    // 	waterDropSounds.push(loadSound('data/audio/sounds/waterDrop1.wav'));
    // 	waterDropSounds.push(loadSound('data/audio/sounds/waterDrop2.wav'));

    let roompools = loadJSON('/data/rooms.JSON');
    ROOMPOOL = roompools.ROOMPOOL;
    STAIRROOMPOOL = roompools.STAIRROOMPOOL;

    PLAYER_STATS = loadJSON('/data/playerStats.JSON');
    PCLASS = "rogue";
    let stats = PLAYER_STATS[PCLASS];
    PLAYER_INITIAL_STATS = [stats.bHealth, stats.bStrength, stats.bIntelligence, stats.bMagic];

    MOB_INFO = loadJSON('/data/mobInfo.JSON');
}

function initSpritesheets() {
    let scale = 256;
    //player sprites

    //left
    PLAYER_TEXTURES[0] = getCropped(playerSpriteSheet, (scale * 1), 0, (scale * 1), (scale * 1));
    PLAYER_TEXTURES[1] = getCropped(playerSpriteSheet, (scale * 1), 0, (scale * 1), (scale * 1));
    PLAYER_TEXTURES[2] = getCropped(playerSpriteSheet, (scale * 1), 0, (scale * 1), (scale * 1));
    PLAYER_TEXTURES[3] = getCropped(playerSpriteSheet, (scale * 1), 0, (scale * 1), (scale * 1));
    //right
    PLAYER_TEXTURES[10] = getCropped(playerSpriteSheet, (scale * 2), 0, (scale * 1), (scale * 1));
    PLAYER_TEXTURES[11] = getCropped(playerSpriteSheet, (scale * 2), 0, (scale * 1), (scale * 1));
    PLAYER_TEXTURES[12] = getCropped(playerSpriteSheet, (scale * 2), 0, (scale * 1), (scale * 1));
    PLAYER_TEXTURES[13] = getCropped(playerSpriteSheet, (scale * 2), 0, (scale * 1), (scale * 1));
    //up
    PLAYER_TEXTURES[20] = getCropped(playerSpriteSheet, (scale * 3), 0, (scale * 1), (scale * 1));
    PLAYER_TEXTURES[21] = getCropped(playerSpriteSheet, (scale * 3), 0, (scale * 1), (scale * 1));
    PLAYER_TEXTURES[22] = getCropped(playerSpriteSheet, (scale * 3), 0, (scale * 1), (scale * 1));
    PLAYER_TEXTURES[23] = getCropped(playerSpriteSheet, (scale * 3), 0, (scale * 1), (scale * 1));
    //down
    PLAYER_TEXTURES[30] = getCropped(playerSpriteSheet, (scale * 0), 0, (scale * 1), (scale * 1));
    PLAYER_TEXTURES[31] = getCropped(playerSpriteSheet, (scale * 0), 0, (scale * 1), (scale * 1));
    PLAYER_TEXTURES[32] = getCropped(playerSpriteSheet, (scale * 0), 0, (scale * 1), (scale * 1));
    PLAYER_TEXTURES[33] = getCropped(playerSpriteSheet, (scale * 0), 0, (scale * 1), (scale * 1));


    //skele sprites
    // skeletonTextureLeft = skeletonSpriteSheet.getCropped(playerTextures, 0, 0, 128, 128);
    // skeletonTextureRight = skeletonSpriteSheet.getCropped(playerTextures, 128, 0, 128, 128);
    // skeletonTextureFront = skeletonSpriteSheet.getCropped(playerTextures, 256, 0, 128, 128);
    // skeletonTextureBack = skeletonSpriteSheet.getCropped(playerTextures, (scale*3), 0, 128, 128);
}

function setup() {


    createCanvas(windowWidth, windowHeight, "game");

    initSpritesheets();

    listen("keydown");
    listen("keyup");
    listen("mouseclicked");
    $(window).focusout(unFocus);
    $(window).contextmenu(function (e) {
        e.preventDefault();
        updateMouseCoords(e);
        mouseClicked(1);
        return false;
    });

    console.log(FRAMETIME);

    noStroke();
    init();
}

//make shadow pngs and implement
//auto open doors and loot
//implement new UI screens for inv, help, inv full?, settings?

function draw() {
    if (lastLoopTime + FRAMETIME <= millis()) {
        lastLoopTime = millis();
        background(15, 10, 10);
        if (interruptLoop) {
            console.log(millis());
            activeLoop = true;
            interruptLoop = false;
            animationCounter = 0;
            GAME_MANAGER.draw(animationCounter);
        }
        else if (activeLoop) {
            animationCounter++;
            GAME_MANAGER.draw(animationCounter);
        }
        else {
            // console.log("idle" + animationCounter);
            animationCounter++;
            GAME_MANAGER.draw(animationCounter);
        }
        GAME_MANAGER.draw(animationCounter);
        if (animationCounter == ANIMATION_STAGES) {
            if (inputs.length == 0) {
                activeLoop = false;
            }
            animationCounter = 0;
        }
        // if (animationInterval === undefined) {
        //     animationInterval = setInterval(function () {
        //         animationCounter++;
        //         draw();
        //     }, FRAMETIME);
        // }
        // if (animationCounter == ANIMATION_STAGES) {
        //     animationCounter = 0;
        //     animating = false;
        //     clearInterval(animationInterval);
        //     animationInterval = undefined;
        //     loop();
        // }
    }
    if (debug && frameCount % 60 == 0) {
        console.log(inputs);
    }
}
function init() {

    console.log("Input rate: " + INPUT_RATE);

    var startTime = millis();
    GAME_MANAGER = new GameManager();
    console.log("It took " + (floor(millis() - startTime)) + " milliseconds to load this dungeon.");
    $("#welcome").css("display", "none");
    loop();

    // while (gameManager.getPlayer().findPath(gameManager.getCurrentFloor().getSquare(gameManager.getCurrentFloor().getStairDown().x, gameManager.getCurrentFloor().getStairDown().y)) == false) {
    // 	console.log("dungeongen failed");
    // 	gameManager = new GameManager();
    // }

    // for (let f of dungeon.floors) {
    //    if (f.floorNum < f. - 1 && !findPath(dungeon.floors.get(f.floorNum).stairDown, dungeon.floors.get(f.floorNum).stairUp, dungeon.floors.get(f.floorNum).board)) {
    //        startUp();
    //    }
    //    if (f.floorNum <  - 1) {
    //       while (!player.findPath(f.floorNum, f.stairUp, f.stairDown)) {
    //          console.log("\n\n\n\nnew dungeon");
    //          newDungeon();
    //       }
    //    }
    //    for (var i = 0; i < dimension; i++) {
    //       for (var j = 0; j < dimension; j++) {
    //          if (dungeon.floors[f.floorNum].board[i][j].squareType == -1) {
    //             dungeon.floors[f.floorNum].board[i][j].texture = WALL_TEXTURES[(floor(random(WALL_TEXTURES.length)))];
    //          }
    //          if (dungeon.floors[f.floorNum].board[i][j].squareType0) {
    //             dungeon.floors[f.floorNum].board[i][j].texture = PATH_TEXTURES[(floor(random(PATH_TEXTURES.length)))];
    //          }
    //       }
    //    }
    // }
}

function checkInput() {

    // var success = false;

    // if (!loading && lastMoveTime + MOVECOOLDOWN <= millis()) {
    // 	if (keyIsDown(87) || keyIsDown(38)) {
    // 		success = gameManager.getPlayer().move('u');
    // 	}
    // 	if (!success && (keyIsDown(65) || keyIsDown(37))) {
    // 		success = gameManager.getPlayer().move('l');
    // 	}
    // 	if (!success && (keyIsDown(83) || keyIsDown(40))) {
    // 		success = gameManager.getPlayer().move('d');
    // 	}
    // 	if (!success && (keyIsDown(68) || keyIsDown(39))) {
    // 		success = gameManager.getPlayer().move('r');
    // 	}
    // }
    // if (success) {
    // 	lastMoveTime = millis();
    // }

    // if (success) {
    // 	clearTimeout(userInputChecker);
    // 	userInputChecker = setTimeout(checkInput, 100);
    // }

    return false;

}

function input() {
    if (inputs.length > 0) {
        if (!activeLoop) {
            interruptLoop = true;
            lastLoopTime = 0;
            console.log(millis());
        }
        var i = -1;
        var success = false;
        //find the first successful move
        while (!success && i < inputs.length - 1) {
            i++;
            success = GAME_MANAGER.handleInput(convertInput(inputs[i]));
        }
        //move has occurred
        if (success) {
            //send previous direction to back of list
            if (inputs.length > 1) {
                var f = inputs.splice(0, 1)[0];
                inputs.push(f);
            }
            //move again asap
            inputTimeout = setTimeout(function () {
                input();
            }, INPUT_RATE);
        }
        //move hasnt occurred
        else {
            if (inputs[0] == TO_MOUSE) {
                inputs.splice(0, 1);
            }
            // stop moving
            inputTimeout = undefined;
        }
    }
    //no moves
    else {
        //stop moving
        inputTimeout = undefined;
    }
}

function convertInput(i) {
    if (i == "w") {
        return UP;
    }
    if (i == "a") {
        return LEFT;
    }
    if (i == "s") {
        return DOWN;
    }
    if (i == "d") {
        return RIGHT;
    }
    if (i == "e") {
        return PHYSICAL_ATTACK;
    }
    if (i == "r") {
        return MAGICAL_ATTACK;
    }
    if (i == TO_MOUSE) {
        return TO_MOUSE;
    }
    if (i == "p") {
        debug = !debug;
    }
}

function keyDown(event) {
    if (!event.repeat) {
        inputs.unshift(event.key.toLocaleLowerCase());
        if (inputs.length < 2) {
            clearTimeout(inputTimeout);
            input();
        }
        else if (typeof inputTimeout === "undefined") {
            input();
        }

    }
}

function keyUp(event) {
    while (inputs.includes(event.key.toLocaleLowerCase())) {
        inputs.splice(inputs.indexOf(event.key.toLocaleLowerCase()), 1);
    }
}

function mouseClicked(b) {
    if (b == 1) {
        GAME_MANAGER.handleInput(RIGHT_CLICK);
    }
    else {
        inputs.unshift(TO_MOUSE);
        if (typeof inputTimeout === "undefined") {
            input();
        }
    }
}

function unFocus() {
    inputs = [];
    clearTimeout(inputTimeout);
}

function windowResized() {
    resizeCanvas($(game).width, $(game).height);
}
