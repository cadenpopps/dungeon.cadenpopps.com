function GameManager() {

	var gameOver;

	var dungeon;
	var itemFactory;
	var mobFactory;
	var player;

	var moveQueueTimer;

	var vignette = $("#vignette");

	generateDungeon();
	// this.update();

	function generateDungeon() {
		itemFactory = new ItemFactory();
		mobFactory = new MobFactory();

		dungeon = new Dungeon();
		player = new Player(dungeon.floors[0].stairUp.x + 1, dungeon.floors[0].stairUp.y, 20, 20, 20, 500);
		setTimeout(() => {
			GAME_MANAGER.update();
			GAME_MANAGER.animate();
		}, 10);
	}

	var createMob = function (x, y, l) {
		var mob = mobFactory.createMob(x, y, l);
		if (typeof mob == "object") {
			dungeon.currentFloor.board[x][y].containsMob = true;
			dungeon.currentFloor.board[x][y].mobAt = mob;
			dungeon.currentFloor.mobs.push(mob);
			return true;
		}
		return false;
	}

	this.animate = function () {
		animating = true;
		this.update(0);
	};

	this.handleInput = function (input) {
		success = false;
		switch (input) {
			case UP:
				success = player.singleMove(UP, dungeon.currentFloor.board);
				break;
			case DOWN:
				success = player.singleMove(DOWN, dungeon.currentFloor.board);
				break;
			case RIGHT:
				success = player.singleMove(RIGHT, dungeon.currentFloor.board);
				break;
			case LEFT:
				success = player.singleMove(LEFT, dungeon.currentFloor.board);
				break;
			case TO_MOUSE:
				success = player.moveToMouse(mouseX, mouseY, dungeon.currentFloor.board);
				break;
			case PHYSICAL_ATTACK:
				success = player.physicalAttack(dungeon.currentFloor.board);
				break;
			case MAGICAL_ATTACK:
				// success = player.moveToMouse(mouseX, mouseY, dungeon.currentFloor.board);
				break;
			case RIGHT_CLICK:
				// player.currentHealth -= 1;
				let s = findSquare(player, mouseX, mouseY, dungeon.currentFloor.board);
				if (s != false && s.currentlyWalkable()) {
					if (createMob(s.getX(), s.getY(), "skeleton", dungeon.currentFloorNum)) {
						this.update();
						this.draw();
					}
				}
				// console.log(findPath(dungeon.currentFloor.board[20][20], s, dungeon.currentFloor.board));
				break;

		}
		// if (success == -2) {
		// 	animating = true;
		// 	this.update()
		// 	clearTimeout(moveQueueTimer);
		// 	moveQueueTimer = setTimeout(() => {
		// 		this.handleInput(PATH_MOVE);
		// 	}, 10);
		// }
		if (success == -1) {
			clearTimeout(moveQueueTimer);
			moveQueueTimer = setTimeout(() => {
				this.handleInput(input);
			}, 10);
			return true;
		}
		else if (success) { return success; }
		return false;
	}

	this.draw = function (counter) {
		if (DEBUG_BOARD) {
			dungeon.currentFloor.drawDebug();
		}
		else {
			// if (debug) {
			// 	var tempTime = millis();
			// }
			// console.log("c: " + counter);
			vignette.css("opacity", (1 - player.getHealthPercentage()) / 3);
			dungeon.currentFloor.draw(player);
			player.draw(10 * SCALE, counter);
			// if (debug) {
			// 	console.log("draw took " + (floor(millis() - tempTime)) + " milliseconds");
			// }
		}
	}

	this.update = function (mode) {
		if (debug) {
			var tempTime = millis();
		}
		let pUpdateStatus = player.update(dungeon.currentFloor.board);
		if (pUpdateStatus == -1) {
			dungeon.downFloor();
			animating = true;
			player.move(RIGHT, dungeon.currentFloor.board);
			this.update();
		}
		else if (dungeon.currentFloorNum > 0 && pUpdateStatus == -2) {
			dungeon.upFloor();
			animating = true;
			player.move(LEFT, dungeon.currentFloor.board);
			this.update();
		}
		dungeon.currentFloor.update(player);

		// this.draw(0);

		// for (let m of this.getCurrentFloor().getMobs()) {
		// 	m.update();
		// }
		//needs to go first because of mob check
		// this.getCurrentFloor().update();
		// for (var i = 0; i < DUNGEON_SIZE; i++) {
		// 	for (var j = 0; j < DUNGEON_SIZE; j++) {
		// 		this.getCurrentFloor().getSquare(i, j).update();
		// 	}
		// }
		// if (debug) {
		// 	console.log("update took " + (floor(millis() - tempTime)) + " milliseconds");
		// }
		// draw();
	};

	this.nextFloor = function () {
		if (player.getX() == this.getCurrentFloor().getStairDown().x && player.getY() == this.getCurrentFloor().getStairDown().y) {
			if (currentFloor == dungeon.getNumFloors() - 1) {
				currentFloor++;
				dungeon.addFloor(floorFactory);
			}
			player.path = [];
		}
	};

	this.prevFloor = function () {
		if (player.getX() == this.getCurrentFloor().getStairUp().x && player.getY() == this.getCurrentFloor().getStairUp().y) {
			currentFloor--;
			player.path = [];
		}
	};
}

function findSquare(player, mX, mY, board) {
	var goalX = player.getX() - floor((((width / 2) + (SQUARE_SIZE / 2)) - mX) / SQUARE_SIZE);
	var goalY = player.getY() - floor((((height / 2) + (SQUARE_SIZE / 2)) - mY) / SQUARE_SIZE);
	if (goalX > 0 && goalX < DUNGEON_SIZE && goalY > 0 && goalY < DUNGEON_SIZE) {
		return board[goalX][goalY];
	}
	else {
		return false;
	}
}

function findPath(currentSquare, goalSquare, board) {
	var closedSet = [];
	var openSet = [];
	openSet.push(board[currentSquare.getX()][currentSquare.getY()]);
	var cameFrom = new Array(DUNGEON_SIZE);
	for (var i = 0; i < DUNGEON_SIZE; i++) {
		cameFrom[i] = new Array(DUNGEON_SIZE);
		for (var j = 0; j < DUNGEON_SIZE; j++) {
			cameFrom[i][j] = -1;
		}
	}
	var gScore = [];
	gScore[currentSquare] = 0;
	var fScore = [];
	fScore[currentSquare] = dist(currentSquare.getX(), currentSquare.getY(), goalSquare.getX(), goalSquare.getY());
	while (openSet.length > 0) {
		var current = openSet[0];
		var currentLowest = fScore[openSet[0]];
		var openIndex = 0;
		for (var i = 0; i < openSet.length; i++) {
			if (fScore[openSet[i]] < currentLowest) {
				current = openSet[i];
				currentLowest = fScore[current];
				openIndex = i;
			}
		}
		if (current == goalSquare) {
			return reconstructPath(cameFrom, current, board);
		}
		openSet.splice(openIndex, 1);
		closedSet.push(current);
		var neighbors = getWalkableNeighbors(current, board);
		for (let neighbor of neighbors) {
			if (indexOf(neighbor, closedSet) != -1) {
				continue;
			}
			var tentG = gScore[current] + (dist(current.getX(), current.getY(), goalSquare.getX(), goalSquare.getY()));
			if (indexOf(neighbor, openSet) == -1) {
				openSet.push(neighbor);
			}
			else if (tentG >= gScore[neighbor]) {
				continue;
			}
			cameFrom[neighbor.getX()][neighbor.getY()] = [
				current.getX(),
				current.getY()
			];
			gScore[neighbor] = tentG;
			fScore[neighbor] = gScore[neighbor] + dist(neighbor.getX(), neighbor.getY(), goalSquare.getX(), goalSquare.getY());
		}
	}
	return false;
}

function indexOf(element, array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].getX() == element.getX() && array[i].getY() == element.getY()) {
			return i;
		}
	}
	return -1;
};

function reconstructPath(cameFrom, current, board) {
	var p = [];
	var dirs = [];
	p.push(current);
	while (cameFrom[current.getX()][current.getY()] != -1) {
		current = board[cameFrom[current.getX()][current.getY()][0]][cameFrom[current.getX()][current.getY()][1]];
		p.push(current);
		if (p[p.length - 1].getX() > p[p.length - 2].getX()) {
			dirs.push(LEFT);
		}
		else if (p[p.length - 1].getX() < p[p.length - 2].getX()) {
			dirs.push(RIGHT);
		}
		else if (p[p.length - 1].getY() > p[p.length - 2].getY()) {
			dirs.push(UP);
		}
		else if (p[p.length - 1].getY() < p[p.length - 2].getY()) {
			dirs.push(DOWN);
		}
	}
	return dirs;
}

function getWalkableNeighbors(current, board) {
	neighbors = [];
	if (current.getX() > 0 && board[current.getX() - 1][current.getY()].currentlyWalkable()) {
		neighbors.push(board[current.getX() - 1][current.getY()]);
	}
	if (current.getX() < DUNGEON_SIZE - 1 && board[current.getX() + 1][current.getY()].currentlyWalkable()) {
		neighbors.push(board[current.getX() + 1][current.getY()]);
	}
	if (current.getY() > 0 && board[current.getX()][current.getY() - 1].currentlyWalkable()) {
		neighbors.push(board[current.getX()][current.getY() - 1]);
	}
	if (current.getY() < DUNGEON_SIZE - 1 && board[current.getX()][current.getY() + 1].currentlyWalkable()) {
		neighbors.push(board[current.getX()][current.getY() + 1]);
	}
	return neighbors;
}

// function getTexture(x, y, board);