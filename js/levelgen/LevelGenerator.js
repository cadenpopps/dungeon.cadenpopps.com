function generateLevel(size, depth){

	let startTime = millis();

	let level; 
	let rooms = [];

	let stairUp = {x:0, y:0, sector:0};
	let stairDown = {x:0, y:0, sector:0};

	level = initLevel(size);
	rooms.push(generateStairUpRoom(stairUp, size));
	rooms.push(generateStairDownRoom(stairUp, stairDown, size));
	generateOtherRooms(level, rooms, size);
	placeRoomsOnLevel(level, rooms);
	markNodeSquares(level);
	connectRooms(level, rooms, size);
	finalizeLevel(level, stairUp, stairDown);

	console.log("Milliseconds: " + (millis() - startTime));

	return new Level(level, stairUp, stairDown, depth);
}

function initLevel(size){
	let level = new Array(size);	
	for(let i = 0; i < size; i++){
		level[i] = new Array(size);
		for(let j = 0; j < size; j++){
			level[i][j] = WALL;
		}
	}
	return level;
}

function generateStairUpRoom(stairUp, size){
	stairUp.sector = randomInt(8);
	sectorToCoordinates(stairUp, size);	
	return new Room(random(CONFIG.STAIRROOMPOOL), stairUp.x, stairUp.y);
}

function generateStairDownRoom(stairUp, stairDown, size){
	stairDown.sector = (stairUp.sector + 4) % 8;
	sectorToCoordinates(stairDown, size);	
	return new Room(random(CONFIG.STAIRROOMPOOL), stairDown.x, stairDown.y);
}

function sectorToCoordinates(stair, size){
	// 0 1 2
	// 7 X 3  (sector + 4) % 8 = opposite sector
	// 6 5 4
	switch(stair.sector){
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

function generateOtherRooms(level, rooms, size){
	for(let i = 0; i < CONFIG.ROOM_TRIES; i++){
		tryRoom(level, rooms, size);
	}
}

function tryRoom(level, rooms, size){
	let newRoom = new Room(random(CONFIG.ROOMPOOL), randomInt(size), randomInt(size));
	if(isValidRoom(rooms, newRoom, size)) rooms.push(newRoom);
}

function isValidRoom(rooms, newRoom, size){
	if(newRoom.left < 0 || newRoom.top < 0 || newRoom.right > size || newRoom.bottom > size) return false;
	for(let r of rooms){
		if(roomsCollide(r, newRoom)) return false;
	}
	return true;
}

function roomsCollide(r1, r2){
	return !(r1.left > r2.right || r1.top > r2.bottom || r1.right < r2.left || r1.bottom < r2.top);
}

function placeRoomsOnLevel(level, rooms){
	for(let r of rooms){
		for(let i = 0; i < r.width; i++){
			for(let j = 0; j < r.height; j++){
				level[i + r.left][j + r.top] = r.squares[i][j];
			}
		}
	}
}

function markNodeSquares(level){
	for(let i = 1; i < level.length - 1; i+=2){
		for(let j = 1; j < level.length - 1; j+=2){
			if(level[i][j] == WALL) level[i][j] = new Node(i, j, false);
		}
	}
}

function connectRooms(level, rooms, size){

	let connected = [rooms[0]];
	let connectedDoors = rooms[0].doors;
	while(connected.length < rooms.length){
		let closestRoom;
		let closestDistance;
		for(let r of rooms){
			if(!connected.includes(r)){
				closestRoom = r;
				closestDistance = 10000;
			}
		}
		for(let c of connected){
			for(let r of rooms){
				if(connected.includes(r)) continue;
				else{
					let currentDistance = roomDistance(c, r);
					if(currentDistance < closestDistance){
						closestRoom = r;
						closestDistance = currentDistance;
					}
				}
			}
		}
		connectRoom(level, connected, closestRoom, connectedDoors);
	}
}

function roomDistance(r1, r2){
	return abs(r1.x - r2.x) + abs(r1.y - r2.y);	
}

function connectRoom(level, connected, room, connectedDoors){

	let roomDoors = room.doors;
	let closestDoors = [connectedDoors[0], roomDoors[0]];
	let closestDistance = 10000;
	let adjacent = false;
	let success = false;

	for(let rd of roomDoors){
		//if door touches a connected room, use that door
		if(includesDoor(connectedDoors, rd)){
			closestDoors[0] = rd;
			adjacent = true;
			success = true;
			break;
		}
		//otherwise find the closest point of connection
		else{
			for(let cd of connectedDoors){
				let currentDistance = doorDistance(rd, cd);
				if(currentDistance < closestDistance){
					closestDoors = [cd, rd];
					closestDistance = currentDistance;
				}
			}
		}
	}

	if(!adjacent){
		success = makePathBetweenDoors(level, closestDoors[0], closestDoors[1], connectedDoors);
	}

	if(success) {
		if(adjacent){
			level[closestDoors[0][0]][closestDoors[0][1]] = DOOR;
		}
		else{
			level[closestDoors[0][0]][closestDoors[0][1]] = DOOR;
			level[closestDoors[1][0]][closestDoors[1][1]] = DOOR;
		}

		for(let rd of roomDoors){
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

function includesDoor(doorArray, door){
	for(let d of doorArray){
		if(door[0] == d[0] && door[1] == d[1]) return true;
	}
	return false;
}

function doorDistance(d1, d2){
	return ((d1[0] - d2[0]) * (d1[0] - d2[0])) + ((d1[1] - d2[1]) * (d1[1] - d2[1]));
}

function makePathBetweenDoors(level, door1, door2, connectedDoors){
	let searched = [];
	let searching = [];
	let distFromStart = {};
	let finalCost = {};

	for (let i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
		for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
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
		};

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
	neighbors = [];
	if (node.x > 1 && level[node.x - 2][node.y] instanceof Node) neighbors.push(level[node.x - 2][node.y]);
	if (node.y > 1 && level[node.x][node.y - 2] instanceof Node) neighbors.push(level[node.x][node.y - 2]);
	if (node.x < level.length - 2 && level[node.x + 2][node.y] instanceof Node) neighbors.push(level[node.x + 2][node.y]);
	if (node.y < level.length - 2 && level[node.x][node.y + 2] instanceof Node) neighbors.push(level[node.x][node.y + 2]);
	return neighbors;
}

function drawNodePath(level, node) {
	// level[node.x][node.y] = FLOOR;
	level[node.x][node.y].connected = true;
	while(node.cameFrom != undefined){
		fillBetweenNodes(level, node, node.cameFrom);
		node = node.cameFrom;
		// level[node.x][node.y] = FLOOR;
		level[node.x][node.y].connected = true;
	}
}

function fillBetweenNodes(level, node1, node2){
	level[node1.x + ((node2.x - node1.x) / 2)][node1.y + ((node2.y - node1.y) / 2)] = FLOOR;
}

function finalizeLevel(level, stairUp, stairDown){
	level[stairUp.x][stairUp.y] = STAIR_UP;
	level[stairDown.x][stairDown.y] = STAIR_DOWN;

	for(let i = 0; i < level.length; i++){
		for(let j = 0; j < level.length; j++){
			if(level[i][j] instanceof Node){
				if(level[i][j].connected){
					level[i][j] = FLOOR;
				}
				else{
					level[i][j] = WALL;
				}
			}
			switch(level[i][j]){
				case FLOOR:
					level[i][j] = new FloorSquare(i, j);
					break;
				case WALL:
					level[i][j] = new WallSquare(i, j);
					break;
				case FLOOR:
					level[i][j] = new FloorSquare(i, j);
					break;
				case DOOR:
					level[i][j] = new DoorSquare(i, j);
					break;
				case STAIR_UP:
					level[i][j] = new StairSquare(i, j, true);
					break;
				case STAIR_DOWN:
					level[i][j] = new StairSquare(i, j, false);
					break;
				case LOOT:
					level[i][j] = new FloorSquare(i, j, true);
					break;
				default:
					console.log("Not recognized squaretype: " + level[i][j]);
					level[i][j] = new Square(i, j, level[i][j]);
					break;
			}
		}
	}
}

function Room(template, x, y) {

	// 000T000   T = (3, 0)   W = 7
	// 0000000   L = (0, 2)   H = 5
	// L00C000R  C = (3, 2)
	// 0000000   R = (7, 2)
	// 0000000   B = (3, 5)
	//    B

	this.width = template.width; //width of inside of room
	this.height = template.height; //inside

	this.left = x - floor(this.width/2); //x coordinate of left most squares
	this.top = y - floor(this.height/2); //top most
	this.left += (this.left % 2) - 1;
	this.top += (this.top % 2) - 1;
	this.right = this.left + this.width; //x coord of first wall on right 
	this.bottom = this.top + this.height; //x coord of first wall on right 

	this.x = this.left + ceil(this.width/2);
	this.y = this.top + ceil(this.height/2);

	this.squares = template.squares.slice(0);
	this.doors = new Array(template.doors.length);

	for(let i = 0; i < this.doors.length; i++){
		this.doors[i] = [template.doors[i][0] + this.left, template.doors[i][1] + this.top];
	}

	this.connected = false;
}

function Node(x, y, connected){
	this.x = x;
	this.y = y;
	this.connected = connected;
}
