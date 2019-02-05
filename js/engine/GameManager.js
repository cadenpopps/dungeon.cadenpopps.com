function GameManager() {

    let SQUARE_SIZE = 36;
    let PLAYER_VISION_RANGE = CONFIG.PLAYER_VISION_RANGE;
    const ACTIVE_MOB_RANGE = PLAYER_VISION_RANGE + 2;

    const ANIMATION_STAGES = CONFIG.ANIMATION_STAGES;

    let undefined;
    let idleAnimationCounter = 0;
    let handleInputTimer = undefined;

    const dungeon = new Dungeon();
    const player = new Player([dungeon.currentStairUp().x, dungeon.currentStairUp().y]);
    let mobs = dungeon.currentLevelMobs();

    const dm = new DisplayManager(SQUARE_SIZE, PLAYER_VISION_RANGE, ANIMATION_STAGES);
    const am = new AudioManager();

    let looping = true;
    let inputs = [];
    const VALID_INPUTS = ['w', 'a', 's', 'd'];

    let aLoop = function (playerMoved) {
        idleAnimationCounter = CONFIG.IDLE_DELAY;
        updatePlayer(playerMoved);
        updateMobs();
    }

    let iLoop = function () {
        if (looping) {
            updateLevel();
            updateAnimations();
            if (inputs.length > 0) {
                if (!player.busy && handleInputTimer == undefined) {
                    handleInputTimer = setTimeout(() => {
                        handleInputs();
                        handleInputTimer = undefined;
                    }, player.currentMoveDelay);
                }
            }
        }
    }

    setInterval(() => {
        iLoop();
    }, CONFIG.IDLE_LOOP_SPEED);

    this.display = function () {
        dm._display(dungeon.currentBoard(), player, mobs);
    }

    this.input = function (type, key, mouseY) {
        if (type == ADD_KEY && inputs.length < 3 && !inputs.includes(key) && VALID_INPUTS.includes(key)) {
            inputs.unshift(key);
            if (handleInputTimer == undefined) {
                handleInputs();
            }
        }
        else if (type == REMOVE_KEY && inputs.includes(key)) {
            inputs.splice(inputs.indexOf(key), 1);
            if (inputs.length == 0) {
                clearTimeout(handleInputTimer);
                resetMoveDelay();
                handleInputTimer = undefined;
            }
        }
    }

    this.clearInputs = function () {
        inputs = [];
        resetMoveDelay();
        clearTimeout(handleInputTimer);
        handleInputTimer = undefined;
    }

    let resetMoveDelay = function () {
        player.currentMoveDelay = CONFIG.MAX_MOVE_DELAY;
    }

    let decreaseMoveDelay = function () {
        if (player.currentMoveDelay != CONFIG.MIN_MOVE_DELAY) {
            player.currentMoveDelay = floor(constrainLow(player.currentMoveDelay * CONFIG.MOVE_DELAY_DECREASE, CONFIG.MIN_MOVE_DELAY));
        }
    }

    let handleInputs = function () {
        if (typeof inputs[0] == "string") {
            let returnCode = 0;
            switch (inputs[0]) {
                case 'w':
                    returnCode = player.move(UP, dungeon.currentBoard());
                    break;
                case 'd':
                    returnCode = player.move(RIGHT, dungeon.currentBoard());
                    break;
                case 's':
                    returnCode = player.move(DOWN, dungeon.currentBoard());
                    break;
                case 'a':
                    returnCode = player.move(LEFT, dungeon.currentBoard());
                    break;
                default:
                    console.log("Invalid input");
                    break;
            }
            if (inputs.length > 1) {
                let newEnd = inputs.splice(0, 1)[0];
                inputs.push(newEnd);
            }
            if (returnCode == 1) {
                decreaseMoveDelay();
                aLoop(true);
            }
            else if (returnCode == 2) {
                // decreaseMoveDelay();
                // aLoop(true);
                downLevel();
            }
            else if (returnCode == 3) {
                upLevel();
            }
        }
        else if (typeof inputs[0] == "object") {
            inputs.splice(0, 1);
        }
    }

    let updatePlayer = function (playerMoved) {
        player.update(dungeon.currentBoard(), playerMoved);
    }

    let updateMobs = function () {
        for (let m in mobs) {
            if (!m instanceof Player && player.x - m.x < ACTIVE_MOB_RANGE && player.y - m.y < ACTIVE_MOB_RANGE) {
                m.update();
            }
        }
    }

    let updateLevel = function () {

    }

    let updateAnimations = function () {
        player.animate(idleAnimationCounter);
        for (let m in mobs) {
            if (player.x - m.x < ACTIVE_MOB_RANGE && player.y - m.y < ACTIVE_MOB_RANGE) {
                m.animate(idleAnimationCounter);
            }
        }
        idleAnimationCounter++;
        if (idleAnimationCounter >= CONFIG.IDLE_ANIMATION_SLOW_FACTOR) idleAnimationCounter = 0;
    }

    let downLevel = function () {
        if (dungeon.currentLevelIndex < dungeon.levels.length - 1) {
            dm.levelChange();
            setTimeout(() => {
                dungeon.currentLevelIndex++;
                player.x = dungeon.currentStairUp().x + 1;
                player.y = dungeon.currentStairUp().y;
                player.animation = RIGHT;
                player.animationCounter = 0;
            }, CONFIG.LEVEL_CHANGE_ANIMATION_TIME / 2);
            setTimeout(() => {
                aLoop(true);
            }, 3 * CONFIG.LEVEL_CHANGE_ANIMATION_TIME / 4);
        }
        else {
            dungeon.newLevel();
            downLevel();
        }
    }

    let upLevel = function () {
        if (dungeon.currentLevelIndex > 0) {
            dm.levelChange();
            setTimeout(() => {
                dungeon.currentLevelIndex--;
                player.x = dungeon.currentStairDown().x - 1;
                player.y = dungeon.currentStairDown().y;
                player.animation = LEFT;
                player.animationCounter = 0;
            }, CONFIG.LEVEL_CHANGE_ANIMATION_TIME / 2);
            setTimeout(() => {
                aLoop(true);
            }, 3 * CONFIG.LEVEL_CHANGE_ANIMATION_TIME / 4);
        }
    }

    let _init = (function () {
        aLoop(true);
    }());
}