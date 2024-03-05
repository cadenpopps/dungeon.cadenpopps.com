import * as PoppsInput from "../../lib/PoppsInput.js";
import { floor, randomInt } from "../../lib/PoppsMath.js";
import { ComponentType } from "../Component.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import LevelComponent from "../Components/LevelComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { System, SystemType } from "../System.js";
export default class LevelMakerSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Level, eventManager, entityManager, [
            ComponentType.Camera,
        ]);
        this.levelWidth = 0;
        this.levelHeight = 0;
        this.dragCooldown = 0;
        this.level = new LevelComponent(0);
        this.levelMap = new Array();
        this.levelWidth = 20;
        this.levelHeight = 20;
        PoppsInput.listenKeyDown(this.keyDownHandler.bind(this));
        PoppsInput.listenMouseDown(this.mouseDownHandler.bind(this));
        PoppsInput.listenMouseDragged(this.mouseDraggedHandler.bind(this));
        this.genEmptyLevel();
        this.printControls();
    }
    logic() { }
    handleEvent(event) { }
    keyDownHandler(key) {
        switch (key) {
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
            case "h":
                this.printControls();
                break;
            case "`":
                this.printLevel();
                break;
        }
    }
    mouseDownHandler(event) {
        const cam = this.entityManager.data[ComponentType.Camera].get(this.entities[0]);
        const squareX = floor(cam.x + (event.x - window.innerWidth / 2) / cam.zoom + 0.5);
        const squareY = floor(cam.y + (event.y - window.innerHeight / 2) / cam.zoom + 0.5);
        this.cycleTile(squareX, squareY);
    }
    mouseDraggedHandler(event) {
        if (this.dragCooldown === 0) {
            const cam = this.entityManager.data[ComponentType.Camera].get(this.entities[0]);
            const squareX = floor(cam.x + (event.x - window.innerWidth / 2) / cam.zoom + 0.5);
            const squareY = floor(cam.y + (event.y - window.innerHeight / 2) / cam.zoom + 0.5);
            this.cycleTile(squareX, squareY);
            this.dragCooldown = 8;
        }
        this.dragCooldown--;
    }
    cycleTile(x, y) {
        for (let entityId of this.level.entityIds) {
            const pos = this.entityManager.data[ComponentType.Position].get(entityId);
            let vis = this.entityManager.data[ComponentType.Visible].get(entityId);
            if (x === pos.x && y === pos.y) {
                if (this.levelMap[x][y] === 0) {
                    this.entityManager.data[ComponentType.Visible].set(entityId, this.getGrassTexture());
                    this.levelMap[x][y] = 1;
                }
                else if (this.levelMap[x][y] === 1) {
                    this.entityManager.data[ComponentType.Visible].set(entityId, this.getPathTexture());
                    this.levelMap[x][y] = 2;
                }
                else if (this.levelMap[x][y] === 2) {
                    this.entityManager.data[ComponentType.Visible].set(entityId, this.getWallTexture());
                    this.levelMap[x][y] = 0;
                }
            }
        }
    }
    printControls() {
        console.log("Controls:\n", "k/K  -Width+  l/L", "\n", "i/I  -Height+  o/O", "\n", "Click to cycle tile type", "\n", "` to print level", "h to print controls");
    }
    printLevel() {
        console.log(JSON.stringify(this.level.entities));
    }
    loadLevel(newLevel) {
        this.entityManager.removeEntities(this.level.entityIds);
        this.level = newLevel;
        newLevel.entityIds = this.entityManager.addEntities(newLevel.entities);
    }
    genEmptyLevel() {
        const newLevel = new LevelComponent(0);
        this.levelMap = new Array(this.levelWidth);
        for (let x = 0; x < this.levelWidth; x++) {
            this.levelMap[x] = new Array(this.levelHeight);
            for (let y = 0; y < this.levelHeight; y++) {
                if (x === 0 ||
                    y === 0 ||
                    x === this.levelWidth - 1 ||
                    y === this.levelHeight - 1) {
                    newLevel.entities.push(this.newWall(x, y));
                    this.levelMap[x][y] = 0;
                }
                else {
                    newLevel.entities.push(this.newGrass(x, y));
                    this.levelMap[x][y] = 1;
                }
            }
        }
        this.entityManager.addEntity([newLevel]);
        this.loadLevel(newLevel);
    }
    newWall(x, y) {
        return [
            new PositionComponent(x, y, 0),
            new CollisionComponent(),
            this.getWallTexture(),
        ];
    }
    getWallTexture() {
        return new VisibleComponent([33, 27, 20]);
    }
    newGrass(x, y) {
        return [new PositionComponent(x, y, 0), this.getGrassTexture()];
    }
    getGrassTexture() {
        return new VisibleComponent([
            30 + randomInt(10),
            92 + randomInt(25),
            0,
        ]);
    }
    newPath(x, y) {
        return [new PositionComponent(x, y, 0), this.getPathTexture()];
    }
    getPathTexture() {
        return new VisibleComponent([
            140 + randomInt(20),
            120 + randomInt(20),
            50,
        ]);
    }
}
//# sourceMappingURL=LevelMakerSystem.js.map