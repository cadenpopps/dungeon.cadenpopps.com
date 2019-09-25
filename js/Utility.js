function Utility(){
	this.getSquareNeighbors = function(x, y, map){
		neighbors = [];
		if (x > 0 && walkable(entity_mob, map[x - 1][y])) {
			neighbors.push(map[x - 1][y]);
		}
		if (y > 0 && walkable(entity_mob, map[x][y - 1])) {
			neighbors.push(map[x][y - 1]);
		}
		if (x < CONFIG.DUNGEON_SIZE - 1 && walkable(entity_mob, map[x + 1][y])) {
			neighbors.push(map[x + 1][y]);
		}
		if (y < CONFIG.DUNGEON_SIZE - 1 && walkable(entity_mob, map[x][y + 1])) {
			neighbors.push(map[x][y + 1]);
		}
		return neighbors;
	}

	this.getHealthPercent = function(entity){
		return entity.health.health / entity.health.maxHealth;
	}

	this.findMobPath = function(board, mob, player){
		return findPath(board, board[mob.position.x][mob.position.y], board[player.position.x][player.position.y]);
	}

	this.walkable = function(square, entity, objects){
		return this.squareInBounds(square) && squareIsWalkable(square, entity) && !squareIsOccupied(square, objects);
	}

	this.positionInBounds = function(x, y){
		return x >= 0 && x < CONFIG.DUNGEON_SIZE && y >= 0 && y < CONFIG.DUNGEON_SIZE;
	}

	this.squareInBounds = function(square){
		return square.position.x >= 0 && square.position.x < CONFIG.DUNGEON_SIZE && square.position.y >= 0 && square.position.y < CONFIG.DUNGEON_SIZE;
	}

	let squareIsWalkable = function(square, entity){
		return (entity instanceof Player) ? playerWalkable(square) : mobWalkable(square);
	}

	let playerWalkable = function(square){
		return (!square.physical.solid || square instanceof DoorSquare || square instanceof StairSquare);
	}

	let mobWalkable = function(square){
		return !(square.physical.solid);
	}

	let squareIsOccupied = function(square, objects){
		for(let o of objects){
			if(o.position.x == square.position.x && o.position.y == square.position.y && o.physical.solid){
				return true;
			}
		}
		return false;
	}

	this.isMovementAction = function(action){
		return action == action_move_up || action == action_move_right || action == action_move_down || action == action_move_left;
	}
}

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
	finalCost[start] = squareDistance(start, end);
	cameFrom[getSquareCode(start.position.x, start.position.y)] = -1;

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

				cameFrom[getSquareCode(n.position.x, n.position.y)] = getSquareCode(current.position.x, current.position.y);
				distFromStart[n] = estimatedDistFromStart;
				finalCost[n] = distFromStart[n] + squareDistance(start, end);
			}
		}
	}
	return false;
}

function squareDistance(start, end) {
	return abs(start.position.x - end.position.x) + abs(start.position.y - end.position.y);
}

function makePath(board, cameFrom, last) {
	let path = [];
	let current = getSquareCode(last.position.x, last.position.y);
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
	if (square.position.x > 0 && walkable(entity_mob, board[square.position.x - 1][square.position.y])) {
		neighbors.push(board[square.position.x - 1][square.position.y]);
	}
	if (square.position.y > 0 && walkable(entity_mob, board[square.position.x][square.position.y - 1])) {
		neighbors.push(board[square.position.x][square.position.y - 1]);
	}
	if (square.position.x < CONFIG.DUNGEON_SIZE - 1 && walkable(entity_mob, board[square.position.x + 1][square.position.y])) {
		neighbors.push(board[square.position.x + 1][square.position.y]);
	}
	if (square.position.y < CONFIG.DUNGEON_SIZE - 1 && walkable(entity_mob, board[square.position.x][square.position.y + 1])) {
		neighbors.push(board[square.position.x][square.position.y + 1]);
	}
	// if (square.position.x > 0 && board[square.position.x - 1][square.position.y].walkable(board, PATHFINDING)) neighbors.push(board[square.position.x - 1][square.position.y]);
	// if (square.position.y > 0 && board[square.position.x][square.position.y - 1].walkable(board, PATHFINDING)) neighbors.push(board[square.position.x][square.position.y - 1]);
	// if (square.position.x < CONFIG.DUNGEON_SIZE - 1 && board[square.position.x + 1][square.position.y].walkable(board, PATHFINDING)) neighbors.push(board[square.position.x + 1][square.position.y]);
	// if (square.position.y < CONFIG.DUNGEON_SIZE - 1 && board[square.position.x][square.position.y + 1].walkable(board, PATHFINDING)) neighbors.push(board[square.position.x][square.position.y + 1]);
	return neighbors;
}

function walkable(entityType, square){
	if(entityType == entity_player){ 
		return playerWalkable(square); 
	}
	else if(entityType == entity_mob){ 
		return mobWalkable(square); 
	}
}

function playerWalkable(square){
	if(square instanceof WallSquare){
		return false;	
	}
	return true;
}

function mobWalkable(square){
	if(square instanceof WallSquare){
		return false;	
	}
	else if(square instanceof DoorSquare && !square.opened){
		return false;	
	}
	else if(square instanceof StairSquare){
		return false;	
	}
	return true;
}

function direction(start, target){
	if(abs(start[0] - target[0]) >= abs(start[1] - target[1])){
		if(start[0] < target[0]) return RIGHT;
		else if(start[0] > target[0]) return LEFT;
	}
	else{
		if(start[1] < target[1]) return DOWN;
		else if(start[1] > target[1]) return UP;
	}
}

function dirToSquare(start, target){
	if(start.position.x > target.position.x){
		return LEFT;
	}
	else if(start.position.y > target.position.y){
		return UP;
	}
	else if (start.position.x < target.position.x){
		return RIGHT;
	}
	else if(start.position.y < target.position.y){
		return DOWN;
	}
	else{
		throw new Error("Cannot determine direction from square" + start + " to " + target);
	}
}
