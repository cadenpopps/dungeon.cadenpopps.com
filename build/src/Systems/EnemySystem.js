import { abs, floor, randomInRange, randomIntInRange } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import AIComponent from "../Components/AIComponent.js";
import AccelerationComponent from "../Components/AccelerationComponent.js";
import CollisionComponent, { CollisionHandler } from "../Components/CollisionComponent.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import DirectionComponent from "../Components/DirectionComponent.js";
import ExperienceComponent from "../Components/ExperienceComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import SizeComponent from "../Components/SizeComponent.js";
import UIComponent, { UIEnemyHealthBar } from "../Components/UIComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
export default class EnemySystem extends System {
    playerId;
    static PACK_RADIUS = 3;
    constructor(eventManager, entityManager) {
        super(SystemType.Enemy, eventManager, entityManager, [CType.EnemySpawner]);
    }
    getEntitiesHelper() {
        this.playerId = this.entityManager.getSystemEntities([CType.Player])[0];
    }
    logic() {
        const cam = CameraSystem.getHighestPriorityCamera();
        const playerPos = this.entityManager.get(this.playerId, CType.Position);
        for (const entityId of this.entities) {
            const entity = this.entityManager.getEntity(entityId);
            const ePos = entity.get(CType.Position);
            if (abs(playerPos.x - ePos.x) < cam.visibleDistance && abs(playerPos.y - ePos.y) < cam.visibleDistance) {
                const spawner = entity.get(CType.EnemySpawner);
                if (spawner.boss) {
                    this.spawnBoss(entity, this.playerId);
                }
                else if (spawner.pack) {
                    this.spawnPack(entity, this.playerId);
                }
                else {
                    this.spawnEnemy(entity, this.playerId);
                }
            }
        }
    }
    spawnEnemy(entity, playerId) {
        const spawnerPos = entity.get(CType.Position);
        const pLevel = this.entityManager.get(playerId, CType.Experience).level;
        const level = spawnerPos.z + pLevel;
        const size = randomInRange(0.5, 2);
        const health = floor(10 * size * level);
        const enemy = new Map([
            [CType.AI, new AIComponent()],
            [CType.Direction, new DirectionComponent()],
            [CType.Experience, new ExperienceComponent(level)],
            [CType.Position, new PositionComponent(spawnerPos.x, spawnerPos.y)],
            [CType.Velocity, new VelocityComponent(0, 0)],
            [CType.Acceleration, new AccelerationComponent(0, 0)],
            [CType.Visible, new VisibleComponent(false, 4)],
            [CType.UI, new UIComponent([new UIEnemyHealthBar(size, 1)])],
            [CType.Health, new HealthComponent(health)],
            [CType.Collision, new CollisionComponent(CollisionHandler.Stop)],
            [CType.Size, new SizeComponent(size)],
            [CType.Controller, new ControllerComponent()],
            [CType.Movement, new MovementComponent(randomIntInRange(10, 30))],
        ]);
        this.entityManager.addEntity(enemy);
        entity.delete(CType.EnemySpawner);
    }
    spawnPack(entity, playerId) {
        const amount = randomIntInRange(3, 5);
        const spawnerPos = entity.get(CType.Position);
        const pLevel = this.entityManager.get(playerId, CType.Experience).level;
        const level = spawnerPos.z + pLevel;
        const enemies = new Array();
        for (let i = 0; i < amount; i++) {
            const size = randomInRange(0.5, 1.25);
            const health = floor(10 * size * level);
            enemies.push(new Map([
                [CType.AI, new AIComponent()],
                [CType.Direction, new DirectionComponent()],
                [CType.Experience, new ExperienceComponent(level)],
                [
                    CType.Position,
                    new PositionComponent(spawnerPos.x + randomInRange(-EnemySystem.PACK_RADIUS, EnemySystem.PACK_RADIUS), spawnerPos.y + randomInRange(-EnemySystem.PACK_RADIUS, EnemySystem.PACK_RADIUS)),
                ],
                [CType.Velocity, new VelocityComponent(0, 0)],
                [CType.Acceleration, new AccelerationComponent(0, 0)],
                [CType.Visible, new VisibleComponent(false, 4)],
                [CType.UI, new UIComponent([new UIEnemyHealthBar(size, 1)])],
                [CType.Health, new HealthComponent(health)],
                [CType.Collision, new CollisionComponent(CollisionHandler.Stop)],
                [CType.Size, new SizeComponent(size)],
                [CType.Controller, new ControllerComponent()],
                [CType.Movement, new MovementComponent(randomIntInRange(10, 30))],
            ]));
        }
        this.entityManager.addEntities(enemies);
        entity.delete(CType.EnemySpawner);
    }
    spawnBoss(entity, playerId) {
        const spawnerPos = entity.get(CType.Position);
        const pLevel = this.entityManager.get(playerId, CType.Experience).level;
        const level = spawnerPos.z + pLevel;
        const size = randomInRange(0.5, 2);
        const health = floor(10 * size * level);
        const enemy = new Map([
            [CType.AI, new AIComponent()],
            [CType.Direction, new DirectionComponent()],
            [CType.Experience, new ExperienceComponent(level)],
            [CType.Position, new PositionComponent(spawnerPos.x, spawnerPos.y)],
            [CType.Velocity, new VelocityComponent(0, 0)],
            [CType.Acceleration, new AccelerationComponent(0, 0)],
            [CType.Visible, new VisibleComponent(false, 4)],
            [CType.UI, new UIComponent([new UIEnemyHealthBar(size, 1)])],
            [CType.Health, new HealthComponent(health)],
            [CType.Collision, new CollisionComponent(CollisionHandler.Stop)],
            [CType.Size, new SizeComponent(size)],
            [CType.Controller, new ControllerComponent()],
            [CType.Movement, new MovementComponent(randomIntInRange(8, 60))],
        ]);
        this.entityManager.addEntity(enemy);
        entity.delete(CType.EnemySpawner);
    }
}
//# sourceMappingURL=EnemySystem.js.map