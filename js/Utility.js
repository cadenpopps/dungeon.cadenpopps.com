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
    cameFrom[start] = -1;

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
            let currentNeighbor = n;
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
    console.log("fail");
    return false;
}

function squareDistance(start, end) {
    return ((start.x - end.x) * (start.x - end.x)) + ((start.y - end.y) * (start.y - end.y));
}

function makePath(board, cameFrom, last) {
    let path = [];
    let current = last.squareCode;
    while (cameFrom[current] > 0) {
        path.unshift(getSquareFromCode(board, current));
        current = cameFrom[current];
    }
    // console.log(path);
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

    searching.push(start);
    distFromStart[start] = 0;
    finalCost[start] = squareDistance(start, end);
    cameFrom[start] = -1;

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
            let currentNeighbor = n;
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
    console.log("fail");
    return false;
}