import DungeonTown from "../../content/levels/Levels.js";
import * as PoppsInput from "../../lib/PoppsInput.js";
import { floor, randomInt } from "../../lib/PoppsMath.js";
import { CType, Component } from "../Component.js";
import CameraComponent from "../Components/CameraComponent.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import InteractableComponent, {
    Interactable,
} from "../Components/InteractableComponent.js";
import LevelComponent from "../Components/LevelComponent.js";
import LevelEntryComponent from "../Components/LevelEntryComponent.js";
import LevelExitComponent from "../Components/LevelExitComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class LevelMakerSystem extends System {
    private level: LevelComponent;
    private levelWidth = 0;
    private levelHeight = 0;
    private activeTile = 0;
    private exitId = 0;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Level, eventManager, entityManager, [CType.Camera]);
        this.level = DungeonTown;
        this.levelWidth = 20;
        this.levelHeight = 20;

        PoppsInput.listenKeyDown(this.keyDownHandler.bind(this));
        PoppsInput.listenMouseDown(this.mouseDownHandler.bind(this));
        PoppsInput.listenMouseDragged(this.mouseDraggedHandler.bind(this));

        this.loadLevel(this.level);
        this.printControls();
    }

    public logic(): void {}

    public handleEvent(event: Event): void {}

    private keyDownHandler(key: string): void {
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

    private mouseDownHandler(event: MouseEvent): void {
        const cam = this.entityManager.get<CameraComponent>(
            this.entities[0],
            CType.Camera
        );
        const squareX = floor(
            cam.x + (event.x - window.innerWidth / 2) / cam.zoom + 0.5
        );
        const squareY = floor(
            cam.y + (event.y - window.innerHeight / 2) / cam.zoom + 0.5
        );
        this.paintTile(squareX, squareY);
    }

    private mouseDraggedHandler(event: MouseEvent): void {
        const cam = this.entityManager.get<CameraComponent>(
            this.entities[0],
            CType.Camera
        );
        const squareX = floor(
            cam.x + (event.x - window.innerWidth / 2) / cam.zoom + 0.5
        );
        const squareY = floor(
            cam.y + (event.y - window.innerHeight / 2) / cam.zoom + 0.5
        );
        this.paintTile(squareX, squareY);
    }

    private removeInteractables(): void {
        for (let i = this.level.entityIds.length - 1; i >= 0; i--) {
            if (
                this.level.entityIds[i] !== undefined &&
                this.entityManager
                    .getEntity(this.level.entityIds[i])
                    .has(CType.Interactable)
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
                this.entityManager
                    .getEntity(this.level.entityIds[i])
                    .has(CType.LevelEntry)
            ) {
                this.entityManager.removeEntity(this.level.entityIds[i]);
                this.eventManager.addEvent(Event.entity_destroyed);
                this.level.entityIds.splice(i, 1);
            }
        }

        this.level.entities = this.level.entities.filter((ent) => {
            return !ent.has(CType.LevelEntry);
        });
    }

    private paintTile(x: number, y: number): void {
        for (let entityId of this.level.entityIds) {
            const pos = this.entityManager.get<PositionComponent>(
                entityId,
                CType.Position
            );
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
                    // case 5:
                    //     this.changeTile(x, y, this.newGrass(x, y));
                    //     break;
                    // case 6:
                    //     this.changeTile(x, y, this.newGrass(x, y));
                    //     break;
                }
            }
        }
    }

    private addTile(newTile: Map<CType, Component>) {
        this.level.entities.push(newTile);
        this.entityManager.addEntity(newTile);
        this.eventManager.addEvent(Event.entity_created);
    }

    private changeTile(x: number, y: number, newTile: Map<CType, Component>) {
        for (let i = 0; i < this.level.entities.length; i++) {
            const pos = this.level.entities[i].get(
                CType.Position
            ) as PositionComponent;
            if (x === pos.x && y === pos.y) {
                this.level.entities[i] = newTile;
            }
        }
        for (let entityId of this.level.entityIds) {
            const pos = this.entityManager.get<PositionComponent>(
                entityId,
                CType.Position
            );
            if (x === pos.x && y === pos.y) {
                this.entityManager.entities.set(entityId, newTile);
                this.eventManager.addEvent(Event.entity_modified);
            }
        }
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
    private printLevel(): void {
        const entryPos = this.entityManager.get<PositionComponent>(
            this.entities[0],
            CType.Position
        );
        this.removeEntries();
        this.addTile(this.newEntry(entryPos.x, entryPos.y));
        const entIds = this.level.entityIds;
        this.level.entityIds = [];
        console.log(
            JSON.stringify(this.level, function replacer(key, value) {
                if (value instanceof Map) {
                    return {
                        dataType: "Map",
                        value: Array.from(value.entries()),
                    };
                } else {
                    return value;
                }
            })
        );
        this.level.entityIds = entIds;
    }

    private loadLevel(newLevel: LevelComponent): void {
        this.entityManager.removeEntities(this.level.entityIds);
        this.level = newLevel;
        this.level.entityIds = this.entityManager.addEntities(
            this.level.entities
        );
        this.eventManager.addEvent(Event.level_loaded);
    }

    private genEmptyLevel(): void {
        const newLevel = new LevelComponent(0);
        for (let x = 0; x < this.levelWidth; x++) {
            for (let y = 0; y < this.levelHeight; y++) {
                if (
                    x === 0 ||
                    y === 0 ||
                    x === this.levelWidth - 1 ||
                    y === this.levelHeight - 1
                ) {
                    newLevel.entities.push(this.newWall(x, y));
                } else {
                    newLevel.entities.push(this.newGrass(x, y));
                }
            }
        }
        this.entityManager.addEntity(
            new Map<CType, Component>([[CType.Level, newLevel]])
        );
        this.loadLevel(newLevel);
    }

    private newWall(x: number, y: number): Map<CType, Component> {
        return new Map<CType, Component>([
            [CType.Position, new PositionComponent(x, y, 0)],
            [CType.Collision, new CollisionComponent()],
            [CType.Visible, this.getWallTexture()],
        ]);
    }

    private getWallTexture(): VisibleComponent {
        return new VisibleComponent([33, 27, 20]);
    }

    private newGrass(x: number, y: number): Map<CType, Component> {
        return new Map<CType, Component>([
            [CType.Position, new PositionComponent(x, y, 0)],
            [CType.Visible, this.getGrassTexture()],
        ]);
    }

    private getGrassTexture(): VisibleComponent {
        return new VisibleComponent([
            30 + randomInt(10),
            92 + randomInt(25),
            0,
        ]);
    }

    private newPath(x: number, y: number): Map<CType, Component> {
        return new Map<CType, Component>([
            [CType.Position, new PositionComponent(x, y, 0)],
            [CType.Visible, this.getPathTexture()],
        ]);
    }

    private getPathTexture(): VisibleComponent {
        return new VisibleComponent([
            140 + randomInt(20),
            120 + randomInt(20),
            50,
        ]);
    }

    private newEntry(x: number, y: number): Map<CType, Component> {
        return new Map<CType, Component>([
            [CType.Position, new PositionComponent(x, y, 0)],
            [CType.LevelEntry, new LevelEntryComponent(0)],
        ]);
    }

    private newExit(x: number, y: number): Map<CType, Component> {
        this.exitId++;
        return new Map<CType, Component>([
            [CType.Position, new PositionComponent(x, y, 0)],
            [
                CType.Interactable,
                new InteractableComponent(Interactable.LevelExit),
            ],
            [CType.LevelExit, new LevelExitComponent(this.exitId)],
        ]);
    }
}
