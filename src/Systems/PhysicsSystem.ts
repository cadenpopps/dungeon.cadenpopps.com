import { abs, ceil, floor, round } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import CameraComponent from "../Components/CameraComponent.js";
import CollisionComponent, { CollisionHandler } from "../Components/CollisionComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class PhysicsSystem extends System {
    private subGrid: Array<Array<Array<number>>>;
    private centerPoint: PositionComponent;
    private visibleDistance: number;
    private cameraIds!: Array<number>;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Physics, eventManager, entityManager, [CType.Position, CType.Collision]);
        this.subGrid = new Array<Array<Array<number>>>();
        this.centerPoint = new PositionComponent(0, 0, 0);
        this.visibleDistance = 1;
    }

    public logic(): void {
        this.setCenterPoint();
        const filteredEntities = this.filterEntitiesByDistance();
        this.preCollision(filteredEntities);
        this.physics();
    }

    public refreshEntitiesHelper(): void {
        this.cameraIds = this.entityManager.getSystemEntities([CType.Camera]);
    }

    private setCenterPoint(): void {
        let priority = -1;
        for (let entityId of this.cameraIds) {
            const cam = this.entityManager.get<CameraComponent>(entityId, CType.Camera);
            if (cam.priority > priority) {
                this.centerPoint.x = round(cam.x);
                this.centerPoint.y = round(cam.y);
                this.centerPoint.z = cam.z;
                this.visibleDistance = cam.visibleDistance;
            }
        }
    }

    private filterEntitiesByDistance(): Array<number> {
        const filteredEntities = new Array<number>();
        for (let entityId of this.entities) {
            const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
            if (
                abs(pos.x - this.centerPoint.x) < this.visibleDistance &&
                abs(pos.y - this.centerPoint.y) < this.visibleDistance
            ) {
                filteredEntities.push(entityId);
            }
        }
        return filteredEntities;
    }

    private preCollision(filteredEntities: Array<number>): void {
        const gridSize = this.getBiggestEntitySize(filteredEntities);
        const gridLength = ceil((this.visibleDistance * 2) / gridSize) - 1;
        this.subGrid = new Array<Array<Array<number>>>(gridLength);
        for (let i = 0; i < gridLength; i++) {
            this.subGrid[i] = new Array<Array<number>>(gridLength);
            for (let j = 0; j < gridLength; j++) {
                this.subGrid[i][j] = new Array<number>();
            }
        }

        for (let entityId of filteredEntities) {
            const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
            const newX = floor((pos.x - this.centerPoint.x + this.visibleDistance - 1) / gridSize);
            const newY = floor((pos.y - this.centerPoint.y + this.visibleDistance - 1) / gridSize);
            this.subGrid[newX][newY].push(entityId);
        }
    }

    private getBiggestEntitySize(filteredEntities: Array<number>): number {
        let biggestEntitySize = 1;
        for (let entityId of filteredEntities) {
            const col = this.entityManager.get<CollisionComponent>(entityId, CType.Collision);
            if (col.size > biggestEntitySize) {
                biggestEntitySize = col.size;
            }
        }
        return biggestEntitySize;
    }

    private physics(): void {
        for (let i = 1; i < this.subGrid.length - 1; i++) {
            for (let j = 1; j < this.subGrid[i].length - 1; j++) {
                for (let entityId of this.subGrid[i][j]) {
                    if (this.entityManager.getEntity(entityId).has(CType.Velocity)) {
                        this.moveEntityWithVelocity(entityId);
                        if (this.collision(entityId, i, j)) {
                            this.collisionHandler(entityId);
                        }
                    }
                }
            }
        }
    }

    private moveEntityWithVelocity(entityId: number): void {
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        const vel = this.entityManager.get<VelocityComponent>(entityId, CType.Velocity);
        pos.x += vel.x;
        pos.y += vel.y;
    }

    private collision(entityId: number, xCoord: number, yCoord: number): boolean {
        for (let i = xCoord - 1; i <= xCoord + 1; i++) {
            for (let j = yCoord - 1; j <= yCoord + 1; j++) {
                for (let otherId of this.subGrid[i][j]) {
                    if (otherId !== entityId) {
                        if (this.collided(entityId, otherId)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    private collided(ent1: number, ent2: number): boolean {
        const pos1 = this.entityManager.get<PositionComponent>(ent1, CType.Position);
        const col1 = this.entityManager.get<CollisionComponent>(ent1, CType.Collision);
        const pos2 = this.entityManager.get<PositionComponent>(ent2, CType.Position);
        const col2 = this.entityManager.get<CollisionComponent>(ent2, CType.Collision);
        return (
            pos1.x < pos2.x + col2.size &&
            pos1.x + col1.size > pos2.x &&
            pos1.y < pos2.y + col2.size &&
            pos1.y + col1.size > pos2.y
        );
    }

    private collisionHandler(entityId: number): void {
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        const vel = this.entityManager.get<VelocityComponent>(entityId, CType.Velocity);
        switch (this.entityManager.get<CollisionComponent>(entityId, CType.Collision).collisionHandler) {
            case CollisionHandler.Stop:
                pos.x -= vel.x;
                pos.y -= vel.y;
                break;
            case CollisionHandler.Reflect:
                pos.x -= vel.x;
                pos.y -= vel.y;
                vel.x *= -1;
                vel.y *= -1;
                break;
        }
    }
}
