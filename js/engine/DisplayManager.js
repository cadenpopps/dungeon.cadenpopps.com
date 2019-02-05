
function DisplayManager(square_size, vision, animation_stages) {

    let SQUARE_SIZE = square_size;
    let HALF_SQUARE_SIZE = SQUARE_SIZE / 2;

    let PLAYER_SIZE = floor(SQUARE_SIZE * .6);
    let HALF_PLAYER_SIZE = PLAYER_SIZE / 2;
    let PLAYER_VISION_RANGE = vision;

    let MOB_SIZE = SQUARE_SIZE * .70;
    let MOB_OFFSET = (SQUARE_SIZE - MOB_SIZE) / 2;


    let BOB_OFFSET_X = [0, SQUARE_SIZE / 20, 0, -SQUARE_SIZE / 20];
    let BOB_OFFSET_Y = [0, SQUARE_SIZE / 30, 0, SQUARE_SIZE / 30];

    let MOVE_OFFSET = [3 * SQUARE_SIZE / 4, SQUARE_SIZE / 2, SQUARE_SIZE / 4, 0];

    let CENTER_X = floor(width / 2);
    let CENTER_Y = floor(height / 2);

    let PLAYER_OFF_X = CENTER_X - HALF_PLAYER_SIZE;
    let PLAYER_OFF_Y = CENTER_Y - HALF_PLAYER_SIZE;

    let DUNGEON_OFFSET_X = CENTER_X - HALF_SQUARE_SIZE;
    let DUNGEON_OFFSET_Y = CENTER_Y - HALF_SQUARE_SIZE;

    this._display = function (board, player, mobs) {
        if (DEBUG_BOARD) {
            drawDungeonDebug(board, player);
        }
        else {
            drawDungeon(board, player);
            drawMobs(mobs, player);
            drawPlayer(player);
        }
    }

    let drawPlayer = function (player) {
        //TEMPORARY UNTIL WE HAVE ANIMATIONS
        stroke(0, 0, 0);
        fill(255, 20, 20);

        let xoff = 0;
        let yoff = 0;
        if (player.animation == IDLE) {
            xoff = BOB_OFFSET_X[player.animationCounter];
            yoff = BOB_OFFSET_Y[player.animationCounter];
        }

        rect(PLAYER_OFF_X + xoff, PLAYER_OFF_Y + yoff, PLAYER_SIZE, PLAYER_SIZE);
        strokeRect(PLAYER_OFF_X + xoff, PLAYER_OFF_Y + yoff, PLAYER_SIZE, PLAYER_SIZE);


        //CODE FOR WHEN WE HAVE SPRITES
        // image(player.sprite, PLAYER_OFF_X, PLAYER_OFF_Y, PLAYER_SIZE, PLAYER_SIZE);
    }

    let drawMobs = function (mobs, player) {

        //TEMPORARY UNTIL WE HAVE ANIMATIONS
        stroke(0, 0, 0);
        fill(0, 255, 0);
        for (let m in mobs) {
            let mob = mobs[m];
            if (mob instanceof Player) continue;
            let xoff = 0;
            let yoff = 0;
            if (mob.animation == IDLE) {
                xoff = BOB_OFFSET_X[mob.animationCounter];
                yoff = BOB_OFFSET_Y[mob.animationCounter];
            }

            rect(DUNGEON_OFFSET_X - ((player.x - mob.x) * SQUARE_SIZE) + MOB_OFFSET + xoff, DUNGEON_OFFSET_Y - ((player.y - mob.y) * SQUARE_SIZE) + MOB_OFFSET + yoff, MOB_SIZE, MOB_SIZE);
            strokeRect(DUNGEON_OFFSET_X - ((player.x - mob.x) * SQUARE_SIZE) + MOB_OFFSET + xoff, DUNGEON_OFFSET_Y - ((player.y - mob.y) * SQUARE_SIZE) + MOB_OFFSET + yoff, MOB_SIZE, MOB_SIZE);
        }


        //CODE FOR WHEN WE HAVE SPRITES
        // for (let m of mobs) {
        //     image(m.sprite, DUNGEON_OFFSET_X - ((player.x - m.x) * SQUARE_SIZE) + MOB_OFFSET, DUNGEON_OFFSET_Y - ((player.y - m.y) * SQUARE_SIZE) + MOB_OFFSET, MOB_SIZE, MOB_SIZE);
        // }
    }

    let drawDungeon = function (board, player) {
        fixOffset(player);
        for (let x = constrainLow(0, player.x - PLAYER_VISION_RANGE); x < constrainHigh(CONFIG.DUNGEON_SIZE, player.x + PLAYER_VISION_RANGE); x++) {
            for (let y = constrainLow(0, player.y - PLAYER_VISION_RANGE); y < constrainHigh(CONFIG.DUNGEON_SIZE, player.y + PLAYER_VISION_RANGE); y++) {
                if (board[x][y].visible || board[x][y].discovered) {
                    //TEMPORARY UNTIL WE HAVE TEXTURES
                    // let distFromPlayer = (abs(player.x))
                    let distFromPlayer = map(dist(player.x, player.y, x, y) - 2, 0, PLAYER_VISION_RANGE, 1, .1);
                    switch (board[x][y].squareType) {
                        case WALL:
                            fill(45, 45, 45, distFromPlayer);
                            break;
                        case FLOOR:
                            fill(220, 220, 220, distFromPlayer);
                            if (board[x][y].loot) {
                                fill(255, 199, 0, distFromPlayer);
                            }
                            break;
                        case DOOR:
                            fill(90, 50, 30, distFromPlayer);
                            if (!board[x][y].opened) {
                                fill(120, 80, 60, distFromPlayer);
                            }
                            break;
                        case STAIR_UP:
                            fill(71, 100, 193, distFromPlayer);
                            break;
                        case STAIR_DOWN:
                            fill(72, 52, 173, distFromPlayer);
                            break;
                        default:
                            fill(255, 0, 0, distFromPlayer);
                            break;
                    }
                    rect(DUNGEON_OFFSET_X - ((player.x - x) * SQUARE_SIZE), DUNGEON_OFFSET_Y - ((player.y - y) * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
                    if (!board[x][y].visible && board[x][y].discovered) {
                        fill(0, 0, 0, .6);
                        rect(DUNGEON_OFFSET_X - ((player.x - x) * SQUARE_SIZE), DUNGEON_OFFSET_Y - ((player.y - y) * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
                    }

                    //CODE FOR WHEN WE HAVE TEXTURES
                    // image(board[x][y].texture, DUNGEON_OFFSET_X - ((player.x - x) * SQUARE_SIZE), DUNGEON_OFFSET_Y - ((player.y - y) * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
                }
            }
        }
    }

    let fixOffset = function (player) {
        let offx = CENTER_X - HALF_SQUARE_SIZE;
        let offy = CENTER_Y - HALF_SQUARE_SIZE;

        if (player.animation < NUMBER_MOVES) {
            switch (player.animation) {
                case UP:
                    offy -= MOVE_OFFSET[player.animationCounter];
                    break;
                case RIGHT:
                    offx += MOVE_OFFSET[player.animationCounter];
                    break;
                case DOWN:
                    offy += MOVE_OFFSET[player.animationCounter];
                    break;
                case LEFT:
                    offx -= MOVE_OFFSET[player.animationCounter];
                    break;
                default:
                    break;
            }
        }
        DUNGEON_OFFSET_X = floor(offx);
        DUNGEON_OFFSET_Y = floor(offy);
    }

    let drawDungeonDebug = function (board, player) {
        SQUARE_SIZE = floor((height - 200) / CONFIG.DUNGEON_SIZE);
        PLAYER_SIZE = SQUARE_SIZE * .8;
        CONFIG.MAX_MOVE_DELAY = 10;
        PLAYER_OFFSET = (SQUARE_SIZE - PLAYER_SIZE) / 2;
        for (let i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
            for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
                switch (board[i][j].squareType) {
                    case WALL:
                        fill(45, 45, 45);
                        break;
                    case FLOOR:
                        fill(220, 220, 220);
                        break;
                    case LOOT:
                        fill(229, 90, 4);
                        break;
                    case DOOR:
                        fill(120, 80, 60);
                        break;
                    case STAIR_UP:
                        fill(71, 100, 193);
                        break;
                    case STAIR_DOWN:
                        fill(72, 52, 173);
                        break;
                    default:
                        fill(255, 0, 0);
                        break;
                }
                rect(100 + (i * SQUARE_SIZE), 100 + (j * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
            }
        }
        fill(255, 255, 0);
        rect(100 + (player.x * SQUARE_SIZE) + PLAYER_OFFSET, 100 + (player.y * SQUARE_SIZE) + PLAYER_OFFSET, PLAYER_SIZE, PLAYER_SIZE);
    }

    this.levelChange = function () {
        $("#overlay").css("transition-duration", (CONFIG.LEVEL_CHANGE_ANIMATION_TIME / 4000) + "s");
        $("#overlay").css("opacity", 1);
        setTimeout(() => {
            $("#overlay").css("opacity", 0);
        }, CONFIG.LEVEL_CHANGE_ANIMATION_TIME / 2);
    }
}