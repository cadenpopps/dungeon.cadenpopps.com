import * as PoppsInput from "../../lib/PoppsInput.js";
import { floor } from "../../lib/PoppsMath.js";
import { CType, Component } from "../Component.js";
import LevelComponent from "../Components/LevelComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import TileComponent, { Tile } from "../Components/TileComponent.js";
import UIComponent, { UIToolTip } from "../Components/UIComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "../Systems/CameraSystem.js";
import {
    newDoor,
    newDungeonFloor,
    newEnemySpawner,
    newEntry,
    newExit,
    newGrass,
    newPath,
    newWall,
} from "../Systems/LevelSystem.js";

export default class LevelMakerSystem extends System {
    private level!: LevelComponent;
    private levelWidth = 0;
    private levelHeight = 0;
    private activeTile = 1;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Level, eventManager, entityManager, []);
        this.level = new LevelComponent(0);
        this.levelWidth = 11;
        this.levelHeight = 11;
        this.genEmptyLevel();

        // const reviver = function reviver(_key: any, value: any) {
        //     if (value !== null && value.type === CType.Tile) {
        //         return convertTile(value);
        //     }
        //     return value;
        // };

        // this.loadLevel(loadJSON("/content/levels/DungeonTown.json", reviver));

        PoppsInput.listenKeyDown(this.keyDownHandler.bind(this));
        PoppsInput.listenMouseDown(this.mouseDownHandler.bind(this));
        PoppsInput.listenMouseDragged(this.mouseDraggedHandler.bind(this));

        this.printControls();
    }

    public logic(): void {
        for (let entityId of this.entities) {
            if (this.entityManager.hasComponent(entityId, CType.Visible)) {
                const vis = this.entityManager.get<VisibleComponent>(entityId, CType.Visible);
                vis.visible = true;
                vis.discovered = true;
            }
        }
    }

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
            case "n":
            case "N":
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
                this.changeTile(x, y, newWall(x, y));
                break;
            case Tile.Floor:
                this.changeTile(x, y, newDungeonFloor(x, y));
                break;
            case Tile.Door:
                this.changeTile(x, y, newDoor(x, y));
                break;
            case Tile.StairDown:
                this.changeTile(x, y, newExit(x, y));
                break;
            case Tile.StairUp:
                this.changeTile(x, y, newEntry(x, y));
                break;
            case Tile.Grass:
                this.changeTile(x, y, newGrass(x, y));
                break;
            case Tile.Path:
                this.changeTile(x, y, newPath(x, y));
                break;
            case Tile.EnemySpawner:
                this.changeTile(x, y, newEnemySpawner(x, y, false, false));
                for (const entity of this.level.entities) {
                    const pos = entity.get(CType.Position) as PositionComponent;
                    if (x === pos.x && y === pos.y) {
                        entity.set(CType.Tile, new TileComponent(Tile.EnemySpawner, x, y));
                        entity.set(CType.UI, new UIComponent([new UIToolTip("Enemy")]));
                    }
                }
                break;
            case Tile.PackSpawner:
                this.changeTile(x, y, newEnemySpawner(x, y, true, false));
                for (const entity of this.level.entities) {
                    const pos = entity.get(CType.Position) as PositionComponent;
                    if (x === pos.x && y === pos.y) {
                        entity.set(CType.Tile, new TileComponent(Tile.PackSpawner, x, y));
                        entity.set(CType.UI, new UIComponent([new UIToolTip("Pack")]));
                    }
                }
                break;
            case Tile.BossSpawner:
                this.changeTile(x, y, newEnemySpawner(x, y, false, true));
                for (const entity of this.level.entities) {
                    const pos = entity.get(CType.Position) as PositionComponent;
                    if (x === pos.x && y === pos.y) {
                        entity.set(CType.Tile, new TileComponent(Tile.BossSpawner, x, y));
                        entity.set(CType.UI, new UIComponent([new UIToolTip("Boss")]));
                    }
                }
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
        this.eventManager.addEvent(Event.level_loaded);
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
            const string = JSON.stringify(this.level.entities, this.replacer);
            console.log(string);
            console.log(`Copied level to clipboard`);
            navigator.clipboard.writeText(string);
            return;
        }

        const entIds = this.level.entityIds;
        this.level.entityIds = [];
        const string = JSON.stringify(this.level, this.replacer);
        console.log(string);
        console.log(`Copied level to clipboard`);
        navigator.clipboard.writeText(string);
        this.level.entityIds = entIds;
    }

    private replacer(_key: any, value: any): Object {
        if (value instanceof Map && value.has(CType.Tile)) {
            const tile = value.get(CType.Tile) as TileComponent;
            const json: any = {
                type: tile.tileType,
                x: tile.x,
                y: tile.y,
            };
            return json;
        } else {
            delete value.type;
            return value;
        }
    }

    private loadLevel(newLevel: LevelComponent): void {
        if (this.level.entityIds) {
            this.entityManager.removeEntities(this.level.entityIds);
        }
        this.level = newLevel;
        this.level.entityIds = this.entityManager.addEntities(this.level.entities);
        this.eventManager.addEvent(Event.level_loaded);
    }

    private genEmptyLevel(): void {
        const newLevel = new LevelComponent(0);
        for (let x = 1; x < this.levelWidth + 1; x++) {
            for (let y = 1; y < this.levelHeight + 1; y++) {
                newLevel.entities.push(newDungeonFloor(x, y));
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
    Tile.EnemySpawner,
    Tile.PackSpawner,
    Tile.BossSpawner,
    Tile.StairDown,
    Tile.StairUp
);

export const TILE_STRING_MAP = new Array<String>(
    "None",
    "Floor",
    "Wall",
    "Grass",
    "Path",
    "EnemySpawner",
    "PackSpawner",
    "BossSpawner",
    "StairDown",
    "StairUp"
);
