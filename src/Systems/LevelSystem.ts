import Levels from "../../content/Levels.js";
import Rooms from "../../content/Rooms.js";
import { abs, ceil, floor } from "../../lib/PoppsMath.js";
import { CType, Component } from "../Component.js";
import LevelChangeComponent from "../Components/LevelChangeComponent.js";
import LevelComponent from "../Components/LevelComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import TileComponent from "../Components/TileComponent.js";
import * as Constants from "../Constants.js";
import { Tile } from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class LevelSystem extends System {
    private BASE_LEVEL_SIZE = 50;
    private LEVEL_GROWTH = 0.5;
    private ROOM_DENSITY = 50;
    private DENSITY_GROWTH = 0.8;
    private currentLevel!: LevelComponent;
    private levels: LevelComponent[];

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Level, eventManager, entityManager, [CType.Player]);
        this.levels = [];
    }

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.new_game:
                this.loadLevel(Levels.DungeonTown);
                break;
            case Event.level_change:
                this.changeLevel();
                break;
        }
    }

    private changeLevel(): void {
        const exitId = this.entityManager.get<PlayerComponent>(this.entities[0], CType.Player).levelChangeId;
        const depth = this.currentLevel.depth;

        for (let l of this.levels) {
            if (depth !== l.depth) {
                for (let e of l.entities) {
                    if (
                        (e.has(CType.LevelChange) && (e.get(CType.LevelChange) as LevelChangeComponent).id) === exitId
                    ) {
                        this.loadLevel(l);
                        return;
                    }
                }
            }
        }

        this.loadLevel(this.generateLevel(exitId, depth + 1));
    }

    private loadLevel(level: LevelComponent): void {
        if (this.currentLevel) {
            this.entityManager.removeEntities(this.currentLevel.entityIds);
        }
        if (!this.levels.includes(level)) {
            this.levels.push(level as LevelComponent);
        }

        this.currentLevel = level;
        this.currentLevel.entityIds = this.entityManager.addEntities(this.currentLevel.entities);
        this.eventManager.addEvent(Event.level_loaded);
    }

    private getTimePassed(startDate: Date): string {
        return `${new Date().getTime() - startDate.getTime()}`;
    }

    private generateLevel(entryId: number, depth: number): LevelComponent {
        const newLevel = new LevelComponent(depth);
        this.entityManager.addEntity(new Map<CType, Component>([[CType.Level, newLevel]]));

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
        this.connectRooms(rooms, levelMap);
        console.log(`${this.getTimePassed(start)}ms - connect rooms`);

        start = new Date();
        this.placeWalls(levelMap);
        console.log(`${this.getTimePassed(start)}ms - place walls on map`);

        start = new Date();
        this.generateTileEntitiesFromMap(newLevel, levelMap, depth);
        console.log(`${this.getTimePassed(start)}ms - placing squares from map`);

        console.log(`${this.getTimePassed(startTotal)}ms - total level generation\n\n`);
        return newLevel;
    }

    private generateTileEntitiesFromMap(
        level: LevelComponent,
        levelMap: Array<Array<Map<CType, Component>>>,
        depth: number
    ): void {
        for (let row of levelMap) {
            for (let square of row) {
                if (square.size !== 0) {
                    const pos = square.get(CType.Position) as PositionComponent;
                    pos.z = depth;
                    const newSquare = new Map<CType, Component>();
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

    private generateEntryRoom(seed: number, depth: number, entryId: number): Array<Map<CType, Component>> {
        const LEVEL_SIZE = floor(this.BASE_LEVEL_SIZE + this.LEVEL_GROWTH * depth);
        const QUADRANT_SIZE = floor(LEVEL_SIZE / 4);
        const EIGHTH_SIZE = floor(LEVEL_SIZE / 8);
        const quadrant = seed % 4;
        const pos = this.getQuadrantPos(quadrant, depth);
        pos.x += seed % QUADRANT_SIZE;
        pos.y += floor(Math.pow(seed, 2) / 113) % QUADRANT_SIZE;
        const newRoom = this.cloneRoom(Rooms.EntryRooms[seed % Rooms.EntryRooms.length]);
        for (let e of newRoom) {
            const epos = e.get(CType.Position) as PositionComponent;
            epos.x += pos.x + EIGHTH_SIZE;
            epos.y += pos.y + EIGHTH_SIZE;
            if (e.has(CType.LevelChange)) {
                e.set(CType.LevelChange, new LevelChangeComponent(entryId));
            }
            e.set(CType.Tile, new TileComponent(Tile.Floor));
        }
        return newRoom;
    }

    private generateExitRoom(seed: number, depth: number, exitId: number): Array<Map<CType, Component>> {
        const LEVEL_SIZE = floor(this.BASE_LEVEL_SIZE + this.LEVEL_GROWTH * depth);
        const QUADRANT_SIZE = floor(LEVEL_SIZE / 4);
        const EIGHTH_SIZE = floor(LEVEL_SIZE / 8);
        const quadrant = (seed + 2) % 4;
        const pos = this.getQuadrantPos(quadrant, depth);
        pos.x += (seed + 7) % QUADRANT_SIZE;
        pos.y += floor(Math.pow(seed + 11, 2) / 113) % QUADRANT_SIZE;
        const newRoom = this.cloneRoom(Rooms.ExitRooms[Math.pow(seed, 2) % Rooms.ExitRooms.length]);
        for (let e of newRoom) {
            const epos = e.get(CType.Position) as PositionComponent;
            epos.x += pos.x + EIGHTH_SIZE;
            epos.y += pos.y + EIGHTH_SIZE;
            if (e.has(CType.LevelChange)) {
                e.set(CType.LevelChange, new LevelChangeComponent(exitId));
            }
            // e.set(CType.Tile, new TileComponent(Tile.Floor));
        }
        return newRoom;
    }

    private generateRooms(seed: number, depth: number, rooms: Array<Array<Map<CType, Component>>>): void {
        const tries = floor(this.ROOM_DENSITY + this.DENSITY_GROWTH * depth);
        const maxRooms = floor(tries / 5);
        let state = seed;
        let fails = 0;
        let successes = 0;
        while (fails < tries && successes < maxRooms) {
            if (this.tryGenerateRoom(state, depth, rooms)) {
                successes++;
            } else {
                fails++;
            }
            state = ceil((Math.pow(state + 1, 2) / 7) % 65536);
        }

        // console.log(``);
        // console.log(`Max Rooms: ${maxRooms}`);
        // console.log(`Rooms: ${successes}`);
        // console.log(`Max Tries: ${tries}`);
        // console.log(`Fails: ${fails}`);
        // console.log(``);
    }

    private tryGenerateRoom(state: number, depth: number, rooms: Array<Array<Map<CType, Component>>>): boolean {
        const LEVEL_SIZE = floor(this.BASE_LEVEL_SIZE + this.LEVEL_GROWTH * depth);
        const EIGHTH_SIZE = floor(LEVEL_SIZE / 8);
        let newRoom = this.cloneRoom(Rooms.EmptyRooms[state % Rooms.EmptyRooms.length]);
        const x = state % LEVEL_SIZE;
        const y = floor(Math.pow(state + 1, 3) / 1000) % LEVEL_SIZE;
        for (let e of newRoom) {
            const pos = e.get(CType.Position) as PositionComponent;
            pos.x += x + EIGHTH_SIZE;
            pos.y += y + EIGHTH_SIZE;
        }
        if (this.roomCollision(rooms, newRoom)) {
            return false;
        }
        rooms.push(newRoom);
        return true;
    }

    private roomCollision(rooms: Array<Array<Map<CType, Component>>>, newRoom: Array<Map<CType, Component>>): boolean {
        for (const r of rooms) {
            for (const e1 of r) {
                for (const e2 of newRoom) {
                    const pos1 = e1.get(CType.Position) as PositionComponent;
                    const pos2 = e2.get(CType.Position) as PositionComponent;
                    if (abs(pos1.x - pos2.x) <= 1 && abs(pos1.y - pos2.y) <= 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private cloneRoom(room: Array<Map<CType, Component>>): Array<Map<CType, Component>> {
        const cloned = new Array<Map<CType, Component>>();
        for (const e of room) {
            cloned.push(structuredClone(e));
        }
        return cloned;
    }

    private getQuadrantPos(quadrant: number, depth: number): PositionComponent {
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

    private placeRoomsOnMap(rooms: Array<Array<Map<CType, Component>>>): Array<Array<Map<CType, Component>>> {
        let smallestX = 1000;
        let largestX = -1000;
        let smallestY = 1000;
        let largestY = -1000;

        for (const r of rooms) {
            for (const e of r) {
                const pos1 = e.get(CType.Position) as PositionComponent;
                if (pos1.x < smallestX) {
                    smallestX = pos1.x;
                } else if (pos1.x > largestX) {
                    largestX = pos1.x;
                }
                if (pos1.y < smallestY) {
                    smallestY = pos1.y;
                } else if (pos1.y > largestY) {
                    largestY = pos1.y;
                }
            }
        }
        const levelMap = new Array<Array<Map<CType, Component>>>(largestX - smallestX + 7);
        for (let x = 0; x < levelMap.length; x++) {
            levelMap[x] = new Array<Map<CType, Component>>(largestY - smallestY + 7);
            for (let y = 0; y < levelMap[x].length; y++) {
                levelMap[x][y] = new Map<CType, Component>();
            }
        }

        for (const r of rooms) {
            for (const e of r) {
                const pos1 = e.get(CType.Position) as PositionComponent;
                pos1.x += 3 - smallestX;
                pos1.y += 3 - smallestY;
                levelMap[pos1.x][pos1.y] = e;
            }
        }

        this.placeWalls(levelMap);
        return levelMap;
    }

    private placeWalls(levelMap: Array<Array<Map<CType, Component>>>): void {
        for (let x = 0; x < levelMap.length; x++) {
            for (let y = 0; y < levelMap[x].length; y++) {
                if (levelMap[x][y].size === 0) {
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            if (
                                x + dx > 0 &&
                                y + dy > 0 &&
                                x + dx < levelMap.length &&
                                y + dy < levelMap[x + dx].length &&
                                !(dx === 0 && dy === 0) &&
                                levelMap[x + dx][y + dy].has(CType.Position) &&
                                !levelMap[x + dx][y + dy].has(CType.Collision)
                            ) {
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

    private connectRooms(
        rooms: Array<Array<Map<CType, Component>>>,
        levelMap: Array<Array<Map<CType, Component>>>
    ): Array<Array<Map<CType, Component>>> {
        let connected: Array<Array<Map<CType, Component>>> = rooms.splice(0, 1);
        let unconnected = rooms.splice(0);
        let tries = 200;
        while (tries > 0 && unconnected.length > 0) {
            const doors = this.findClosestDoors(connected, unconnected, levelMap);
            levelMap[doors[0].pos.x][doors[0].pos.y] = new Map<CType, Component>();
            levelMap[doors[1].pos.x][doors[1].pos.y] = new Map<CType, Component>();
            if (this.createPath(levelMap, [doors[0].pos, doors[1].pos])) {
                const unconnectedIndex = doors[1].roomNumber;
                connected.push(unconnected.splice(unconnectedIndex, 1)[0]);
            } else {
                console.log(
                    `No path found between ${doors[0].pos.x}, ${doors[0].pos.y} and ${doors[1].pos.x}, ${doors[1].pos.y}`
                );
                levelMap[doors[0].pos.x][doors[0].pos.y] = Constants.newWall(doors[0].pos.x, doors[0].pos.y);
                levelMap[doors[1].pos.x][doors[1].pos.y] = Constants.newWall(doors[1].pos.x, doors[1].pos.y);
            }
            tries--;
        }

        return levelMap;
    }

    private findClosestDoors(
        connected: Array<Array<Map<CType, Component>>>,
        unconnected: Array<Array<Map<CType, Component>>>,
        levelMap: Array<Array<Map<CType, Component>>>
    ): Array<{ roomNumber: number; pos: PositionComponent }> {
        let connectedDoors = this.getPossibleDoors(connected, levelMap);
        let unconnectedDoors = this.getPossibleDoors(unconnected, levelMap);
        let closestDoors: Array<{ roomNumber: number; pos: PositionComponent }> = [];
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
                        if (dist < closestDist) {
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

    private getPossibleDoors(
        rooms: Array<Array<Map<CType, Component>>>,
        levelMap: Array<Array<Map<CType, Component>>>
    ): Array<Array<PositionComponent>> {
        let doorList: Array<Array<PositionComponent>> = [];
        for (let i = 0; i < rooms.length; i++) {
            doorList[i] = [];
            if (!rooms[i]) {
                continue;
            }
            for (let s of rooms[i]) {
                const pos = s.get(CType.Position) as PositionComponent;
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

    private canBeDoor(pos: PositionComponent, levelMap: Array<Array<Map<CType, Component>>>): boolean {
        let floorCounter = 0;
        let wallCounter = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (!(dx === 0 && dy === 0)) {
                    if (
                        levelMap[pos.x + dx][pos.y + dy].has(CType.Tile) &&
                        (levelMap[pos.x + dx][pos.y + dy].get(CType.Tile) as TileComponent).tileType === Tile.Door
                    ) {
                        return false;
                    } else if (
                        levelMap[pos.x + dx][pos.y + dy].has(CType.Tile) &&
                        (levelMap[pos.x + dx][pos.y + dy].get(CType.Tile) as TileComponent).tileType === Tile.Floor
                    ) {
                        floorCounter++;
                    } else if (
                        levelMap[pos.x + dx][pos.y + dy].has(CType.Tile) &&
                        (levelMap[pos.x + dx][pos.y + dy].get(CType.Tile) as TileComponent).tileType === Tile.Wall
                    ) {
                        wallCounter++;
                    }
                }
            }
        }
        return (floorCounter === 3 || floorCounter === 6) && wallCounter == 2;
    }

    createPath(levelMap: Array<Array<Map<CType, Component>>>, squares: Array<PositionComponent>): boolean {
        const len = levelMap.length;
        let searching = [];
        let searched = new Array<Array<boolean>>(len);
        let distFromStart = new Array<Array<number>>(len);
        let finalCost = new Array<Array<number>>(len);
        let path = new Array<Array<PositionComponent | undefined>>(len);

        for (let i = 0; i < levelMap.length; i++) {
            const height = levelMap[i].length;
            searched[i] = new Array<boolean>(height);
            distFromStart[i] = new Array<number>(height);
            finalCost[i] = new Array<number>(height);
            path[i] = new Array<PositionComponent | undefined>(height);
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
                let head: PositionComponent | undefined = endPos;
                while (head !== undefined) {
                    levelMap[head.x][head.y] = Constants.newDungeonFloor(head.x, head.y);
                    head = path[head.x][head.y];
                }
                levelMap[endPos.x][endPos.y] = Constants.newDoor(endPos.x, endPos.y);
                levelMap[startPos.x][startPos.y] = Constants.newDoor(startPos.x, startPos.y);
                return true;
            }

            searching = searching.filter((s): boolean => {
                return !(s.x === currentPos.x && s.y === currentPos.y);
            });
            searched[currentPos.x][currentPos.y] = true;

            const currentNeighbors = this.getNeighbors(currentPos, searched, levelMap);
            for (let n of currentNeighbors) {
                const estimatedDistFromStart = distFromStart[currentPos.x][currentPos.y] + 1;

                if (!this.includesPosition(n, searching)) {
                    searching.push(n);
                } else if (estimatedDistFromStart >= distFromStart[n.x][n.y]) {
                    continue;
                }

                path[n.x][n.y] = currentPos;
                distFromStart[n.x][n.y] = estimatedDistFromStart;
                finalCost[n.x][n.y] = distFromStart[n.x][n.y] + distStartEnd;
            }
        }
        return false;
    }

    private includesPosition(search: PositionComponent, searching: Array<PositionComponent>): boolean {
        for (let s of searching) {
            if (s.x === search.x && s.y === search.y) {
                return true;
            }
        }
        return false;
    }

    private distanceHeuristic(startPos: PositionComponent, endPos: PositionComponent): number {
        return abs(startPos.x - endPos.x) + abs(startPos.y - endPos.y);
    }

    private getNeighbors(
        currentPos: PositionComponent,
        searched: Array<Array<boolean>>,
        levelMap: Array<Array<Map<CType, Component>>>
    ): Array<PositionComponent> {
        const currentNeighbors = new Array<PositionComponent>();
        if (
            currentPos.x > 0 &&
            searched[currentPos.x - 1][currentPos.y] === false &&
            !levelMap[currentPos.x - 1][currentPos.y].has(CType.Position)
        ) {
            currentNeighbors.push(new PositionComponent(currentPos.x - 1, currentPos.y));
        }
        if (
            currentPos.y > 0 &&
            searched[currentPos.x][currentPos.y - 1] === false &&
            !levelMap[currentPos.x][currentPos.y - 1].has(CType.Position)
        ) {
            currentNeighbors.push(new PositionComponent(currentPos.x, currentPos.y - 1));
        }
        if (
            currentPos.x < levelMap.length - 1 &&
            searched[currentPos.x + 1][currentPos.y] === false &&
            !levelMap[currentPos.x + 1][currentPos.y].has(CType.Position)
        ) {
            currentNeighbors.push(new PositionComponent(currentPos.x + 1, currentPos.y));
        }
        if (
            currentPos.y < levelMap[currentPos.x].length - 1 &&
            searched[currentPos.x][currentPos.y + 1] === false &&
            !levelMap[currentPos.x][currentPos.y + 1].has(CType.Position)
        ) {
            currentNeighbors.push(new PositionComponent(currentPos.x, currentPos.y + 1));
        }
        return currentNeighbors;
    }
}
