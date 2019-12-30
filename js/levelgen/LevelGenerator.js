function generateLevel(CONFIG, depth, ROOM_POOL, STAIR_ROOM_POOL) {
	if(LEVEL_GEN) {
		let startTime = millis();

		let level;
		let rooms = [];
		let torches = [];

		let stairUp = {x:0, y:0, sector:0};
		let stairDown = {x:0, y:0, sector:0};

		level = initLevel(CONFIG.DUNGEON_SIZE, square_wall);
		rooms.push(generateStairUpRoom(stairUp, CONFIG.DUNGEON_SIZE, STAIR_ROOM_POOL));
		stairUp.x = rooms[0].x;
		stairUp.y = rooms[0].y;
		rooms.push(generateStairDownRoom(stairUp, stairDown, CONFIG.DUNGEON_SIZE, STAIR_ROOM_POOL));
		stairDown.x = rooms[1].x;
		stairDown.y = rooms[1].y;
		generateOtherRooms(level, rooms, CONFIG.DUNGEON_SIZE, CONFIG.ROOM_TRIES, ROOM_POOL);
		placeRoomsOnLevel(level, rooms);
		markNodeSquares(level);
		connectRooms(level, rooms, CONFIG.DUNGEON_SIZE);
		populateRooms(level, rooms, torches);
		finalizeLevel(level, stairUp, stairDown);

		// console.log("Milliseconds: " + (millis() - startTime));

		return new Level(level, stairUp, stairDown, depth, torches);
	}
	else {
		let level = initLevel(CONFIG.DUNGEON_SIZE, square_floor);
		let torches = [];
		let stairUp = {
			x: randomInt(CONFIG.DUNGEON_SIZE),
			y: randomInt(CONFIG.DUNGEON_SIZE)
		}
		let stairDown = {
			x: randomInt(CONFIG.DUNGEON_SIZE),
			y: randomInt(CONFIG.DUNGEON_SIZE)
		}
		finalizeLevel(level, stairUp, stairDown);
		return new Level(level, stairUp, stairDown, depth, torches);
	}
}

function initLevel(size, defaultValue) {
	let level = new Array(size);
	for(let i = 0; i < size; i++) {
		level[i] = new Array(size);
		for(let j = 0; j < size; j++) {
			level[i][j] = defaultValue;
		}
	}
	return level;
}

function generateStairUpRoom(stairUp, size, STAIR_ROOM_POOL) {
	stairUp.sector = randomInt(8);
	sectorToCoordinates(stairUp, size);

	// stairUp.x += (stairUp.x % 2) - 1;
	// stairUp.y += (stairUp.y % 2) - 1;

	return new Room(random(STAIR_ROOM_POOL), stairUp.x, stairUp.y);
}

function generateStairDownRoom(stairUp, stairDown, size, STAIR_ROOM_POOL) {
	stairDown.sector = (stairUp.sector + 4) % 8;
	sectorToCoordinates(stairDown, size);

	// stairDown.x += (stairDown.x % 2) - 1;
	// stairDown.y += (stairDown.y % 2) - 1;

	return new Room(random(STAIR_ROOM_POOL), stairDown.x, stairDown.y);
}

function sectorToCoordinates(stair, size) {
	// 0 1 2
	// 7 X 3  (sector + 4) % 8 = opposite sector
	// 6 5 4
	switch(stair.sector) {
		case 0:
			stair.x = floor(size/4);
			stair.y = floor(size/4);
			break;
		case 1:
			stair.x = 2 * floor(size/4);
			stair.y = floor(size/4);
			break;
		case 2:
			stair.x = 3 * floor(size/4);
			stair.y = floor(size/4);
			break;
		case 3:
			stair.x = 3 * floor(size/4);
			stair.y = 2 * floor(size/4);
			break;
		case 4:
			stair.x = 3 * floor(size/4);
			stair.y = 3 * floor(size/4);
			break;
		case 5:
			stair.x = 2 * floor(size/4);
			stair.y = 3 * floor(size/4);
			break;
		case 6:
			stair.x = floor(size/4);
			stair.y = 3 * floor(size/4);
			break;
		case 7:
			stair.x = floor(size/4);
			stair.y = 2 * floor(size/4);
			break;
	}
}

function generateOtherRooms(level, rooms, size, ROOM_TRIES, ROOM_POOL) {
	for(let i = 0; i < ROOM_TRIES; i++) {
		tryRoom(level, rooms, size, ROOM_POOL);
	}
}

function tryRoom(level, rooms, size, ROOM_POOL) {
	let newRoom = new Room(random(ROOM_POOL), randomInt(size), randomInt(size));
	if(isValidRoom(rooms, newRoom, size)) rooms.push(newRoom);
}

function isValidRoom(rooms, newRoom, size) {
	if(newRoom.left < 0 || newRoom.top < 0 || newRoom.right > size || newRoom.bottom > size) return false;
	for(let r of rooms) {
		if(roomsCollide(r, newRoom)) return false;
	}
	return true;
}

function roomsCollide(r1, r2) {
	return !(r1.left > r2.right || r1.top > r2.bottom || r1.right < r2.left || r1.bottom < r2.top);
}

function placeRoomsOnLevel(level, rooms) {
	for(let r of rooms) {
		for(let i = 0; i < r.width; i++) {
			for(let j = 0; j < r.height; j++) {
				level[i + r.left][j + r.top] = r.squares[i][j];
			}
		}
	}
}

function markNodeSquares(level) {
	for(let i = 1; i < level.length - 1; i+=2) {
		for(let j = 1; j < level.length - 1; j+=2) {
			if(level[i][j] == square_wall) level[i][j] = new Node(i, j, false);
		}
	}
}

function connectRooms(level, rooms, size) {

	let connected = [rooms[0]];
	let connectedDoors = rooms[0].doors;
	while(connected.length < rooms.length) {
		let closestRoom;
		let closestDistance;
		for(let r of rooms) {
			if(!connected.includes(r)) {
				closestRoom = r;
				closestDistance = 10000;
			}
		}
		for(let c of connected) {
			for(let r of rooms) {
				if(connected.includes(r)) continue;
				else{
					let currentDistance = roomDistance(c, r);
					if(currentDistance < closestDistance) {
						closestRoom = r;
						closestDistance = currentDistance;
					}
				}
			}
		}
		connectRoom(level, connected, closestRoom, connectedDoors);
	}
}

function roomDistance(r1, r2) {
	return abs(r1.x - r2.x) + abs(r1.y - r2.y);
}

function connectRoom(level, connected, room, connectedDoors) {

	let roomDoors = room.doors;
	let closestDoors = [connectedDoors[0], roomDoors[0]];
	let closestDistance = 10000;
	let adjacent = false;
	let success = false;

	for(let rd of roomDoors) {
		//if door touches a connected room, use that door
		if(includesDoor(connectedDoors, rd)) {
			closestDoors[0] = rd;
			adjacent = true;
			success = true;
			break;
		}
		//otherwise find the closest point of connection
		else{
			for(let cd of connectedDoors) {
				let currentDistance = doorDistance(rd, cd);
				if(currentDistance < closestDistance) {
					closestDoors = [cd, rd];
					closestDistance = currentDistance;
				}
			}
		}
	}

	if(!adjacent) {
		success = makePathBetweenDoors(level, closestDoors[0], closestDoors[1], connectedDoors);
	}

	if(success) {
		if(adjacent) {
			level[closestDoors[0][0]][closestDoors[0][1]] = square_door;
		}
		else{
			level[closestDoors[0][0]][closestDoors[0][1]] = square_door;
			level[closestDoors[1][0]][closestDoors[1][1]] = square_door;
		}

		for(let rd of roomDoors) {
			if(!includesDoor(connectedDoors, rd)) {
				connectedDoors.push(rd);
			}
		}
		connected.push(room);
	}
	else{
		connectedDoors.splice(connectedDoors.indexOf(closestDoors[0]), 1);
		room.doors.splice(room.doors.indexOf(closestDoors[1]), 1);
		connectRoom(level, connected, room, connectedDoors);
	}
}

function includesDoor(doorArray, door) {
	for(let d of doorArray) {
		if(door[0] == d[0] && door[1] == d[1]) return true;
	}
	return false;
}

function doorDistance(d1, d2) {
	return ((d1[0] - d2[0]) * (d1[0] - d2[0])) + ((d1[1] - d2[1]) * (d1[1] - d2[1]));
}

function makePathBetweenDoors(level, door1, door2, connectedDoors) {
	let searched = [];
	let searching = [];
	let distFromStart = {};
	let finalCost = {};

	for (let i = 0; i < level.length; i++) {
		for (let j = 0; j < level[0].length; j++) {
			distFromStart[level[i][j]] = LARGE_VALUE;
			finalCost[level[i][j]] = LARGE_VALUE;
		}
	}

	let start = getAdjacentNode(level, door1);
	let end = getAdjacentNode(level, door2);

	if(start == undefined || end == undefined) return false;

	searching.push(start);
	distFromStart[start] = 0;
	finalCost[start] = nodeDistance(start, end);
	start.cameFrom = undefined;

	while (searching.length > 0) {
		let current = searching[0];
		for (let s of searching) {
			if (finalCost[s] < finalCost[current]) current = s;
		}

		if (current == end) {
			drawNodePath(level, current, connectedDoors);
			return true;
		}

		searching.splice(searching.indexOf(current), 1);
		searched.push(current);

		let currentNeighbors = getSurroundingNodes(level, current);
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

				n.cameFrom = current;
				distFromStart[n] = estimatedDistFromStart;
				finalCost[n] = distFromStart[n] + nodeDistance(start, end);
			}
		}
	}
	return false;
}

function getAdjacentNode(level, door) {
	if (door[0] % 2 == 1 && door[1] % 2 == 1) return level[door[0]][door[1]];
	if (door[0] > 1 && level[door[0] - 1][door[1]] instanceof Node) return level[door[0] - 1][door[1]];
	if (door[1] > 1 && level[door[0]][door[1] - 1] instanceof Node) return level[door[0]][door[1] - 1];
	if (door[0] < level.length - 2 && level[door[0] + 1][door[1]] instanceof Node) return level[door[0] + 1][door[1]];
	if (door[1] < level.length - 2 && level[door[0]][door[1] + 1] instanceof Node) return level[door[0]][door[1] + 1];
}

function nodeDistance(start, end) {
	return abs(start.x - end.x) + abs(start.y - end.y);
}

function getSurroundingNodes(level, node) {
	let neighbors = [];
	if (node.x > 1 && level[node.x - 2][node.y] instanceof Node) neighbors.push(level[node.x - 2][node.y]);
	if (node.y > 1 && level[node.x][node.y - 2] instanceof Node) neighbors.push(level[node.x][node.y - 2]);
	if (node.x < level.length - 2 && level[node.x + 2][node.y] instanceof Node) neighbors.push(level[node.x + 2][node.y]);
	if (node.y < level.length - 2 && level[node.x][node.y + 2] instanceof Node) neighbors.push(level[node.x][node.y + 2]);
	return neighbors;
}

function drawNodePath(level, node) {
	// level[node.x][node.y] = square_floor;
	level[node.x][node.y].connected = true;
	while(node.cameFrom != undefined) {
		fillBetweenNodes(level, node, node.cameFrom);
		node = node.cameFrom;
		// level[node.x][node.y] = square_floor;
		level[node.x][node.y].connected = true;
	}
}

function fillBetweenNodes(level, node1, node2) {
	level[node1.x + ((node2.x - node1.x) / 2)][node1.y + ((node2.y - node1.y) / 2)] = square_floor;
}

function populateRooms(level, rooms, torches) {
	for(let r of rooms) {
		placeTorchInRoom(level, r, torches);
	}
}

function placeTorchInRoom(level, room, torches) {
	if(room.width > 5 && room.height > 5 && !oneIn(5)) {
		let dir = randomInt(4);
		let x = 0, y = 0;
		switch(dir) {
			case direction_up:
				x = room.left + randomInt(2, room.width - 2);
				y = room.top;
				dir = direction_down;
				if(level[x][y] == square_door) { return; }
				break;
			case direction_right:
				x = room.right - 1;
				y = room.top + randomInt(2, room.height - 2);
				dir = direction_left;
				if(level[x][y] == square_door) { return; }
				break;
			case direction_down:
				x = room.left + randomInt(2, room.width - 2);
				y = room.bottom - 1;
				dir = direction_up;
				if(level[x][y] == square_door) { return; }
				break;
			case direction_left:
				x = room.left;
				y = room.top + randomInt(2, room.height - 2);
				dir = direction_right;
				if(level[x][y] == square_door) { return; }
				break;
		}
		torches.push(new Torch(x, y, dir));
	}
}

function finalizeLevel(level, stairUp, stairDown) {
	level[stairUp.x][stairUp.y] = square_stair_up;
	level[stairDown.x][stairDown.y] = square_stair_down;

	for(let i = 0; i < level.length; i++) {
		for(let j = 0; j < level.length; j++) {
			if(level[i][j] instanceof Node) {
				if(level[i][j].connected) {
					level[i][j] = square_floor;
				}
				else{
					level[i][j] = square_wall;
				}
			}
			switch(level[i][j]) {
				case square_floor:
					level[i][j] = new FloorSquare(i, j);
					break;
				case square_wall:
					level[i][j] = new WallSquare(i, j);
					break;
				case square_door:
					level[i][j] = new DoorSquare(i, j);
					break;
				case square_stair_up:
					level[i][j] = new StairUpSquare(i, j);
					break;
				case square_stair_down:
					level[i][j] = new StairDownSquare(i, j);
					break;
				case square_loot:
					level[i][j] = new FloorSquare(i, j);
					break;
				default:
					console.log('Not recognized squaretype: ' + level[i][j]);
					level[i][j] = new Square(i, j, level[i][j]);
					break;
			}
		}
	}


	let blanks = [];

	for(let i = 1; i < level.length - 1; i++) {
		for(let j = 1; j < level.length - 1; j++) {
			if(level[i][j] instanceof WallSquare && !(level[i - 1][j - 1] instanceof FloorSquare || level[i][j - 1] instanceof FloorSquare || level[i + 1][j - 1] instanceof FloorSquare || level[i - 1][j] instanceof FloorSquare || level[i + 1][j] instanceof FloorSquare || level[i - 1][j + 1] instanceof FloorSquare || level[i][j + 1] instanceof FloorSquare || level[i + 1][j + 1] instanceof FloorSquare)){
				blanks.push(level[i][j]);
			}
		}
	}

	for(let i = 1; i < level.length - 1; i++) {
		if(!(level[i - 1][1] instanceof FloorSquare || level[i][1] instanceof FloorSquare || level[i + 1][1] instanceof FloorSquare)){
			blanks.push(level[i][0]);
		}
		if(!(level[1][i - 1] instanceof FloorSquare || level[1][i] instanceof FloorSquare || level[1][i + 1] instanceof FloorSquare)){
			blanks.push(level[0][i]);
		}
		if(!(level[i - 1][level.length - 2] instanceof FloorSquare || level[i][level.length - 2] instanceof FloorSquare || level[i + 1][level.length - 2] instanceof FloorSquare)){
			blanks.push(level[i][level.length - 1]);
		}
		if(!(level[level.length - 2][i - 1] instanceof FloorSquare || level[level.length - 2][i] instanceof FloorSquare || level[level.length - 2][i + 1] instanceof FloorSquare)){
			blanks.push(level[level.length - 1][i]);
		}
	}

	for(let b of blanks) {
		level[b.position.x][b.position.y] = new BlankSquare(b.position.x, b.position.y);
	}
}

function Node(x, y, connected) {
	this.x = x;
	this.y = y;
	this.connected = connected;
}
