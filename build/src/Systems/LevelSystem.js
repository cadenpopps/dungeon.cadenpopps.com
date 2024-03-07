import DungeonTown from "../../content/levels/Levels.js";
import { floor, randomInRange, randomInt } from "../../lib/PoppsMath.js";
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
export default class LevelSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Level, eventManager, entityManager, [CType.Player]);
        this.currentLevel = new LevelComponent(-1);
        this.levels = [];
    }
    logic() { }
    handleEvent(event) {
        switch (event) {
            case Event.new_game:
                this.loadLevel(DungeonTown);
                break;
            case Event.level_change:
                this.changeLevel();
                break;
        }
    }
    changeLevel() {
        const exitId = this.entityManager.get(this.entities[0], CType.Player).levelExitId;
        for (let l of this.levels) {
            for (let e of l.entities) {
                const entry = e.get(CType.LevelEntry);
                if (entry && entry.id === exitId) {
                    this.loadLevel(l);
                    return;
                }
            }
        }
        this.levels.push(this.generateLevel(exitId, this.currentLevel.depth + 1));
    }
    loadLevel(level) {
        this.entityManager.removeEntities(this.currentLevel.entityIds);
        if (!this.levels.includes(level)) {
            this.levels.push(level);
        }
        this.currentLevel = level;
        this.currentLevel.entityIds = this.entityManager.addEntities(this.currentLevel.entities);
        this.eventManager.addEvent(Event.level_loaded);
    }
    generateLevel(entryId, depth) {
        const newLevel = new LevelComponent(depth);
        const width = 60;
        const height = 60;
        newLevel.entities.push(this.newEntry(floor(randomInRange(width / 10, width - width / 10)), floor(randomInRange(height / 10, height - height / 10)), depth, entryId));
        newLevel.entities.push(this.newExit(floor(randomInRange(width / 10, width - width / 10)), floor(randomInRange(height / 10, height - height / 10)), depth));
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                    newLevel.entities.push(this.newWall(x, y, depth));
                }
                else {
                    if (Math.random() < 0.05) {
                        newLevel.entities.push(this.newWall(x, y, depth));
                    }
                    else {
                        newLevel.entities.push(this.newRockFloor(x, y, depth));
                    }
                }
            }
        }
        this.entityManager.addEntity(new Map([[CType.Level, newLevel]]));
        return newLevel;
    }
    newWall(x, y, depth) {
        return new Map([
            [CType.Position, new PositionComponent(x, y, depth)],
            [CType.Collision, new CollisionComponent()],
            [CType.Visible, this.getWallTexture()],
        ]);
    }
    getWallTexture() {
        return new VisibleComponent([33, 27, 20]);
    }
    newRockFloor(x, y, depth) {
        return new Map([
            [CType.Position, new PositionComponent(x, y, depth)],
            [CType.Visible, this.getRockFloorTexture()],
        ]);
    }
    getRockFloorTexture() {
        return new VisibleComponent([
            30 + randomInt(10),
            92 + randomInt(25),
            100,
        ]);
    }
    newGrass(x, y, depth) {
        return new Map([
            [CType.Position, new PositionComponent(x, y, depth)],
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
    newPath(x, y, depth) {
        return new Map([
            [CType.Position, new PositionComponent(x, y, depth)],
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
    newEntry(x, y, depth, id) {
        return new Map([
            [CType.Position, new PositionComponent(x, y, depth)],
            [CType.LevelEntry, new LevelEntryComponent(id)],
            [CType.Visible, new VisibleComponent([30, 200, 30], 1)],
        ]);
    }
    newExit(x, y, depth) {
        const exitId = this.entityManager.get(this.entities[0], CType.Player).levelExitId;
        return new Map([
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
//# sourceMappingURL=LevelSystem.js.map