
Player.prototype = Object.create(Entity.prototype);

function Player(pos, hp, str, mag, int) {
    // this.x = 0; this.y = 0;
    Entity.call(this, pos, hp, str, mag, int);

    this.currentMoveDelay = CONFIG.MAX_INPUT_DELAY;

    this.visibleSquares = [];


    this.update = function (board, playerMoved) {
        if (playerMoved) updateSight(board, this.x, this.y);
    }

    let updateSight = function (board, x, y) {

        for (var i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
            for (var j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
                board[i][j].visible = false;
            }
        }

        if (DEBUG_SIGHT) {
            var squarecounter = 0;
        }

        // var dX = eX - sX;
        // var dY = eY - sY;
        // var incX = floor(dX / 4);
        // var incY = floor(dY / 4);
        // var numInc = 2;

        for (let i = constrainLow(x - CONFIG.PLAYER_VISION_RANGE, 0); i < constrainHigh(x + CONFIG.PLAYER_VISION_RANGE, CONFIG.DUNGEON_SIZE); i++) {
            for (let j = constrainLow(y - CONFIG.PLAYER_VISION_RANGE, 0); j < constrainHigh(y + CONFIG.PLAYER_VISION_RANGE, CONFIG.DUNGEON_SIZE); j++) {
                if (DEBUG_SIGHT) {
                    squarecounter++;
                }
                sight(i, j, x, y, board);
                // board[i][j].distanceFromPlayer = distanceToSquare(i, j);
            }
        }

        for (let i = constrainLow(x - CONFIG.PLAYER_VISION_RANGE, 1); i < constrainHigh(x + CONFIG.PLAYER_VISION_RANGE, CONFIG.DUNGEON_SIZE - 1); i++) {
            for (let j = constrainLow(y - CONFIG.PLAYER_VISION_RANGE, 1); j < constrainHigh(y + CONFIG.PLAYER_VISION_RANGE, CONFIG.DUNGEON_SIZE - 1); j++) {
                if (board[i - 1][j].squareType == FLOOR && board[i - 1][j].visible) {
                    board[i][j].discovered = true;
                    continue;
                }
                else if (board[i + 1][j].squareType == FLOOR && board[i + 1][j].visible) {
                    board[i][j].discovered = true;
                    continue;
                }
                else if (board[i][j - 1].squareType == FLOOR && board[i][j - 1].visible) {
                    board[i][j].discovered = true;
                    continue;
                }
                else if (board[i][j + 1].squareType == FLOOR && board[i][j + 1].visible) {
                    board[i][j].discovered = true;
                    continue;
                }
            }
        }


        if (DEBUG_SIGHT) {
            console.log(squarecounter);
        }
    }

    function sight(i, j, x, y, board) {
        var l = new SightLine(x, y, i, j);
        if (!l.straight) {
            l.findTouching(board);
        }
        else {
            l.findStraightTouching(board);
        }
        var blocked = false;
        for (let s of l.touching) {
            if (blocked) {
                continue;
            }
            else if (s.squareType == WALL) {
                // else if (s.squareType == WALL || (s.getSquareType() == DOOR && !s.getOpen())) {
                blocked = true;
                s.visible = true;
                s.discovered = true;
            }
            else {
                s.visible = true;
                s.discovered = true;
            }
        }
    }
}