
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

        genMaze(board);
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
            addChildren(r, board);
            regions.push(new Region(r.squares));
            addRegion(board, r, regions[regions.length - 1]);
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

            // console.log("x: " + roomx + "   y: " + roomy);

            var newRoom = new Room(template, roomx, roomy);
            var valid = true;

            for (let r of rooms) {
                if (newRoom.overlaps(r)) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                rooms.push(newRoom);
                addChildren(newRoom, board);
                regions.push(new Region(newRoom.squares));
                addRegion(board, newRoom, regions[regions.length - 1]);
            }
        }
    };

    var genMaze = function (board) {

        // le = [];

        for (let x = 1; x < CONFIG.DUNGEON_SIZE - 1; x++) {
            for (let y = 1; y < CONFIG.DUNGEON_SIZE - 1; y++) {
                if (x % 2 == 1 && y % 2 == 1 && !board[x][y].roomSquare) {

                    board[x][y].squareType = FLOOR;
                    // nodes.push(board[x][y]);
                    board[x][y].nodeSquare = true;
                    // if (board[x][y].squareType == WALL && board[x][y].numNeighbors(board) <= 1 && board[x - 1][y].squareType == WALL && board[x][y - 1].squareType == WALL) {
                    // current.x = x;
                    // current.y = y;
                    // genMazeSection(board, current);
                }
            }
        }

        // retur;

        // let current = createVector();

        // for (let x = 1; x < CONFIG.DUNGEON_SIZE - 1; x++) {
        //     for (let y = 1; y < CONFIG.DUNGEON_SIZE - 1; y++) {
        //         if (x % 2 == 1 && y % 2 == 1) {
        //             if (board[x][y].squareType == WALL && board[x][y].numNeighbors(board) <= 1 && board[x - 1][y].squareType == WALL && board[x][y - 1].squareType == WALL) {
        //                 current.x = x;
        //                 current.y = y;
        //                 genMazeSection(board, current);
        //             }
        //         }
        //     }
        // }

        // for (let r of regions) {
        //     for (let s of r.squares) {
        //         s.region = r;
        //     }
        // }

        //make some imperfections
        // let IMPERFECTION_RATE = floor(1 / .01);

        // for (var i = 2; i < CONFIG.DUNGEON_SIZE - 2; i++) {
        //     for (let j = 2; j < CONFIG.DUNGEON_SIZE - 2; j++) {
        //         if (board[i][j].squareType == FLOOR && board[i][j].floorNeighbors(board, CONFIG.DUNGEON_SIZE) == 2) {
        //             if ((board[i - 1][j].squareType == WALL && board[i - 2][j].squareType == FLOOR && board[i - 2][j].region == board[i][j].region) && oneIn(IMPERFECTION_RATE)) {
        //                 board[i - 1][j].squareType = FLOOR;
        //                 board[i - 1][j].region = board[i][j].region;
        //             }
        //             if ((board[i + 1][j].squareType == WALL && board[i + 2][j].squareType == FLOOR && board[i + 2][j].region == board[i][j].region) && oneIn(IMPERFECTION_RATE)) {
        //                 board[i + 1][j].squareType = FLOOR;
        //                 board[i + 1][j].region = board[i][j].region;
        //             }
        //             if ((board[i][j - 1].squareType == WALL && board[i][j - 2].squareType == FLOOR && board[i][j - 2].region == board[i][j].region) && oneIn(IMPERFECTION_RATE)) {
        //                 board[i][j - 1].squareType = FLOOR;
        //                 board[i][j - 1].region = board[i][j].region;
        //             }
        //             if ((board[i][j + 1].squareType == WALL && board[i][j + 2].squareType == FLOOR && board[i][j + 2].region == board[i][j].region) && oneIn(IMPERFECTION_RATE)) {
        //                 board[i][j + 1].squareType = FLOOR;
        //                 board[i][j + 1].region = board[i][j].region;
        //             }
        //         }
        //     }
        // }
        // //more imperfections?
        // for (var i = 2; i < CONFIG.DUNGEON_SIZE - 2; i++) {
        //     for (let j = 2; j < CONFIG.DUNGEON_SIZE - 2; j++) {
        //         if (board[i][j].squareType == WALL && board[i][j].floorNeighbors(board, CONFIG.DUNGEON_SIZE) == 2) {
        //             if ((board[i - 1][j].squareType == FLOOR && board[i + 1][j].squareType == FLOOR && board[i - 1][j].region == board[i + 1][j].region) && random(1) < .02) {
        //                 board[i][j].squareType = FLOOR;
        //                 board[i][j].region = board[i][j].region;
        //             }
        //             if ((board[i][j - 1].squareType == FLOOR && board[i][j + 1].squareType == FLOOR && board[i][j - 1].region == board[i][j + 1].region) && random(1) < .02) {
        //                 board[i][j].squareType = FLOOR;
        //                 board[i][j].region = board[i][j].region;
        //             }
        //         }
        //     }
        // }
    };

    var genMazeSection = function (board, current) {
        let moveStack = [];
        let unvisitedSquares = true;
        let sectionSquares = [];
        let currentSquare = createVector(current.x, current.y);

        while (unvisitedSquares) {
            board[currentSquare.x][currentSquare.y].squareType = FLOOR;
            sectionSquares.push(board[currentSquare.x][currentSquare.y]);
            let moves = board[currentSquare.x][currentSquare.y].moves(board);
            if (moves.length !== 0) {
                moveStack.push(currentSquare);
                var randomMove = randomInt(moves.length);
                if (randomMove % 2 == 1) {
                    randomMove = randomInt(moves.length);
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
            unvisitedSquares = false;
            for (var i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
                for (let j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
                    if (i % 2 == 1 || j % 2 == 1) {
                        if (board[i][j].squareType == WALL) {
                            unvisitedSquares = true;
                        }
                    }
                }
            }
        }
        var r = new Region(sectionSquares);
        r.path = true;
        regions.push(r);
    };

    var connectRooms = function (board) {

        //actually, loop through all rooms, get a couple doors for each room, then make it a region. then connect regions. this way you guarentee 1-? doors per room, with many fewer wasted loops

        for (let r of rooms) {
            let door = getDoorSquare(board, random(r.doorSquares), r.left, r.top);
            while (!door.connector(board) || door.adjacentDoors(board) > 0 || door.nearbyDoors(board) > 0) {
                r.doorSquares.splice(r.doorSquares.indexOf(door), 1);
                door = getDoorSquare(board, random(r.doorSquares), r.left, r.top);
            }
            door.squareType = DOOR;
            addToConnected(door);
            r.doors.push(door);

            let adjacentNodes = door.adjacentNodes(board);
            if (adjacentNodes.length > 0) {
                addToConnected(adjacentNodes[0]);
            }
        }

        let allConnected = false;

        for (let r of rooms) {

            let door = r.doors[0];
            let target = findTarget(board, door, r.doors);
            if (!connect(board, door, target)) {
                while (!connect(board, door, target) && r.doorSquares.length > 2) {
                    r.doorSquares.splice(r.doorSquares.indexOf(door), 1);
                    door = getDoorSquare(board, random(r.doorSquares), r.left, r.top);
                    while ((!door.connector(board) || door.adjacentDoors(board) > 0 || door.nearbyDoors(board) > 1) && r.doorSquares.length > 1) {
                        r.doorSquares.splice(r.doorSquares.indexOf(door), 1);
                        door = getDoorSquare(board, random(r.doorSquares), r.left, r.top);
                    }

                    target = findTarget(board, door, r.doors);
                }

            }
            r.doors.push(door);

            let numDoors = random(2, r.maxDoors) - 1;
            for (let i = r.doorSquares - 1; i >= 0; i--) {
                if (getDoorSquare(board, r.doorSquares[i], r.left, r.top).squareType == DOOR) {
                    numDoors--;
                    // r.doorSquares.splice(i, 1);
                }
            }

            while (numDoors > 0 && r.doorSquares.length > 2) {
                r.doorSquares.splice(r.doorSquares.indexOf(door), 1);
                door = getDoorSquare(board, random(r.doorSquares), r.left, r.top);
                while ((!door.connector(board) || door.adjacentDoors(board) > 0 || door.nearbyDoors(board) > 1) && r.doorSquares.length > 1) {
                    r.doorSquares.splice(r.doorSquares.indexOf(door), 1);
                    door = getDoorSquare(board, random(r.doorSquares), r.left, r.top);
                }
                if (door.connector(board) && door.adjacentDoors(board) == 0 && door.nearbyDoors(board) <= 1) {
                    target = findTarget(board, door, r.doors);
                    if (connect(board, door, target)) numDoors--;
                }
            }
        }

        // while (!allConnected) {

        //     //for all rooms, for all doors, find a path to a connected square or another door
        //     let currentRoom = random(rooms);
        //     addToConnected(currentRoom);
        //     rooms.splice(rooms.indexOf(currentRoom), 1);
        //     let currentDoor = random(currentRoom.doors);
        //     console.log(currentDoor);
        //     while (!currentDoor.connector(board)) {
        //         currentRoom.doors.splice(currentRoom.doors.indexOf(currentDoor), 1);
        //         currentDoor = random(currentRoom.doors);
        //     }
        //     addToConnected(currentDoor);
        //     currentRoom.doors.splice(currentRoom.doors.indexOf(currentDoor), 1);
        //     let currentNode = random(currentDoor.adjacentNodes(board));
        //     while (currentNode.adjacentDoors(board) == 0 && currentNode.surroundingNodes(board).length > 0) {
        //         let newNode = random(currentNode.surroundingNodes(board));
        //         addToConnected(currentNode);
        //         connectToNode(board, currentNode, newNode);
        //         currentNode = newNode;
        //     }
        //     allConnected = true;
        //     for (let r of rooms) {
        //         if (!r.connected) allConnected = false;
        //     }
        // }



        // console.log(currentlyConnecting);

        // while (!allConnected) {
        // let room = random(rooms);
        // while (room.connected) {
        //     room = random(rooms);
        // }
        // let door = getDoorSquare(board, random(room.doorSquares), room.left, room.top);
        // while (door.adjacentNodes(board) == 0) {
        //     room = random(rooms);
        //     door = getDoorSquare(board, random(room.doorSquares), room.left, room.top);
        // }
        // door.squareType = DOOR;
        // room.connected = true;
        // allConnected = true;
        // for (let r of rooms) {
        //     if (!r.connected) allConnected = false;
        // }
        // }

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
                if (!board[i][j].connected) board[i][j].squareType = WALL;
                board[i][j] = board[i][j].copy();
            }
        }
    };

    var addChildren = function (room, board) {
        for (let i = room.left; i < room.right; i++) {
            for (let j = room.top; j < room.bottom; j++) {
                board[i][j].squareType = room.squares[i - room.left + 1][j - room.top + 1];
                board[i][j].roomSquare = true;
                board[i][j].connected = true;
            }
        }
        for (let d of room.doorSquares) {
            board[d.x][d.y].doorSquare = true;
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


function getDoorSquare(board, pos, left, top) {
    return board[left + pos.x - 1][top + pos.y - 1];
}

function addToConnected(toConnect) {
    toConnect.connected = true;
}

function findTarget(board, square) {
    if (square.roomConnector(board)) return square;
    square = square.adjacentNodes(board)[0];
    let target = undefined;
    let radius = 1;
    while (target === undefined) {
        minX = constrainLow(0, square.x - radius);
        maxX = constrainHigh(CONFIG.DUNGEON_SIZE - 1, square.x + radius);
        minY = constrainLow(0, square.y - radius);
        maxY = constrainHigh(CONFIG.DUNGEON_SIZE - 1, square.y + radius);

        for (let x = minX; x <= maxX; x++) {
            if (canBeTarget(board, board[x][minY])) {
                target = board[x][minY];
                break;
            }
            else if (canBeTarget(board, board[x][maxY])) {
                target = board[x][maxY];
                break;
            }
        }
        if (target === undefined) {
            for (let y = minY; y <= maxY; y++) {
                if (canBeTarget(board, board[minX][y])) {
                    target = board[minX][y];
                    break;
                }
                else if (canBeTarget(board, board[maxX][y])) {
                    target = board[maxX][y];
                    break;
                }
            }
        }
        radius++;
    }
    return target;
}

function canBeTarget(board, square) {
    // return ((square.nodeSquare && square.connected) || (square.doorSquare && !square.connected && !doors.includes(square) && square.adjacentDoors(board) == 0 && square.adjacentNodes(board).length > 0));
    return (square.nodeSquare && square.connected);
}

function connect(board, start, target) {
    if (target == start) addToConnected(start);
    else {
        let nodeStart = start.adjacentNodes(board)[0];
        let path = findNodePath(board, nodeStart, target);

        if (path !== false) {
            addToConnected(start);
            addToConnected(nodeStart);
            addToConnected(target);
            connectPath(board, path, nodeStart);
        }
        else {
            return false;
        }
    }
    return true;
}

function connectPath(board, path, start) {
    let current = start;
    for (let p of path) {
        connectToNode(board, current, p);
        current = p;
    }
}

function connectToNode(board, node1, node2) {
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

    board[node1.x + difX][node1.y + difY].squareType = FLOOR;
    addToConnected(board[node1.x + difX][node1.y + difY]);
    addToConnected(node1);
    addToConnected(node2);
}
