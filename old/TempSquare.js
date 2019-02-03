function SquareBuilder(_x, _y) {

	this.x = _x;
	this.y = _y;
	this.squareType = WALL;
	// if ((random() < .7 && (_x % 5 == 0 || _y % 7 == 0)) || (_x % 5 == 0 && _y % 7 == 0) || _x == 0 || _y == 0 || _x == DUNGEON_SIZE - 1 || _y == DUNGEON_SIZE - 1) {
	// 	this.squareType = WALL;
	// }
	this.lightLevel = 0;
	this.deadend = false;
	this.containsMob = false;
	this.isOpen = false;
	this.region = null;

	this.copy = function () {
		return new Square(this.x, this.y, this.squareType);
	};

	//returns an arraylist of pvectors of moves (for maze)
	this.moves = function (board) {
		moves = [];
		if (this.x > 1 && board[this.x - 1][this.y].squareType == -1 && (this.y) % 2 == 1 && board[this.x - 1][this.y].numNeighbors(board) < 2) {
			moves.push(createVector(this.x - 1, this.y));
		}
		if (this.y > 1 && board[this.x][this.y - 1].squareType == -1 && (this.x) % 2 == 1 && board[this.x][this.y - 1].numNeighbors(board) < 2) {
			moves.push(createVector(this.x, this.y - 1));
		}
		if (this.x < board.length - 2 && board[this.x + 1][this.y].squareType == -1 && (this.y) % 2 == 1 && board[this.x + 1][this.y].numNeighbors(board) < 2) {
			moves.push(createVector(this.x + 1, this.y));
		}
		if (this.y < board.length - 2 && board[this.x][this.y + 1].squareType == -1 && (this.x) % 2 == 1 && board[this.x][this.y + 1].numNeighbors(board) < 2) {
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
		if (this.x < DUNGEON_SIZE - 1 && board[this.x + 1][this.y].walkable()) {
			neighbors++;
		}
		if (this.y > 0 && board[this.x][this.y - 1].walkable()) {
			neighbors++;
		}
		if (this.y < DUNGEON_SIZE - 1 && board[this.x][this.y + 1].walkable()) {
			neighbors++;
		}
		return neighbors;
	};

	this.canBeLoot = function (board) {

		if (this.squareType != PATH) {
			return false;
		}

		var neighbors = [];
		neighbors.push(board[this.x - 1][this.y]);
		neighbors.push(board[this.x + 1][this.y]);
		neighbors.push(board[this.x][this.y + 1]);
		neighbors.push(board[this.x][this.y - 1]);
		neighbors.push(board[this.x - 1][this.y - 1]);
		neighbors.push(board[this.x - 1][this.y + 1]);
		neighbors.push(board[this.x + 1][this.y - 1]);
		neighbors.push(board[this.x + 1][this.y + 1]);

		if (this.numNeighbors(board) != 3 || this.diagNeighbors(board) < 2) {
			return false;
		}

		for (let n of neighbors) {
			if (n.squareType == DOOR || n.squareType == LOOT || n.squareType == STAIRUP || n.squareType == STAIRDOWN) {
				return false;
			}
		}

		return true;
	};

	this.canBeMobStart = function (stairUp) {
		if (this.squareType != PATH) {
			return false;
		}
		if (dist(this.x, this.y, stairUp.x, stairUp.y) < 7) {
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
		if (this.x < DUNGEON_SIZE - 1 && board[this.x + 1][this.y].walkable()) {
			neighbors.push(board[this.x + 1][this.y]);
		}
		if (this.y > 0 && board[this.x][this.y - 1].walkable()) {
			neighbors.push(board[this.x][this.y - 1]);
		}
		if (this.y < DUNGEON_SIZE - 1 && board[this.x][this.y + 1].walkable()) {
			neighbors.push(board[this.x][this.y + 1]);
		}
		return neighbors;
	};

	this.walkable = function () {
		return (this.squareType == PATH || this.squareType == DOOR || this.squareType == STAIRDOWN || this.squareType == STAIRUP);
	};

	this.currentlyWalkable = function () {
		return (!this.containsMob && (this.squareType == PATH || this.squareType == DOOR || this.squareType == STAIRDOWN || this.squareType == STAIRUP));
	};

	this.diagNeighbors = function (board) {
		var neighbors = 0;
		if (this.x > 0 && board[this.x - 1][this.y - 1].squareType === 0) {
			neighbors++;
		}
		if (this.x < DUNGEON_SIZE - 1 && board[this.x + 1][this.y + 1].squareType === 0) {
			neighbors++;
		}
		if (this.y > 0 && board[this.x + 1][this.y - 1].squareType === 0) {
			neighbors++;
		}
		if (this.y < DUNGEON_SIZE - 1 && board[this.x - 1][this.y + 1].squareType === 0) {
			neighbors++;
		}
		return neighbors;
	};

	this.pathNeighbors = function (board) {
		var neighbors = 0;
		if (this.x > 0 && board[this.x - 1][this.y].squareType === 0) {
			neighbors++;
		}
		if (this.x < DUNGEON_SIZE - 2 && board[this.x + 1][this.y].squareType === 0) {
			neighbors++;
		}
		if (this.y > 0 && board[this.x][this.y - 1].squareType === 0) {
			neighbors++;
		}
		if (this.y < DUNGEON_SIZE - 2 && board[this.x][this.y + 1].squareType === 0) {
			neighbors++;
		}
		return neighbors;
	};

	this.connector = function (_regions, _board) {
		for (let r of _regions) {
			if (this.adjacentTo(r, _board)) {
				for (let u of _regions) {
					if (this.adjacentTo(u, _board)) {
						if (!r.connectors.includes(this)) {
							r.connectors.push(this);
						}
						if (!u.connectors.includes(this)) {
							u.connectors.push(this);
						}
					}
				}
			}
		}
		return false;
	};

	this.adjacentTo = function (_region, _board) {
		if ((this.x > 0 && _board[this.x - 1][this.y].region != null && _board[this.x - 1][this.y].region == _region) || (this.x < DUNGEON_SIZE - 1 && _board[this.x + 1][this.y].region != null && _board[this.x + 1][this.y].region == _region) || (this.y > 0 && _board[this.x][this.y - 1].region != null && _board[this.x][this.y - 1].region == _region) || (this.y < DUNGEON_SIZE - 1 && _board[this.x][this.y + 1].region != null && _board[this.x][this.y + 1].region == _region)) {
			return true;
		}

		return false;
	};

	this.mobAt = function () {
		for (let m of gameManager.getDungeon().getFloor(gameManager.getCurrentFloor()).getMobs()) {
			if (this.x == m.x && this.y == m.y) {
				return m;
			}
		}
		return null;
	};
}
