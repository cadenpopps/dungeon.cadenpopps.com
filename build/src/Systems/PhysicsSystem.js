import { abs, ceil, floor, round } from "../../lib/PoppsMath.js";
import { ComponentType } from "../Component.js";
import PositionComponent from "../Components/PositionComponent.js";
import { System, SystemType } from "../System.js";
export default class PhysicsSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Physics, eventManager, entityManager, [
            ComponentType.Position,
            ComponentType.Collision,
        ]);
        this.counter = 0;
        this.subGrid = new Array();
        this.centerPoint = new PositionComponent(0, 0, 0);
        this.visibleDistance = 1;
    }
    logic() {
        this.setCenterPoint();
        const filteredEntities = this.filterEntitiesByDistance();
        this.preCollision(filteredEntities);
        this.counter = 0;
        this.physics();
    }
    handleEvent(event) { }
    physics() {
        for (let i = 1; i < this.subGrid.length - 1; i++) {
            for (let j = 1; j < this.subGrid[i].length - 1; j++) {
                for (let entityId of this.subGrid[i][j]) {
                    if (this.entityManager.data[ComponentType.Velocity].has(entityId)) {
                        const position = this.entityManager.data[ComponentType.Position].get(entityId);
                        const velocity = this.entityManager.data[ComponentType.Velocity].get(entityId);
                        const collision = this.entityManager.data[ComponentType.Collision].get(entityId);
                        collision.collided = false;
                        position.x += velocity.x;
                        position.y += velocity.y;
                        if (this.collision(entityId, i, j)) {
                            collision.collided = true;
                            position.x -= velocity.x;
                            position.y -= velocity.y;
                        }
                    }
                }
            }
        }
    }
    setCenterPoint() {
        let priority = -1;
        for (let entityId of this.entities) {
            if (this.entityManager.data[ComponentType.Camera].has(entityId)) {
                const cam = this.entityManager.data[ComponentType.Camera].get(entityId);
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
            const pos = this.entityManager.data[ComponentType.Position].get(entityId);
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
            const pos = this.entityManager.data[ComponentType.Position].get(entityId);
            const newX = floor((pos.x - this.centerPoint.x + this.visibleDistance - 1) /
                gridSize);
            const newY = floor((pos.y - this.centerPoint.y + this.visibleDistance - 1) /
                gridSize);
            this.subGrid[newX][newY].push(entityId);
        }
    }
    getBiggestEntitySize(filteredEntities) {
        let biggestEntitySize = 1;
        for (let entityId of filteredEntities) {
            const col = this.entityManager.data[ComponentType.Collision].get(entityId);
            if (col.size > biggestEntitySize) {
                biggestEntitySize = col.size;
            }
        }
        return biggestEntitySize;
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
        this.counter++;
        const pos1 = this.entityManager.data[ComponentType.Position].get(ent1);
        const col1 = this.entityManager.data[ComponentType.Collision].get(ent1);
        const pos2 = this.entityManager.data[ComponentType.Position].get(ent2);
        const col2 = this.entityManager.data[ComponentType.Collision].get(ent2);
        return (pos1.x < pos2.x + col2.size &&
            pos1.x + col1.size > pos2.x &&
            pos1.y < pos2.y + col2.size &&
            pos1.y + col1.size > pos2.y);
    }
}
//# sourceMappingURL=PhysicsSystem.js.map