function Utility(CONFIG){

	this.entityActionSuccessful = function(entity){
		entity.actions.busy = action_length[entity.actions.currentAction];

		entity.animation.newAnimation = true;
		entity.animation.animation = action_to_animation[entity.actions.currentAction];

		entity.actions.failedAction = action_none;
		entity.actions.lastAction = entity.actions.currentAction;
		entity.actions.currentAction = action_none;
	}

	this.entityActionFailed = function(entity){
		entity.actions.lastAction = action_none;
		entity.actions.failedAction = entity.actions.currentAction;
		entity.actions.currentAction = action_none;
	}

	this.entityDistance = function(e1, e2, dist) {
		return abs(e1.position.x - e2.position.x) < dist && abs(e1.position.y - e2.position.y) < dist;
	}

	this.getDirectionToEntity = function(e1, e2) {
		if(e1.position.y > e2.position.y){ return direction_up; }
		if(e1.position.x < e2.position.x){ return direction_right;}
		if(e1.position.y < e2.position.y){ return direction_down; }
		if(e1.position.x > e2.position.x){ return direction_left; }
	}

	this.getSquareNeighbors = function(x, y, map){
		neighbors = [];
		if (x > 0) {
			neighbors.push(map[x - 1][y]);
		}
		if (y > 0) {
			neighbors.push(map[x][y - 1]);
		}
		if (x < CONFIG.LEVEL_SETTINGS.DUNGEON_SIZE) {
			neighbors.push(map[x + 1][y]);
		}
		if (y < CONFIG.LEVEL_SETTINGS.DUNGEON_SIZE - 1) {
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

	this.positionOnScreen = function(x, y, w, h){
		return x > -w && x < width + w && y > -h && y < height + h;
	}

	this.positionInBounds = function(x, y){
		return x >= 0 && x < CONFIG.LEVEL_SETTINGS.DUNGEON_SIZE && y >= 0 && y < CONFIG.LEVEL_SETTINGS.DUNGEON_SIZE;
	}

	this.squareInBounds = function(square){
		return square.position.x >= 0 && square.position.x < CONFIG.LEVEL_SETTINGS.DUNGEON_SIZE && square.position.y >= 0 && square.position.y < CONFIG.LEVEL_SETTINGS.DUNGEON_SIZE;
	}

	let squareIsWalkable = function(square, entity){
		return (entity instanceof Player) ? playerWalkable(square) : mobWalkable(square);
	}

	let playerWalkable = function(square){
		return (!square.physical.solid || square instanceof DoorSquare || square instanceof StairUpSquare || square instanceof StairDownSquare);
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

	this.isSprintAction = function(action){
		return action == action_sprint_up || action == action_sprint_right || action == action_sprint_down || action == action_sprint_left;
	}

	this.convertMovementToSprint = function(entity){
		switch(entity.actions.currentAction){
			case action_move_up:
				entity.actions.currentAction = action_sprint_up;
				break;
			case action_move_right:
				entity.actions.currentAction = action_sprint_right;
				break;
			case action_move_down:
				entity.actions.currentAction = action_sprint_down;
				break;
			case action_move_left:
				entity.actions.currentAction = action_sprint_left;
				break;
		}
	}

	this.convertSprintToMovement = function(action){
		switch(action){
			case action_sprint_up:
				return action_move_up;
				break;
			case action_sprint_right:
				return action_move_right;
				break;
			case action_sprint_down:
				return action_move_down;
				break;
			case action_sprint_left:
				return action_move_left;
				break;
		}
	}

	this.convertAnimationsFromConfig = function(animations){
		let animationsArray = [];
		for(let a in animations){
			animationsArray[animation_strings_to_constants[a]] = animations[a];	
		}
		return animationsArray;
	}

	this.convertActionsFromConfig = function(actions){
		let actionsArray = [];
		for(let i = 0; i < actions.length; i++){
			actionsArray[i] = action_strings_to_constants[actions[i]];	
		}
		return actionsArray;
	}

	this.getSquareCode = function(x, y) {
		return x + (y * CONFIG.LEVEL_SETTINGS.DUNGEON_SIZE)
	}

	this.getSquareFromCode = function(board, code) {
		return board[code % CONFIG.LEVEL_SETTINGS.DUNGEON_SIZE][floor(code / CONFIG.LEVEL_SETTINGS.DUNGEON_SIZE)];
	}
}



const LARGE_VALUE = 2147483647;

function findPath(board, start, end) {

	let searched = [];
	let searching = [];
	let cameFrom = {};
	let distFromStart = {};
	let finalCost = {};

	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[0].length; j++) {
			distFromStart[board[i][j]] = LARGE_VALUE;
			finalCost[board[i][j]] = LARGE_VALUE;
		}
	}

	searching.push(start);
	distFromStart[start] = 0;
	finalCost[start] = squareDistance(start, end);
	cameFrom[Utility.getSquareCode(start.position.x, start.position.y)] = -1;

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

				cameFrom[Utility.getSquareCode(n.position.x, n.position.y)] = Utility.getSquareCode(current.position.x, current.position.y);
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
	let current = Utility.getSquareCode(last.position.x, last.position.y);
	while (cameFrom[current] > 0) {
		path.unshift(Utility.getSquareFromCode(board, current));
		current = cameFrom[current];
	}
	path.unshift(Utility.getSquareFromCode(board, current));
	return path;
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
	if (square.position.x < board.length - 1 && walkable(entity_mob, board[square.position.x + 1][square.position.y])) {
		neighbors.push(board[square.position.x + 1][square.position.y]);
	}
	if (square.position.y < board.length - 1 && walkable(entity_mob, board[square.position.x][square.position.y + 1])) {
		neighbors.push(board[square.position.x][square.position.y + 1]);
	}
	// if (square.position.x > 0 && board[square.position.x - 1][square.position.y].walkable(board, PATHFINDING)) neighbors.push(board[square.position.x - 1][square.position.y]);
	// if (square.position.y > 0 && board[square.position.x][square.position.y - 1].walkable(board, PATHFINDING)) neighbors.push(board[square.position.x][square.position.y - 1]);
	// if (square.position.x < board.length - 1 && board[square.position.x + 1][square.position.y].walkable(board, PATHFINDING)) neighbors.push(board[square.position.x + 1][square.position.y]);
	// if (square.position.y < board.length - 1 && board[square.position.x][square.position.y + 1].walkable(board, PATHFINDING)) neighbors.push(board[square.position.x][square.position.y + 1]);
	return neighbors;
}

function walkable(e, i){

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
