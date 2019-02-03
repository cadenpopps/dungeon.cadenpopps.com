function Floor(_board, _stairUp, _stairDown, _mobs, _mobCap) {

	const OFFSET_X = (width / 2) - (PLAYER_WIDTH / 2);
	const OFFSET_Y = (height / 2) - (SQUARE_SIZE / 4) + (SQUARE_SIZE / 24);

	this.board = _board;
	this.stairUp = _stairUp;
	this.stairDown = _stairDown;
	this.mobs = new Array();

	var mobCap = _mobCap;

	this.update = function (player) {
		for (var i = this.mobs.length - 1; i >= 0; i--) {
			var m = this.mobs[i];
			if (player.visibleMobs.includes(m) || dist(m.x, m.y, player.getX(), player.getY()) < MOB_VISION_RANGE) {
				// if (this.mobs[i].getHealth() <= 0) {
				// 	this.mobs.splice(i, 1);
				// }
				var u = m.update(player, this.board);
				if (typeof u == "number") {
					switch (u) {
						case UP:
							this.board[m.x][m.y + 1].containsMob = false;
							this.board[m.x][m.y + 1].mobAt = null;
							this.board[m.x][m.y].containsMob = true;
							this.board[m.x][m.y].mobAt = m;
							break;
						case DOWN:
							this.board[m.x][m.y - 1].containsMob = false;
							this.board[m.x][m.y - 1].mobAt = null;
							this.board[m.x][m.y].containsMob = true;
							this.board[m.x][m.y].mobAt = m;
							break;
						case LEFT:
							this.board[m.x + 1][m.y].containsMob = false;
							this.board[m.x + 1][m.y].mobAt = null;
							this.board[m.x][m.y].containsMob = true;
							this.board[m.x][m.y].mobAt = m;
							break;
						case RIGHT:
							this.board[m.x - 1][m.y].containsMob = false;
							this.board[m.x - 1][m.y].mobAt = null;
							this.board[m.x][m.y].containsMob = true;
							this.board[m.x][m.y].mobAt = m;
							break;
					}
				}
			}
		}
	};

	this.draw = function (player) {
		var xOff = OFFSET_X - (player.getX() * SQUARE_SIZE);
		var yOff = floor(OFFSET_Y - (player.getY() * SQUARE_SIZE));
		// if (player.getBusy()) {
		// 	switch (floor(player.getState() / 10)) {
		// 		case LEFT:
		// 			xOff -= floor(OFFSET_CONST * player.getMoveStage());
		// 			break;
		// 		case RIGHT:
		// 			xOff += floor(OFFSET_CONST * player.getMoveStage());
		// 			break;
		// 		case UP:
		// 			yOff -= floor(OFFSET_CONST * player.getMoveStage());
		// 			break;
		// 		case DOWN:
		// 			yOff += floor(OFFSET_CONST * player.getMoveStage());
		// 			break;
		// 	}
		// }
		drawBoard(player.getX(), player.getY(), xOff, yOff, this.board);
		drawMobs(xOff, yOff, this.mobs, player);
	}

	function drawBoard(playerX, playerY, xOff, yOff, board) {
		var drawStartX = floor(playerX - PLAYER_VISION_RANGE);
		if (drawStartX < 0) {
			drawStartX = 0;
		}
		var drawStartY = floor(playerY - PLAYER_VISION_RANGE);
		if (drawStartY < 0) {
			drawStartY = 0;
		}
		var drawEndX = ceil(playerX + PLAYER_VISION_RANGE);
		if (drawEndX > DUNGEON_SIZE) {
			drawEndX = DUNGEON_SIZE;
		}
		var drawEndY = ceil(playerY + PLAYER_VISION_RANGE);
		if (drawEndY > DUNGEON_SIZE) {
			drawEndY = DUNGEON_SIZE;
		}

		for (var i = drawStartX; i < drawEndX; i++) {
			for (var j = drawStartY; j < drawEndY; j++) {
				if (board[i][j].visible) {
					let texture = board[i][j].draw();
					if (texture.length > 1) {
						for (let t of texture) {
							image(t, xOff + (i * SQUARE_SIZE), yOff + (j * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
						}
					}
					else {
						image(texture, xOff + (i * SQUARE_SIZE), yOff + (j * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
					}
					// rect(xOff + (i * SQUARE_SIZE), yOff + (j * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
				}
				else if (board[i][j].discovered) {
					// board[i][j].draw();
					// rect(xOff + (i * SQUARE_SIZE), yOff + (j * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
					let texture = board[i][j].draw();
					if (texture.length > 1) {
						for (let t of texture) {
							image(t, xOff + (i * SQUARE_SIZE), yOff + (j * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
						}
					}
					else {
						image(texture, xOff + (i * SQUARE_SIZE), yOff + (j * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
					}
					// image(board[i][j].draw(), xOff + (i * SQUARE_SIZE), yOff + (j * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
					fill(5, 0, 10, .3);
					rect(xOff + (i * SQUARE_SIZE), yOff + (j * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
					fill(0, 0, 0, (board[i][j].distanceFromPlayer / 100) - .1);
					rect(xOff + (i * SQUARE_SIZE), yOff + (j * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
				}
				else {
					continue;
				}
				// if (i % 2 != j % 2) {
				// 	fill(0, 0, 0, .12);
				// 	rect(xOff + (i * SQUARE_SIZE), yOff + (j * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
				// }
				fill(0, 0, 0, (board[i][j].distanceFromPlayer / 40) - .25);
				rect(xOff + (i * SQUARE_SIZE), yOff + (j * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE);
			}
		}
	}

	function drawMobs(xOff, yOff, mobs, player) {
		for (let m of mobs) {
			if (player.visibleMobs.includes(m)) {
				m.draw(xOff, yOff, animationCounter);
			}
			else if (m.getMoving()) {
				m.resetState();
			}
		}
	}

	this.drawDebug = function () {
		drawFullBoard(this.board);
	}

	function drawFullBoard(board) {
		var squareSize = floor(height / DUNGEON_SIZE);

		for (var i = 0; i < DUNGEON_SIZE; i++) {
			for (var j = 0; j < DUNGEON_SIZE; j++) {
				board[i][j].draw();
				rect(i * squareSize, j * squareSize, squareSize, squareSize);

				// if (curSquare.getMobAt() != null) {
				// 	fill(255, 255, 0);
				// 	rect(i * squareSize, j * squareSize, squareSize, squareSize);
				// }
			}
		}
	}
}
