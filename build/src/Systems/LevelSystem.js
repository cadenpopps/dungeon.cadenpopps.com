import { ComponentType } from "../Component.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import LevelComponent from "../Components/LevelComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
export default class LevelSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Level, eventManager, entityManager, [
            ComponentType.Level,
        ]);
    }
    logic() { }
    handleEvent(event) {
        switch (event) {
            case Event.new_game:
                this.loadLevelZero();
                break;
            case Event.level_down:
                this.loadLevelDown();
                break;
            case Event.level_up:
                this.loadLevelUp();
                break;
        }
    }
    loadLevelZero() {
        const levelZero = this.levelGen(0);
        this.currentLevel = levelZero;
        this.loadLevel(levelZero);
    }
    loadLevelDown() {
        for (let entityId of this.entities) {
            const level = this.entityManager.data[ComponentType.Level].get(entityId);
            if (level.depth === this.currentLevel.depth + 1) {
                this.loadLevel(level);
                return;
            }
        }
        const newLevel = this.levelGen(this.currentLevel.depth + 1);
        this.loadLevel(newLevel);
    }
    loadLevelUp() {
        for (let entityId of this.entities) {
            const level = this.entityManager.data[ComponentType.Level].get(entityId);
            if (level.depth === this.currentLevel.depth - 1) {
                this.loadLevel(level);
                return;
            }
        }
    }
    loadLevel(level) {
        this.entityManager.removeEntities(this.currentLevel.entityIds);
        this.currentLevel = level;
        level.entityIds = this.entityManager.addEntities(level.entities);
    }
    levelFromJSON(level) { }
    levelGen(depth) {
        const newLevel = new LevelComponent(depth);
        const w = 100;
        const h = 100;
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
                    newLevel.entities.push([
                        new CollisionComponent(),
                        new PositionComponent(x, y, depth),
                        new VisibleComponent({
                            r: 30,
                            g: 30,
                            b: 30,
                        }),
                    ]);
                }
                else {
                    if (Math.random() < 0.1) {
                        newLevel.entities.push([
                            new CollisionComponent(),
                            new PositionComponent(x, y, depth),
                            new VisibleComponent({
                                r: 30,
                                g: 30,
                                b: 30,
                            }),
                        ]);
                    }
                    else {
                        newLevel.entities.push([
                            new PositionComponent(x, y, depth),
                            new VisibleComponent({
                                r: 100 - (x % 2) * 10,
                                g: 100 - (y % 2) * 10,
                                b: 150,
                            }),
                        ]);
                    }
                }
            }
        }
        this.entityManager.addEntity([newLevel]);
        return newLevel;
    }
}
//# sourceMappingURL=LevelSystem.js.map