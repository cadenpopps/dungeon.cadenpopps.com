import DungeonTown from "../../content/levels/Levels.js";
import { floor, randomInRange, randomInt } from "../../lib/PoppsMath.js";
import { CType, Component } from "../Component.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import InteractableComponent, {
    Interactable,
} from "../Components/InteractableComponent.js";
import LevelComponent from "../Components/LevelComponent.js";
import LevelEntryComponent from "../Components/LevelEntryComponent.js";
import LevelExitComponent from "../Components/LevelExitComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class LevelSystem extends System {
    private currentLevel: LevelComponent;
    private levels: LevelComponent[];

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Level, eventManager, entityManager, [CType.Player]);
        this.currentLevel = new LevelComponent(-1);
        this.levels = [];
    }

    public logic(): void {}

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.new_game:
                this.loadLevel(DungeonTown);
                break;
            case Event.level_change:
                this.changeLevel();
                break;
        }
    }

    private changeLevel(): void {
        const exitId = this.entityManager.get<PlayerComponent>(
            this.entities[0],
            CType.Player
        ).levelExitId;

        for (let l of this.levels) {
            for (let e of l.entities) {
                const entry = e.get(CType.LevelEntry) as LevelEntryComponent;
                if (entry && entry.id === exitId) {
                    this.loadLevel(l);
                    return;
                }
            }
        }

        this.levels.push(
            this.generateLevel(exitId, this.currentLevel.depth + 1)
        );
    }

    private loadLevel(level: LevelComponent): void {
        this.entityManager.removeEntities(this.currentLevel.entityIds);
        if (!this.levels.includes(level)) {
            this.levels.push(level);
        }
        this.currentLevel = level;
        this.currentLevel.entityIds = this.entityManager.addEntities(
            this.currentLevel.entities
        );
        this.eventManager.addEvent(Event.level_loaded);
    }

    private generateLevel(entryId: number, depth: number): LevelComponent {
        const newLevel = new LevelComponent(depth);
        const width = 60;
        const height = 60;
        newLevel.entities.push(
            this.newEntry(
                floor(randomInRange(width / 10, width - width / 10)),
                floor(randomInRange(height / 10, height - height / 10)),
                depth,
                entryId
            )
        );

        newLevel.entities.push(
            this.newExit(
                floor(randomInRange(width / 10, width - width / 10)),
                floor(randomInRange(height / 10, height - height / 10)),
                depth
            )
        );

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                    newLevel.entities.push(this.newWall(x, y, depth));
                } else {
                    if (Math.random() < 0.05) {
                        newLevel.entities.push(this.newWall(x, y, depth));
                    } else {
                        newLevel.entities.push(this.newRockFloor(x, y, depth));
                    }
                }
            }
        }

        this.entityManager.addEntity(
            new Map<CType, Component>([[CType.Level, newLevel]])
        );
        return newLevel;
    }

    private newWall(
        x: number,
        y: number,
        depth: number
    ): Map<CType, Component> {
        return new Map<CType, Component>([
            [CType.Position, new PositionComponent(x, y, depth)],
            [CType.Collision, new CollisionComponent()],
            [CType.Visible, this.getWallTexture()],
        ]);
    }

    private getWallTexture(): VisibleComponent {
        return new VisibleComponent([33, 27, 20]);
    }

    private newRockFloor(
        x: number,
        y: number,
        depth: number
    ): Map<CType, Component> {
        return new Map<CType, Component>([
            [CType.Position, new PositionComponent(x, y, depth)],
            [CType.Visible, this.getRockFloorTexture()],
        ]);
    }

    private getRockFloorTexture(): VisibleComponent {
        return new VisibleComponent([
            30 + randomInt(10),
            92 + randomInt(25),
            100,
        ]);
    }

    private newGrass(
        x: number,
        y: number,
        depth: number
    ): Map<CType, Component> {
        return new Map<CType, Component>([
            [CType.Position, new PositionComponent(x, y, depth)],
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

    private newPath(
        x: number,
        y: number,
        depth: number
    ): Map<CType, Component> {
        return new Map<CType, Component>([
            [CType.Position, new PositionComponent(x, y, depth)],
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

    private newEntry(
        x: number,
        y: number,
        depth: number,
        id: number
    ): Map<CType, Component> {
        return new Map<CType, Component>([
            [CType.Position, new PositionComponent(x, y, depth)],
            [CType.LevelEntry, new LevelEntryComponent(id)],
            [CType.Visible, new VisibleComponent([30, 200, 30], 1)],
        ]);
    }

    private newExit(
        x: number,
        y: number,
        depth: number
    ): Map<CType, Component> {
        const exitId = this.entityManager.get<PlayerComponent>(
            this.entities[0],
            CType.Player
        ).levelExitId;
        return new Map<CType, Component>([
            [CType.Position, new PositionComponent(x, y, depth)],
            [
                CType.Interactable,
                new InteractableComponent(Interactable.LevelExit),
            ],
            [CType.LevelExit, new LevelExitComponent(exitId + 1)],
            [CType.Visible, new VisibleComponent([200, 30, 30], 1)],
        ]);
    }
}
