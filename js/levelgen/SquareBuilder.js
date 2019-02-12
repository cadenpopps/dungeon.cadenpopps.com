function SquareBuilder(x, y) {

	this.x = x;
	this.y = y;
	this.squareType = WALL;
	this.roomSquare = false;
	this.nodeSquare = false;
	this.doorSquare = false;
	this.region = undefined;
	this.overlaps = false;
	this.connected = false;

	this.copy = function () {
		switch (this.squareType) {
			case WALL:
				return new WallSquare(this.x, this.y);
			case FLOOR:
				return new FloorSquare(this.x, this.y);
			case DOOR:
				return new DoorSquare(this.x, this.y);
			case STAIR_UP:
				return new StairSquare(this.x, this.y, true);
			case STAIR_DOWN:
				return new StairSquare(this.x, this.y, false);
			case LOOT:
				return new FloorSquare(this.x, this.y, true);
			default:
				console.log(this.squareType);
				return new Square(this.x, this.y, this.squareType);
		}
	};

	//returns an array of vectors of moves (for maze)
	this.moves = function (board) {
		moves = [];
		if (this.x > 1 && board[this.x - 1][this.y].squareType == WALL && this.y % 2 == 1 && board[this.x - 1][this.y].numNeighbors(board) < 2) {
			moves.push(createVector(this.x - 1, this.y));
		}
		if (this.y > 1 && board[this.x][this.y - 1].squareType == WALL && this.x % 2 == 1 && board[this.x][this.y - 1].numNeighbors(board) < 2) {
			moves.push(createVector(this.x, this.y - 1));
		}
		if (this.x < board.length - 2 && board[this.x + 1][this.y].squareType == WALL && this.y % 2 == 1 && board[this.x + 1][this.y].numNeighbors(board) < 2) {
			moves.push(createVector(this.x + 1, this.y));
		}
		if (this.y < board.length - 2 && board[this.x][this.y + 1].squareType == WALL && this.x % 2 == 1 && board[this.x][this.y + 1].numNeighbors(board) < 2) {
			moves.push(createVector(this.x, this.y + 1));
		}
		return moves;
	};

	//returns the number of neighbors, doors or paths
	this.numNeighbors = function (board) {
		var neighbors = 0;
		if (this.x > 0 && board[this.x - 1][this.y].walkable()) {
			neighbors++;
		}
		if (this.x < CONFIG.DUNGEON_SIZE - 1 && board[this.x + 1][this.y].walkable()) {
			neighbors++;
		}
		if (this.y > 0 && board[this.x][this.y - 1].walkable()) {
			neighbors++;
		}
		if (this.y < CONFIG.DUNGEON_SIZE - 1 && board[this.x][this.y + 1].walkable()) {
			neighbors++;
		}
		return neighbors;
	};

	// this.canBeLoot = function (board) {

	// 	if (this.squareType != FLOOR) {
	// 		return false;
	// 	}

	// 	var neighbors = [];
	// 	neighbors.push(board[this.x - 1][this.y]);
	// 	neighbors.push(board[this.x + 1][this.y]);
	// 	neighbors.push(board[this.x][this.y + 1]);
	// 	neighbors.push(board[this.x][this.y - 1]);
	// 	neighbors.push(board[this.x - 1][this.y - 1]);
	// 	neighbors.push(board[this.x - 1][this.y + 1]);
	// 	neighbors.push(board[this.x + 1][this.y - 1]);
	// 	neighbors.push(board[this.x + 1][this.y + 1]);

	// 	if (this.numNeighbors(board) != 3 || this.diagonalFloorNeighbors(board) < 2) {
	// 		return false;
	// 	}

	// 	for (let n of neighbors) {
	// 		if (n.squareType == DOOR || n.squareType == LOOT || n.squareType == STAIR_UP || n.squareType == STAIR_DOWN) {
	// 			return false;
	// 		}
	// 	}

	// 	return true;
	// };

	this.canBeMobStart = function (STAIR_UP) {
		if (this.squareType != FLOOR) {
			return false;
		}
		if (dist(this.x, this.y, STAIR_UP.x, STAIR_UP.y) < 7) {
			return false;
		}
		return true;
	};

	//returns an ArrayList of neighbors, doors or paths
	this.neighbors = function (board) {
		var neighbors = [];
		if (this.x > 0 && board[this.x - 1][this.y].walkable()) {
			neighbors.push(board[this.x - 1][this.y]);
		}
		if (this.x < CONFIG.DUNGEON_SIZE - 1 && board[this.x + 1][this.y].walkable()) {
			neighbors.push(board[this.x + 1][this.y]);
		}
		if (this.y > 0 && board[this.x][this.y - 1].walkable()) {
			neighbors.push(board[this.x][this.y - 1]);
		}
		if (this.y < CONFIG.DUNGEON_SIZE - 1 && board[this.x][this.y + 1].walkable()) {
			neighbors.push(board[this.x][this.y + 1]);
		}
		return neighbors;
	};

	this.walkable = function () {
		return (this.squareType == FLOOR || this.squareType == DOOR || this.squareType == STAIR_DOWN || this.squareType == STAIR_UP);
	};

	this.diagonalFloorNeighbors = function (board) {
		var neighbors = 0;
		if (this.x > 0 && board[this.x - 1][this.y - 1].squareType === FLOOR) {
			neighbors++;
		}
		if (this.x < CONFIG.DUNGEON_SIZE - 1 && board[this.x + 1][this.y + 1].squareType === FLOOR) {
			neighbors++;
		}
		if (this.y > 0 && board[this.x + 1][this.y - 1].squareType === FLOOR) {
			neighbors++;
		}
		if (this.y < CONFIG.DUNGEON_SIZE - 1 && board[this.x - 1][this.y + 1].squareType === FLOOR) {
			neighbors++;
		}
		return neighbors;
	};

	this.floorNeighbors = function (board) {
		var neighbors = 0;
		if (this.x > 0 && board[this.x - 1][this.y].squareType === 0) {
			neighbors++;
		}
		if (this.x < CONFIG.DUNGEON_SIZE - 2 && board[this.x + 1][this.y].squareType === 0) {
			neighbors++;
		}
		if (this.y > 0 && board[this.x][this.y - 1].squareType === 0) {
			neighbors++;
		}
		if (this.y < CONFIG.DUNGEON_SIZE - 2 && board[this.x][this.y + 1].squareType === 0) {
			neighbors++;
		}
		return neighbors;
	};

	this.adjacentNodes = function (board) {
		var nodes = [];
		if (this.x > 2 && board[this.x - 1][this.y].nodeSquare) {
			nodes.push(board[this.x - 1][this.y]);
		}
		if (this.x < CONFIG.DUNGEON_SIZE - 3 && board[this.x + 1][this.y].nodeSquare) {
			nodes.push(board[this.x + 1][this.y]);
		}
		if (this.y > 2 && board[this.x][this.y - 1].nodeSquare) {
			nodes.push(board[this.x][this.y - 1]);
		}
		if (this.y < CONFIG.DUNGEON_SIZE - 3 && board[this.x][this.y + 1].nodeSquare) {
			nodes.push(board[this.x][this.y + 1]);
		}
		return nodes;
	};


	this.connector = function (board) {
		// if (this.x > 2 && board[this.x - 1][this.y].nodeSquare) {
		// 	return true;
		// }
		// if (this.x < CONFIG.DUNGEON_SIZE - 3 && board[this.x + 1][this.y].nodeSquare) {
		// 	return true;
		// }
		// if (this.y > 2 && board[this.x][this.y - 1].nodeSquare) {
		// 	return true;
		// }
		// if (this.y < CONFIG.DUNGEON_SIZE - 3 && board[this.x][this.y + 1].nodeSquare) {
		// 	return true;
		// }
		if (this.adjacentNodes(board).length > 0) {
			return true;
		}
		if (this.overlaps && this.checkAdjacentRooms(board)) return true;
		// if (this.x > 2 && this.x < CONFIG.DUNGEON_SIZE - 3 && board[this.x - 1][this.y].roomSquare && board[this.x + 1][this.y].roomSquare && board[this.x - 1][this.y].squareType == FLOOR && board[this.x + 1][this.y].squareType == FLOOR) {
		// 	return true;
		// }
		// if (this.y > 2 && this.y < CONFIG.DUNGEON_SIZE - 3 && board[this.x][this.y - 1].roomSquare && board[this.x][this.y + 1].roomSquare && board[this.x][this.y - 1].squareType == FLOOR && board[this.x][this.y + 1].squareType == FLOOR) {
		// 	return true;
		// }
		return false;
	};

	this.checkAdjacentRooms = function (board) {
		if (this.x > 2 && this.x < CONFIG.DUNGEON_SIZE - 3 && board[this.x - 1][this.y].room != board[this.x + 1][this.y].room) return true;
		if (this.y > 2 && this.y < CONFIG.DUNGEON_SIZE - 3 && board[this.x][this.y - 1].room != board[this.x][this.y + 1].room) return true;
		return false;
	}

	this.roomConnector = function (board) {
		if (this.x > 2 && this.x < CONFIG.DUNGEON_SIZE - 3 && board[this.x - 1][this.y].roomSquare && board[this.x + 1][this.y].roomSquare && board[this.x - 1][this.y].squareType == FLOOR && board[this.x + 1][this.y].squareType == FLOOR) {
			return true;
		}
		if (this.y > 2 && this.y < CONFIG.DUNGEON_SIZE - 3 && board[this.x][this.y - 1].roomSquare && board[this.x][this.y + 1].roomSquare && board[this.x][this.y - 1].squareType == FLOOR && board[this.x][this.y + 1].squareType == FLOOR) {
			return true;
		}
		return false;
	};

	this.adjacentDoors = function (board) {
		let doors = 0;
		if (this.x > 1 && board[this.x - 1][this.y].squareType == DOOR) {
			doors++;
		}
		if (this.x < CONFIG.DUNGEON_SIZE - 2 && board[this.x + 1][this.y].squareType == DOOR) {
			doors++;
		}
		if (this.y > 1 && board[this.x][this.y - 1].squareType == DOOR) {
			doors++;
		}
		if (this.y < CONFIG.DUNGEON_SIZE - 2 && board[this.x][this.y + 1].squareType == DOOR) {
			doors++;
		}
		return doors;
	};

	this.nearbyDoors = function (board) {
		let doors = 0;
		if (this.x > 2 && board[this.x - 2][this.y].squareType == DOOR) {
			doors++;
		}
		if (this.x < CONFIG.DUNGEON_SIZE - 3 && board[this.x + 2][this.y].squareType == DOOR) {
			doors++;
		}
		if (this.y > 2 && board[this.x][this.y - 2].squareType == DOOR) {
			doors++;
		}
		if (this.y < CONFIG.DUNGEON_SIZE - 3 && board[this.x][this.y + 2].squareType == DOOR) {
			doors++;
		}
		return doors;
	};

	this.surroundingNodes = function (board) {
		let nodes = [];
		if (this.x > 3 && board[this.x - 2][this.y].nodeSquare && !board[this.x - 2][this.y].connected) {
			nodes.push(board[this.x - 2][this.y]);
		}
		if (this.x < CONFIG.DUNGEON_SIZE - 4 && board[this.x + 2][this.y].nodeSquare && !board[this.x + 2][this.y].connected) {
			nodes.push(board[this.x + 2][this.y]);
		}
		if (this.y > 3 && board[this.x][this.y - 2].nodeSquare && !board[this.x][this.y - 2].connected) {
			nodes.push(board[this.x][this.y - 2]);
		}
		if (this.y < CONFIG.DUNGEON_SIZE - 4 && board[this.x][this.y + 2].nodeSquare && !board[this.x][this.y + 2].connected) {
			nodes.push(board[this.x][this.y + 2]);
		}
		return nodes;
	};

	// this.connector = function (regions, board) {
	// 	for (let r of regions) {
	// 		if (this.adjacentTo(r, board)) {
	// 			for (let u of regions) {
	// 				if (this.adjacentTo(u, board)) {
	// 					if (!r.connectors.includes(this)) {
	// 						r.connectors.push(this);
	// 					}
	// 					if (!u.connectors.includes(this)) {
	// 						u.connectors.push(this);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return false;
	// };

	this.adjacentTo = function (_region, board) {
		if ((this.x > 0 && board[this.x - 1][this.y].region != null && board[this.x - 1][this.y].region == _region) || (this.x < CONFIG.DUNGEON_SIZE - 1 && board[this.x + 1][this.y].region != null && board[this.x + 1][this.y].region == _region) || (this.y > 0 && board[this.x][this.y - 1].region != null && board[this.x][this.y - 1].region == _region) || (this.y < CONFIG.DUNGEON_SIZE - 1 && board[this.x][this.y + 1].region != null && board[this.x][this.y + 1].region == _region)) {
			return true;
		}

		return false;
	};
}
