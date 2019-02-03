function Player(startX, startY) {

	const DRAW_X = (width / 2) - (PLAYER_WIDTH / 2);
	const DRAW_Y = floor((height / 2) - (PLAYER_SIZE / 3.5));

	var x = startX;
	var y = startY;
	var state = STATE_DOWN[0];
	var busy = false;
	var pathInterval = undefined;

	this.maxHealth = PLAYER_INITIAL_STATS[0];
	this.currentHealth = this.maxHealth;
	this.strength = PLAYER_INITIAL_STATS[1];
	this.magic = PLAYER_INITIAL_STATS[2];
	this.intelligence = PLAYER_INITIAL_STATS[3];
	this.class = PCLASS;
	this.level = 0;

	console.log(PLAYER_INITIAL_STATS);

	var inventory;

	this.visibleMobs = [];
	this.ignoreMobs = [];
	this.path = [];

	// inventory = new Array(3);
	// for (var_xi = 0; i < 3; i++) {
	// 	inventory[i] = new Array(4);
	// 	for (var j = 0; j < 4; j++) {
	// 		inventory[i][j] = gameManager.itemFactory.createItemPlaceholder();
	// 	}
	// }

	this.getMoveStage = function () {
		return ANIMATION_STAGES - (state % 10);
	};

	this.getBusy = function () {
		return busy;
	};

	this.getHealthPercentage = function () {
		return this.currentHealth / this.maxHealth;
	};

	this.getX = function () {
		return x;
	};

	this.getY = function () {
		return y;
	};

	this.getState = function () {
		return state;
	};

	this.alive = function () {
		return this.currentHealth > 0;
	}


	// ----------------------------------------------------------------------------------
	// -----------------------------------   UPDATE   -----------------------------------
	// ----------------------------------------------------------------------------------

	this.update = function (board) {

		this.visibleMobs = [];
		this.updateSquares(board);
		for (var i = this.ignoreMobs.length - 1; i >= 0; i--) {
			if (!this.visibleMobs.includes(this.ignoreMobs[i])) {
				this.ignoreMobs.splice(i, 1);
			}
		}
		if (board[x][y].getSquareType() == STAIRDOWN) {
			return -1;
		} else if (board[x][y].getSquareType() == STAIRUP) {
			return -2;
		}
	};

	this.updateSquares = function (board) {

		var sX = floor(x - PLAYER_VISION_RANGE);
		if (sX < 0) {
			sX = 0;
		}
		var sY = floor(y - PLAYER_VISION_RANGE);
		if (sY < 0) {
			sY = 0;
		}
		var eX = ceil(x + PLAYER_VISION_RANGE);
		if (eX > DUNGEON_SIZE) {
			eX = DUNGEON_SIZE;
		}
		var eY = ceil(y + PLAYER_VISION_RANGE);
		if (eY > DUNGEON_SIZE) {
			eY = DUNGEON_SIZE;
		}

		for (var i = 0; i < DUNGEON_SIZE; i++) {
			for (var j = 0; j < DUNGEON_SIZE; j++) {
				board[i][j].visible = false;
			}
		}

		if (debug) {
			var squarecounter = 0;
		}

		var dX = eX - sX;
		var dY = eY - sY;
		var incX = floor(dX / 4);
		var incY = floor(dY / 4);
		var numInc = 2;

		for (var i = sX; i < eX; i++) {
			for (var j = sY; j < eY; j++) {
				if (debug) {
					squarecounter++;
				}
				sight(i, j, board, this.visibleMobs);
				board[i][j].distanceFromPlayer = distanceToSquare(i, j);
			}
		}

		for (var i = sX; i < eX; i++) {
			for (var j = sY; j < eY; j++) {
				if (i > 0 && board[i - 1][j].getSquareType() == PATH && board[i - 1][j].visible) {
					board[i][j].discovered = true;
					continue;
				}
				if (i < DUNGEON_SIZE - 1 && board[i + 1][j].getSquareType() == PATH && board[i + 1][j].discovered) {
					board[i][j].discovered = true;
					continue;
				}
				if (j > 0 && board[i][j - 1].getSquareType() == PATH && board[i][j - 1].visible) {
					board[i][j].discovered = true;
					continue;
				}
				if (j < DUNGEON_SIZE - 1 && board[i][j + 1].getSquareType() == PATH && board[i][j + 1].visible) {
					board[i][j].discovered = true;
					continue;
				}
			}
		}


		if (debug) {
			console.log(squarecounter);
		}
	}

	function sight(i, j, board, visibleMobs) {
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
			else if (s.getSquareType() == WALL || (s.getSquareType() == DOOR && !s.getOpen())) {
				blocked = true;
				s.visible = true;
				s.discovered = true;
			}
			else {
				s.visible = true;
				s.discovered = true;
				if (s.containsMob && !visibleMobs.includes(s.mobAt)) {
					visibleMobs.push(s.mobAt);
				}
			}
		}
	}

	function distanceToSquare(i, j) {
		return floor((abs(x - i) + abs(y - j)) * 2);
	}


	// -----------------------------------------------------------------------------------
	// -----------------------------------   ACTIONS   -----------------------------------
	// -----------------------------------------------------------------------------------

	this.startAction = function () {
		busy = true;
		GAME_MANAGER.animate();
	};

	this.endAction = function () {
		state = floor(state / 10) * 10;
		busy = false;
	};

	this.move = function (dir, board) {
		let oldX = x;
		let oldY = y;
		if (!busy) {
			let success = false;
			switch (dir) {
				case UP:
					if (y > 0 && board[x][y - 1].currentlyWalkable()) {
						state = STATE_UP[0];
						y--;
						success = true;
					}
					break;
				case DOWN:
					if (y < DUNGEON_SIZE - 1 && board[x][y + 1].currentlyWalkable()) {
						state = STATE_DOWN[0];
						y++;
						success = true;
					}
					break;
				case LEFT:
					if (x > 0 && board[x - 1][y].currentlyWalkable()) {
						state = STATE_LEFT[0];
						x--;
						success = true;
					}
					break;
				case RIGHT:
					if (x < DUNGEON_SIZE - 1 && board[x + 1][y].currentlyWalkable()) {
						state = STATE_RIGHT[0];
						x++;
						success = true;
					}
					break;
				default: return false;
			}
			if (success) {
				if (board[oldX][oldY].getSquareType() == DOOR) {
					board[oldX][oldY].close();
				}
				if (board[x][y].getSquareType() == DOOR) {
					board[x][y].open();
				}
				this.startAction();
				return true;
			}
			else return false;
		}
		else {
			return -1;
		}
	};

	this.singleMove = function (dir, board) {
		this.path = [];
		return this.move(dir, board);
	};

	this.moveToMouse = function (msX, msY, board) {
		if (!this.busy) {
			var goalSquare = findSquare(this, msX, msY, board);
			if (goalSquare != false) {
				this.path = findPath(board[x][y], goalSquare, board);
				if (this.path != false && typeof this.path == "object") {
					this.startPathMoves(board);
				}
				else {
					console.log("no valid path");
					clearInterval(pathInterval);
					pathInterval = undefined;
					return false;
				}
			}
		}
		else {
			return -1;
		}
	};

	this.startPathMoves = function (board) {
		if (pathInterval == undefined && this.pathMove(board)) {
			this.startAction();
			pathInterval = setInterval(() => {
				switch (this.pathMove(board)) {
					case false:
						clearInterval(pathInterval);
						pathInterval = undefined;
						break;
					case -1:
						clearInterval(pathInterval);
						pathInterval = undefined;
						this.startPathMoves(board);
				}
			}, INPUT_RATE);
		}
	}

	this.pathMove = function (board) {
		if (!this.stopMoving()) {
			success = this.move(this.path[this.path.length - 1], board);
			if (success === true) {
				this.path.splice(this.path.length - 1, 1);
				this.startAction();
				return true;
			}
			else if (success == -1) {
				return -1;
			}
		}
		return false;
	};

	this.stopMoving = function () {
		let stop = false;
		if (this.visibleMobs.length > 0) {
			for (let m of this.visibleMobs) {
				if (!this.ignoreMobs.includes(m)) {
					this.ignoreMobs.push(m);
					stop = true;
				}
			}
		}
		if (stop) {
			alert("Mob discovered");
		}
		return stop;
	};

	//not really a player action, animation happens at the same time player is moving
	// this.openDoor = function () {
	// 	var success = false;
	// 	for (var i = x - 1; i <= x + 1; i++) {
	// 		for (var j = y - 1; j <= y + 1; j++) {
	// 			if (i > 0 && j > 0 && i < DUNGEON_SIZE - 1 && j < DUNGEON_SIZE - 1 && (i != x || j != y)) {
	// 				if (gameManager.getCurrentFloor().getSquare(i, j).getSquareType() == DOOR) {
	// 					gameManager.getCurrentFloor().getSquare(i, j).open();
	// 					success = true;
	// 				}
	// 			}
	// 		}
	// 	}

	// 	if (success) {
	// 		gameManager.update();
	// 	}
	// };

	this.openLoot = function () {
		var success = false;
		for (var i = x - 1; i <= x + 1; i++) {
			for (var j = y - 1; j <= y + 1; j++) {
				if (i > 0 && j > 0 && i < DUNGEON_SIZE - 1 && j < DUNGEON_SIZE - 1 && (i != x || j != y)) {
					if (gameManager.getCurrentFloor().getSquare(i, j).getSquareType() == LOOT) {
						gameManager.getCurrentFloor().getSquare(i, j).open();
						success = true;
					}
				}
			}
		}
		if (success) {
			gameManager.update();
		}
	};

	this.physicalAttack = function (board) {
		if (!busy) {
			var success = true;

			state = STATE_PHYSICAL_ATTACK[0];

			// for (i = x - 1; i <= x + 1; i++) {
			// 	for (j = y - 1; j <= y + 1; j++) {
			// 		if (!(x == i && y == j) && currentFloor.getSquare(i, j).getMobAt() != null) {
			// 			var m = currentFloor.getSquare(i, j).getMobAt();
			// 			if (pAttackMob(m)) {
			// 				addXP(m);
			// 			}
			// 			success = true;
			// 		}
			// 	}
			// }

			if (success) {
				this.path = [];
				this.startAction();
				return true;
			}
		}
		else {
			return -1;
		}
	};

	this.magicalAttack = function () {

		var success = false;

		for (let s of canSee) {
			if (s.getMobAt() != null && !(s.x == x && s.y == y)) {
				var m = s.getMobAt();
				if (mAttackMob(m)) {
					addXP(m);
				}
				success = true;
			}
		}

		if (success) {
			magicSounds[floor(random(magicSounds.length))].play();
			gameManager.update();
		}
	};

	var addXP = function (mob) {
		xpMult += ((mob.getLevel() / level) / 10) + (intelligence / (90 + level));
		if (xpMult >= 1) {
			levelUp();
		}
	};

	var levelUp = function () {
		xpMult -= 1;
		level++;
		maxHealth += 50;
		currentHealth += 50;
		strength += 2;
		magic++;
		intelligence++;
	};

	this.loseHealth = function (healthLost) {
		currentHealth -= abs(healthLost); // - armor - physical
		playerHurtSounds[floor(random(playerHurtSounds.length))].play();
	};

	var gameover = function () {
		userInterface.gameOverTime = millis();
		gameOver = true;
	};


	// -----------------------------------------------------------------------------------
	// -----------------------------------   DISPLAY   -----------------------------------
	// -----------------------------------------------------------------------------------

	this.draw = function (size, counter) {
		image(this.parseState(), DRAW_X, DRAW_Y, PLAYER_SIZE, PLAYER_SIZE);
		if (busy) {
			this.updateState();
		}
		// rect(DRAW_X, DRAW_Y, PLAYER_SIZE, PLAYER_SIZE);
	}
	this.updateState = function () {
		if (state % 10 < ANIMATION_STAGES - 1) {
			state++;
		}
		else if (state % 10 == ANIMATION_STAGES - 1) {
			this.endAction();
		}
	}
	this.parseState = function () {
		return PLAYER_TEXTURES[state];
		// switch (floor(state / 10)) {
		// 	case 0:
		// 		fill(0, 120, (state % 10) * 30);
		// 		break;
		// 	case 1:
		// 		fill(0, 140, (state % 10) * 30);
		// 		break;
		// 	case 2:
		// 		fill(0, 160, (state % 10) * 30);
		// 		break;
		// 	case 3:
		// 		fill(0, 180, (state % 10) * 30);
		// 		break;
		// 	case 4:
		// 		fill(200 - (state % 10) * 50, 50, (state % 10) * 30);
		// 		break;
		// }
	}
}
