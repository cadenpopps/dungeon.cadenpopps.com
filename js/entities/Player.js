Player.prototype = Object.create(Entity.prototype);

function Player(x, y, hp, str, mag, int) {
	Entity.call(this, x, y, hp, str, mag, int);

	this.currentMoveDelay = CONFIG.MAX_INPUT_DELAY;

	this.visibleSquares = [];


	this.update = function (board, mobs) {
		Entity.prototype.update.call(this, board, mobs);
		updateBoardSight(board, this.x, this.y);
		updateMobSight(board, mobs);
	}

	this.move = function (dir, board, mobs) {
		let status = Entity.prototype.move.call(this, dir, board, mobs);
		if (status == SUCCESS) {
			if (board[this.x][this.y].squareType == DOOR) {
				board[this.x][this.y].open();
				status = SUCCESS;
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

	this.attack = function(board, mobs){
		let status = 0;
		for(let m in mobs){
			let mob = mobs[m];
			if(abs(this.x - mob.x) <= 1 && abs(this.y - mob.y) <= 1 && !(mob instanceof Player)){
				Entity.prototype.attack.call(this, mob);
				status = ACTION_ATTACK;
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
