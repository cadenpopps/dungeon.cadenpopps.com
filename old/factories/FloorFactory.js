function FloorFactory() {

	var newFloor;
	var board;
	var stairUp;
	var stairDown;
	var floorNum;
	var rooms;
	var regions;
	var mobs;
	var maxRoomSize;
	var minRoomSize;
	var roomOffSet;
	var lootCap;
	var mobCap;

	this.createFloor = function (_stairUp, _floorNum) {

		stairUp = _stairUp;
		floorNum = _floorNum;
		stairDown = null;
		rooms = [];
		regions = [];
		mobs = [];
		lootCap = floor((DUNGEON_SIZE / 5) + ((_floorNum + 7) / 2));
		mobCap = floor((DUNGEON_SIZE / 8) + ((_floorNum + 30) / 2));

		if (lootCap > DUNGEON_SIZE / 2) {
			lootCap = DUNGEON_SIZE / 2;
		}
		if (lootCap > DUNGEON_SIZE / 1.5) {
			lootCap = DUNGEON_SIZE / 1.5;
		}

		// console.log("\n\n\nLootcap for this floor: " + lootCap);
		// console.log("Mobcap for this floor: " + mobCap);

		this.genBoard(DUNGEON_SIZE);

		this.genDungeon();

		for (var i = 0; i < DUNGEON_SIZE; i++) {
			for (var j = 0; j < DUNGEON_SIZE; j++) {
				board[i][j] = board[i][j].copy();
			}
		}

		if (!findPath(board[stairDown.x][stairDown.y], board[stairUp.x][stairUp.y], board)) {
			return this.createFloor(_stairUp, _floorNum);
		}

		return new Floor(board, stairUp, stairDown, mobs, mobCap);

	};

	this.genBoard = function (_DUNGEON_SIZE) {
		board = new Array(_DUNGEON_SIZE);
		for (var i = 0; i < _DUNGEON_SIZE; i++) {
			board[i] = new Array(_DUNGEON_SIZE);
			for (var j = 0; j < _DUNGEON_SIZE; j++) {
				board[i][j] = new SquareBuilder(i, j);
			}
		}
	};

	this.genDungeon = function () {
		this.genStairs();
		console.log("stairs done");

		this.genRooms();
		console.log("rooms done");

		this.genMaze();
		console.log("maze done");

		this.connectRegions();
		console.log("regions done");

		this.sparseMaze();
		this.removeDetours();
		this.sparseMaze();
		this.removeDetours();
		this.sparseMaze();

		// console.log("sparse done");

		// for (var i = 0; i < 3; i++) {
		// 	this.removeDetours();
		// 	this.sparseMaze();
		// }
		// console.log("detours removed");

		this.fixMaze();
		// console.log("maze fixed");


		// move down to detour code
		for (var i = 0; i < DUNGEON_SIZE; i++) {
			for (var j = 0; j < DUNGEON_SIZE; j++) {
				if (board[i][j].squareType == 5) {
					board[i][j].squareType = WALL;
				}
			}
		}

		board[stairUp.x][stairUp.y].squareType = STAIRUP;
		board[stairDown.x][stairDown.y].squareType = STAIRDOWN;

		// this.populate();

		// rooms = null;
		// regions = null;

	};

	this.genStairs = function () {

		stairDown = createVector(floor(random(5, DUNGEON_SIZE - 5)), floor(random(5, DUNGEON_SIZE - 5)));

		while (abs(stairDown.x - stairUp.x) < DUNGEON_SIZE / 3 && abs(stairDown.y - stairUp.y) < DUNGEON_SIZE / 3) {
			stairDown.x = floor(random(5, DUNGEON_SIZE - 5));
			stairDown.y = floor(random(5, DUNGEON_SIZE - 5));
		}

		var stairDownRoom = new Room(stairDown.x, stairDown.y, STAIRROOMPOOL[floor(random(STAIRROOMPOOL.length))]);
		var stairUpRoom = new Room(stairUp.x, stairUp.y, STAIRROOMPOOL[floor(random(STAIRROOMPOOL.length))]);

		rooms.push(stairUpRoom);
		rooms.push(stairDownRoom);

		for (let r of rooms) {
			addChildren(r, board);
			regions.push(new Region(r.childSquares));
			addRegion(board, r, regions[regions.length - 1]);
			r.roomType = -1;
		}

	};

	this.genRooms = function () {

		for (var i = 0; i < ROOM_TRIES; i++) {
			let D_EDGE = 5;

			var center = [floor(random(D_EDGE, DUNGEON_SIZE - D_EDGE)), floor(random(D_EDGE, DUNGEON_SIZE - D_EDGE))];
			var newRoom = new Room(center[0], center[1], ROOMPOOL[floor(random(ROOMPOOL.length))]);
			var valid = true;

			for (let r of rooms) {
				if (!newRoom.valid(r)) {
					valid = false;
					break;
				}
			}

			if (valid) {
				rooms.push(newRoom);
				addChildren(newRoom, board);
				regions.push(new Region(newRoom.childSquares));
				addRegion(board, newRoom, regions[regions.length - 1]);
			}
		}
	};

	this.genMaze = function () {

		var cur = createVector(0, 0);

		for (var x = 0; x < DUNGEON_SIZE; x++) {
			for (var y = 0; y < DUNGEON_SIZE; y++) {
				if (x % 2 == 1 || y % 2 == 1) {
					if (x > 0 && y > 0 && board[x][y].squareType == WALL && board[x][y].numNeighbors(board) < 2 && board[x - 1][y].squareType == WALL && board[x][y - 1].squareType == WALL) {
						cur.x = x;
						cur.y = y;
						this.genMazeSection(cur);
					}
				}
			}
		}
		for (let r of regions) {
			for (let s of r.children) {
				s.region = r;
			}
		}

		//make some imperfections
		const IMPERFECTION_RATE = 0;

		for (var i = 0; i < DUNGEON_SIZE; i++) {
			for (var j = 0; j < DUNGEON_SIZE; j++) {
				if (board[i][j].squareType == PATH && board[i][j].pathNeighbors(board, DUNGEON_SIZE) == 2) {
					if (i > 1 && j > 1 && i < DUNGEON_SIZE - 2 && j < DUNGEON_SIZE - 2 && (board[i - 1][j].squareType == WALL && board[i - 2][j].squareType == PATH && board[i - 2][j].region == board[i][j].region) && random(1) < IMPERFECTION_RATE) {
						board[i - 1][j].squareType = PATH;
						board[i - 1][j].region = board[i][j].region;
					}
					if (i > 1 && j > 1 && i < DUNGEON_SIZE - 2 && j < DUNGEON_SIZE - 2 && (board[i + 1][j].squareType == WALL && board[i + 2][j].squareType == PATH && board[i + 2][j].region == board[i][j].region) && random(1) < IMPERFECTION_RATE) {
						board[i + 1][j].squareType = PATH;
						board[i + 1][j].region = board[i][j].region;
					}
					if (i > 1 && j > 1 && i < DUNGEON_SIZE - 2 && j < DUNGEON_SIZE - 2 && (board[i][j - 1].squareType == WALL && board[i][j - 2].squareType == PATH && board[i][j - 2].region == board[i][j].region) && random(1) < IMPERFECTION_RATE) {
						board[i][j - 1].squareType = PATH;
						board[i][j - 1].region = board[i][j].region;
					}
					if (i > 1 && j > 1 && i < DUNGEON_SIZE - 2 && j < DUNGEON_SIZE - 2 && (board[i][j + 1].squareType == WALL && board[i][j + 2].squareType == PATH && board[i][j + 2].region == board[i][j].region) && random(1) < IMPERFECTION_RATE) {
						board[i][j + 1].squareType = PATH;
						board[i][j + 1].region = board[i][j].region;
					}
				}
			}
		}
		//more imperfections?
		for (var i = 0; i < DUNGEON_SIZE; i++) {
			for (var j = 0; j < DUNGEON_SIZE; j++) {
				if (board[i][j].squareType == -1 && board[i][j].pathNeighbors(board, DUNGEON_SIZE) == 2) {
					if (i > 1 && j > 1 && i < DUNGEON_SIZE - 2 && j < DUNGEON_SIZE - 2 && (board[i - 1][j].squareType == PATH && board[i + 1][j].squareType == PATH && board[i - 1][j].region == board[i + 1][j].region) && random(1) < .02) {
						board[i][j].squareType = PATH;
						board[i][j].region = board[i][j].region;
					}
					if (i > 1 && j > 1 && i < DUNGEON_SIZE - 2 && j < DUNGEON_SIZE - 2 && (board[i][j - 1].squareType == PATH && board[i][j + 1].squareType == PATH && board[i][j - 1].region == board[i][j + 1].region) && random(1) < .02) {
						board[i][j].squareType = PATH;
						board[i][j].region = board[i][j].region;
					}
				}
			}
		}
	};

	this.genMazeSection = function (cur) {

		moveStack = [];
		notVisited = true;
		var sectionSquares = [];
		currentSquare = createVector(cur.x, cur.y);

		while (notVisited) {
			board[currentSquare.x][currentSquare.y].squareType = PATH;
			sectionSquares.push(board[currentSquare.x][currentSquare.y]);
			var moves = board[currentSquare.x][currentSquare.y].moves(board);
			if (moves.length !== 0) {
				moveStack.push(currentSquare);
				var randomMove = floor(random(moves.length));
				if (randomMove % 2 == 1) {
					randomMove = floor(random(moves.length));
				}
				currentSquare = moves[randomMove];
			}
			else if (moveStack.length !== 0) {
				currentSquare = moveStack[moveStack.length - 1];
				moveStack.pop();
			}
			else {
				break;
			}
			notVisited = false;
			for (var i = 0; i < DUNGEON_SIZE; i++) {
				for (var j = 0; j < DUNGEON_SIZE; j++) {
					if (i % 2 == 1 || j % 2 == 1) {
						if (board[i][j].squareType == WALL) {
							notVisited = true;
						}
					}
				}
			}
		}
		var r = new Region(sectionSquares);
		r.path = true;
		regions.push(r);
	};

	this.connectRegions = function () {
		regions[0].connect();
		for (var i = 0; i < DUNGEON_SIZE; i++) {
			for (var j = 0; j < DUNGEON_SIZE; j++) {
				if (board[i][j].squareType == -1) {
					board[i][j].connector(regions, board);
				}
			}
		}
		var allConnected = false;
		while (!allConnected) {
			for (let r of regions) {
				if (r.connected && r.connectors.length != 0) {
					var temp = floor(random(r.connectors.length));
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

	this.sparseMaze = function () {
		var deadends = true;
		while (deadends) {
			for (var i = 0; i < DUNGEON_SIZE; i++) {
				for (var j = 0; j < DUNGEON_SIZE; j++) {
					if (board[i][j].deadend) {
						board[i][j].deadend = false;
						board[i][j].squareType = -1;
					}
				}
			}

			for (var i = 0; i < DUNGEON_SIZE; i++) {
				for (var j = 0; j < DUNGEON_SIZE; j++) {
					if (board[i][j].squareType == PATH && board[i][j].numNeighbors(board) <= 1 && random(1) < .99) {
						board[i][j].deadend = true;
					}
				}
			}

			deadends = false;
			for (var i = 0; i < DUNGEON_SIZE; i++) {
				for (var j = 0; j < DUNGEON_SIZE; j++) {
					if (board[i][j].deadend) {
						deadends = true;
					}
				}
			}
		}
	};

	this.removeDetours = function () {
		for (var i = 0; i < DUNGEON_SIZE; i++) {
			for (var j = 0; j < DUNGEON_SIZE; j++) {
				if (board[i][j].squareType == WALL && board[i][j].pathNeighbors(board) == 3 && board[i][j].diagNeighbors(board) == 4) {
					board[i][j].squareType = 5;
					if (i > 1 && j > 1 && i < DUNGEON_SIZE - 2 && j < DUNGEON_SIZE - 2 && (board[i - 1][j].squareType == WALL || board[i - 1][j].squareType == 5)) {
						board[i - 1][j].squareType = PATH;
						board[i - 1][j].region = board[i][j].region;
						board[i + 1][j].squareType = WALL;
					}
					else if (i > 1 && j > 1 && i < DUNGEON_SIZE - 2 && j < DUNGEON_SIZE - 2 && (board[i + 1][j].squareType == WALL || board[i + 1][j].squareType == 5)) {
						board[i + 1][j].squareType = PATH;
						board[i + 1][j].region = board[i][j].region;
						board[i - 1][j].squareType = WALL;
					}
					else if (i > 1 && j > 1 && i < DUNGEON_SIZE - 2 && j < DUNGEON_SIZE - 2 && (board[i][j - 1].squareType == WALL || board[i][j - 1].squareType == 5)) {
						board[i][j - 1].squareType = PATH;
						board[i][j - 1].region = board[i][j].region;
						board[i][j + 1].squareType = WALL;
					}
					else if (i > 1 && j > 1 && i < DUNGEON_SIZE - 2 && j < DUNGEON_SIZE - 2 && (board[i][j + 1].squareType == WALL || board[i][j + 1].squareType == 5)) {
						board[i][j + 1].squareType = PATH;
						board[i][j + 1].region = board[i][j].region;
						board[i][j - 1].squareType = WALL;
					}
				}
				else if (board[i][j].squareType == 5) {
					board[i][j].squareType = WALL;
				}
			}
		}
		for (var i = 0; i < DUNGEON_SIZE; i++) {
			for (var j = 0; j < DUNGEON_SIZE; j++) {
				if (board[i][j].squareType == WALL && board[i][j].pathNeighbors(board) == 4 && board[i][j].diagNeighbors(board) == 4 && random(1) < .98) {
					var n = board[i][j].neighbors(board);
					var temp = floor(random(0, n.length));
					n[temp].squareType = WALL;
				}
			}
		}
	};

	this.fixMaze = function () {
		for (var i = 0; i < DUNGEON_SIZE; i++) {
			for (var j = 0; j < DUNGEON_SIZE; j++) {
				if (board[i][j].squareType == DOOR && board[i][j].numNeighbors(board) < 2) {
					//delete doors with too many surrounding doors
					board[i][j].squareType = WALL;
				}
				if (board[i][j].squareType == DOOR && random(1) < .02) {
					board[i][j].squareType = PATH;
				}
				if (board[i][j].squareType == WALL && board[i][j].pathNeighbors(board) > 2) {
					//change walls to paths if they have more than 2 path neighbors
					board[i][j].squareType = 0;
				}
				if (board[i][j].squareType == DOOR) {
					for (var a = i - 1; a <= i + 1; a++) {
						for (var b = j - 1; b <= j + 1; b++) {
							if (a > 0 && b > 0 && a < DUNGEON_SIZE - 1 && b < DUNGEON_SIZE - 1 && (a != i || b != j)) {
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

	this.populate = function () {

		var i = 0;
		while (i < lootCap) {
			var randomSquare = board[floor(random(DUNGEON_SIZE))][floor(random(DUNGEON_SIZE))];
			while (!randomSquare.canBeLoot(board)) {
				var randomSquare = board[floor(random(DUNGEON_SIZE))][floor(random(DUNGEON_SIZE))];
			}
			randomSquare.squareType = 2;
			i++;
		}
		i = 0;
		while (i < mobCap || (i > mobCap - 2 && random() < .2)) {
			var randomSquare = board[floor(random(DUNGEON_SIZE))][floor(random(DUNGEON_SIZE))];
			while (!randomSquare.canBeMobStart(stairUp)) {
				var randomSquare = board[floor(random(DUNGEON_SIZE))][floor(random(DUNGEON_SIZE))];
			}
			randomSquare.containsMob = true;
			// mobs.push(new Mob(randomSquare.x, randomSquare.y, floorNum + 1));
			i++;
		}

	};
}

function addChildren(room, board) {
	for (var i = room.topLeftx; i < room.topLeftx + room.width; i++) {
		for (var j = room.topLefty; j < room.topLefty + room.height; j++) {
			board[i][j].squareType = room.childSquares[i - room.topLeftx][j - room.topLefty];
		}
	}
}

function addRegion(board, room, region) {
	for (var i = 0; i < room.width; i++) {
		for (var j = 0; j < room.height; j++) {
			board[i + room.topLeftx][j + room.topLefty].region = region;
		}
	}
}