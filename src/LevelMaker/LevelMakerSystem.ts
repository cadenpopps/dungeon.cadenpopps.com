import * as PoppsInput from "../../lib/PoppsInput.js";
import { floor } from "../../lib/PoppsMath.js";
import { CType, Component } from "../Component.js";
import LevelComponent from "../Components/LevelComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import TileComponent, { Tile } from "../Components/TileComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import * as Constants from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "../Systems/CameraSystem.js";
import LightSystem from "../Systems/LightSystem.js";

export default class LevelMakerSystem extends System {
    private level: LevelComponent;
    private levelWidth = 0;
    private levelHeight = 0;
    private activeTile = 1;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Level, eventManager, entityManager, []);
        this.level = new LevelComponent(1);
        this.levelWidth = 11;
        this.levelHeight = 11;

        this.genEmptyLevel();
        PoppsInput.listenKeyDown(this.keyDownHandler.bind(this));
        PoppsInput.listenMouseDown(this.mouseDownHandler.bind(this));
        PoppsInput.listenMouseDragged(this.mouseDraggedHandler.bind(this));

        this.loadLevel(this.level);
        this.printControls();
    }

    public logic(): void {
        for (let entityId of this.entities) {
            if (this.entityManager.hasComponent(entityId, CType.Visible)) {
                const vis = this.entityManager.get<VisibleComponent>(entityId, CType.Visible);
                vis.visible = true;
                vis.discovered = true;
                vis.lightLevel = LightSystem.LIGHT_MAX;
            }
        }
    }

    public handleEvent(): void {}

    private keyDownHandler(key: string): void {
        switch (key) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.activeTile = parseInt(key);
                console.log(`Tile: ${TILE_STRING_MAP[this.activeTile]}`);
                break;
            case "l":
                this.levelWidth++;
                console.log(`Size: ${this.levelWidth}, ${this.levelHeight}`);
                this.genEmptyLevel();
                break;
            case "L":
                this.levelWidth += 5;
                console.log(`Size: ${this.levelWidth}, ${this.levelHeight}`);
                this.genEmptyLevel();
                break;
            case "h":
                this.levelWidth--;
                console.log(`Size: ${this.levelWidth}, ${this.levelHeight}`);
                this.genEmptyLevel();
                break;
            case "H":
                this.levelWidth -= 5;
                console.log(`Size: ${this.levelWidth}, ${this.levelHeight}`);
                this.genEmptyLevel();
                break;
            case "j":
                this.levelHeight++;
                console.log(`Size: ${this.levelWidth}, ${this.levelHeight}`);
                this.genEmptyLevel();
                break;
            case "J":
                this.levelHeight += 5;
                console.log(`Size: ${this.levelWidth}, ${this.levelHeight}`);
                this.genEmptyLevel();
                break;
            case "k":
                this.levelHeight--;
                console.log(`Size: ${this.levelWidth}, ${this.levelHeight}`);
                this.genEmptyLevel();
                break;
            case "K":
                this.levelHeight -= 5;
                console.log(`Size: ${this.levelWidth}, ${this.levelHeight}`);
                this.genEmptyLevel();
                break;
            case "/":
                this.removeInteractables();
                this.removeEntries();
                break;
            case "h":
                this.printControls();
                break;
            case "`":
                this.printLevel();
                break;
            case "p":
                this.printLevel(true);
                break;
        }
    }

    private mouseDownHandler(event: MouseEvent): void {
        const cam = CameraSystem.getHighestPriorityCamera();
        const squareX = floor(cam.x + (event.x - window.innerWidth / 2) / cam.zoom + 0.5);
        const squareY = floor(cam.y + (event.y - window.innerHeight / 2) / cam.zoom + 0.5);
        this.paintTile(squareX, squareY);
    }

    private mouseDraggedHandler(event: MouseEvent): void {
        const cam = CameraSystem.getHighestPriorityCamera();
        const squareX = floor(cam.x + (event.x - window.innerWidth / 2) / cam.zoom + 0.5);
        const squareY = floor(cam.y + (event.y - window.innerHeight / 2) / cam.zoom + 0.5);
        this.paintTile(squareX, squareY);
    }

    private removeInteractables(): void {
        for (let i = this.level.entityIds.length - 1; i >= 0; i--) {
            if (
                this.level.entityIds[i] !== undefined &&
                this.entityManager.getEntity(this.level.entityIds[i]).has(CType.Interactable)
            ) {
                this.entityManager.removeEntity(this.level.entityIds[i]);
                this.eventManager.addEvent(Event.entity_destroyed);
                this.level.entityIds.splice(i, 1);
            }
        }

        this.level.entities = this.level.entities.filter((ent) => {
            return !ent.has(CType.Interactable);
        });
    }

    private removeEntries(): void {
        for (let i = this.level.entityIds.length - 1; i >= 0; i--) {
            if (
                this.level.entityIds[i] !== undefined &&
                this.entityManager.getEntity(this.level.entityIds[i]).has(CType.LevelChange)
            ) {
                this.entityManager.removeEntity(this.level.entityIds[i]);
                this.eventManager.addEvent(Event.entity_destroyed);
                this.level.entityIds.splice(i, 1);
            }
        }

        this.level.entities = this.level.entities.filter((ent) => {
            return !ent.has(CType.LevelChange);
        });
    }

    private paintTile(x: number, y: number): void {
        const tile = TILE_MAP[this.activeTile];
        switch (tile) {
            case Tile.None:
                this.removeTile(x, y);
                break;
            case Tile.Wall:
                this.changeTile(x, y, Constants.newWall(x, y));
                break;
            case Tile.Floor:
                this.changeTile(x, y, Constants.newDungeonFloor(x, y));
                break;
            case Tile.Door:
                this.changeTile(x, y, Constants.newDoor(x, y));
                break;
            case Tile.StairDown:
                this.changeTile(x, y, Constants.newExit(x, y));
                break;
            case Tile.StairUp:
                this.changeTile(x, y, Constants.newEntry(x, y));
                break;
            case Tile.Grass:
                this.changeTile(x, y, Constants.newGrass(x, y));
                break;
            case Tile.Path:
                this.changeTile(x, y, Constants.newPath(x, y));
                break;
        }
    }

    private addTile(newTile: Map<CType, Component>) {
        this.level.entities.push(newTile);
        const id = this.entityManager.addEntity(newTile);
        if (!this.level.entityIds.includes(id)) {
            this.level.entityIds.push(id);
        }
    }

    private removeTile(x: number, y: number): void {
        for (let i = this.level.entityIds.length - 1; i >= 0; i--) {
            const pos = this.entityManager.get<PositionComponent>(this.level.entityIds[i], CType.Position);
            if (x === pos.x && y === pos.y) {
                this.entityManager.removeEntity(this.level.entityIds[i]);
                this.level.entityIds.splice(i, 1);
                i = 0;
            }
        }

        this.level.entities = this.level.entities.filter((ent) => {
            const pos = ent.get(CType.Position) as PositionComponent;
            return !(x === pos.x && y === pos.y);
        });
    }

    private changeTile(x: number, y: number, newTile: Map<CType, Component>) {
        this.removeTile(x, y);
        this.addTile(newTile);
    }

    private printControls(): void {
        console.log(
            "Controls:\n",
            "k/K  -Width+  l/L",
            "\n",
            "i/I  -Height+  o/O",
            "\n",
            "1-10 to change tile type",
            "\n",
            "` to print level",
            "h to print controls"
        );
    }
    private printLevel(room?: boolean): void {
        if (room) {
            console.log(JSON.stringify(this.level.entities, this.replacer));
            return;
        }
        // const entryPos = this.entityManager.get<PositionComponent>(this.entities[0], CType.Position);
        // this.removeEntries();
        // this.addTile(Constants.newEntry(entryPos.x, entryPos.y));
        const entIds = this.level.entityIds;
        this.level.entityIds = [];
        console.log(JSON.stringify(this.level, this.replacer));
        this.level.entityIds = entIds;
    }

    private replacer(_key: any, value: any): Object {
        if (value instanceof Map && value.has(CType.Tile)) {
            const t = value.get(CType.Tile) as TileComponent;
            return {
                type: CType.Tile,
                tileType: t.tileType,
                x: t.x,
                y: t.y,
            };
        } else {
            return value;
        }
    }

    private loadLevel(newLevel: LevelComponent): void {
        this.entityManager.removeEntities(this.level.entityIds);
        this.level = newLevel;
        this.level.entityIds = this.entityManager.addEntities(this.level.entities);
        this.eventManager.addEvent(Event.level_loaded);
    }

    private genEmptyLevel(): void {
        const newLevel = new LevelComponent(0);
        for (let x = 1; x < this.levelWidth + 1; x++) {
            for (let y = 1; y < this.levelHeight + 1; y++) {
                newLevel.entities.push(Constants.newDungeonFloor(x, y));
                // newLevel.entities.push(Constants.newGrass(x, y));
            }
        }
        this.entityManager.addEntity(new Map<CType, Component>([[CType.Level, newLevel]]));
        this.loadLevel(newLevel);
    }
}

export const TILE_MAP = new Array<Tile>(
    Tile.None,
    Tile.Floor,
    Tile.Wall,
    Tile.Grass,
    Tile.Path,
    Tile.Wall,
    Tile.Wall,
    Tile.Wall,
    Tile.StairDown,
    Tile.StairUp
);

export const TILE_STRING_MAP = new Array<String>(
    "None",
    "Floor",
    "Wall",
    "Grass",
    "Path",
    "Wall",
    "Wall",
    "Wall",
    "StairDown",
    "StairUp"
);
