import { abs, ceil, floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import AccelerationComponent from "../Components/AccelerationComponent.js";
import CollisionComponent, { CollisionHandler, Force } from "../Components/CollisionComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import SizeComponent from "../Components/SizeComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import { getEntitiesInRange } from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";

export default class PhysicsSystem extends System {
    private cameraIds!: Array<number>;
    private velocityIds!: Array<number>;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Physics, eventManager, entityManager, [CType.Collision]);
    }

    public logic(): void {
        const cam = CameraSystem.getHighestPriorityCamera(this.cameraIds, this.entityManager);
        const entitiesInRange = getEntitiesInRange(
            new PositionComponent(cam.x, cam.y),
            cam.visibleDistance + 2,
            this.entities,
            this.entityManager
        );
        const subGridSize = this.setBiggestEntitySize(entitiesInRange);
        const subGrid = this.createSubGrid(entitiesInRange, subGridSize);
        const movingEntitiesInRange = getEntitiesInRange(
            new PositionComponent(cam.x, cam.y),
            cam.visibleDistance,
            this.velocityIds,
            this.entityManager
        );
        this.physics(subGrid, movingEntitiesInRange, subGridSize);
    }

    public refreshEntitiesHelper(): void {
        this.cameraIds = this.entityManager.getSystemEntities([CType.Camera]);
        this.velocityIds = this.entityManager.getSystemEntities([CType.Velocity]);
    }

    private createSubGrid(
        filteredEntities: Array<number>,
        subGridSize: number
    ): Map<number, Map<number, Array<number>>> {
        const subGrid = new Map<number, Map<number, Array<number>>>();

        for (let entityId of filteredEntities) {
            const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
            const newX = floor(pos.x / subGridSize);
            const newY = floor(pos.y / subGridSize);
            if (!subGrid.get(newX)) {
                subGrid.set(newX, new Map<number, Array<number>>());
            }
            if (!subGrid.get(newX)?.get(newY)) {
                subGrid.get(newX)?.set(newY, new Array<number>());
            }
            subGrid.get(newX)?.get(newY)?.push(entityId);
        }
        return subGrid;
    }

    private setBiggestEntitySize(filteredEntities: Array<number>): number {
        let biggestEntitySize = 1;
        for (let entityId of filteredEntities) {
            const size = this.entityManager.get<SizeComponent>(entityId, CType.Size);
            if (size.size > biggestEntitySize) {
                biggestEntitySize = size.size;
            }
        }
        return biggestEntitySize;
    }

    private physics(
        subGrid: Map<number, Map<number, Array<number>>>,
        movingEntitiesInRange: Array<number>,
        subGridSize: number
    ): void {
        for (let entityId of movingEntitiesInRange) {
            const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
            const vel = this.entityManager.get<VelocityComponent>(entityId, CType.Velocity);
            if (this.entityManager.getEntity(entityId).has(CType.Acceleration)) {
                const acc = this.entityManager.get<AccelerationComponent>(entityId, CType.Acceleration);
                vel.x += acc.x;
                vel.y += acc.y;
            }

            if (abs(vel.x) > 0.0001) {
                pos.x += vel.x;
            } else {
                vel.x = 0;
            }

            if (abs(vel.y) > 0.0001) {
                pos.y += vel.y;
            } else {
                vel.y = 0;
            }
        }
        for (let entityId of movingEntitiesInRange) {
            const vel = this.entityManager.get<VelocityComponent>(entityId, CType.Velocity);
            if (abs(vel.x) > 0 || abs(vel.y) > 0) {
                this.collision(entityId, subGrid, subGridSize);
            }
        }
        for (let entityId of movingEntitiesInRange) {
            const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
            const col = this.entityManager.get<CollisionComponent>(entityId, CType.Collision);
            let positiveX = 0;
            let negativeX = 0;
            let positiveY = 0;
            let negativeY = 0;

            for (let i = 0; i < col.correctionForces.length; i++) {
                const force1 = col.correctionForces[i];
                let ignoreX = force1.x === 0;
                let ignoreY = force1.y === 0;
                for (let j = 0; j < col.correctionForces.length; j++) {
                    if (i !== j) {
                        const force2 = col.correctionForces[j];
                        if (force1.x === force2.x) {
                            ignoreY = true;
                        }
                        if (force1.y === force2.y) {
                            ignoreX = true;
                        }
                    }
                }
                if (!ignoreX && (abs(force1.x) < abs(force1.y) || force1.y === 0)) {
                    if (force1.x > positiveX) {
                        positiveX = force1.x;
                    } else if (force1.x < negativeX) {
                        negativeX = force1.x;
                    }
                } else if (!ignoreY && (abs(force1.x) > abs(force1.y) || force1.x === 0)) {
                    if (force1.y > positiveY) {
                        positiveY = force1.y;
                    } else if (force1.y < negativeY) {
                        negativeY = force1.y;
                    }
                }
            }
            pos.x += positiveX + negativeX;
            pos.y += positiveY + negativeY;
            col.correctionForces = new Array<Force>();
        }
    }

    private collision(entityId: number, subGrid: Map<number, Map<number, Array<number>>>, subGridSize: number): void {
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        const subGridX = floor(pos.x / subGridSize);
        const subGridY = floor(pos.y / subGridSize);
        for (let i = subGridX - 1; i <= subGridX + 1; i++) {
            for (let j = subGridY - 1; j <= subGridY + 1; j++) {
                if (subGrid.get(i) && subGrid.get(i)?.get(j) && (subGrid.get(i)?.get(j) as Array<number>).length > 0) {
                    for (let otherId of subGrid.get(i)?.get(j) as Array<number>) {
                        if (otherId !== entityId) {
                            if (this.overlapping(entityId, otherId)) {
                                this.collisionHandler(entityId, otherId);
                            }
                        }
                    }
                }
            }
        }
    }

    private overlapping(ent1: number, ent2: number): boolean {
        const pos1 = this.entityManager.get<PositionComponent>(ent1, CType.Position);
        const halfSize1 = this.entityManager.get<SizeComponent>(ent1, CType.Size).size / 2;
        const pos2 = this.entityManager.get<PositionComponent>(ent2, CType.Position);
        const halfSize2 = this.entityManager.get<SizeComponent>(ent2, CType.Size).size / 2;
        const left1 = pos1.x - halfSize1;
        const top1 = pos1.y - halfSize1;
        const right1 = pos1.x + halfSize1;
        const bottom1 = pos1.y + halfSize1;
        const left2 = pos2.x - halfSize2;
        const top2 = pos2.y - halfSize2;
        const right2 = pos2.x + halfSize2;
        const bottom2 = pos2.y + halfSize2;
        return left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2;
    }

    private collisionHandler(entityId: number, collisionId: number): void {
        const pos1 = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        const col1 = this.entityManager.get<CollisionComponent>(entityId, CType.Collision);
        const vel = this.entityManager.get<VelocityComponent>(entityId, CType.Velocity);
        const pos2 = this.entityManager.get<PositionComponent>(collisionId, CType.Position);
        const size1 = this.entityManager.get<SizeComponent>(entityId, CType.Size);
        const size2 = this.entityManager.get<SizeComponent>(collisionId, CType.Size);

        const scale = 1000;
        const xOverlap = ceil(scale * ((size1.size + size2.size) / 2 - abs(pos1.x - pos2.x))) / scale;
        const yOverlap = ceil(scale * ((size1.size + size2.size) / 2 - abs(pos1.y - pos2.y))) / scale;
        const force = { x: 0, y: 0 };
        if (pos1.x < pos2.x) {
            force.x = -xOverlap;
        } else if (pos1.x > pos2.x) {
            force.x = xOverlap;
        }
        if (pos1.y < pos2.y) {
            force.y = -yOverlap;
        } else if (pos1.y > pos2.y) {
            force.y = yOverlap;
        }
        col1.correctionForces.push(force);
        switch (this.entityManager.get<CollisionComponent>(entityId, CType.Collision).collisionHandler) {
            case CollisionHandler.Reflect:
                if (xOverlap > yOverlap) {
                    vel.y *= -1;
                } else if (yOverlap > xOverlap) {
                    vel.x *= -1;
                }

                break;
        }
    }
}
