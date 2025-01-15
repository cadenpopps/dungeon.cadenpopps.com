import { abs, floor, randomInRange, randomIntInRange } from "../../lib/PoppsMath.js";
import { CType, Component } from "../Component.js";
import AIComponent from "../Components/AIComponent.js";
import AbilityComponent, { SpinAttack } from "../Components/AbilityComponent.js";
import AccelerationComponent from "../Components/AccelerationComponent.js";
import CollisionComponent, { CollisionHandler } from "../Components/CollisionComponent.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import DirectionComponent from "../Components/DirectionComponent.js";
import EnemySpawnerComponent from "../Components/EnemySpawnerComponent.js";
import ExperienceComponent from "../Components/ExperienceComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import SizeComponent from "../Components/SizeComponent.js";
import TextureComponent, { Texture, TextureMap, TextureMaps } from "../Components/TextureComponent.js";
import UIComponent, { UIEnemyAI, UIEnemyHealthBar } from "../Components/UIComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { SHOW_ENEMY_AI } from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";

export default class EnemySystem extends System {
    private playerId!: number;
    public static PACK_RADIUS: number = 3;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Enemy, eventManager, entityManager, [CType.EnemySpawner]);
    }

    public getEntitiesHelper(): void {
        this.playerId = this.entityManager.getSystemEntities([CType.Player])[0];
    }

    public logic(): void {
        if (this.playerId === undefined) {
            return;
        }
        const cam = CameraSystem.getHighestPriorityCamera();
        const playerPos = this.entityManager.get(this.playerId, CType.Position) as PositionComponent;
        for (const entityId of this.entities) {
            const entity = this.entityManager.getEntity(entityId);
            const ePos = entity.get(CType.Position) as PositionComponent;
            if (abs(playerPos.x - ePos.x) < cam.visibleDistance && abs(playerPos.y - ePos.y) < cam.visibleDistance) {
                const spawner = entity.get(CType.EnemySpawner) as EnemySpawnerComponent;
                if (spawner.boss) {
                    this.spawnBoss(entity, this.playerId);
                } else if (spawner.pack) {
                    this.spawnPack(entity, this.playerId);
                } else {
                    this.spawnEnemy(entity, this.playerId);
                }
            }
        }
    }

    private createEnemy(level: number, pos: PositionComponent, size: number, health: number): Map<CType, Component> {
        const enemy = new Map<CType, Component>([
            [CType.AI, new AIComponent()],
            [CType.Ability, new AbilityComponent(new SpinAttack(20))],
            [CType.Direction, new DirectionComponent()],
            [CType.Experience, new ExperienceComponent(level)],
            [CType.Position, new PositionComponent(pos.x, pos.y)],
            [CType.Velocity, new VelocityComponent(0, 0)],
            [CType.Acceleration, new AccelerationComponent(0, 0)],
            [CType.Visible, new VisibleComponent(false, 4)],
            [CType.UI, new UIComponent([new UIEnemyHealthBar(size, 1)])],
            [CType.Health, new HealthComponent(health)],
            [CType.Collision, new CollisionComponent(CollisionHandler.Stop)],
            [CType.Size, new SizeComponent(size)],
            [CType.Controller, new ControllerComponent()],
            [CType.Movement, new MovementComponent(10)],
            [CType.Texture, new TextureComponent([new Texture(TextureMaps.get(TextureMap.Skeleton))])],
        ]);
        if (SHOW_ENEMY_AI) {
            (enemy.get(CType.UI) as UIComponent).elements.push(new UIEnemyAI(size));
        }
        return enemy;
    }

    private spawnEnemy(entity: Map<CType, Component>, playerId: number): void {
        const spawnerPos = entity.get(CType.Position) as PositionComponent;
        const pLevel = (this.entityManager.get(playerId, CType.Experience) as ExperienceComponent).level;
        const level = spawnerPos.z + pLevel;
        const size = randomInRange(0.5, 2);
        const health = floor(10 * size * level);
        const enemy = this.createEnemy(level, spawnerPos, size, health);
        this.entityManager.addEntity(enemy);
        entity.delete(CType.EnemySpawner);
    }

    private spawnPack(entity: Map<CType, Component>, playerId: number): void {
        const amount = randomIntInRange(3, 5);
        const spawnerPos = entity.get(CType.Position) as PositionComponent;
        const pLevel = (this.entityManager.get(playerId, CType.Experience) as ExperienceComponent).level;
        const level = spawnerPos.z + pLevel;
        const enemies = new Array<Map<CType, Component>>();
        for (let i = 0; i < amount; i++) {
            const size = randomInRange(0.5, 1.25);
            const health = floor(10 * size * level);
            const enemy = this.createEnemy(level, spawnerPos, size, health);
            enemies.push(enemy);
        }
        this.entityManager.addEntities(enemies);
        entity.delete(CType.EnemySpawner);
    }

    private spawnBoss(entity: Map<CType, Component>, playerId: number): void {
        const spawnerPos = entity.get(CType.Position) as PositionComponent;
        const pLevel = (this.entityManager.get(playerId, CType.Experience) as ExperienceComponent).level;
        const level = spawnerPos.z + pLevel;
        const size = randomInRange(0.5, 2);
        const health = floor(10 * size * level);
        const enemy = this.createEnemy(level, spawnerPos, size, health);
        this.entityManager.addEntity(enemy);
        entity.delete(CType.EnemySpawner);
    }
}
