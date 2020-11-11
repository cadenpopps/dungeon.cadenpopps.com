class Utility {

	static debugLog(message) {
		if(DEBUG_MODE) console.log(message);
	}

	static collision(o1, o2) {
		return !(o1.top >= o2.bottom || o1.right <= o2.left || o1.bottom <= o2.top || o1.left >= o2.right);
	}

	static checkComponents(entityComponents, systemComponents) {
		for(let component of systemComponents) {
			if(!(component in entityComponents)) return false;
		}
		return true;
	}

	static entityHasComponent(entity, component) {
		return component in entity;
	}

	static entityHasDepth(entity) {
		for(let component of entity.components) {
			if(component instanceof DepthComponent) return true;
		}
		return false;
	}

	static getHealthPercent(entity) {
		return entity[component_health].currentHealth / entity[component_health].maxHealth;
	}

	static getCurrentHeartAmount(entity){
		return floor(entity[component_health].currentHealth / 10);
	}

	static getMaxHeartAmount(entity){
		return floor(entity[component_health].maxHealth / 10);
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

	static getSquaresInFront(engine, position, direction, range) {
		let squares = [];
		let map = engine.getMap();
		switch(direction) {
			case direction_up:
				for(let i = 0; i < range; i++) {
					for(let j = 0; j < range - i; j++) {
						if(position.y - (i + 1) >= 0) {
							if(position.x - j >= 0) {
								squares.push(map[position.x - j][position.y - (i + 1)]);
							}
							if(j != 0 && position.x + j < map.length) {
								squares.push(map[position.x + j][position.y - (i + 1)]);
							}
						}
					}
				}
				break;
			case direction_right:
				for(let i = 0; i < range; i++) {
					for(let j = 0; j < range - i; j++) {
						if(position.x + (i + 1) < map.length) {
							if(position.y - j >= 0) {
								squares.push(map[position.x + (i + 1)][position.y - j]);
							}
							if(j != 0 && position.y + j < map.length) {
								squares.push(map[position.x + (i + 1)][position.y + j]);
							}
						}
					}
				}
				break;
			case direction_down:
				for(let i = 0; i < range; i++) {
					for(let j = 0; j < range - i; j++) {
						if(position.y + (i + 1) < map.length) {
							if(position.x - j >= 0) {
								squares.push(map[position.x - j][position.y + (i + 1)]);
							}
							if(j != 0 && position.x + j < map.length) {
								squares.push(map[position.x + j][position.y + (i + 1)]);
							}
						}
					}
				}
				break;
			case direction_left:
				for(let i = 0; i < range; i++) {
					for(let j = 0; j < range - i; j++) {
						if(position.x - (i + 1) >= 0) {
							if(position.y - j >= 0) {
								squares.push(map[position.x - (i + 1)][position.y - j]);
							}
							if(j != 0 && position.y + j < map.length) {
								squares.push(map[position.x - (i + 1)][position.y + j]);
							}
						}
					}
				}
				break;
		}
		return squares;
	}

	static getSquaresAround(engine, position, range) {
		let squares = [];
		let map = engine.getMap();
		for(let i = position.x - range; i <= position.x + range; i++) {
			for(let j = position.y - range; j <= position.y + range; j++) {
				if(Utility.positionInBounds(new PositionComponent(i, j), engine.getMap().length)) {
					squares.push(map[i][j]);
				}
			}
		}
		return squares;
	}

	static getEntitiesInSquares(engine, squares) {
		let entities = [];
		let elist = engine.getEntities();
		for(let s of squares) {
			for(let e of elist) {
				if(e.components.includes(component_position) && e.position.x == s.position.x && e.position.y == s.position.y) {
					entities.push(e);
				}
				else if(e.components.includes(component_collision) && Utility.collision(e.collision, new CollisionComponent(s.position.x, s.position.y, 1))) {
					entities.push(e);
				}
			}
		}
		return entities;
	}

	static entityWithinRange(e1, e2, dist) {
		return abs(e1.position.x - e2.position.x) < dist && abs(e1.position.y - e2.position.y) < dist;
	}

	static positionInRange(p1, p2, dist) {
		return abs(p1.x - p2.x) < dist && abs(p1.y - p2.y) < dist;
	}

	static entityDistance(e1, e2) {
		if(e1.collision.width == 1 && e1.collision.height == 1 && e2.collision.width == 1 && e2.collision.height == 1) {
			return Utility.distance(e1.position, e2.position);
		}
		else {
			let xDist = 0;
			if(e1.collision.left >= e2.collision.right) {
				xDist = abs(e1.collision.left - (e2.collision.right - 1));
			}
			else if(e1.collision.right <= e2.collision.left) {
				xDist = abs((e1.collision.right - 1) - e2.collision.left);
			}
			let yDist = 0;
			if(e1.collision.top >= e2.collision.bottom) {
				yDist = abs(e1.collision.top - (e2.collision.bottom - 1));
			}
			else if(e1.collision.bottom <= e2.collision.top) {
				yDist = abs((e1.collision.bottom - 1) - e2.collision.top);
			}
			return xDist + yDist;
		}
	}

	static distance(p1, p2) {
		return abs(p1.x - p2.x) + abs(p1.y - p2.y);
	}

	static getDirectionToEntity(e1, e2) {
		if(e1.position.y > e2.position.y) { return direction_up; }
		if(e1.position.x < e2.position.x) { return direction_right;}
		if(e1.position.y < e2.position.y) { return direction_down; }
		if(e1.position.x > e2.position.x) { return direction_left; }
	}

	static shortestPath(map, startPosition, endPosition) {
		// let nodeMap = Utility.convertMapToNodes(map);
		// let searching = [];

		// let start = nodeMap[startPosition.x][startPosition.y];
		// let end = nodeMap[endPosition.x][endPosition.y];

		// searching.push(start);
		// start.distFromStart = 0;
		// start.finalCost = Utility.distance(startPosition, endPosition);
		// // start.cameFrom = undefined;

		// while (searching.length > 0) {
		// 	let current = searching[0];
		// 	for (let node of searching) {
		// 		if (node.finalCost < current.finalCost) {
		// 			current = node;
		// 		}
		// 	}

		// 	if(current == end) {
		// 		return makePath(current);
		// 	}

		// 	searching.splice(searching.indexOf(current), 1);
		// 	current.searched = true;

		// 	let currentNeighbors = getNeighbors(board, current);
		// 	for(let n of currentNeighbors) {
		// 		if (!n.searched) {
		// 			let estimatedDistFromStart = Utility.distance();

		// 			if (!searching.includes(n)) {
		// 				searching.push(n);
		// 			}
		// 			else if (estimatedDistFromStart >= distFromStart[n]) {
		// 				continue;
		// 			}

		// 			cameFrom[Utility.getSquareCode(n.position.x, n.position.y)] = Utility.getSquareCode(current.position.x, current.position.y);
		// 			distFromStart[n] = estimatedDistFromStart;
		// 			finalCost[n] = distFromStart[n] + squareDistance(start, end);
		// 		}
		// 	}
		// }
		// return false;
	}

	static convertMapToNodes(map) {
		let nodeMap = new Array(map.length);
		for(let i = 0; i < map.length; i++) {
			nodeMap[i] = new Array(map.length);
			for(let j = 0; j < map.length; j++) {
				nodeMap[i][j] = {
					'searched': false,
					'cameFrom': undefined,
					'distFromStart': 10000,
					'finalCost': 10000
				}
			}
		}
		return nodeMap;
	}

	static getCollisionInFrontOf(entity) {
		return Utility.getCollisionInDirection(entity, entity.direction.direction);
	}

	static getCollisionInDirection(entity, direction) {
		switch(direction) {
			case direction_up:
				return new CollisionComponent(entity.collision.left, entity.collision.top - 1, entity.collision.width, 1);
			case direction_right:
				return new CollisionComponent(entity.collision.right, entity.collision.top, 1, entity.collision.height);
			case direction_down:
				return new CollisionComponent(entity.collision.left, entity.collision.bottom, entity.collision.width, 1);
			case direction_left:
				return new CollisionComponent(entity.collision.left - 1, entity.collision.top, 1, entity.collision.height);
			default:
				console.log("Cannot determine direction");
				return;
		}
	}

	static entityAdjacent(entity, otherEntity) {
		let c1 = entity.collision, c2 = otherEntity.collision;
		if (Utility.collision(Utility.getCollisionInDirection(entity, direction_up), c2)) {
			return direction_up;
		}
		else if (Utility.collision(Utility.getCollisionInDirection(entity, direction_right), c2)) {
			return direction_right;
		}
		else if (Utility.collision(Utility.getCollisionInDirection(entity, direction_down), c2)) {
			return direction_down;
		}
		else if (Utility.collision(Utility.getCollisionInDirection(entity, direction_left), c2)) {
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

	static findMobPath(board, mob, player) {
		return findPath(board, board[mob.position.x][mob.position.y], board[player.position.x][player.position.y]);
	}

	static walkable(x, y, map, entity, objects){
		return Utility.positionInBounds(new PositionComponent(x, y), map.length) && Utility.squareIsWalkable(map[x][y], entity) && !Utility.squareIsOccupied(x, y, entity, objects);
	}

	static positionOnScreen(x, y, w, h) {
		return x > -w && x < width + w && y > -h && y < height + h;
	}

	static positionInBounds(position, size){
		return position.x >= 0 && position.x < size && position.y >= 0 && position.y < size;
	}

	static squareInBounds(square, size) {
		return square.position.x >= 0 && square.position.x < size && square.position.y >= 0 && square.position.y < size;
	}

	static getNeighbors(square, map) {
		let neighbors = new Array(4);
		if(Utility.positionInBounds(new PositionComponent(square.position.x, square.position.y - 1), map.length)) {
			neighbors[0] = (map[square.position.x][square.position.y - 1]);
		}
		if(Utility.positionInBounds(new PositionComponent(square.position.x + 1, square.position.y), map.length)) {
			neighbors[1] = (map[square.position.x + 1][square.position.y]);
		}
		if(Utility.positionInBounds(new PositionComponent(square.position.x, square.position.y + 1), map.length)) {
			neighbors[2] = (map[square.position.x][square.position.y + 1]);
		}
		if(Utility.positionInBounds(new PositionComponent(square.position.x - 1, square.position.y), map.length)) {
			neighbors[3] = (map[square.position.x - 1][square.position.y]);
		}
		return neighbors;
	}

	static getCornerNeighbors(square, map) {
		let neighbors = new Array(4);
		if(Utility.positionInBounds(new PositionComponent(square.position.x - 1, square.position.y - 1), map.length)) {
			neighbors[0] = (map[square.position.x - 1][square.position.y - 1]);
		}
		if(Utility.positionInBounds(new PositionComponent(square.position.x + 1, square.position.y - 1), map.length)) {
			neighbors[1] = (map[square.position.x + 1][square.position.y - 1]);
		}
		if(Utility.positionInBounds(new PositionComponent(square.position.x - 1, square.position.y + 1), map.length)) {
			neighbors[2] = (map[square.position.x - 1][square.position.y + 1]);
		}
		if(Utility.positionInBounds(new PositionComponent(square.position.x - 1, square.position.y + 1), map.length)) {
			neighbors[3] = (map[square.position.x + 1][square.position.y + 1]);
		}
		return neighbors;
	}

	static squareIsWalkable(square, entity){
		return (entity instanceof Player) ? Utility.playerWalkable(square) : Utility.mobWalkable(square);
	}

	static playerWalkable(square) {
		return (!square.components.includes(component_collision) || square instanceof DoorSquare || square instanceof StairUpSquare || square instanceof StairDownSquare);
	}

	static mobWalkable(square) {
		return !square.components.includes(component_collision);
	}

	static squareIsOccupied(x, y, entity, objects) {
		for(let o of objects) {
			if(entity != o && o.components.includes(component_collision)) {
				if(Utility.collision(new CollisionComponent(x, y, 1), o.collision)) {
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
			case direction_right:
				return new PositionComponent(1, 0);
			case direction_down:
				return new PositionComponent(0, 1);
			case direction_left:
				return new PositionComponent(-1, 0);
		}
	}


	static isMovementAction(action) {
		return action > action_move && action <= action_move_left;
	}

	static convertMovementToSprint(action) {
		switch(action) {
			case action_move_up:
				return action_sprint_up;
			case action_move_right:
				return action_sprint_right;
			case action_move_down:
				return action_sprint_down;
			case action_move_left:
				return action_sprint_left;
		}
	}

	static convertSprintToMovement(action) {
		switch(action) {
			case action_sprint_up:
				return action_move_up;
			case action_sprint_right:
				return action_move_right;
			case action_sprint_down:
				return action_move_down;
			case action_sprint_left:
				return action_move_left;
		}
	}

	static convertAnimationsFromConfig(animations) {
		let animationsArray = [];
		for(let a in animations) {
			animationsArray[animation_strings_to_constants[a]] = animations[a];
		}
		return animationsArray;
	}

	static convertActionsFromConfig(actions) {
		let actionsArray = [];
		for(let i = 0; i < actions.length; i++) {
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

const LARGE_VALUE = 10000;

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
		}

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
