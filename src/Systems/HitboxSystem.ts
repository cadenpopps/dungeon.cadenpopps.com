import { distance } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import DirectionComponent from "../Components/DirectionComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import HitboxComponent, { HitboxShape } from "../Components/HitboxComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import RotationComponent, { RotationDirectionMap } from "../Components/RotationComponent.js";
import SizeComponent from "../Components/SizeComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import { getEntitiesInRange } from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";

export default class HitboxSystem extends System {
    private healthEntityIds!: Array<number>;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Hitbox, eventManager, entityManager, [CType.Hitbox]);
    }

    public logic(): void {
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        const healthEntitiesInRange = getEntitiesInRange(
            new PositionComponent(cam.x, cam.y),
            cam.visibleDistance,
            this.healthEntityIds,
            this.entityManager
        );
        const hitboxesInRange = getEntitiesInRange(
            new PositionComponent(cam.x, cam.y),
            cam.visibleDistance,
            this.entities,
            this.entityManager
        );
        for (let entityId of hitboxesInRange) {
            const hitbox = this.entityManager.get<HitboxComponent>(entityId, CType.Hitbox);
            if (hitbox.frames === 0) {
                this.entityManager.removeEntity(entityId);
            } else {
                hitbox.frames--;
                this.adjustHitboxPosition(entityId, hitbox);
                this.hitboxCollision(entityId, hitbox, healthEntitiesInRange);
            }
        }
    }

    public getEntitiesHelper(): void {
        this.healthEntityIds = this.entityManager.getSystemEntities([CType.Health]);
    }

    private adjustHitboxPosition(entityId: number, hitbox: HitboxComponent): void {
        const sourcePos = this.entityManager.get<PositionComponent>(hitbox.sourceId, CType.Position);
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        const sourceDir = this.entityManager.get<DirectionComponent>(hitbox.sourceId, CType.Direction).direction;
        const rotation = this.entityManager.get<RotationComponent>(entityId, CType.Rotation);
        pos.x = sourcePos.x + hitbox.xOffset;
        pos.y = sourcePos.y + hitbox.yOffset;
        rotation.degrees = (RotationDirectionMap.get(sourceDir) as number) + hitbox.degreesOffset;
    }

    private hitboxCollision(entityId: number, hitbox: HitboxComponent, healthEntitiesInRange: Array<number>): void {
        const vertices = hitbox.shape === HitboxShape.Rectangle ? this.getVertices(entityId) : null;
        for (const healthEntityId of healthEntitiesInRange) {
            if (!hitbox.ignoreIds.includes(healthEntityId)) {
                const health = this.entityManager.get<HealthComponent>(healthEntityId, CType.Health);
                if (health.invincibleCounter > 0) {
                    continue;
                }

                let overlap = false;
                if (hitbox.shape === HitboxShape.Rectangle) {
                    overlap = this.rectangleOverlap(healthEntityId, vertices as Array<PositionComponent>);
                } else {
                    overlap = this.circleOverlap(healthEntityId, entityId, hitbox);
                }
                if (overlap) {
                    hitbox.ignoreIds.push(healthEntityId);
                    for (const sameAttackHitbox of this.entities) {
                        const h = this.entityManager.get<HitboxComponent>(sameAttackHitbox, CType.Hitbox);
                        if (h.sourceId === hitbox.sourceId) {
                            h.ignoreIds.push(healthEntityId);
                        }
                    }
                    health.currentHealth -= hitbox.damage;
                    health.invincibleCounter = 3;
                    if (
                        this.entityManager.hasComponent(healthEntityId, CType.Position) &&
                        this.entityManager.hasComponent(healthEntityId, CType.Velocity)
                    ) {
                        const pos = this.entityManager.get<PositionComponent>(healthEntityId, CType.Position);
                        const vel = this.entityManager.get<VelocityComponent>(healthEntityId, CType.Velocity);
                        const sourcePos = this.entityManager.get<PositionComponent>(hitbox.sourceId, CType.Position);
                        vel.x += (pos.x - sourcePos.x) / 10;
                        vel.y += (pos.y - sourcePos.y) / 10;
                    }
                }
            }
        }
    }

    private rectangleOverlap(healthEntityId: number, vertices: Array<PositionComponent>): boolean {
        const healthEntityVertices = this.getVertices(healthEntityId);
        const axes = this.getAxes(vertices).concat(this.getAxes(healthEntityVertices));
        for (const axis of axes) {
            const hitboxProjection = this.projectVerticesOntoAxis(vertices, axis);
            const healthEntityProjection = this.projectVerticesOntoAxis(healthEntityVertices, axis);
            if (
                hitboxProjection.max < healthEntityProjection.min ||
                healthEntityProjection.max < hitboxProjection.min
            ) {
                return false;
            }
        }
        return true;
    }

    private circleOverlap(healthEntityId: number, hitboxId: number, hitbox: HitboxComponent): boolean {
        const healthEntityVertices = this.getVertices(healthEntityId);
        const hitboxPos = this.entityManager.get<PositionComponent>(hitboxId, CType.Position);
        for (const vertex of healthEntityVertices) {
            if (
                distance(vertex.x, vertex.y, hitboxPos.x + hitbox.xOffset, hitboxPos.y + hitbox.yOffset) < hitbox.width
            ) {
                return true;
            }
        }
        return false;
    }

    private getVertices(entityId: number): Array<PositionComponent> {
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        const size = this.entityManager.get<SizeComponent>(entityId, CType.Size);
        const vertices: Array<PositionComponent> = new Array<PositionComponent>();
        vertices.push(new PositionComponent(pos.x - size.width / 2, pos.y - size.height / 2));
        vertices.push(new PositionComponent(pos.x + size.width / 2, pos.y - size.height / 2));
        vertices.push(new PositionComponent(pos.x - size.width / 2, pos.y + size.height / 2));
        vertices.push(new PositionComponent(pos.x + size.width / 2, pos.y + size.height / 2));

        if (this.entityManager.hasComponent(entityId, CType.Rotation)) {
            const rot = this.entityManager.get<RotationComponent>(entityId, CType.Rotation);
            const angle = (rot.degrees * Math.PI) / 180;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            for (let vertex = 0; vertex < vertices.length; vertex++) {
                const newVertex = new PositionComponent(
                    (vertices[vertex].x - rot.centerPoint.x) * cos -
                        (vertices[vertex].y - rot.centerPoint.y) * sin +
                        rot.centerPoint.x,
                    (vertices[vertex].x - rot.centerPoint.x) * sin +
                        (vertices[vertex].y - rot.centerPoint.y) * cos +
                        rot.centerPoint.y
                );
                vertices[vertex] = newVertex;
            }
        }

        return vertices;
    }

    private getAxes(shape: Array<PositionComponent>): Array<PositionComponent> {
        const axes: Array<PositionComponent> = new Array<PositionComponent>(shape.length);
        for (let vertex = 0; vertex < shape.length; vertex++) {
            const v1 = shape[vertex];
            const v2 = shape[vertex + 1 === shape.length ? 0 : vertex + 1];
            const normal = new PositionComponent(-(v1.y - v2.y), v1.x - v2.x);
            axes[vertex] = normal;
        }
        return axes;
    }

    private projectVerticesOntoAxis(shape: Array<PositionComponent>, axis: PositionComponent): Projection {
        const first = this.dot(shape[0], axis);
        const projection: Projection = { min: first, max: first };
        for (let i = 1; i < shape.length; i++) {
            const current = this.dot(shape[i], axis);
            if (current < projection.min) {
                projection.min = current;
            } else if (current > projection.max) {
                projection.max = current;
            }
        }
        return projection;
    }

    private dot(v1: PositionComponent, v2: PositionComponent): number {
        return v1.x * v2.x + v1.y * v2.y;
    }
}

export interface Projection {
    min: number;
    max: number;
}
