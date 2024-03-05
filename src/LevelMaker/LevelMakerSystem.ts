import * as PoppsInput from "../../lib/PoppsInput.js";
import { floor, randomInt } from "../../lib/PoppsMath.js";
import { Component, ComponentType } from "../Component.js";
import CameraComponent from "../Components/CameraComponent.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import LevelComponent from "../Components/LevelComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class LevelMakerSystem extends System {
    private level: LevelComponent;
    private levelMap: Array<Array<number>>;
    private levelWidth = 0;
    private levelHeight = 0;
    private dragCooldown = 0;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Level, eventManager, entityManager, [
            ComponentType.Camera,
        ]);
        this.level = new LevelComponent(0);
        this.levelMap = new Array<Array<number>>();
        this.levelWidth = 20;
        this.levelHeight = 20;

        PoppsInput.listenKeyDown(this.keyDownHandler.bind(this));
        PoppsInput.listenMouseDown(this.mouseDownHandler.bind(this));
        PoppsInput.listenMouseDragged(this.mouseDraggedHandler.bind(this));

        this.genEmptyLevel();
        this.printControls();
    }

    public logic(): void {}

    public handleEvent(event: Event): void {}

    private keyDownHandler(key: string): void {
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

    private mouseDownHandler(event: MouseEvent): void {
        const cam = this.entityManager.data[ComponentType.Camera].get(
            this.entities[0]
        ) as CameraComponent;
        const squareX = floor(
            cam.x + (event.x - window.innerWidth / 2) / cam.zoom + 0.5
        );
        const squareY = floor(
            cam.y + (event.y - window.innerHeight / 2) / cam.zoom + 0.5
        );
        this.cycleTile(squareX, squareY);
    }

    private mouseDraggedHandler(event: MouseEvent): void {
        if (this.dragCooldown === 0) {
            const cam = this.entityManager.data[ComponentType.Camera].get(
                this.entities[0]
            ) as CameraComponent;
            const squareX = floor(
                cam.x + (event.x - window.innerWidth / 2) / cam.zoom + 0.5
            );
            const squareY = floor(
                cam.y + (event.y - window.innerHeight / 2) / cam.zoom + 0.5
            );
            this.cycleTile(squareX, squareY);
            this.dragCooldown = 8;
        }
        this.dragCooldown--;
    }

    private cycleTile(x: number, y: number): void {
        for (let entityId of this.level.entityIds) {
            const pos = this.entityManager.data[ComponentType.Position].get(
                entityId
            ) as PositionComponent;
            let vis = this.entityManager.data[ComponentType.Visible].get(
                entityId
            ) as VisibleComponent;
            if (x === pos.x && y === pos.y) {
                if (this.levelMap[x][y] === 0) {
                    this.entityManager.data[ComponentType.Visible].set(
                        entityId,
                        this.getGrassTexture()
                    );
                    this.levelMap[x][y] = 1;
                } else if (this.levelMap[x][y] === 1) {
                    this.entityManager.data[ComponentType.Visible].set(
                        entityId,
                        this.getPathTexture()
                    );
                    this.levelMap[x][y] = 2;
                } else if (this.levelMap[x][y] === 2) {
                    this.entityManager.data[ComponentType.Visible].set(
                        entityId,
                        this.getWallTexture()
                    );
                    this.levelMap[x][y] = 0;
                }
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
            "Click to cycle tile type",
            "\n",
            "` to print level",
            "h to print controls"
        );
    }

    private printLevel(): void {
        console.log(JSON.stringify(this.level.entities));
    }

    private loadLevel(newLevel: LevelComponent): void {
        this.entityManager.removeEntities(this.level.entityIds);
        this.level = newLevel;
        newLevel.entityIds = this.entityManager.addEntities(newLevel.entities);
    }

    private genEmptyLevel(): void {
        const newLevel = new LevelComponent(0);
        this.levelMap = new Array<Array<number>>(this.levelWidth);
        for (let x = 0; x < this.levelWidth; x++) {
            this.levelMap[x] = new Array<number>(this.levelHeight);
            for (let y = 0; y < this.levelHeight; y++) {
                if (
                    x === 0 ||
                    y === 0 ||
                    x === this.levelWidth - 1 ||
                    y === this.levelHeight - 1
                ) {
                    newLevel.entities.push(this.newWall(x, y));
                    this.levelMap[x][y] = 0;
                } else {
                    newLevel.entities.push(this.newGrass(x, y));
                    this.levelMap[x][y] = 1;
                }
            }
        }
        this.entityManager.addEntity([newLevel]);
        this.loadLevel(newLevel);
    }

    private newWall(x: number, y: number): Array<Component> {
        return [
            new PositionComponent(x, y, 0),
            new CollisionComponent(),
            this.getWallTexture(),
        ];
    }

    private getWallTexture(): VisibleComponent {
        return new VisibleComponent([33, 27, 20]);
    }

    private newGrass(x: number, y: number): Array<Component> {
        return [new PositionComponent(x, y, 0), this.getGrassTexture()];
    }

    private getGrassTexture(): VisibleComponent {
        return new VisibleComponent([
            30 + randomInt(10),
            92 + randomInt(25),
            0,
        ]);
    }

    private newPath(x: number, y: number): Array<Component> {
        return [new PositionComponent(x, y, 0), this.getPathTexture()];
    }

    private getPathTexture(): VisibleComponent {
        return new VisibleComponent([
            140 + randomInt(20),
            120 + randomInt(20),
            50,
        ]);
    }
}
