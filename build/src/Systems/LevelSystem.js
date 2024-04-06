import Levels from "../../content/Levels.js";
import Rooms from "../../content/Rooms.js";
import { abs, ceil, floor, oneIn } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import LevelChangeComponent from "../Components/LevelChangeComponent.js";
import LevelComponent from "../Components/LevelComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import TileComponent from "../Components/TileComponent.js";
import * as Constants from "../Constants.js";
import { Tile } from "../Constants.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
export default class LevelSystem extends System {
    BASE_LEVEL_SIZE = 50;
    LEVEL_GROWTH = 0.75;
    ROOM_DENSITY = 50;
    DENSITY_GROWTH = 0.8;
    currentLevel;
    levels;
    constructor(eventManager, entityManager) {
        super(SystemType.Level, eventManager, entityManager, [CType.Player]);
        this.levels = [];
    }
    handleEvent(event) {
        switch (event) {
            case Event.new_game:
                this.loadLevel(Levels.DungeonTown);
                break;
            case Event.level_change:
                this.changeLevel();
                break;
        }
    }
    changeLevel() {
        const exitId = this.entityManager.get(this.entities[0], CType.Player).levelChangeId;
        const depth = this.currentLevel.depth;
        for (let l of this.levels) {
            if (depth !== l.depth) {
                for (let e of l.entities) {
                    if ((e.has(CType.LevelChange) && e.get(CType.LevelChange).id) === exitId) {
                        this.loadLevel(l);
                        return;
                    }
                }
            }
        }
        this.loadLevel(this.generateLevel(exitId, depth + 1));
    }
    loadLevel(level) {
        if (this.currentLevel) {
            this.entityManager.removeEntities(this.currentLevel.entityIds);
        }
        if (!this.levels.includes(level)) {
            this.levels.push(level);
        }
        this.currentLevel = level;
        this.currentLevel.entityIds = this.entityManager.addEntities(this.currentLevel.entities);
        this.eventManager.addEvent(Event.level_loaded);
    }
    getTimePassed(startDate) {
        return `${new Date().getTime() - startDate.getTime()}`;
    }
    generateLevel(entryId, depth) {
        const newLevel = new LevelComponent(depth);
        this.entityManager.addEntity(new Map([[CType.Level, newLevel]]));
        let rooms = [];
        console.log(`Generating level with depth ${depth}`);
        console.log(`Level seed: ${newLevel.seed}`);
        let startTotal = new Date();
        let start = new Date();
        rooms.push(this.generateEntryRoom(newLevel.seed, depth, entryId));
        rooms.push(this.generateExitRoom(newLevel.seed, depth, entryId + 1));
        console.log(`${this.getTimePassed(start)}ms - generate entry and exit`);
        start = new Date();
        this.generateRooms(newLevel.seed, depth, rooms);
        console.log(`${this.getTimePassed(start)}ms - generate rooms`);
        start = new Date();
        const levelMap = this.placeRoomsOnMap(rooms);
        console.log(`${this.getTimePassed(start)}ms - place rooms on map`);
        start = new Date();
        this.connectRooms(newLevel.seed, rooms, levelMap);
        console.log(`${this.getTimePassed(start)}ms - connect rooms`);
        start = new Date();
        this.placeWalls(levelMap);
        console.log(`${this.getTimePassed(start)}ms - place walls on map`);
        start = new Date();
        this.placeTorches(newLevel, levelMap);
        console.log(`${this.getTimePassed(start)}ms - place torches on map`);
        start = new Date();
        this.generateTileEntitiesFromMap(newLevel, levelMap, depth);
        console.log(`${this.getTimePassed(start)}ms - placing squares from map`);
        console.log(`${this.getTimePassed(startTotal)}ms - total level generation\n\n`);
        return newLevel;
    }
    generateTileEntitiesFromMap(level, levelMap, depth) {
        for (let row of levelMap) {
            for (let square of row) {
                if (square.size !== 0) {
                    const pos = square.get(CType.Position);
                    pos.z = depth;
                    const newSquare = new Map();
                    for (let entry of square.entries()) {
                        if (entry[0] !== CType.Tile) {
                            newSquare.set(entry[0], entry[1]);
                        }
                    }
                    level.entities.push(newSquare);
                }
            }
        }
    }
    generateEntryRoom(seed, depth, entryId) {
        const LEVEL_SIZE = floor(this.BASE_LEVEL_SIZE + this.LEVEL_GROWTH * depth);
        const QUADRANT_SIZE = floor(LEVEL_SIZE / 4);
        const EIGHTH_SIZE = floor(LEVEL_SIZE / 8);
        const quadrant = seed % 4;
        const pos = this.getQuadrantPos(quadrant, depth);
        pos.x += seed % QUADRANT_SIZE;
        pos.y += floor(Math.pow(seed, 2) / 113) % QUADRANT_SIZE;
        const newRoom = this.cloneRoom(Rooms.EntryRooms[seed % Rooms.EntryRooms.length]);
        for (let e of newRoom) {
            const epos = e.get(CType.Position);
            epos.x += pos.x + EIGHTH_SIZE;
            epos.y += pos.y + EIGHTH_SIZE;
            if (e.has(CType.LevelChange)) {
                e.set(CType.LevelChange, new LevelChangeComponent(entryId));
            }
            e.set(CType.Tile, new TileComponent(Tile.Floor));
        }
        return newRoom;
    }
    generateExitRoom(seed, depth, exitId) {
        const LEVEL_SIZE = floor(this.BASE_LEVEL_SIZE + this.LEVEL_GROWTH * depth);
        const QUADRANT_SIZE = floor(LEVEL_SIZE / 4);
        const EIGHTH_SIZE = floor(LEVEL_SIZE / 8);
        const quadrant = (seed + 2) % 4;
        const pos = this.getQuadrantPos(quadrant, depth);
        pos.x += (seed + 7) % QUADRANT_SIZE;
        pos.y += floor(Math.pow(seed + 11, 2) / 113) % QUADRANT_SIZE;
        const newRoom = this.cloneRoom(Rooms.ExitRooms[Math.pow(seed, 2) % Rooms.ExitRooms.length]);
        for (let e of newRoom) {
            const epos = e.get(CType.Position);
            epos.x += pos.x + EIGHTH_SIZE;
            epos.y += pos.y + EIGHTH_SIZE;
            if (e.has(CType.LevelChange)) {
                e.set(CType.LevelChange, new LevelChangeComponent(exitId));
            }
        }
        return newRoom;
    }
    generateRooms(seed, depth, rooms) {
        const tries = floor(this.ROOM_DENSITY + this.DENSITY_GROWTH * depth);
        const maxRooms = floor(tries / 5);
        let state = seed;
        let fails = 0;
        let successes = 0;
        while (fails < tries && successes < maxRooms) {
            if (this.tryGenerateRoom(state, depth, rooms)) {
                successes++;
            }
            else {
                fails++;
            }
            state = ceil((Math.pow(state + 1, 2) / 7) % 65536);
        }
    }
    tryGenerateRoom(state, depth, rooms) {
        const LEVEL_SIZE = floor(this.BASE_LEVEL_SIZE + this.LEVEL_GROWTH * depth);
        const EIGHTH_SIZE = floor(LEVEL_SIZE / 8);
        let newRoom = this.cloneRoom(Rooms.EmptyRooms[state % Rooms.EmptyRooms.length]);
        const x = state % LEVEL_SIZE;
        const y = floor(Math.pow(state + 1, 3) / 1000) % LEVEL_SIZE;
        for (let e of newRoom) {
            const pos = e.get(CType.Position);
            pos.x += x + EIGHTH_SIZE;
            pos.y += y + EIGHTH_SIZE;
        }
        if (this.roomCollision(rooms, newRoom)) {
            return false;
        }
        rooms.push(newRoom);
        return true;
    }
    roomCollision(rooms, newRoom) {
        for (const r of rooms) {
            for (const e1 of r) {
                for (const e2 of newRoom) {
                    const pos1 = e1.get(CType.Position);
                    const pos2 = e2.get(CType.Position);
                    if (abs(pos1.x - pos2.x) <= 1 && abs(pos1.y - pos2.y) <= 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    cloneRoom(room) {
        const cloned = new Array();
        for (const e of room) {
            cloned.push(structuredClone(e));
        }
        return cloned;
    }
    getQuadrantPos(quadrant, depth) {
        const LEVEL_SIZE = floor(this.BASE_LEVEL_SIZE + this.LEVEL_GROWTH * depth);
        const QUADRANT_SIZE = floor(LEVEL_SIZE / 4);
        const EIGHTH_SIZE = floor(LEVEL_SIZE / 8);
        switch (quadrant) {
            case 0:
                return new PositionComponent(EIGHTH_SIZE, EIGHTH_SIZE, 0);
            case 1:
                return new PositionComponent(EIGHTH_SIZE + 2 * QUADRANT_SIZE, EIGHTH_SIZE, 0);
            case 2:
                return new PositionComponent(EIGHTH_SIZE + 2 * QUADRANT_SIZE, EIGHTH_SIZE + 2 * QUADRANT_SIZE, 0);
            case 3:
                return new PositionComponent(EIGHTH_SIZE, EIGHTH_SIZE + 2 * QUADRANT_SIZE, 0);
            default:
                return new PositionComponent();
        }
    }
    placeRoomsOnMap(rooms) {
        let smallestX = 1000;
        let largestX = -1000;
        let smallestY = 1000;
        let largestY = -1000;
        for (const r of rooms) {
            for (const e of r) {
                const pos1 = e.get(CType.Position);
                if (pos1.x < smallestX) {
                    smallestX = pos1.x;
                }
                else if (pos1.x > largestX) {
                    largestX = pos1.x;
                }
                if (pos1.y < smallestY) {
                    smallestY = pos1.y;
                }
                else if (pos1.y > largestY) {
                    largestY = pos1.y;
                }
            }
        }
        const levelMap = new Array(largestX - smallestX + 7);
        for (let x = 0; x < levelMap.length; x++) {
            levelMap[x] = new Array(largestY - smallestY + 7);
            for (let y = 0; y < levelMap[x].length; y++) {
                levelMap[x][y] = new Map();
            }
        }
        for (const r of rooms) {
            for (const e of r) {
                const pos1 = e.get(CType.Position);
                pos1.x += 3 - smallestX;
                pos1.y += 3 - smallestY;
                levelMap[pos1.x][pos1.y] = e;
            }
        }
        this.placeWalls(levelMap);
        return levelMap;
    }
    placeWalls(levelMap) {
        for (let x = 0; x < levelMap.length; x++) {
            for (let y = 0; y < levelMap[x].length; y++) {
                if (levelMap[x][y].size === 0) {
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            if (x + dx > 0 &&
                                y + dy > 0 &&
                                x + dx < levelMap.length &&
                                y + dy < levelMap[x + dx].length &&
                                !(dx === 0 && dy === 0) &&
                                levelMap[x + dx][y + dy].has(CType.Position) &&
                                !levelMap[x + dx][y + dy].has(CType.Collision)) {
                                dx = 2;
                                dy = 2;
                                levelMap[x][y] = Constants.newWall(x, y);
                            }
                        }
                    }
                }
            }
        }
    }
    placeTorches(newLevel, levelMap) {
        for (let x = 0; x < levelMap.length; x++) {
            for (let y = 0; y < levelMap[x].length; y++) {
                if (levelMap[x][y].has(CType.Tile) &&
                    levelMap[x][y].get(CType.Tile).tileType === Tile.Floor) {
                    let wallCounter = 0;
                    let floorCounter = 0;
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            if (x + dx > 0 &&
                                y + dy > 0 &&
                                x + dx < levelMap.length &&
                                y + dy < levelMap[x + dx].length &&
                                !(dx === 0 && dy === 0) &&
                                levelMap[x + dx][y + dy].has(CType.Tile) &&
                                levelMap[x + dx][y + dy].get(CType.Tile).tileType === Tile.Floor) {
                                floorCounter++;
                            }
                            else if (x + dx > 0 &&
                                y + dy > 0 &&
                                x + dx < levelMap.length &&
                                y + dy < levelMap[x + dx].length &&
                                !(dx === 0 && dy === 0) &&
                                levelMap[x + dx][y + dy].has(CType.Tile) &&
                                levelMap[x + dx][y + dy].get(CType.Tile).tileType === Tile.Wall) {
                                wallCounter++;
                            }
                        }
                        if (wallCounter === 3 || (wallCounter === 6 && floorCounter > 2)) {
                            if (oneIn(50)) {
                                newLevel.entities.push(Constants.newTorch(x, y));
                            }
                        }
                    }
                }
            }
        }
    }
    connectRooms(seed, rooms, levelMap) {
        let connected = rooms.slice(0, 1);
        let unconnected = rooms.slice(1, rooms.length);
        let connections = new Array();
        let tries = 200;
        while (tries > 0 && unconnected.length > 0) {
            const doors = this.findClosestDoors(connected, unconnected, levelMap);
            if (doors[0] === undefined || doors[1] === undefined) {
                break;
            }
            levelMap[doors[0].pos.x][doors[0].pos.y] = new Map();
            levelMap[doors[1].pos.x][doors[1].pos.y] = new Map();
            if (this.createPath(levelMap, [doors[0].pos, doors[1].pos])) {
                connections.push([
                    rooms.indexOf(connected[doors[0].roomNumber]),
                    rooms.indexOf(unconnected[doors[1].roomNumber]),
                ]);
                connected.push(unconnected.splice(doors[1].roomNumber, 1)[0]);
            }
            else {
                console.log(`No path found between ${doors[0].pos.x}, ${doors[0].pos.y} and ${doors[1].pos.x}, ${doors[1].pos.y}`);
                levelMap[doors[0].pos.x][doors[0].pos.y] = Constants.newPath(doors[0].pos.x, doors[0].pos.y);
                levelMap[doors[1].pos.x][doors[1].pos.y] = Constants.newPath(doors[1].pos.x, doors[1].pos.y);
            }
            tries--;
        }
        if (unconnected.length > 0) {
            console.log(`\n\n\nFAILED\n\n\n`);
        }
        tries = 5;
        let localSeed = seed;
        while (tries > 0) {
            const roomIndex = Math.pow(localSeed, 2) % rooms.length;
            localSeed = ceil((Math.pow(localSeed + 1, 2) / 7) % 65536);
            const offLimit = [];
            for (let c of connections) {
                if (c[0] === roomIndex) {
                    offLimit.push(c[1]);
                }
                else if (c[1] === roomIndex) {
                    offLimit.push(c[0]);
                }
            }
            let otherRoomIndex = Math.pow(localSeed, 2) % rooms.length;
            for (let i = 0; i < 10; i++) {
                if (otherRoomIndex === roomIndex || offLimit.includes(otherRoomIndex)) {
                    localSeed = ceil((Math.pow(localSeed + 1, 2) / 7) % 65536);
                    otherRoomIndex = Math.pow(localSeed, 2) % rooms.length;
                }
                else {
                    i = 10;
                    const secondaryDoors = this.findClosestDoors([rooms[roomIndex]], [rooms[otherRoomIndex]], levelMap);
                    if (secondaryDoors[0] && secondaryDoors[1]) {
                        levelMap[secondaryDoors[0].pos.x][secondaryDoors[0].pos.y] = new Map();
                        levelMap[secondaryDoors[1].pos.x][secondaryDoors[1].pos.y] = new Map();
                        if (this.createPath(levelMap, [secondaryDoors[0].pos, secondaryDoors[1].pos], 40)) {
                            connections.push([roomIndex, otherRoomIndex]);
                        }
                    }
                }
            }
            tries--;
        }
        for (let i = 0; i < levelMap.length; i++) {
            for (let j = 0; j < levelMap[i].length; j++) {
                if (levelMap[i][j].size !== 0 &&
                    levelMap[i][j].get(CType.Tile).tileType === Tile.Path) {
                    const pos = levelMap[i][j].get(CType.Position);
                    levelMap[i][j] = Constants.newWall(pos.x, pos.y);
                }
            }
        }
        return levelMap;
    }
    findClosestDoors(connected, unconnected, levelMap) {
        let connectedDoors = this.getPossibleDoors(connected, levelMap);
        let unconnectedDoors = this.getPossibleDoors(unconnected, levelMap);
        let closestDoors = [];
        for (let i = 0; i < connectedDoors.length; i++) {
            for (let c of connectedDoors[i]) {
                if (c) {
                    closestDoors[0] = { roomNumber: i, pos: c };
                }
            }
        }
        for (let j = 0; j < unconnectedDoors.length; j++) {
            for (let u of unconnectedDoors[j]) {
                if (u) {
                    closestDoors[1] = { roomNumber: j, pos: u };
                }
            }
        }
        let closestDist = 10000;
        for (let i = 0; i < connectedDoors.length; i++) {
            for (let c of connectedDoors[i]) {
                for (let j = 0; j < unconnectedDoors.length; j++) {
                    for (let u of unconnectedDoors[j]) {
                        const dist = this.distanceHeuristic(c, u);
                        if (dist < closestDist && oneIn(2)) {
                            closestDist = dist;
                            closestDoors = [
                                { roomNumber: i, pos: c },
                                { roomNumber: j, pos: u },
                            ];
                        }
                    }
                }
            }
        }
        return closestDoors;
    }
    getPossibleDoors(rooms, levelMap) {
        let doorList = [];
        for (let i = 0; i < rooms.length; i++) {
            doorList[i] = [];
            if (!rooms[i]) {
                continue;
            }
            for (let s of rooms[i]) {
                const pos = s.get(CType.Position);
                if (levelMap[pos.x - 1][pos.y].has(CType.Collision)) {
                    const west = new PositionComponent(pos.x - 1, pos.y);
                    if (this.canBeDoor(west, levelMap)) {
                        doorList[i].push(west);
                    }
                }
                if (levelMap[pos.x][pos.y - 1].has(CType.Collision)) {
                    const north = new PositionComponent(pos.x, pos.y - 1);
                    if (this.canBeDoor(north, levelMap)) {
                        doorList[i].push(north);
                    }
                }
                if (levelMap[pos.x + 1][pos.y].has(CType.Collision)) {
                    const east = new PositionComponent(pos.x + 1, pos.y);
                    if (this.canBeDoor(east, levelMap)) {
                        doorList[i].push(east);
                    }
                }
                if (levelMap[pos.x][pos.y + 1].has(CType.Collision)) {
                    const south = new PositionComponent(pos.x, pos.y + 1);
                    if (this.canBeDoor(south, levelMap)) {
                        doorList[i].push(south);
                    }
                }
            }
        }
        return doorList;
    }
    canBeDoor(pos, levelMap) {
        let floorCounter = 0;
        let wallCounter = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (!(dx === 0 && dy === 0)) {
                    if (levelMap[pos.x + dx][pos.y + dy].has(CType.Tile) &&
                        levelMap[pos.x + dx][pos.y + dy].get(CType.Tile).tileType === Tile.Door) {
                        return false;
                    }
                    else if (levelMap[pos.x + dx][pos.y + dy].has(CType.Tile) &&
                        levelMap[pos.x + dx][pos.y + dy].get(CType.Tile).tileType === Tile.Floor) {
                        floorCounter++;
                    }
                    else if (levelMap[pos.x + dx][pos.y + dy].has(CType.Tile) &&
                        levelMap[pos.x + dx][pos.y + dy].get(CType.Tile).tileType === Tile.Wall) {
                        wallCounter++;
                    }
                }
            }
        }
        return (floorCounter === 3 || floorCounter === 6) && wallCounter === 2;
    }
    findPath(levelMap, squares) {
        const len = levelMap.length;
        let searching = [];
        let searched = new Array(len);
        let distFromStart = new Array(len);
        let finalCost = new Array(len);
        let path = new Array(len);
        for (let i = 0; i < levelMap.length; i++) {
            const height = levelMap[i].length;
            searched[i] = new Array(height);
            distFromStart[i] = new Array(height);
            finalCost[i] = new Array(height);
            path[i] = new Array(height);
            for (let j = 0; j < levelMap[i].length; j++) {
                distFromStart[i][j] = 10000;
                finalCost[i][j] = 10000;
                searched[i][j] = false;
                path[i][j] = undefined;
            }
        }
        let startPos = squares[0];
        let endPos = squares[1];
        const distStartEnd = this.distanceHeuristic(startPos, endPos);
        searching.push(startPos);
        distFromStart[startPos.x][startPos.y] = 0;
        finalCost[startPos.x][startPos.y] = this.distanceHeuristic(startPos, endPos);
        path[startPos.x][startPos.y] = undefined;
        while (searching.length > 0) {
            let currentPos = searching[0];
            for (const otherSquare of searching) {
                if (finalCost[otherSquare.x][otherSquare.y] < finalCost[currentPos.x][currentPos.y]) {
                    currentPos = otherSquare;
                }
            }
            if (currentPos.x === endPos.x && currentPos.y === endPos.y) {
                return true;
            }
            searching = searching.filter((s) => {
                return !(s.x === currentPos.x && s.y === currentPos.y);
            });
            searched[currentPos.x][currentPos.y] = true;
            const currentNeighbors = this.getNeighbors(currentPos, searched, levelMap);
            for (let n of currentNeighbors) {
                const estimatedDistFromStart = distFromStart[currentPos.x][currentPos.y] + 1;
                if (!this.includesPosition(n, searching)) {
                    searching.push(n);
                }
                else if (estimatedDistFromStart >= distFromStart[n.x][n.y]) {
                    continue;
                }
                path[n.x][n.y] = currentPos;
                distFromStart[n.x][n.y] = estimatedDistFromStart;
                finalCost[n.x][n.y] = distFromStart[n.x][n.y] + distStartEnd;
            }
        }
        return false;
    }
    createPath(levelMap, squares, maxDist) {
        const len = levelMap.length;
        let searching = [];
        let searched = new Array(len);
        let distFromStart = new Array(len);
        let finalCost = new Array(len);
        let path = new Array(len);
        for (let i = 0; i < levelMap.length; i++) {
            const height = levelMap[i].length;
            searched[i] = new Array(height);
            distFromStart[i] = new Array(height);
            finalCost[i] = new Array(height);
            path[i] = new Array(height);
            for (let j = 0; j < levelMap[i].length; j++) {
                distFromStart[i][j] = 10000;
                finalCost[i][j] = 10000;
                searched[i][j] = false;
                path[i][j] = undefined;
            }
        }
        let startPos = squares[0];
        let endPos = squares[1];
        const distStartEnd = this.distanceHeuristic(startPos, endPos);
        searching.push(startPos);
        distFromStart[startPos.x][startPos.y] = 0;
        finalCost[startPos.x][startPos.y] = this.distanceHeuristic(startPos, endPos);
        path[startPos.x][startPos.y] = undefined;
        while (searching.length > 0) {
            let currentPos = searching[0];
            for (const otherSquare of searching) {
                if (finalCost[otherSquare.x][otherSquare.y] < finalCost[currentPos.x][currentPos.y]) {
                    currentPos = otherSquare;
                }
            }
            if (currentPos.x === endPos.x && currentPos.y === endPos.y) {
                if (maxDist && finalCost[currentPos.x][currentPos.y] > maxDist) {
                    return false;
                }
                let head = endPos;
                while (head !== undefined) {
                    levelMap[head.x][head.y] = Constants.newDungeonFloor(head.x, head.y);
                    head = path[head.x][head.y];
                }
                levelMap[endPos.x][endPos.y] = Constants.newDoor(endPos.x, endPos.y);
                levelMap[startPos.x][startPos.y] = Constants.newDoor(startPos.x, startPos.y);
                return true;
            }
            searching = searching.filter((s) => {
                return !(s.x === currentPos.x && s.y === currentPos.y);
            });
            searched[currentPos.x][currentPos.y] = true;
            const currentNeighbors = this.getNeighbors(currentPos, searched, levelMap);
            for (let n of currentNeighbors) {
                const estimatedDistFromStart = distFromStart[currentPos.x][currentPos.y] + 1;
                if (!this.includesPosition(n, searching)) {
                    searching.push(n);
                }
                else if (estimatedDistFromStart >= distFromStart[n.x][n.y]) {
                    continue;
                }
                path[n.x][n.y] = currentPos;
                distFromStart[n.x][n.y] = estimatedDistFromStart;
                finalCost[n.x][n.y] = distFromStart[n.x][n.y] + distStartEnd;
            }
        }
        return false;
    }
    includesPosition(search, searching) {
        for (let s of searching) {
            if (s.x === search.x && s.y === search.y) {
                return true;
            }
        }
        return false;
    }
    distanceHeuristic(startPos, endPos) {
        return abs(startPos.x - endPos.x) + abs(startPos.y - endPos.y);
    }
    getNeighbors(currentPos, searched, levelMap) {
        const currentNeighbors = new Array();
        if (currentPos.x > 0 &&
            searched[currentPos.x - 1][currentPos.y] === false &&
            !levelMap[currentPos.x - 1][currentPos.y].has(CType.Position)) {
            currentNeighbors.push(new PositionComponent(currentPos.x - 1, currentPos.y));
        }
        if (currentPos.y > 0 &&
            searched[currentPos.x][currentPos.y - 1] === false &&
            !levelMap[currentPos.x][currentPos.y - 1].has(CType.Position)) {
            currentNeighbors.push(new PositionComponent(currentPos.x, currentPos.y - 1));
        }
        if (currentPos.x < levelMap.length - 1 &&
            searched[currentPos.x + 1][currentPos.y] === false &&
            !levelMap[currentPos.x + 1][currentPos.y].has(CType.Position)) {
            currentNeighbors.push(new PositionComponent(currentPos.x + 1, currentPos.y));
        }
        if (currentPos.y < levelMap[currentPos.x].length - 1 &&
            searched[currentPos.x][currentPos.y + 1] === false &&
            !levelMap[currentPos.x][currentPos.y + 1].has(CType.Position)) {
            currentNeighbors.push(new PositionComponent(currentPos.x, currentPos.y + 1));
        }
        return currentNeighbors;
    }
}
//# sourceMappingURL=LevelSystem.js.map