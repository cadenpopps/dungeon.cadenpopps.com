function Square(_x, _y, _squareType) {

	const X = _x;
	const Y = _y;
	const SQUARETYPE = _squareType;
	var texture = 0;
	if (SQUARETYPE == PATH) {
		// texture = floor(random(PATH_TEXTURES.length));
		texture = random(1);
		if (texture < .6) {
			texture = 0;
		}
		else if (texture < .75) {
			texture = 1;
		}
		else if (texture < .85) {
			texture = 2;
		}
		else if (texture < .9) {
			texture = 3;
		}
		else if (texture < .95) {
			texture = 4;
		}
		else if (texture < .97) {
			texture = 5;
		}
		else {
			texture = 6;
		}

		// getTexture(x, y, SQUARETYPE);
	}
	else if (SQUARETYPE == WALL) {
		texture = random(1);
		if (texture < .6) {
			texture = 0;
		}
		else if (texture < .75) {
			texture = 1;
		}
		else if (texture < .85) {
			texture = 2;
		}
		else if (texture < .9) {
			texture = 3;
		}
		else if (texture < .95) {
			texture = 4;
		}
		else if (texture < .98) {
			texture = 5;
		}
		else {
			texture = 6;
		}
	}

	// if (SQUARETYPE == PATH) {
	// 	texture = floor(random(PATH_TEXTURES.length));
	// }
	// if (SQUARETYPE == PATH) {
	// 	texture = floor(random(PATH_TEXTURES.length));
	// }
	// var containsEntity = false;
	// var lightLevel = 0;
	var open = false;
	this.visible = false;
	this.discovered = false;
	this.distanceFromPlayer = 0;
	this.containsMob = false;
	this.mobAt = null;

	// var randomTexture = random(100);
	// if (randomTexture < 85) {
	// 	randomTexture = 0;
	// }
	// else if (randomTexture < 94) {
	// 	randomTexture = 1;
	// }
	// else if (randomTexture < 97) {
	// 	randomTexture = 2;
	// }
	// else if (randomTexture < 99) {
	// 	randomTexture = 3;
	// }
	// else if (randomTexture < 99.5) {
	// 	randomTexture = 4;
	// }
	// else {
	// 	randomTexture = 5;
	// }
	// const texture = randomTexture;

	this.getSquareType = function () {
		return SQUARETYPE;
	};

	this.getTexture = function () {
		return texture;
	};

	this.getX = function () {
		return X;
	};

	this.getY = function () {
		return Y;
	};

	this.walkable = function () {
		return (SQUARETYPE == PATH || (SQUARETYPE == DOOR) || SQUARETYPE == STAIRDOWN || SQUARETYPE == STAIRUP);
	};

	this.currentlyWalkable = function () {
		return (!this.containsMob && (SQUARETYPE == PATH || SQUARETYPE == DOOR || SQUARETYPE == STAIRDOWN || SQUARETYPE == STAIRUP));
	};

	this.open = function () {
		if (SQUARETYPE == DOOR) {
			// doorSounds[floor(random(doorSounds.length))].play();
			// if (random(1) < .1) {
			// 	doorSqueaks[floor(random(doorSqueaks.length))].play();
			// }
			open = true;
		}
		// else if (SQUARETYPE == LOOT) {
		// 	if (open) {
		// 		lockSounds[1].play();
		// 	}
		// 	else {
		// 		lockSounds[0].play();
		// 	}
		// }
	};

	this.close = function () {
		if (SQUARETYPE == DOOR) {
			if (!this.containsMob) {
				// doorSounds[floor(random(doorSounds.length))].play();
				// if (random(1) < .1) {
				// 	doorSqueaks[floor(random(doorSqueaks.length))].play();
				// }
				open = false;
			}
		}
		// else if (SQUARETYPE == LOOT) {
		// 	if (open) {
		// 		lockSounds[1].play();
		// 	}
		// 	else {
		// 		lockSounds[0].play();
		// 	}
		// }
	};

	this.getOpen = function () {
		return open;
	};

	// this.getMobAt = function() {
	// 	if (containsMob) {
	// 		return mobHere;
	// 	}
	// 	return null;
	// };

	this.update = function () {
		// for (let m of gameManager.getCurrentFloor().getMobs()) {
		// 	if (X == m.x && Y == m.y) {
		// 		containsMob = true;
		// 		mobHere = m;
		// 		return;
		// 	}
		// }
		// containsMob = false;
		// mobHere = null;
	};

	// this.getWalkableNeighbors = function() {
	// 	var currentFloor = gameManager.getCurrentFloor();
	// 	var neighbors = new Array();
	// 	if (currentFloor.getSquare(X - 1, Y).walkable()) {
	// 		neighbors.push(currentFloor.getSquare(X - 1, Y));
	// 	}
	// 	if (currentFloor.getSquare(X + 1, Y).walkable()) {
	// 		neighbors.push(currentFloor.getSquare(X + 1, Y));
	// 	}
	// 	if (currentFloor.getSquare(X, Y - 1).walkable()) {
	// 		neighbors.push(currentFloor.getSquare(X, Y - 1));
	// 	}
	// 	if (currentFloor.getSquare(X, Y + 1).walkable()) {
	// 		neighbors.push(currentFloor.getSquare(X, Y + 1));
	// 	}

	// 	return neighbors;
	// };


	this.draw = function () {
		switch (SQUARETYPE) {
			case PATH:
				return PATH_TEXTURES[texture];
			case WALL:
				return WALL_TEXTURES[texture];
			case STAIRDOWN:
				return [PATH_TEXTURES[0], STAIR_DOWN_TEXTURE];
			case STAIRUP:
				return [PATH_TEXTURES[0], STAIR_UP_TEXTURE];
			case DOOR:
				if (open) {
					return [PATH_TEXTURES[0], DOOR_OPEN_TEXTURE];
				}
				else {
					return [PATH_TEXTURES[0], DOOR_CLOSED_TEXTURE];
				}
			case LOOT:
				return [PATH_TEXTURES[0], CHEST_CLOSED_TEXTURE];
		}
	}
}
