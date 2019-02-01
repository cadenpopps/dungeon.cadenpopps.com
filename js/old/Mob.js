function Mob(startX, startY, stats) {

	this.x = startX;
	this.y = startY;
	var state = UP[0];
	var moving = false;

	this.maxHealth = stats[0];
	this.currentHealth = this.maxHealth;
	this.strength = stats[1];
	this.magic = stats[2];
	this.intelligence = stats[3];

	this.getHealthMult = function () {
		return this.currentHealth / this.maxHealth;
	};

	this.alive = function () {
		return this.currentHealth > 0;
	}

	this.update = function (player, board) {
		if (!(abs(this.x - player.getX()) < 2 && abs(this.y - player.getY()) < 2)) {
			var s = this.getCloser(player, board);
			if (typeof s == "number") {
				return s;
			}
		}
		// else if (abs(x - player.getX()) < 2 && abs(this.y- player.getY()) < 2) {
		// 	attack();
		// }
	};

	this.getMoveStage = function () {
		return ANIMATION_STAGES - (state % 10);
	}

	this.getMoving = function () {
		return moving;
	}

	this.resetState = function () {
		state = floor(state / 10) * 10;
		moving = false;
	}

	this.move = function (dir, board) {
		var sucess = false;
		if (!moving) {
			switch (dir) {
				case UP:
					if (this.y > 0 && board[this.x][this.y - 1].currentlyWalkable()) {
						state = STATE_UP[0];
						this.y--;
						success = true;
					}
					break;
				case DOWN:
					if (this.y < DUNGEON_SIZE - 1 && board[this.x][this.y + 1].currentlyWalkable()) {
						state = STATE_DOWN[0];
						this.y++;
						success = true;
					}
					break;
				case LEFT:
					if (this.x > 0 && board[this.x - 1][this.y].currentlyWalkable()) {
						state = STATE_LEFT[0];
						this.x--;
						success = true;
					}
					break;
				case RIGHT:
					if (this.x < DUNGEON_SIZE - 1 && board[this.x + 1][this.y].currentlyWalkable()) {
						state = STATE_RIGHT[0];
						this.x++;
						success = true;
					}
					break;
			}
			if (success) {
				moving = true;
				return dir;
			}
		}
		return false;
	};

	this.getCloser = function (player, board) {
		var path = findPath(board[this.x][this.y], board[player.getX()][player.getY()], board);
		return this.move(path[path.length - 1], board);
	};

	var attack = function () {
		gameManager.getPlayer().loseHealth(strength);
	};

	this.loseHealth = function (healthLost, attType) {
		//add distance check
		if (attType == 'p') {
			if (abs(this.x - gameManager.getPlayer().getX() <= 2) && abs(this.y - gameManager.getPlayer().getY() <= 2)) {
				currentHealth -= abs(healthLost); //-armor etc
			}
		}
		else if (attType == 'm') {
			for (let s of gameManager.getPlayer().getCanSee()) {
				if (this.x == s.getX() && this.y == s.getY()) {
					currentHealth -= abs(healthLost); //-armor etc
				}
			}
		}
	};

	this.draw = function (xOff, yOff) {
		let moveOffX = -(SQUARE_SIZE - MOB_SIZE) / 2;
		let moveOffY = -(SQUARE_SIZE - MOB_SIZE) / 2;
		if (moving) {
			switch (floor(state / 10)) {
				case 0:
					moveOffX -= floor(OFFSET_CONST * this.getMoveStage());
					break;
				case 1:
					moveOffX += floor(OFFSET_CONST * this.getMoveStage());
					break;
				case 2:
					moveOffY -= floor(OFFSET_CONST * this.getMoveStage());
					break;
				case 3:
					moveOffY += floor(OFFSET_CONST * this.getMoveStage());
					break;
			}
		}
		if (moving && state % 10 < ANIMATION_STAGES) {
			state++;
		}
		else if (moving && state % 10 == ANIMATION_STAGES) {
			state -= ANIMATION_STAGES;
			moving = false;
		}
		fill(150, 50, (state % 10) * 50);
		rect(xOff + (this.x * SQUARE_SIZE) - moveOffX, yOff + (this.y * SQUARE_SIZE) - moveOffY, MOB_SIZE, MOB_SIZE);
	}
}
