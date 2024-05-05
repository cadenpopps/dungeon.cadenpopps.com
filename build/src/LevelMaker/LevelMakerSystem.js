import * as PoppsInput from "../../lib/PoppsInput.js";
import { floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import LevelComponent from "../Components/LevelComponent.js";
import TileComponent, { Tile } from "../Components/TileComponent.js";
import UIComponent, { UIToolTip } from "../Components/UIComponent.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "../Systems/CameraSystem.js";
import { newDoor, newDungeonFloor, newEnemySpawner, newEntry, newExit, newGrass, newPath, newWall, } from "../Systems/LevelSystem.js";
export default class LevelMakerSystem extends System {
    level;
    levelWidth = 0;
    levelHeight = 0;
    activeTile = 1;
    constructor(eventManager, entityManager) {
        super(SystemType.Level, eventManager, entityManager, []);
        this.level = new LevelComponent(0);
        this.levelWidth = 11;
        this.levelHeight = 11;
        this.genEmptyLevel();
        PoppsInput.listenKeyDown(this.keyDownHandler.bind(this));
        PoppsInput.listenMouseDown(this.mouseDownHandler.bind(this));
        PoppsInput.listenMouseDragged(this.mouseDraggedHandler.bind(this));
        this.printControls();
    }
    logic() {
        for (let entityId of this.entities) {
            if (this.entityManager.hasComponent(entityId, CType.Visible)) {
                const vis = this.entityManager.get(entityId, CType.Visible);
                vis.visible = true;
                vis.discovered = true;
            }
        }
    }
    keyDownHandler(key) {
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
    mouseDownHandler(event) {
        const cam = CameraSystem.getHighestPriorityCamera();
        const squareX = floor(cam.x + (event.x - window.innerWidth / 2) / cam.zoom + 0.5);
        const squareY = floor(cam.y + (event.y - window.innerHeight / 2) / cam.zoom + 0.5);
        this.paintTile(squareX, squareY);
    }
    mouseDraggedHandler(event) {
        const cam = CameraSystem.getHighestPriorityCamera();
        const squareX = floor(cam.x + (event.x - window.innerWidth / 2) / cam.zoom + 0.5);
        const squareY = floor(cam.y + (event.y - window.innerHeight / 2) / cam.zoom + 0.5);
        this.paintTile(squareX, squareY);
    }
    removeInteractables() {
        for (let i = this.level.entityIds.length - 1; i >= 0; i--) {
            if (this.level.entityIds[i] !== undefined &&
                this.entityManager.getEntity(this.level.entityIds[i]).has(CType.Interactable)) {
                this.entityManager.removeEntity(this.level.entityIds[i]);
                this.eventManager.addEvent(Event.entity_destroyed);
                this.level.entityIds.splice(i, 1);
            }
        }
        this.level.entities = this.level.entities.filter((ent) => {
            return !ent.has(CType.Interactable);
        });
    }
    removeEntries() {
        for (let i = this.level.entityIds.length - 1; i >= 0; i--) {
            if (this.level.entityIds[i] !== undefined &&
                this.entityManager.getEntity(this.level.entityIds[i]).has(CType.LevelChange)) {
                this.entityManager.removeEntity(this.level.entityIds[i]);
                this.eventManager.addEvent(Event.entity_destroyed);
                this.level.entityIds.splice(i, 1);
            }
        }
        this.level.entities = this.level.entities.filter((ent) => {
            return !ent.has(CType.LevelChange);
        });
    }
    paintTile(x, y) {
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
                    const pos = entity.get(CType.Position);
                    if (x === pos.x && y === pos.y) {
                        entity.set(CType.Tile, new TileComponent(Tile.EnemySpawner, x, y));
                        entity.set(CType.UI, new UIComponent([new UIToolTip("Enemy")]));
                    }
                }
                break;
            case Tile.PackSpawner:
                this.changeTile(x, y, newEnemySpawner(x, y, true, false));
                for (const entity of this.level.entities) {
                    const pos = entity.get(CType.Position);
                    if (x === pos.x && y === pos.y) {
                        entity.set(CType.Tile, new TileComponent(Tile.PackSpawner, x, y));
                        entity.set(CType.UI, new UIComponent([new UIToolTip("Pack")]));
                    }
                }
                break;
            case Tile.BossSpawner:
                this.changeTile(x, y, newEnemySpawner(x, y, false, true));
                for (const entity of this.level.entities) {
                    const pos = entity.get(CType.Position);
                    if (x === pos.x && y === pos.y) {
                        entity.set(CType.Tile, new TileComponent(Tile.BossSpawner, x, y));
                        entity.set(CType.UI, new UIComponent([new UIToolTip("Boss")]));
                    }
                }
                break;
        }
    }
    addTile(newTile) {
        this.level.entities.push(newTile);
        const id = this.entityManager.addEntity(newTile);
        if (!this.level.entityIds.includes(id)) {
            this.level.entityIds.push(id);
        }
    }
    removeTile(x, y) {
        for (let i = this.level.entityIds.length - 1; i >= 0; i--) {
            const pos = this.entityManager.get(this.level.entityIds[i], CType.Position);
            if (x === pos.x && y === pos.y) {
                this.entityManager.removeEntity(this.level.entityIds[i]);
                this.level.entityIds.splice(i, 1);
                i = 0;
            }
        }
        this.level.entities = this.level.entities.filter((ent) => {
            const pos = ent.get(CType.Position);
            return !(x === pos.x && y === pos.y);
        });
    }
    changeTile(x, y, newTile) {
        this.removeTile(x, y);
        this.addTile(newTile);
        this.eventManager.addEvent(Event.level_loaded);
    }
    printControls() {
        console.log("Controls:\n", "k/K  -Width+  l/L", "\n", "i/I  -Height+  o/O", "\n", "1-10 to change tile type", "\n", "` to print level", "h to print controls");
    }
    printLevel(room) {
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
    replacer(_key, value) {
        if (value instanceof Map && value.has(CType.Tile)) {
            const tile = value.get(CType.Tile);
            const json = {
                type: tile.tileType,
                x: tile.x,
                y: tile.y,
            };
            return json;
        }
        else {
            delete value.type;
            return value;
        }
    }
    loadLevel(newLevel) {
        if (this.level.entityIds) {
            this.entityManager.removeEntities(this.level.entityIds);
        }
        this.level = newLevel;
        this.level.entityIds = this.entityManager.addEntities(this.level.entities);
        this.eventManager.addEvent(Event.level_loaded);
    }
    genEmptyLevel() {
        const newLevel = new LevelComponent(0);
        for (let x = 1; x < this.levelWidth + 1; x++) {
            for (let y = 1; y < this.levelHeight + 1; y++) {
                newLevel.entities.push(newDungeonFloor(x, y));
            }
        }
        this.entityManager.addEntity(new Map([[CType.Level, newLevel]]));
        this.loadLevel(newLevel);
    }
}
export const TILE_MAP = new Array(Tile.None, Tile.Floor, Tile.Wall, Tile.Grass, Tile.Path, Tile.EnemySpawner, Tile.PackSpawner, Tile.BossSpawner, Tile.StairDown, Tile.StairUp);
export const TILE_STRING_MAP = new Array("None", "Floor", "Wall", "Grass", "Path", "EnemySpawner", "PackSpawner", "BossSpawner", "StairDown", "StairUp");
//# sourceMappingURL=LevelMakerSystem.js.map