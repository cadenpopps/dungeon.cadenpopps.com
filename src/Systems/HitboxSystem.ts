import { distance } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import DirectionComponent from "../Components/DirectionComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import HitboxComponent, { HitboxShape } from "../Components/HitboxComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import SizeComponent from "../Components/SizeComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import { directionToDegrees, getEntitiesInRange } from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";

export default class HitboxSystem extends System {
    public static HIT_INVINCIBILITY_FRAMES: number = 10;
    public static KNOCKBACK_BASE_MODIFIER: number = 0.008;
    public static KNOCKBACK_SIZE_MODIFIER: number = 4;

    private healthEntityIds: Array<number> = new Array<number>();

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Hitbox, eventManager, entityManager, [CType.Hitbox]);
        this.entityManager.subscribeToEntities([CType.Health, CType.Position, CType.Size], this.healthEntityIds, this);
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
        for (let entityId of this.entities) {
            const hitbox = this.entityManager.get<HitboxComponent>(entityId, CType.Hitbox);
            if (hitbox.duration === 0) {
                this.entityManager.removeEntity(entityId);
            } else {
                if (this.sourceAlive(hitbox.sourceEntityId)) {
                    if (hitbox.shape === HitboxShape.Rectangle) {
                        this.updateHitboxVertices(hitbox);
                    }
                    hitbox.duration--;
                    this.hitboxCollision(entityId, hitbox, healthEntitiesInRange);
                } else {
                    this.entityManager.removeEntity(entityId);
                }
            }
        }
    }

    private sourceAlive(entityId: number): boolean {
        if (this.entityManager.hasEntity(entityId)) {
            return this.entityManager.get<HealthComponent>(entityId, CType.Health).alive;
        }
        return false;
    }

    private hitboxCollision(entityId: number, hitbox: HitboxComponent, healthEntitiesInRange: Array<number>): void {
        for (const healthEntityId of healthEntitiesInRange) {
            const health = this.entityManager.get<HealthComponent>(healthEntityId, CType.Health);
            if (healthEntityId === hitbox.sourceEntityId || !health.alive || health.invincibleCounter > 0) {
                continue;
            }
            switch (hitbox.shape) {
                case HitboxShape.Rectangle:
                    if (this.rectangleOverlap(healthEntityId, hitbox)) {
                        this.hit(healthEntityId, hitbox);
                    }

                    break;
                case HitboxShape.Circle:
                    if (this.circleOverlap(healthEntityId, entityId, hitbox)) {
                        this.hit(healthEntityId, hitbox);
                    }
                    break;
            }
        }
    }

    private hit(entityId: number, hitbox: HitboxComponent): void {
        const health = this.entityManager.get<HealthComponent>(entityId, CType.Health);
        health.currentHealth -= hitbox.damage;
        health.invincibleCounter = HitboxSystem.HIT_INVINCIBILITY_FRAMES;

        if (
            this.entityManager.hasComponent(entityId, CType.Position) &&
            this.entityManager.hasComponent(entityId, CType.Velocity)
        ) {
            this.knockback(entityId, hitbox);
        }
    }

    private knockback(entityId: number, hitbox: HitboxComponent): void {
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        const vel = this.entityManager.get<VelocityComponent>(entityId, CType.Velocity);
        const sourcePos = this.entityManager.get<PositionComponent>(hitbox.sourceEntityId, CType.Position);
        const sourceSize = this.entityManager.get<SizeComponent>(hitbox.sourceEntityId, CType.Size);
        const angle = Math.atan2(pos.x - sourcePos.x, pos.y - sourcePos.y);
        const magnitude =
            distance(pos.x, pos.y, sourcePos.x, sourcePos.y) *
            HitboxSystem.KNOCKBACK_BASE_MODIFIER *
            (sourceSize.height + HitboxSystem.KNOCKBACK_SIZE_MODIFIER) *
            (sourceSize.width + HitboxSystem.KNOCKBACK_SIZE_MODIFIER);
        vel.x += magnitude * Math.sin(angle);
        vel.y += magnitude * Math.cos(angle);
    }

    private rectangleOverlap(healthEntityId: number, hitbox: HitboxComponent): boolean {
        const healthEntityHurtbox = this.getEntityHurtbox(healthEntityId);
        const axes = this.getAxes(hitbox.vertices).concat(this.getAxes(healthEntityHurtbox));
        for (const axis of axes) {
            const hitboxProjection = this.projectVerticesOntoAxis(hitbox.vertices, axis);
            const healthEntityProjection = this.projectVerticesOntoAxis(healthEntityHurtbox, axis);
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
        const healthEntityHurtbox = this.getEntityHurtbox(healthEntityId);
        const sourcePos = this.entityManager.get<PositionComponent>(hitbox.sourceEntityId, CType.Position);
        for (const vertex of healthEntityHurtbox) {
            if (distance(vertex.x, vertex.y, sourcePos.x + hitbox.x, sourcePos.y + hitbox.y) < hitbox.width) {
                return true;
            }
        }
        return false;
    }

    private getEntityHurtbox(entityId: number): Array<PositionComponent> {
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        const size = this.entityManager.get<SizeComponent>(entityId, CType.Size);
        const vertices: Array<PositionComponent> = new Array<PositionComponent>();
        vertices.push(new PositionComponent(pos.x - size.width / 2, pos.y - size.height / 2));
        vertices.push(new PositionComponent(pos.x + size.width / 2, pos.y - size.height / 2));
        vertices.push(new PositionComponent(pos.x - size.width / 2, pos.y + size.height / 2));
        vertices.push(new PositionComponent(pos.x + size.width / 2, pos.y + size.height / 2));

        return vertices;
    }

    private updateHitboxVertices(hitbox: HitboxComponent): void {
        const vertices: Array<PositionComponent> = new Array<PositionComponent>();
        const angle = (hitbox.rotation * Math.PI) / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        vertices.push(
            new PositionComponent(
                hitbox.x + (-hitbox.width / 2) * cos - (-hitbox.height / 2) * sin,
                hitbox.y + (-hitbox.height / 2) * cos + (-hitbox.width / 2) * sin
            )
        );
        vertices.push(
            new PositionComponent(
                hitbox.x + (-hitbox.width / 2) * cos - (+hitbox.height / 2) * sin,
                hitbox.y + (+hitbox.height / 2) * cos + (-hitbox.width / 2) * sin
            )
        );
        vertices.push(
            new PositionComponent(
                hitbox.x + (hitbox.width / 2) * cos - (hitbox.height / 2) * sin,
                hitbox.y + (hitbox.height / 2) * cos + (hitbox.width / 2) * sin
            )
        );
        vertices.push(
            new PositionComponent(
                hitbox.x + (+hitbox.width / 2) * cos - (-hitbox.height / 2) * sin,
                hitbox.y + (-hitbox.height / 2) * cos + (+hitbox.width / 2) * sin
            )
        );

        const sourcePos = this.entityManager.get<PositionComponent>(hitbox.sourceEntityId, CType.Position);
        const sourceDir = this.entityManager.get<DirectionComponent>(hitbox.sourceEntityId, CType.Direction);
        const angle2 = (directionToDegrees(sourceDir.direction) * Math.PI) / 180;
        const cos2 = Math.cos(angle2);
        const sin2 = Math.sin(angle2);

        vertices[0] = new PositionComponent(
            sourcePos.x + (vertices[0].x * cos2 - vertices[0].y * sin2),
            sourcePos.y + (vertices[0].y * cos2 + vertices[0].x * sin2)
        );
        vertices[1] = new PositionComponent(
            sourcePos.x + (vertices[1].x * cos2 - vertices[1].y * sin2),
            sourcePos.y + (vertices[1].y * cos2 + vertices[1].x * sin2)
        );
        vertices[2] = new PositionComponent(
            sourcePos.x + (vertices[2].x * cos2 - vertices[2].y * sin2),
            sourcePos.y + (vertices[2].y * cos2 + vertices[2].x * sin2)
        );
        vertices[3] = new PositionComponent(
            sourcePos.x + (vertices[3].x * cos2 - vertices[3].y * sin2),
            sourcePos.y + (vertices[3].y * cos2 + vertices[3].x * sin2)
        );

        hitbox.vertices = vertices;
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
