import { loadJSON } from "../../lib/PoppsLoad.js";
import { abs, ceil, floor, oneIn, randomInt, randomIntInRange } from "../../lib/PoppsMath.js";
import { CType, Component } from "../Component.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import EnemySpawnerComponent from "../Components/EnemySpawnerComponent.js";
import InteractableComponent, { Interactable } from "../Components/InteractableComponent.js";
import LevelChangeComponent from "../Components/LevelChangeComponent.js";
import LevelComponent from "../Components/LevelComponent.js";
import LightSourceComponent from "../Components/LightSourceComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import SizeComponent from "../Components/SizeComponent.js";
import TileComponent, { Tile } from "../Components/TileComponent.js";
import UIComponent, { UIInteractablePrompt } from "../Components/UIComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { LOG_LEVEL_GEN } from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import LightSystem from "./LightSystem.js";

export default class LevelSystem extends System {
    public static BASE_LEVEL_SIZE = 50;
    public static LEVEL_GROWTH = 0.75;
    public static ROOM_DENSITY = 50;
    public static DENSITY_GROWTH = 0.8;
    private currentLevel!: LevelComponent;
    private levels: Array<LevelComponent>;
    private EntryRooms: Array<Array<Map<CType, Component>>>;
    private ExitRooms: Array<Array<Map<CType, Component>>>;
    private EmptyRooms: Array<Array<Map<CType, Component>>>;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Level, eventManager, entityManager, [CType.Player]);

        const reviver = function reviver(_key: any, value: any) {
            if (value !== null && value.type !== undefined) {
                return convertTile(value);
            }
            return value;
        };

        this.levels = [loadJSON("/content/levels/DungeonTown.json", reviver)];
        this.EntryRooms = loadJSON("/content/rooms/EntryRooms.json", reviver);
        this.ExitRooms = loadJSON("/content/rooms/ExitRooms.json", reviver);
        this.EmptyRooms = loadJSON("/content/rooms/EmptyRooms.json", reviver);
    }

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.new_game:
                this.loadLevel(this.levels[0]);
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

        let startTotal = new Date();
        if (LOG_LEVEL_GEN) {
            console.log(`Generating level with depth ${depth}`);
            console.log(`Level seed: ${newLevel.seed}`);
        }

        let start = new Date();
        rooms.push(this.generateEntryRoom(newLevel.seed, depth, entryId));
        rooms.push(this.generateExitRoom(newLevel.seed, depth, entryId + 1));
        if (LOG_LEVEL_GEN) {
            console.log(`${this.getTimePassed(start)}ms - generate entry and exit`);
        }

        if (LOG_LEVEL_GEN) {
            start = new Date();
        }
        this.generateRooms(newLevel.seed, depth, rooms);
        if (LOG_LEVEL_GEN) {
            console.log(`${this.getTimePassed(start)}ms - generate rooms`);
        }

        if (LOG_LEVEL_GEN) {
            start = new Date();
        }
        const levelMap = this.placeRoomsOnMap(rooms);
        if (LOG_LEVEL_GEN) {
            console.log(`${this.getTimePassed(start)}ms - place rooms on map`);
        }

        if (LOG_LEVEL_GEN) {
            start = new Date();
        }
        this.connectRooms(newLevel.seed, rooms, levelMap);
        if (LOG_LEVEL_GEN) {
            console.log(`${this.getTimePassed(start)}ms - connect rooms`);
        }

        if (LOG_LEVEL_GEN) {
            start = new Date();
        }
        this.placeWalls(levelMap);
        if (LOG_LEVEL_GEN) {
            console.log(`${this.getTimePassed(start)}ms - place walls on map`);
        }

        if (LOG_LEVEL_GEN) {
            start = new Date();
        }
        this.placeTorches(newLevel, levelMap);
        if (LOG_LEVEL_GEN) {
            console.log(`${this.getTimePassed(start)}ms - place torches on map`);
        }

        if (LOG_LEVEL_GEN) {
            start = new Date();
        }
        this.generateTileEntitiesFromMap(newLevel, levelMap, depth);
        if (LOG_LEVEL_GEN) {
            console.log(`${this.getTimePassed(start)}ms - placing squares from map`);
        }

        if (LOG_LEVEL_GEN) {
            console.log(`${this.getTimePassed(startTotal)}ms - total level generation\n\n`);
        }
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
                        newSquare.set(entry[0], entry[1]);
                    }
                    level.entities.push(newSquare);
                }
            }
        }
    }

    private generateEntryRoom(seed: number, depth: number, entryId: number): Array<Map<CType, Component>> {
        const LEVEL_SIZE = floor(LevelSystem.BASE_LEVEL_SIZE + LevelSystem.LEVEL_GROWTH * depth);
        const QUADRANT_SIZE = floor(LEVEL_SIZE / 4);
        const EIGHTH_SIZE = floor(LEVEL_SIZE / 8);
        const quadrant = seed % 4;
        const pos = this.getQuadrantPos(quadrant, depth);
        pos.x += seed % QUADRANT_SIZE;
        pos.y += floor(Math.pow(seed, 2) / 113) % QUADRANT_SIZE;
        const newRoom = this.cloneRoom(this.EntryRooms[seed % this.EntryRooms.length]);
        for (let e of newRoom) {
            const epos = e.get(CType.Position) as PositionComponent;
            epos.x += pos.x + EIGHTH_SIZE;
            epos.y += pos.y + EIGHTH_SIZE;
            if (e.has(CType.LevelChange)) {
                e.set(CType.LevelChange, new LevelChangeComponent(entryId));
            }
        }
        return newRoom;
    }

    private generateExitRoom(seed: number, depth: number, exitId: number): Array<Map<CType, Component>> {
        const LEVEL_SIZE = floor(LevelSystem.BASE_LEVEL_SIZE + LevelSystem.LEVEL_GROWTH * depth);
        const QUADRANT_SIZE = floor(LEVEL_SIZE / 4);
        const EIGHTH_SIZE = floor(LEVEL_SIZE / 8);
        const quadrant = (seed + 2) % 4;
        const pos = this.getQuadrantPos(quadrant, depth);
        pos.x += (seed + 7) % QUADRANT_SIZE;
        pos.y += floor(Math.pow(seed + 11, 2) / 113) % QUADRANT_SIZE;
        const newRoom = this.cloneRoom(this.ExitRooms[Math.pow(seed, 2) % this.ExitRooms.length]);
        for (let e of newRoom) {
            const epos = e.get(CType.Position) as PositionComponent;
            epos.x += pos.x + EIGHTH_SIZE;
            epos.y += pos.y + EIGHTH_SIZE;
            if (e.has(CType.LevelChange)) {
                e.set(CType.LevelChange, new LevelChangeComponent(exitId));
            }
        }
        return newRoom;
    }

    private generateRooms(seed: number, depth: number, rooms: Array<Array<Map<CType, Component>>>): void {
        const tries = floor(LevelSystem.ROOM_DENSITY + LevelSystem.DENSITY_GROWTH * depth);
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
    }

    private tryGenerateRoom(state: number, depth: number, rooms: Array<Array<Map<CType, Component>>>): boolean {
        const LEVEL_SIZE = floor(LevelSystem.BASE_LEVEL_SIZE + LevelSystem.LEVEL_GROWTH * depth);
        const EIGHTH_SIZE = floor(LEVEL_SIZE / 8);
        let newRoom = this.cloneRoom(this.EmptyRooms[state % this.EmptyRooms.length]);
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
        for (const tile of room) {
            cloned.push(structuredClone(tile));
        }
        return cloned;
    }

    private getQuadrantPos(quadrant: number, depth: number): PositionComponent {
        const LEVEL_SIZE = floor(LevelSystem.BASE_LEVEL_SIZE + LevelSystem.LEVEL_GROWTH * depth);
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
                                levelMap[x][y] = newWall(x, y);
                            }
                        }
                    }
                }
            }
        }
    }

    private placeTorches(newLevel: LevelComponent, levelMap: Array<Array<Map<CType, Component>>>): void {
        for (let x = 0; x < levelMap.length; x++) {
            for (let y = 0; y < levelMap[x].length; y++) {
                if (
                    levelMap[x][y].has(CType.Tile) &&
                    (levelMap[x][y].get(CType.Tile) as TileComponent).tileType === Tile.Floor
                ) {
                    let wallCounter = 0;
                    let floorCounter = 0;
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            if (
                                x + dx > 0 &&
                                y + dy > 0 &&
                                x + dx < levelMap.length &&
                                y + dy < levelMap[x + dx].length &&
                                !(dx === 0 && dy === 0) &&
                                levelMap[x + dx][y + dy].has(CType.Tile) &&
                                (levelMap[x + dx][y + dy].get(CType.Tile) as TileComponent).tileType === Tile.Floor
                            ) {
                                floorCounter++;
                            } else if (
                                x + dx > 0 &&
                                y + dy > 0 &&
                                x + dx < levelMap.length &&
                                y + dy < levelMap[x + dx].length &&
                                !(dx === 0 && dy === 0) &&
                                levelMap[x + dx][y + dy].has(CType.Tile) &&
                                (levelMap[x + dx][y + dy].get(CType.Tile) as TileComponent).tileType === Tile.Wall
                            ) {
                                wallCounter++;
                            }
                        }
                        if (wallCounter === 3 || (wallCounter === 6 && floorCounter > 2)) {
                            if (oneIn(50)) {
                                newLevel.entities.push(newTorch(x, y));
                            }
                        }
                    }
                }
            }
        }
    }

    private connectRooms(
        seed: number,
        rooms: Array<Array<Map<CType, Component>>>,
        levelMap: Array<Array<Map<CType, Component>>>
    ): Array<Array<Map<CType, Component>>> {
        let connected: Array<Array<Map<CType, Component>>> = rooms.slice(0, 1);
        let unconnected = rooms.slice(1, rooms.length);
        let connections = new Array<Array<number>>();
        let tries = 200;
        while (tries > 0 && unconnected.length > 0) {
            const doors = this.findClosestDoors(connected, unconnected, levelMap);
            if (doors[0] === undefined || doors[1] === undefined) {
                break;
            }
            levelMap[doors[0].pos.x][doors[0].pos.y] = new Map<CType, Component>();
            levelMap[doors[1].pos.x][doors[1].pos.y] = new Map<CType, Component>();
            if (this.createPath(levelMap, [doors[0].pos, doors[1].pos])) {
                connections.push([
                    rooms.indexOf(connected[doors[0].roomNumber]),
                    rooms.indexOf(unconnected[doors[1].roomNumber]),
                ]);
                connected.push(unconnected.splice(doors[1].roomNumber, 1)[0]);
            } else {
                console.log(
                    `No path found between ${doors[0].pos.x}, ${doors[0].pos.y} and ${doors[1].pos.x}, ${doors[1].pos.y}`
                );
                levelMap[doors[0].pos.x][doors[0].pos.y] = newPath(doors[0].pos.x, doors[0].pos.y);
                levelMap[doors[1].pos.x][doors[1].pos.y] = newPath(doors[1].pos.x, doors[1].pos.y);
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
                } else if (c[1] === roomIndex) {
                    offLimit.push(c[0]);
                }
            }
            let otherRoomIndex = Math.pow(localSeed, 2) % rooms.length;
            for (let i = 0; i < 10; i++) {
                if (otherRoomIndex === roomIndex || offLimit.includes(otherRoomIndex)) {
                    localSeed = ceil((Math.pow(localSeed + 1, 2) / 7) % 65536);
                    otherRoomIndex = Math.pow(localSeed, 2) % rooms.length;
                } else {
                    i = 10;
                    const secondaryDoors = this.findClosestDoors([rooms[roomIndex]], [rooms[otherRoomIndex]], levelMap);
                    if (secondaryDoors[0] && secondaryDoors[1]) {
                        levelMap[secondaryDoors[0].pos.x][secondaryDoors[0].pos.y] = new Map<CType, Component>();
                        levelMap[secondaryDoors[1].pos.x][secondaryDoors[1].pos.y] = new Map<CType, Component>();
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
                if (
                    levelMap[i][j].size !== 0 &&
                    (levelMap[i][j].get(CType.Tile) as TileComponent).tileType === Tile.Path
                ) {
                    const pos = levelMap[i][j].get(CType.Position) as PositionComponent;
                    levelMap[i][j] = newWall(pos.x, pos.y);
                }
            }
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
                    const West = new PositionComponent(pos.x - 1, pos.y);
                    if (this.canBeDoor(West, levelMap)) {
                        doorList[i].push(West);
                    }
                }
                if (levelMap[pos.x][pos.y - 1].has(CType.Collision)) {
                    const North = new PositionComponent(pos.x, pos.y - 1);
                    if (this.canBeDoor(North, levelMap)) {
                        doorList[i].push(North);
                    }
                }
                if (levelMap[pos.x + 1][pos.y].has(CType.Collision)) {
                    const East = new PositionComponent(pos.x + 1, pos.y);
                    if (this.canBeDoor(East, levelMap)) {
                        doorList[i].push(East);
                    }
                }
                if (levelMap[pos.x][pos.y + 1].has(CType.Collision)) {
                    const South = new PositionComponent(pos.x, pos.y + 1);
                    if (this.canBeDoor(South, levelMap)) {
                        doorList[i].push(South);
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
        return (floorCounter === 3 || floorCounter === 6) && wallCounter === 2;
    }

    findPath(levelMap: Array<Array<Map<CType, Component>>>, squares: Array<PositionComponent>): boolean {
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

    createPath(
        levelMap: Array<Array<Map<CType, Component>>>,
        squares: Array<PositionComponent>,
        maxDist?: number
    ): boolean {
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
                if (maxDist && finalCost[currentPos.x][currentPos.y] > maxDist) {
                    return false;
                }
                let head: PositionComponent | undefined = endPos;
                while (head !== undefined) {
                    levelMap[head.x][head.y] = newDungeonFloor(head.x, head.y);
                    head = path[head.x][head.y];
                }
                levelMap[endPos.x][endPos.y] = newDoor(endPos.x, endPos.y);
                levelMap[startPos.x][startPos.y] = newDoor(startPos.x, startPos.y);
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

export function convertTile(value: any): Map<CType, Component> {
    switch (value.type) {
        case Tile.Floor:
            return newDungeonFloor(value.x, value.y);
        case Tile.Wall:
            return newWall(value.x, value.y);
        case Tile.Door:
            return newDoor(value.x, value.y);
        case Tile.Path:
            return newPath(value.x, value.y);
        case Tile.Grass:
            return newGrass(value.x, value.y);
        case Tile.StairUp:
            return newEntry(value.x, value.y);
        case Tile.StairDown:
            return newExit(value.x, value.y);
        case Tile.EnemySpawner:
            return newEnemySpawner(value.x, value.y, false, false);
        case Tile.PackSpawner:
            return newEnemySpawner(value.x, value.y, true, false);
        case Tile.BossSpawner:
            return newEnemySpawner(value.x, value.y, false, true);
    }
    return new Map();
}

export function newEnemySpawner(x: number, y: number, pack: boolean, boss: boolean): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.Floor, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Visible, new VisibleComponent(false)],
        [CType.EnemySpawner, new EnemySpawnerComponent(pack, boss)],
    ]);
}

export function newDungeonFloor(x: number, y: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.Floor, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Visible, new VisibleComponent(false)],
    ]);
}

export function newWall(x: number, y: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.Wall, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Collision, new CollisionComponent()],
        [CType.Visible, new VisibleComponent(true)],
    ]);
}

export function newDoor(x: number, y: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.Door, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Interactable, new InteractableComponent(Interactable.Door)],
        [CType.Visible, new VisibleComponent(false)],
    ]);
}

export function newGrass(x: number, y: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.Grass, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Visible, new VisibleComponent(false)],
    ]);
}

export function newPath(x: number, y: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.Path, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Visible, new VisibleComponent(false)],
    ]);
}

export function newEntry(x: number, y: number, id?: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.StairUp, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.LevelChange, new LevelChangeComponent(id || 0)],
        [CType.Interactable, new InteractableComponent(Interactable.LevelChange)],
        [CType.Visible, new VisibleComponent(false)],
        [CType.UI, new UIComponent([new UIInteractablePrompt("to enter previous level")])],
    ]);
}

export function newExit(x: number, y: number, id?: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.StairDown, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.LevelChange, new LevelChangeComponent(id || 0)],
        [CType.Interactable, new InteractableComponent(Interactable.LevelChange)],
        [CType.Visible, new VisibleComponent(false)],
        [CType.UI, new UIComponent([new UIInteractablePrompt("to enter next level")])],
    ]);
}

export function newTorch(x: number, y: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Size, new SizeComponent(0.2)],
        [CType.Visible, new VisibleComponent(false, 2)],
        [CType.Position, new PositionComponent(x, y)],
        [
            CType.LightSource,
            new LightSourceComponent(LightSystem.LIGHT_MAX - randomIntInRange(5, 7), randomIntInRange(180, 300), {
                r: randomInt(30),
                g: randomInt(30),
                b: randomInt(30),
                a: 0,
            }),
        ],
    ]);
}
