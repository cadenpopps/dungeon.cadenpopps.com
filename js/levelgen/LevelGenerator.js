
function generateLevel(depth) {

	let rooms = [];
	let regions = [];
	let stairUp = createVector(0, 0);
	let stairDown = createVector(0, 0);

	var createLevel = function (depth, stairUp) {

		// var mobCap = floor((CONFIG.DUNGEON_SIZE / 8) + ((depth + 30) / 2));

		// console.log("Mobcap for this floor: " + mobCap);

		let board = initBoard(CONFIG.DUNGEON_SIZE);

		genStairs(board);
		if (DEBUG) {
			console.log("STAIRS DONE");
		}

		genRooms(board);
		if (DEBUG) {
			console.log("ROOMS DONE");
		}

		genNodes(board);
		if (DEBUG) {
			console.log("MAZE DONE");
		}



		connectRooms(board);
		if (DEBUG) {
			console.log("ROOMS CONNECTED");
		}

		// connectRegions(board);
		// if (DEBUG) {
		//     console.log("CONNECTING REGIONS DONE");
		// }

		// for (let i = 0; i < 3; i++) {
		//     sparseMaze(board);
		//     if (DEBUG) {
		//         console.log("SPARSING DONE: " + i);
		//     }

		//     removeDetours(board);
		//     if (DEBUG) {
		//         console.log("REMOVE DONE: " + i);
		//     }
		// }

		// fixMaze(board);
		// if (DEBUG) {
		//     console.log("FIXING MAZE DONE");
		// }


		// console.log(stairUp);
		// console.log(stairDown);

		board[stairUp.x][stairUp.y].squareType = STAIR_UP;
		board[stairDown.x][stairDown.y].squareType = STAIR_DOWN;

		makeSquares(board);


		// if (!findPath(board[STAIR_DOWN.x][STAIR_DOWN.y], board[stairUp.x][stairUp.y], board)) {
		//     return createLevel(_stairUp, _floorNum);
		// }

		return new Level(board, stairUp, stairDown);

	};

	var initBoard = function () {
		var board = new Array(CONFIG.DUNGEON_SIZE);
		for (var i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
			board[i] = new Array(CONFIG.DUNGEON_SIZE);
			for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
				board[i][j] = new SquareBuilder(i, j);
			}
		}
		return board;
	};

	var genStairs = function (board) {

		let stairDownTemplate = random(CONFIG.STAIRROOMPOOL);
		let stairUpTemplate = random(CONFIG.STAIRROOMPOOL);

		let stairUpLocation;
		stairUpLocation = randomInt(8);
		if (stairUpLocation == 4) stairUpLocation = 8;
		let stairDownLocation = sectorToCoordinates(genStairDownSector(stairUpLocation), stairDownTemplate);
		stairUpLocation = sectorToCoordinates(getSectorCoords(stairUpLocation), stairUpTemplate);

		let stairUpRoom = new Room(stairUpTemplate, stairUpLocation[0], stairUpLocation[1]);
		let stairDownRoom = new Room(stairDownTemplate, stairDownLocation[0], stairDownLocation[1]);

		rooms.push(stairUpRoom);
		rooms.push(stairDownRoom);

		for (let r of rooms) {
			regions.push(new Region(r));
			addChildren(board, r);
			r.roomType = -1;
		}

		stairUp.x = stairUpLocation[0] + (floor(stairUpTemplate.width / 2));
		stairUp.y = stairUpLocation[1] + (floor(stairUpTemplate.height / 2));
		stairDown.x = stairDownLocation[0] + (floor(stairDownTemplate.width / 2));
		stairDown.y = stairDownLocation[1] + (floor(stairDownTemplate.height / 2));

		if (DEBUG) {
			console.log("STAIR UP: " + stairUp.x + " " + stairUp.y);
			console.log("STAIR DOWN: " + stairDown.x + " " + stairDown.y);
		}

	};

	var genStairDownSector = function (stairUpSector) {
		let coordinates = [];
		if (stairUpSector % 2 == 0) {
			let availableSectors = [];
			let row = (floor(stairUpSector / 3) + 2) % 4;
			let col = ((stairUpSector % 3) + 2) % 4;
			for (let i = 0; i < 9; i++) {
				if (floor(i / 3) == row || (i % 3) == col) {
					availableSectors.push(i);
				}
			}
			coordinates = getSectorCoords(random(availableSectors));
		}
		else {
			if ((stairUpSector - 1) % 6 == 0) {
				let row = (stairUpSector + 1) % 4;
				return getSectorCoords((row * 3) + randomInt(3));
			}
			else {
				let col = (stairUpSector - 1) % 4;
				return getSectorCoords(col + (3 * randomInt(3)));
			}
		}
		return coordinates;
	}

	var getSectorCoords = function (num) {
		switch (num) {
			case 0:
				return [0, 0];
			case 1:
				return [0, 1];
			case 2:
				return [0, 2];
			case 3:
				return [1, 0];
			case 9:
				return [1, 1];
			case 5:
				return [1, 2];
			case 6:
				return [2, 0];
			case 7:
				return [2, 1];
			case 8:
				return [2, 2];
			default:
				return [-1, -1];
		}
	}

	var sectorToCoordinates = function (sector, template) {
		let x = sector[0] + 1;
		let y = sector[1] + 1;
		let translationScale = floor((CONFIG.DUNGEON_SIZE - 10) / 3);
		x = (x * translationScale) + randomInt(-3, 3) - floor(template.width / 2);
		y = (y * translationScale) + randomInt(-3, 3) - floor(template.height / 2);
		x += (x) % 2;
		y += (y) % 2
		return [x, y];
	}

	var genRooms = function (board) {

		let HALF_DUNGEON = floor(CONFIG.DUNGEON_SIZE / 2);
		for (let i = 0; i < CONFIG.ROOM_TRIES; i++) {

			let template = random(CONFIG.ROOMPOOL);

			let roomx = randomInt(0, HALF_DUNGEON - floor(template.width / 2) + 1) * 2;
			let roomy = randomInt(0, HALF_DUNGEON - floor(template.height / 2) + 1) * 2;

			let newRoom = new Room(template, roomx, roomy);
			let valid = true;

			for (let r of rooms) {
				if (newRoom.overlaps(r)) {
					valid = false;
					break;
				}
			}

			if (valid) {
				rooms.push(newRoom);
				regions.push(new Region(newRoom));
				addChildren(board, newRoom);
			}

		}
	};

	var genNodes = function (board) {

		for (let x = 1; x < CONFIG.DUNGEON_SIZE - 1; x++) {
			for (let y = 1; y < CONFIG.DUNGEON_SIZE - 1; y++) {
				if (x % 2 == 1 && y % 2 == 1 && !board[x][y].roomSquare) {
					// board[x][y].squareType = FLOOR;
					board[x][y].nodeSquare = true;
				}
			}
		}
	};

	var connectRooms = function (board) {

		let connectedRooms = [];
		let unconnectedRooms = rooms.slice();

		while (unconnectedRooms.length > 0){
			closestRooms = findClosestRooms(connectedRooms, unconnectedRooms);
			if(connectRooms(closestRooms[0], closestRooms[1])){
				unconnectedRooms.splice(unconnectedRooms.indexOf(closestRooms[1]), 1);	
				connectedRooms.push(closestRooms[1]);
			}
		}

		var findClosestRooms(connected, unconnected) {
			let r1 = connected[0];
			let r2 = unconnected [0];
			return [r1, r2];
		}

		var connectRooms(connected, unconnected) {
			return true;
		}

		var connectRegions = function (board) {
			regions[0].connect();
			for (let i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
				for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
					if (board[i][j].squareType == WALL) {
						board[i][j].connector(regions, board);
					}
				}
			}
			var allConnected = false;
			while (!allConnected) {
				for (let r of regions) {
					if (r.connected && r.connectors.length != 0) {
						var temp = randomInt(r.connectors.length);
						for (let u of regions) {
							if (!u.connected && u.connectors.includes(r.connectors[temp])) {
							u.connect();
							r.connectors[temp].squareType = DOOR;
							u.connectors.splice(u.connectors.indexOf(r.connectors[temp]), 1)
							r.connectors.splice(temp, 1);
						}
					}
				}
			}
			allConnected = true;
			for (let r of regions) {
				if (!r.connected) {
					allConnected = false;
				}
			}
		}
	};

	var sparseMaze = function (board) {
		var deadends = true;
		while (deadends) {
			for (let i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
				for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
					if (board[i][j].deadend) {
						board[i][j].deadend = false;
						board[i][j].squareType = WALL;
					}
				}
			}

			for (let i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
				for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
					if (board[i][j].squareType == FLOOR && board[i][j].numNeighbors(board) <= 1 && random(1) < .99) {
						board[i][j].deadend = true;
					}
				}
			}

			deadends = false;
			for (let i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
				for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
					if (board[i][j].deadend) {
						deadends = true;
					}
				}
			}
		}
	};

	var removeDetours = function (board) {
		for (let i = 2; i < CONFIG.DUNGEON_SIZE - 2; i++) {
			for (let j = 2; j < CONFIG.DUNGEON_SIZE - 2; j++) {
				if (board[i][j].squareType == WALL && board[i][j].floorNeighbors(board) == 3 && board[i][j].diagonalFloorNeighbors(board) == 4) {
					board[i][j].squareType = PILLAR;
					if ((board[i - 1][j].squareType == WALL || board[i - 1][j].squareType == PILLAR)) {
						board[i - 1][j].squareType = FLOOR;
						board[i - 1][j].region = board[i][j].region;
						board[i + 1][j].squareType = WALL;
					}
					else if ((board[i + 1][j].squareType == WALL || board[i + 1][j].squareType == PILLAR)) {
						board[i + 1][j].squareType = FLOOR;
						board[i + 1][j].region = board[i][j].region;
						board[i - 1][j].squareType = WALL;
					}
					else if ((board[i][j - 1].squareType == WALL || board[i][j - 1].squareType == PILLAR)) {
						board[i][j - 1].squareType = FLOOR;
						board[i][j - 1].region = board[i][j].region;
						board[i][j + 1].squareType = WALL;
					}
					else if ((board[i][j + 1].squareType == WALL || board[i][j + 1].squareType == PILLAR)) {
						board[i][j + 1].squareType = FLOOR;
						board[i][j + 1].region = board[i][j].region;
						board[i][j - 1].squareType = WALL;
					}
				}
				else if (board[i][j].squareType == PILLAR) {
					board[i][j].squareType = WALL;
				}
			}
		}
		for (let i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
			for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
				if (board[i][j].squareType == WALL && board[i][j].floorNeighbors(board) == 4 && board[i][j].diagonalFloorNeighbors(board) == 4 && random(1) < .98) {
					var n = board[i][j].neighbors(board);
					var temp = randomInt(0, n.length);
					n[temp].squareType = WALL;
				}
			}
		}
		for (var i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
			for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
				if (board[i][j].squareType == PILLAR) {
					board[i][j].squareType = WALL;
				}
			}
		}
	};

	var fixMaze = function (board) {
		for (let i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
			for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
				if (board[i][j].squareType == DOOR && board[i][j].numNeighbors(board) < 2) {
					//delete doors with too many surrounding doors
					board[i][j].squareType = WALL;
				}
				if (board[i][j].squareType == DOOR && random(1) < .02) {
					board[i][j].squareType = FLOOR;
				}
				if (board[i][j].squareType == WALL && board[i][j].floorNeighbors(board) > 2) {
					//change walls to paths if they have more than 2 path neighbors
					board[i][j].squareType = FLOOR;
				}
				if (board[i][j].squareType == DOOR) {
					for (var a = i - 1; a <= i + 1; a++) {
						for (var b = j - 1; b <= j + 1; b++) {
							if (a > 0 && b > 0 && a < CONFIG.DUNGEON_SIZE - 1 && b < CONFIG.DUNGEON_SIZE - 1 && (a != i || b != j)) {
								if (board[a][b].squareType == DOOR && random(1) < .9) {
									board[a][b].squareType = WALL;
								}
							}
						}
					}
				}
			}
		}
	};

	var populate = function () {

		var i = 0;
		while (i < mobCap || (i > mobCap - 2 && random() < .2)) {
			var randomSquare = board[randomInt(CONFIG.DUNGEON_SIZE)][randomInt(CONFIG.DUNGEON_SIZE)];
			while (!randomSquare.canBeMobStart(STAIR_UP)) {
				var randomSquare = board[randomInt(CONFIG.DUNGEON_SIZE)][randomInt(CONFIG.DUNGEON_SIZE)];
			}
			randomSquare.containsMob = true;
			// mobs.push(new Mob(randomSquare.x, randomSquare.y, floorNum + 1));
			i++;
		}

	};

	var makeSquares = function (board) {
		for (var i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
			for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
				// if (!board[i][j].connected) board[i][j].squareType = WALL;
				board[i][j] = board[i][j].copy();
			}
		}
	};

	var addRegion = function (board, room, region) {
		for (let i = 0; i < room.width; i++) {
			for (let j = 0; j < room.height; j++) {
				board[i + room.left][j + room.top].region = region;
			}
		}
	};


	var printBoard = function (board) {
		for (let i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
			let row = "Row " + i + ": ";
			for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
				row += board[i][j].squareType + " ";
			}
			console.log(row);
		}
	}

	return createLevel(depth, stairUp);

}


function addChildren(board, room) {
	for (let i = room.left; i < room.right; i++) {
		for (let j = room.top; j < room.bottom; j++) {
			board[i][j].squareType = room.squares[i - room.left + 1][j - room.top + 1];
			board[i][j].roomSquare = true;
			board[i][j].room = room;
			// board[i][j].connected = true;
		}
	}
	for (let d of room.doorSquares) {
		if (board[d.x + room.left - 1][d.y + room.top - 1].region != undefined) {
			board[d.x + room.left - 1][d.y + room.top - 1].overlaps = true;
		}
		board[d.x + room.left - 1][d.y + room.top - 1].room = room;
		board[d.x + room.left - 1][d.y + room.top - 1].doorSquare = true;
		board[d.x + room.left - 1][d.y + room.top - 1].region = room.region;
	}
};

function addToConnected(s) {
	s.connected = true;
}

function connectToRegion(board, regions, region) {

	let room = random(region.rooms);
	let door = getDoor(board, room);
	let target;
	let otherRoom;
	if (door.overlaps == true) {
		target = door;
		otherRoom = getOtherRoom(board, room, target);
	}
	else {
		target = findTarget(board, region, door);
	}

	let connected = connect(board, door, target);

	while (!connected) {
		room.doorSquares.splice(room.doorSquares.indexOf(door), 1);

		room = random(region.rooms);
		while (room.doorSquares.length == 0) {
			room = random(region.rooms);
		}
		door = getDoor(board, room);
		if (door.overlaps == true) {
			target = door;
			otherRoom = getOtherRoom(board, room, target);
		}
		else {
			target = findTarget(board, region, door);
		}
		connected = connect(board, door, target);
	}

	console.log(target);
	console.log(otherRoom);

	room.addDoor(door);
	if (door.overlaps) {
		otherRoom.region.addRooms(door.region.rooms);
		otherRoom.addDoor(door);
	}
	else {
		target.region.addRooms(door.region.rooms);
	}
	regions.splice(regions.indexOf(region), 1);

}

function getOtherRoom(board, room, square) {
	if (square.x > 3 && board[square.x - 1][square.y].room != room) return board[square.x - 1][square.y].room;
	if (square.y > 3 && board[square.x][square.y - 1].room != room) return board[square.x][square.y - 1].room;
	if (square.x < CONFIG.DUNGEON_SIZE - 4 && board[square.x + 1][square.y].room != room) return board[square.x + 1][square.y].room;
	if (square.y < CONFIG.DUNGEON_SIZE - 4 && board[square.x][square.y + 1].room != room) return board[square.x][square.y + 1].room;
	return false;
}

function getDoor(board, room) {
	let door = getDoorSquare(board, random(room.doorSquares), room.left, room.top);
	while (!door.connector(board) || !room.canBeDoor(door)) {
		room.doorSquares.splice(room.doorSquares.indexOf(door), 1);
		door = getDoorSquare(board, random(room.doorSquares), room.left, room.top);
	}
	return door;
}

function getDoorSquare(board, pos, left, top) {
	return board[left + pos.x - 1][top + pos.y - 1];
}

function findTarget(board, region, square) {
	let target = undefined;
	let radius = 1;
	while (target === undefined) {
		minX = constrainLow(0, square.x - radius);
		maxX = constrainHigh(CONFIG.DUNGEON_SIZE - 1, square.x + radius);
		minY = constrainLow(0, square.y - radius);
		maxY = constrainHigh(CONFIG.DUNGEON_SIZE - 1, square.y + radius);

		for (let x = minX; x <= maxX; x++) {
			if (canBeTarget(board, square, board[x][minY])) {
				target = board[x][minY];
				break;
			}
			else if (canBeTarget(board, square, board[x][maxY])) {
				target = board[x][maxY];
				break;
			}
		}
		if (target === undefined) {
			for (let y = minY; y <= maxY; y++) {
				if (canBeTarget(board, square, board[minX][y])) {
					target = board[minX][y];
					break;
				}
				else if (canBeTarget(board, square, board[maxX][y])) {
					target = board[maxX][y];
					break;
				}
			}
		}
		radius++;
	}
	return target;
}

function canBeTarget(board, start, square) {
	return canBeDoorTarget(board, start, square);
}

function canBeDoorTarget(board, start, square) {
	return (square.doorSquare && square.overlaps == false && square.region != start.region && square.adjacentNodes(board).length > 0);
}

function canBeNodeTarget(region, square) {
	return (square.nodeSquare && square.connected && square.region != region && square.region !== undefined);
}

function connect(board, start, target) {
	if (start == target) {
		start.squareType = DOOR;
		return true;
	}
	else {
		let nodeStart = start.adjacentNodes(board)[0];
		let nodeTarget = target.adjacentNodes(board)[0];
		let path = findNodePath(board, nodeStart, nodeTarget);
		if (path == false) {
			return false
		}
		else {
			addToConnected(nodeStart);
			addToConnected(nodeTarget);
			start.squareType = DOOR;
			target.squareType = DOOR;
			connectPath(board, target.region, path, nodeStart);
			return true;
		}
	}
}

function connectPath(board, region, path, start) {
	let current = start;
	for (let p of path) {
		connectToNode(board, region, current, p);
		current = p;
	}
}

function connectToNode(board, region, node1, node2) {
	let difX = 0;
	if (node1.x < node2.x) {
		difX = 1;
	}
	else if (node1.x > node2.x) {
		difX = -1;
	}

	let difY = 0;
	if (node1.y < node2.y) {
		difY = 1;
	}
	else if (node1.y > node2.y) {
		difY = -1;
	}

	board[node1.x][node1.y].squareType = FLOOR;
	board[node2.x][node2.y].squareType = FLOOR;
	board[node1.x + difX][node1.y + difY].squareType = FLOOR;
	board[node1.x][node1.y].region = region;
	board[node2.x][node2.y].region = region;
	board[node1.x + difX][node1.y + difY].region = region;
	addToConnected(board[node1.x + difX][node1.y + difY]);
	addToConnected(node1);
	addToConnected(node2);
}
