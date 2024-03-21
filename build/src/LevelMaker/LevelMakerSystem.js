import * as PoppsInput from "../../lib/PoppsInput.js";
import { floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import LevelComponent from "../Components/LevelComponent.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import LevelSystem from "../Systems/LevelSystem.js";
export default class LevelMakerSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Level, eventManager, entityManager, [CType.Camera]);
        this.levelWidth = 0;
        this.levelHeight = 0;
        this.activeTile = 0;
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
        for (let entityId of this.level.entityIds) {
            if (entityId !== undefined) {
                switch (this.activeTile) {
                    case 0:
                        this.removeTile(x, y);
                        break;
                    case 1:
                        this.changeTile(x, y, LevelSystem.newWall(x, y));
                        break;
                    case 2:
                        this.changeTile(x, y, LevelSystem.newDungeonFloor(x, y));
                        break;
                    case 3:
                        this.changeTile(x, y, LevelSystem.newDoor(x, y));
                        break;
                    case 4:
                        this.changeTile(x, y, LevelSystem.newExit(x, y));
                        break;
                    case 5:
                        this.changeTile(x, y, LevelSystem.newEntry(x, y));
                        break;
                    case 6:
                        this.changeTile(x, y, LevelSystem.newGrass(x, y));
                        break;
                    case 7:
                        this.changeTile(x, y, LevelSystem.newPath(x, y));
                        break;
                }
            }
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
            console.log(JSON.stringify(this.level.entities, function replacer(key, value) {
                key;
                if (value instanceof Map) {
                    return {
                        dataType: "Map",
                        value: Array.from(value.entries()),
                    };
                }
                else {
                    return value;
                }
            }));
            return;
        }
        const entryPos = this.entityManager.get(this.entities[0], CType.Position);
        this.removeEntries();
        this.addTile(LevelSystem.newEntry(entryPos.x, entryPos.y));
        const entIds = this.level.entityIds;
        this.level.entityIds = [];
        console.log(JSON.stringify(this.level, function replacer(key, value) {
            key;
            if (value instanceof Map) {
                return {
                    dataType: "Map",
                    value: Array.from(value.entries()),
                };
            }
            else {
                return value;
            }
        }));
        this.level.entityIds = entIds;
    }
    loadLevel(newLevel) {
        this.entityManager.removeEntities(this.level.entityIds);
        this.level = newLevel;
        this.level.entityIds = this.entityManager.addEntities(this.level.entities);
        this.eventManager.addEvent(Event.level_loaded);
    }
    genEmptyLevel() {
        const newLevel = new LevelComponent(0);
        for (let x = 0; x < this.levelWidth; x++) {
            for (let y = 0; y < this.levelHeight; y++) {
                newLevel.entities.push(LevelSystem.newDungeonFloor(x, y));
            }
        }
        this.entityManager.addEntity(new Map([[CType.Level, newLevel]]));
        this.loadLevel(newLevel);
    }
}
//# sourceMappingURL=LevelMakerSystem.js.map