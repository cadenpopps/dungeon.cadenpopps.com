import DungeonTown from "../../content/levels/Levels.js";
import * as PoppsInput from "../../lib/PoppsInput.js";
import { floor, randomInt } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import InteractableComponent, { Interactable, } from "../Components/InteractableComponent.js";
import LevelComponent from "../Components/LevelComponent.js";
import LevelEntryComponent from "../Components/LevelEntryComponent.js";
import LevelExitComponent from "../Components/LevelExitComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
export default class LevelMakerSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Level, eventManager, entityManager, [CType.Camera]);
        this.levelWidth = 0;
        this.levelHeight = 0;
        this.activeTile = 0;
        this.exitId = 0;
        this.level = DungeonTown;
        this.levelWidth = 20;
        this.levelHeight = 20;
        PoppsInput.listenKeyDown(this.keyDownHandler.bind(this));
        PoppsInput.listenMouseDown(this.mouseDownHandler.bind(this));
        PoppsInput.listenMouseDragged(this.mouseDraggedHandler.bind(this));
        this.loadLevel(this.level);
        this.printControls();
    }
    logic() { }
    handleEvent(event) { }
    keyDownHandler(key) {
        switch (key) {
            case "1":
                this.activeTile = 1;
                console.log("Active tile: Wall");
                break;
            case "2":
                this.activeTile = 2;
                console.log("Active tile: Grass");
                break;
            case "3":
                this.activeTile = 3;
                console.log("Active tile: Path");
                break;
            case "4":
                this.activeTile = 4;
                console.log("Active tile: LevelExit");
                break;
            case "5":
                this.activeTile = 5;
                console.log("Active tile: ");
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
                this.entityManager
                    .getEntity(this.level.entityIds[i])
                    .has(CType.Interactable)) {
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
                this.entityManager
                    .getEntity(this.level.entityIds[i])
                    .has(CType.LevelEntry)) {
                this.entityManager.removeEntity(this.level.entityIds[i]);
                this.eventManager.addEvent(Event.entity_destroyed);
                this.level.entityIds.splice(i, 1);
            }
        }
        this.level.entities = this.level.entities.filter((ent) => {
            return !ent.has(CType.LevelEntry);
        });
    }
    paintTile(x, y) {
        for (let entityId of this.level.entityIds) {
            const pos = this.entityManager.get(entityId, CType.Position);
            if (x === pos.x && y === pos.y) {
                switch (this.activeTile) {
                    case 1:
                        this.changeTile(x, y, this.newWall(x, y));
                        break;
                    case 2:
                        this.changeTile(x, y, this.newGrass(x, y));
                        break;
                    case 3:
                        this.changeTile(x, y, this.newPath(x, y));
                        break;
                    case 4:
                        this.addTile(this.newExit(x, y));
                        break;
                }
            }
        }
    }
    addTile(newTile) {
        this.level.entities.push(newTile);
        this.entityManager.addEntity(newTile);
        this.eventManager.addEvent(Event.entity_created);
    }
    changeTile(x, y, newTile) {
        for (let i = 0; i < this.level.entities.length; i++) {
            const pos = this.level.entities[i].get(CType.Position);
            if (x === pos.x && y === pos.y) {
                this.level.entities[i] = newTile;
            }
        }
        for (let entityId of this.level.entityIds) {
            const pos = this.entityManager.get(entityId, CType.Position);
            if (x === pos.x && y === pos.y) {
                this.entityManager.entities.set(entityId, newTile);
                this.eventManager.addEvent(Event.entity_modified);
            }
        }
    }
    printControls() {
        console.log("Controls:\n", "k/K  -Width+  l/L", "\n", "i/I  -Height+  o/O", "\n", "1-10 to change tile type", "\n", "` to print level", "h to print controls");
    }
    printLevel() {
        const entryPos = this.entityManager.get(this.entities[0], CType.Position);
        this.removeEntries();
        this.addTile(this.newEntry(entryPos.x, entryPos.y));
        const entIds = this.level.entityIds;
        this.level.entityIds = [];
        console.log(JSON.stringify(this.level, function replacer(key, value) {
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
                if (x === 0 ||
                    y === 0 ||
                    x === this.levelWidth - 1 ||
                    y === this.levelHeight - 1) {
                    newLevel.entities.push(this.newWall(x, y));
                }
                else {
                    newLevel.entities.push(this.newGrass(x, y));
                }
            }
        }
        this.entityManager.addEntity(new Map([[CType.Level, newLevel]]));
        this.loadLevel(newLevel);
    }
    newWall(x, y) {
        return new Map([
            [CType.Position, new PositionComponent(x, y, 0)],
            [CType.Collision, new CollisionComponent()],
            [CType.Visible, this.getWallTexture()],
        ]);
    }
    getWallTexture() {
        return new VisibleComponent([33, 27, 20]);
    }
    newGrass(x, y) {
        return new Map([
            [CType.Position, new PositionComponent(x, y, 0)],
            [CType.Visible, this.getGrassTexture()],
        ]);
    }
    getGrassTexture() {
        return new VisibleComponent([
            30 + randomInt(10),
            92 + randomInt(25),
            0,
        ]);
    }
    newPath(x, y) {
        return new Map([
            [CType.Position, new PositionComponent(x, y, 0)],
            [CType.Visible, this.getPathTexture()],
        ]);
    }
    getPathTexture() {
        return new VisibleComponent([
            140 + randomInt(20),
            120 + randomInt(20),
            50,
        ]);
    }
    newEntry(x, y) {
        return new Map([
            [CType.Position, new PositionComponent(x, y, 0)],
            [CType.LevelEntry, new LevelEntryComponent(0)],
        ]);
    }
    newExit(x, y) {
        this.exitId++;
        return new Map([
            [CType.Position, new PositionComponent(x, y, 0)],
            [
                CType.Interactable,
                new InteractableComponent(Interactable.LevelExit),
            ],
            [CType.LevelExit, new LevelExitComponent(this.exitId)],
        ]);
    }
}
//# sourceMappingURL=LevelMakerSystem.js.map