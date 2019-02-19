function getSquareCode(x, y) {
	return x + (y * CONFIG.DUNGEON_SIZE)
}

const LARGE_VALUE = 2147483647;

function findPath(board, start, end) {
	let searched = [];
	let searching = [];
	let cameFrom = {};
	let distFromStart = {};
	let finalCost = {};

	for (let i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
		for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
			distFromStart[board[i][j]] = LARGE_VALUE;
			finalCost[board[i][j]] = LARGE_VALUE;
		}
	}

	searching.push(start);
	distFromStart[start] = 0;
	finalCost[start] = nodeDistance(start, end);
	cameFrom[getSquareCode(start.x, start.y)] = -1;

	while (searching.length > 0) {
		let current = searching[0];
		for (let s of searching) {
			if (finalCost[s] < finalCost[current]) current = s;
		}

		if (current == end) {
			return makePath(board, cameFrom, current);
		};

		searching.splice(searching.indexOf(current), 1);
		searched.push(current);

		let currentNeighbors = getNeighbors(board, current);
		for (let n of currentNeighbors) {
			if (searched.includes(n)) {
				continue;
			}
			else {
				let estimatedDistFromStart = distFromStart[current] + 1;

				if (!searching.includes(n)) {
					searching.push(n);
				}
				else if (estimatedDistFromStart >= distFromStart[n]) {
					continue;
				}

				cameFrom[n.squareCode] = current.squareCode;
				distFromStart[n] = estimatedDistFromStart;
				finalCost[n] = distFromStart[n] + squareDistance(start, end);
			}
		}
	}
	return false;
}

function squareDistance(start, end) {
	return abs(start.x - end.x) + abs(start.y - end.y);
}

function makePath(board, cameFrom, last) {
	let path = [];
	let current = getSquareCode(last.x, last.y);
	while (cameFrom[current] > 0) {
		path.unshift(getSquareFromCode(board, current));
		current = cameFrom[current];
	}
	path.unshift(getSquareFromCode(board, current));
	return path;
}

function getSquareFromCode(board, code) {
	return board[code % CONFIG.DUNGEON_SIZE][floor(code / CONFIG.DUNGEON_SIZE)];
}

const PATHFINDING = -1;

function getNeighbors(board, square) {
	neighbors = [];
	if (square.x > 0 && board[square.x - 1][square.y].walkable(board, PATHFINDING)) neighbors.push(board[square.x - 1][square.y]);
	if (square.y > 0 && board[square.x][square.y - 1].walkable(board, PATHFINDING)) neighbors.push(board[square.x][square.y - 1]);
	if (square.x < CONFIG.DUNGEON_SIZE - 1 && board[square.x + 1][square.y].walkable(board, PATHFINDING)) neighbors.push(board[square.x + 1][square.y]);
	if (square.y < CONFIG.DUNGEON_SIZE - 1 && board[square.x][square.y + 1].walkable(board, PATHFINDING)) neighbors.push(board[square.x][square.y + 1]);
	return neighbors;
}

function dirToSquare(start, target){
	if(abs(start.x - target.x) == 1 || abs(start.y - target.y) == 1){
		if(start.x > target.x){
			return LEFT;
		}
		else if(start.y > target.y){
			return UP;
		}
		else if (start.x < target.x){
			return RIGHT;
		}
		else if(start.y < target.y){
			return DOWN;
		}
	}
}

function findNodePath(board, start, end) {
	let searched = [];
	let searching = [];
	let cameFrom = {};
	let distFromStart = {};
	let finalCost = {};

	for (let i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
		for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
			distFromStart[board[i][j]] = LARGE_VALUE;
			finalCost[board[i][j]] = LARGE_VALUE;
		}
	}

	// start = adjacentNode(board, start);
	// end = adjacentNode(board, end);

	searching.push(start);
	distFromStart[start] = 0;
	finalCost[start] = nodeDistance(start, end);
	cameFrom[getSquareCode(start.x, start.y)] = -1;

	while (searching.length > 0) {
		let current = searching[0];
		for (let s of searching) {
			if (finalCost[s] < finalCost[current]) current = s;
		}

		if (current == end) {
			return makeNodePath(board, cameFrom, current);
		};

		searching.splice(searching.indexOf(current), 1);
		searched.push(current);

		let currentNeighbors = getNodeNeighbors(board, current);
		for (let n of currentNeighbors) {
			if (searched.includes(n)) {
				continue;
			}
			else {
				let estimatedDistFromStart = distFromStart[current] + 1;

				if (!searching.includes(n)) {
					searching.push(n);
				}
				else if (estimatedDistFromStart >= distFromStart[n]) {
					continue;
				}

				cameFrom[getSquareCode(n.x, n.y)] = getSquareCode(current.x, current.y);
				distFromStart[n] = estimatedDistFromStart;
				finalCost[n] = distFromStart[n] + nodeDistance(start, end);
			}
		}
	}
	return false;
}

function nodeDistance(start, end) {
	return abs(start.x - end.x) + abs(start.y - end.y);
}

function getNodeNeighbors(board, square) {
	neighbors = [];
	if (square.x > 1 && board[square.x - 2][square.y].nodeSquare) neighbors.push(board[square.x - 2][square.y]);
	if (square.y > 1 && board[square.x][square.y - 2].nodeSquare) neighbors.push(board[square.x][square.y - 2]);
	if (square.x < CONFIG.DUNGEON_SIZE - 2 && board[square.x + 2][square.y].nodeSquare) neighbors.push(board[square.x + 2][square.y]);
	if (square.y < CONFIG.DUNGEON_SIZE - 2 && board[square.x][square.y + 2].nodeSquare) neighbors.push(board[square.x][square.y + 2]);
	return neighbors;
}

function adjacentToTarget(board, square, target) {
	if (square.x > 1 && board[square.x - 1][square.y] == target) return true;
	if (square.y > 1 && board[square.x][square.y - 1] == target) return true;
	if (square.x < CONFIG.DUNGEON_SIZE - 2 && board[square.x + 1][square.y] == target) return true;
	if (square.y < CONFIG.DUNGEON_SIZE - 2 && board[square.x][square.y + 1] == target) return true;
	return false;
}

function adjacentNode(board, square) {
	if (square.nodeSquare) return square;
	if (square.x > 1 && board[square.x - 1][square.y].nodeSquare) return board[square.x - 1][square.y];
	if (square.y > 1 && board[square.x][square.y - 1].nodeSquare) return board[square.x][square.y - 1];
	if (square.x < CONFIG.DUNGEON_SIZE - 2 && board[square.x + 1][square.y].nodeSquare) return board[square.x + 1][square.y];
	if (square.y < CONFIG.DUNGEON_SIZE - 2 && board[square.x][square.y + 1].nodeSquare) return board[square.x][square.y + 1];
	// return square;
}

function makeNodePath(board, cameFrom, last) {

	let path = [];
	let current = getSquareCode(last.x, last.y);
	while (cameFrom[current] > 0) {
		path.unshift(getSquareFromCode(board, current));
		current = cameFrom[current];
	}
	path.unshift(getSquareFromCode(board, current));
	return path;
}
