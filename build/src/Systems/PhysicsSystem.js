import { abs, ceil, floor, round } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import { CollisionHandler } from "../Components/CollisionComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { System, SystemType } from "../System.js";
export default class PhysicsSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Physics, eventManager, entityManager, [CType.Position, CType.Collision]);
        this.subGrid = new Array();
        this.centerPoint = new PositionComponent(0, 0, 0);
        this.visibleDistance = 1;
    }
    logic() {
        this.setCenterPoint();
        const filteredEntities = this.filterEntitiesByDistance();
        this.preCollision(filteredEntities);
        this.physics();
    }
    setCenterPoint() {
        let priority = -1;
        for (let entityId of this.entities) {
            if (this.entityManager.getEntity(entityId).has(CType.Camera)) {
                const cam = this.entityManager.get(entityId, CType.Camera);
                if (cam.priority > priority) {
                    this.centerPoint.x = round(cam.x);
                    this.centerPoint.y = round(cam.y);
                    this.centerPoint.z = cam.z;
                    this.visibleDistance = cam.visibleDistance;
                }
            }
        }
    }
    filterEntitiesByDistance() {
        const filteredEntities = new Array();
        for (let entityId of this.entities) {
            const pos = this.entityManager.get(entityId, CType.Position);
            if (abs(pos.x - this.centerPoint.x) < this.visibleDistance &&
                abs(pos.y - this.centerPoint.y) < this.visibleDistance) {
                filteredEntities.push(entityId);
            }
        }
        return filteredEntities;
    }
    preCollision(filteredEntities) {
        const gridSize = this.getBiggestEntitySize(filteredEntities);
        const gridLength = ceil((this.visibleDistance * 2) / gridSize) - 1;
        this.subGrid = new Array(gridLength);
        for (let i = 0; i < gridLength; i++) {
            this.subGrid[i] = new Array(gridLength);
            for (let j = 0; j < gridLength; j++) {
                this.subGrid[i][j] = new Array();
            }
        }
        for (let entityId of filteredEntities) {
            const pos = this.entityManager.get(entityId, CType.Position);
            const newX = floor((pos.x - this.centerPoint.x + this.visibleDistance - 1) / gridSize);
            const newY = floor((pos.y - this.centerPoint.y + this.visibleDistance - 1) / gridSize);
            this.subGrid[newX][newY].push(entityId);
        }
    }
    getBiggestEntitySize(filteredEntities) {
        let biggestEntitySize = 1;
        for (let entityId of filteredEntities) {
            const col = this.entityManager.get(entityId, CType.Collision);
            if (col.size > biggestEntitySize) {
                biggestEntitySize = col.size;
            }
        }
        return biggestEntitySize;
    }
    physics() {
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
    moveEntityWithVelocity(entityId) {
        const pos = this.entityManager.get(entityId, CType.Position);
        const vel = this.entityManager.get(entityId, CType.Velocity);
        pos.x += vel.x;
        pos.y += vel.y;
    }
    collision(entityId, xCoord, yCoord) {
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
    collided(ent1, ent2) {
        const pos1 = this.entityManager.get(ent1, CType.Position);
        const col1 = this.entityManager.get(ent1, CType.Collision);
        const pos2 = this.entityManager.get(ent2, CType.Position);
        const col2 = this.entityManager.get(ent2, CType.Collision);
        return (pos1.x < pos2.x + col2.size &&
            pos1.x + col1.size > pos2.x &&
            pos1.y < pos2.y + col2.size &&
            pos1.y + col1.size > pos2.y);
    }
    collisionHandler(entityId) {
        const pos = this.entityManager.get(entityId, CType.Position);
        const vel = this.entityManager.get(entityId, CType.Velocity);
        switch (this.entityManager.get(entityId, CType.Collision).collisionHandler) {
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
//# sourceMappingURL=PhysicsSystem.js.map