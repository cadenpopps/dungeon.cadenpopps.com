class Utility {

	static collision(o1, o2) {
		return !(o1.top >= o2.bottom || o1.right <= o2.left || o1.bottom <= o2.top || o1.left >= o2.right);
	}

	static checkComponents(object, requirements) {
		for(var i = 0; i < requirements.length; i++){
			if(object.components.indexOf(requirements[i]) === -1)
				return false;
		}
		return true;
	}

	static entityActionSuccessful(entity) {
		entity.actions.busy = action_length[entity.actions.currentAction];

		entity.animation.newAnimation = true;
		entity.animation.animation = action_to_animation[entity.actions.currentAction];

		entity.actions.failedAction = action_none;
		entity.actions.lastAction = entity.actions.currentAction;
		entity.actions.currentAction = action_none;
	}

	static entityActionFailed(entity) {
		entity.actions.lastAction = action_none;
		entity.actions.failedAction = entity.actions.currentAction;
		entity.actions.currentAction = action_none;
	}

	static entityWithinRange(e1, e2, dist) {
		return abs(e1.position.x - e2.position.x) < dist && abs(e1.position.y - e2.position.y) < dist;
	}

	static entityDistance(e1, e2) {
		return abs((e1.position.x > e2.position.x) ? e1.collision.left - e2.collision.right : e1.collision.right - e2.collision.left) + abs((e1.position.y > e2.position.y) ? e1.collision.top - e2.collision.bottom : e1.collision.bottom - e2.collision.top);
	}

	static getDirectionToEntity(e1, e2) {
		if(e1.position.y > e2.position.y){ return direction_up; }
		if(e1.position.x < e2.position.x){ return direction_right;}
		if(e1.position.y < e2.position.y){ return direction_down; }
		if(e1.position.x > e2.position.x){ return direction_left; }
	}

	static entityAdjacent(entity, otherEntity) {
		if (Utility.collision(new CollisionComponent(entity.collision.top - 1, entity.collision.right, entity.collision.top, entity.collision.left), otherEntity.collision)) {
			return direction_up;
		}
		else if (Utility.collision(new CollisionComponent(entity.collision.top, entity.collision.right + 1, entity.collision.bottom, entity.collision.right), otherEntity.collision)) {
			return direction_right;
		}
		else if (Utility.collision(new CollisionComponent(entity.collision.bottom, entity.collision.right, entity.collision.bottom + 1, entity.collision.left), otherEntity.collision)) {
			return direction_down;
		}
		else if (Utility.collision(new CollisionComponent(entity.collision.top, entity.collision.left, entity.collision.bottom, entity.collision.left - 1), otherEntity.collision)) {
			return direction_left;
		}
		else {
			return -1;
		}
	}

	static getSquareNeighbors(x, y, map) {
		neighbors = [];
		if(x > 0) {
			neighbors.push(map[x - 1][y]);
		}
		if(y > 0) {
			neighbors.push(map[x][y - 1]);
		}
		if(x < map.length - 1) {
			neighbors.push(map[x + 1][y]);
		}
		if(y < map.length - 1) {
			neighbors.push(map[x][y + 1]);
		}
		return neighbors;
	}

	static getHealthPercent(entity){
		return entity.health.health / entity.health.maxHealth;
	}

	static findMobPath(board, mob, player){
		return findPath(board, board[mob.position.x][mob.position.y], board[player.position.x][player.position.y]);
	}

	static walkable(x, y, map, entity, objects){
		return Utility.positionInBounds(x, y, map.length) && Utility.squareTypeIsWalkable(map[x][y], entity) && !Utility.squareIsOccupied(x, y, entity, objects);
	}

	static positionOnScreen(x, y, w, h){
		return x > -w && x < width + w && y > -h && y < height + h;
	}

	static positionInBounds(x, y, size){
		return x >= 0 && x < size && y >= 0 && y < size;
	}

	static squareInBounds(square, size){
		return square.position.x >= 0 && square.position.x < size && square.position.y >= 0 && square.position.y < size;
	}

	static squareTypeIsWalkable(square, entity){
		return (entity instanceof Player) ? Utility.playerWalkable(square) : Utility.mobWalkable(square);
	}

	static playerWalkable(square){
		return (!square.physical.solid || square instanceof DoorSquare || square instanceof StairUpSquare || square instanceof StairDownSquare);
	}

	static mobWalkable(square){
		return !(square.physical.solid);
	}

	static squareIsOccupied(x, y, entity, objects){
		for(let o of objects){
			if(entity != o) {
				if(Utility.collision(new CollisionComponent(x, y, entity.physical.size), o.collision)) {
					return true;
				}
			}
		}
		return false;
	}

	static directionToPosition(direction) {
		switch(direction) {
			case direction_up:
				return new PositionComponent(0, -1);
				break;
			case direction_right:
				return new PositionComponent(1, 0);
				break;
			case direction_down:
				return new PositionComponent(0, 1);
				break;
			case direction_left:
				return new PositionComponent(-1, 0);
				break;
		}
	}

	static getPositionInFrontOf(entity) {
		let dtp = Utility.directionToPosition(entity.direction.direction);
		return new PositionComponent(entity.position.x + dtp.x, entity.position.y + dtp.y);
	}

	static isMovementAction(action){
		return action > action_move && action <= action_move_left;
	}

	static isSprintAction(action){
		return action > action_sprint && action <= action_sprint_left;
	}

	static convertMovementToSprint(action){
		switch(action){
			case action_move_up:
				return action_sprint_up;
				break;
			case action_move_right:
				return action_sprint_right;
				break;
			case action_move_down:
				return action_sprint_down;
				break;
			case action_move_left:
				return action_sprint_left;
				break;
		}
	}

	static convertSprintToMovement(action){
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

	static convertAnimationsFromConfig(animations){
		let animationsArray = [];
		for(let a in animations){
			animationsArray[animation_strings_to_constants[a]] = animations[a];	
		}
		return animationsArray;
	}

	static convertActionsFromConfig(actions){
		let actionsArray = [];
		for(let i = 0; i < actions.length; i++){
			actionsArray[i] = action_strings_to_constants[actions[i]];	
		}
		return actionsArray;
	}

	static getSquareCode(x, y, size) {
		return x + (y * size);
	}

	static getSquareFromCode(map, code) {
		return map[code % map.length][floor(code / map.length)];
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
		if(current == end) {
			return makePath(board, cameFrom, current);
		};

		searching.splice(searching.indexOf(current), 1);
		searched.push(current);

		let currentNeighbors = getNeighbors(board, current);
		for(let n of currentNeighbors) {
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
	while(cameFrom[current] > 0) {
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
