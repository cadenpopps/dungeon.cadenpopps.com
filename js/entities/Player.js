Player.prototype = Object.create(Entity.prototype);

function Player(pos, hp, str, mag, int) {
	Entity.call(this, pos, hp, str, mag, int);

	this.currentMoveDelay = CONFIG.MAX_INPUT_DELAY;

	this.visibleSquares = [];


	this.update = function (board, mobs) {
		updateBoardSight(board, this.x, this.y);
		updateMobSight(board, mobs);
	}

	this.move = function (dir, board, mobs) {
		let status = Entity.prototype.move.call(this, dir, board, mobs);
		if (status == SUCCESS) {
			if (board[this.x][this.y].squareType == DOOR) {
				board[this.x][this.y].open();
				status = DOOR;
			}
			else if (board[this.x][this.y] instanceof StairSquare) {
				if (board[this.x][this.y].down) {
					status = STAIR_DOWN;
				}
				else if (board[this.x][this.y].up) {
					status = STAIR_UP;
				}
			}
		}
		return status;
	}

	let updateBoardSight = function (board, x, y) {
		for (var i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
			for (var j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
				board[i][j].visible = false;
			}
		}
		playerSight(board, x, y);
	}


	let updateMobSight = function (board, mobs) {
		for (let m in mobs) {
			let mob = mobs[m];
			mob.visible = board[mob.x][mob.y].visible;
		}
	}
}
