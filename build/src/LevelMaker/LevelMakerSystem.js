import * as PoppsInput from "../../lib/PoppsInput.js";
import { floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import LevelComponent from "../Components/LevelComponent.js";
import * as Constants from "../Constants.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
export default class LevelMakerSystem extends System {
    level;
    levelWidth = 0;
    levelHeight = 0;
    activeTile = 0;
    constructor(eventManager, entityManager) {
        super(SystemType.Level, eventManager, entityManager, [CType.Camera]);
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
    logic() { }
    handleEvent() { }
    keyDownHandler(key) {
        switch (key) {
            case "0":
                this.activeTile = 0;
                console.log("Active tile: None");
                break;
            case "1":
                this.activeTile = 1;
                console.log("Active tile: Wall");
                break;
            case "2":
                this.activeTile = 2;
                console.log("Active tile: DungeonFloor");
                break;
            case "3":
                this.activeTile = 3;
                console.log("Active tile: Door");
                break;
            case "4":
                this.activeTile = 4;
                console.log("Active tile: LevelExit");
                break;
            case "5":
                this.activeTile = 5;
                console.log("Active tile: LevelEntry");
                break;
            case "6":
                this.activeTile = 6;
                console.log("Active tile: Grass");
                break;
            case "7":
                this.activeTile = 7;
                console.log("Active tile: Path");
                break;
            case "l":
                this.levelWidth++;
                this.genEmptyLevel();
                break;
            case "L":
                this.levelWidth += 5;
                this.genEmptyLevel();
                break;
            case "k":
                this.levelWidth--;
                this.genEmptyLevel();
                break;
            case "K":
                this.levelWidth -= 5;
                this.genEmptyLevel();
                break;
            case "o":
                this.levelHeight++;
                this.genEmptyLevel();
                break;
            case "O":
                this.levelHeight += 5;
                this.genEmptyLevel();
                break;
            case "i":
                this.levelHeight--;
                this.genEmptyLevel();
                break;
            case "I":
                this.levelHeight -= 5;
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
        const cam = this.entityManager.get(this.entities[0], CType.Camera);
        const squareX = floor(cam.x + (event.x - window.innerWidth / 2) / cam.zoom + 0.5);
        const squareY = floor(cam.y + (event.y - window.innerHeight / 2) / cam.zoom + 0.5);
        this.paintTile(squareX, squareY);
    }
    mouseDraggedHandler(event) {
        const cam = this.entityManager.get(this.entities[0], CType.Camera);
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
        switch (this.activeTile) {
            case 0:
                this.removeTile(x, y);
                break;
            case 1:
                this.changeTile(x, y, Constants.newWall(x, y));
                break;
            case 2:
                this.changeTile(x, y, Constants.newDungeonFloor(x, y));
                break;
            case 3:
                this.changeTile(x, y, Constants.newDoor(x, y));
                break;
            case 4:
                this.changeTile(x, y, Constants.newExit(x, y));
                break;
            case 5:
                this.changeTile(x, y, Constants.newEntry(x, y));
                break;
            case 6:
                this.changeTile(x, y, Constants.newGrass(x, y));
                break;
            case 7:
                this.changeTile(x, y, Constants.newPath(x, y));
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
    }
    printControls() {
        console.log("Controls:\n", "k/K  -Width+  l/L", "\n", "i/I  -Height+  o/O", "\n", "1-10 to change tile type", "\n", "` to print level", "h to print controls");
    }
    printLevel(room) {
        if (room) {
            console.log(JSON.stringify(this.level.entities, this.replacer));
            return;
        }
        const entIds = this.level.entityIds;
        this.level.entityIds = [];
        console.log(JSON.stringify(this.level, this.replacer));
        this.level.entityIds = entIds;
    }
    replacer(_key, value) {
        if (value instanceof Map && value.has(CType.Tile)) {
            const t = value.get(CType.Tile);
            return {
                type: CType.Tile,
                tileType: t.tileType,
                x: t.x,
                y: t.y,
            };
        }
        else {
            return value;
        }
    }
    loadLevel(newLevel) {
        this.entityManager.removeEntities(this.level.entityIds);
        this.level = newLevel;
        this.level.entityIds = this.entityManager.addEntities(this.level.entities);
        this.eventManager.addEvent(Event.level_loaded);
    }
    genEmptyLevel() {
        const newLevel = new LevelComponent(0);
        for (let x = 1; x < this.levelWidth + 1; x++) {
            for (let y = 1; y < this.levelHeight + 1; y++) {
                newLevel.entities.push(Constants.newGrass(x, y));
            }
        }
        this.entityManager.addEntity(new Map([[CType.Level, newLevel]]));
        this.loadLevel(newLevel);
    }
}
//# sourceMappingURL=LevelMakerSystem.js.map