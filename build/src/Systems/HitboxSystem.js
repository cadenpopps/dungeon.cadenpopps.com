import { distance } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import { HitboxShape } from "../Components/HitboxComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { directionToDegrees, getEntitiesInRange } from "../Constants.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
export default class HitboxSystem extends System {
    static HIT_INVINCIBILITY_FRAMES = 10;
    static KNOCKBACK_BASE_MODIFIER = 0.008;
    static KNOCKBACK_SIZE_MODIFIER = 4;
    healthEntityIds = new Array();
    constructor(eventManager, entityManager) {
        super(SystemType.Hitbox, eventManager, entityManager, [CType.Hitbox]);
        this.entityManager.subscribeToEntities([CType.Health, CType.Position, CType.Size], this.healthEntityIds, this);
    }
    logic() {
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        const healthEntitiesInRange = getEntitiesInRange(new PositionComponent(cam.x, cam.y), cam.visibleDistance, this.healthEntityIds, this.entityManager);
        for (let entityId of this.entities) {
            const hitbox = this.entityManager.get(entityId, CType.Hitbox);
            if (hitbox.duration === 0) {
                this.entityManager.removeEntity(entityId);
            }
            else {
                if (this.sourceAlive(hitbox.sourceEntityId)) {
                    if (hitbox.shape === HitboxShape.Rectangle) {
                        this.updateHitboxVertices(hitbox);
                    }
                    hitbox.duration--;
                    this.hitboxCollision(entityId, hitbox, healthEntitiesInRange);
                }
                else {
                    this.entityManager.removeEntity(entityId);
                }
            }
        }
    }
    sourceAlive(entityId) {
        if (this.entityManager.hasEntity(entityId)) {
            return this.entityManager.get(entityId, CType.Health).alive;
        }
        return false;
    }
    hitboxCollision(entityId, hitbox, healthEntitiesInRange) {
        for (const healthEntityId of healthEntitiesInRange) {
            const health = this.entityManager.get(healthEntityId, CType.Health);
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
    hit(entityId, hitbox) {
        const health = this.entityManager.get(entityId, CType.Health);
        health.currentHealth -= hitbox.damage;
        health.invincibleCounter = HitboxSystem.HIT_INVINCIBILITY_FRAMES;
        if (this.entityManager.hasComponent(entityId, CType.Position) &&
            this.entityManager.hasComponent(entityId, CType.Velocity)) {
            this.knockback(entityId, hitbox);
        }
    }
    knockback(entityId, hitbox) {
        const pos = this.entityManager.get(entityId, CType.Position);
        const vel = this.entityManager.get(entityId, CType.Velocity);
        const sourcePos = this.entityManager.get(hitbox.sourceEntityId, CType.Position);
        const sourceSize = this.entityManager.get(hitbox.sourceEntityId, CType.Size);
        const angle = Math.atan2(pos.x - sourcePos.x, pos.y - sourcePos.y);
        const magnitude = distance(pos.x, pos.y, sourcePos.x, sourcePos.y) *
            HitboxSystem.KNOCKBACK_BASE_MODIFIER *
            (sourceSize.height + HitboxSystem.KNOCKBACK_SIZE_MODIFIER) *
            (sourceSize.width + HitboxSystem.KNOCKBACK_SIZE_MODIFIER);
        vel.x += magnitude * Math.sin(angle);
        vel.y += magnitude * Math.cos(angle);
    }
    rectangleOverlap(healthEntityId, hitbox) {
        const healthEntityHurtbox = this.getEntityHurtbox(healthEntityId);
        const axes = this.getAxes(hitbox.vertices).concat(this.getAxes(healthEntityHurtbox));
        for (const axis of axes) {
            const hitboxProjection = this.projectVerticesOntoAxis(hitbox.vertices, axis);
            const healthEntityProjection = this.projectVerticesOntoAxis(healthEntityHurtbox, axis);
            if (hitboxProjection.max < healthEntityProjection.min ||
                healthEntityProjection.max < hitboxProjection.min) {
                return false;
            }
        }
        return true;
    }
    circleOverlap(healthEntityId, hitboxId, hitbox) {
        const healthEntityHurtbox = this.getEntityHurtbox(healthEntityId);
        const sourcePos = this.entityManager.get(hitbox.sourceEntityId, CType.Position);
        for (const vertex of healthEntityHurtbox) {
            if (distance(vertex.x, vertex.y, sourcePos.x + hitbox.x, sourcePos.y + hitbox.y) < hitbox.width) {
                return true;
            }
        }
        return false;
    }
    getEntityHurtbox(entityId) {
        const pos = this.entityManager.get(entityId, CType.Position);
        const size = this.entityManager.get(entityId, CType.Size);
        const vertices = new Array();
        vertices.push(new PositionComponent(pos.x - size.width / 2, pos.y - size.height / 2));
        vertices.push(new PositionComponent(pos.x + size.width / 2, pos.y - size.height / 2));
        vertices.push(new PositionComponent(pos.x - size.width / 2, pos.y + size.height / 2));
        vertices.push(new PositionComponent(pos.x + size.width / 2, pos.y + size.height / 2));
        return vertices;
    }
    updateHitboxVertices(hitbox) {
        const vertices = new Array();
        const angle = (hitbox.rotation * Math.PI) / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        vertices.push(new PositionComponent(hitbox.x + (-hitbox.width / 2) * cos - (-hitbox.height / 2) * sin, hitbox.y + (-hitbox.height / 2) * cos + (-hitbox.width / 2) * sin));
        vertices.push(new PositionComponent(hitbox.x + (-hitbox.width / 2) * cos - (+hitbox.height / 2) * sin, hitbox.y + (+hitbox.height / 2) * cos + (-hitbox.width / 2) * sin));
        vertices.push(new PositionComponent(hitbox.x + (hitbox.width / 2) * cos - (hitbox.height / 2) * sin, hitbox.y + (hitbox.height / 2) * cos + (hitbox.width / 2) * sin));
        vertices.push(new PositionComponent(hitbox.x + (+hitbox.width / 2) * cos - (-hitbox.height / 2) * sin, hitbox.y + (-hitbox.height / 2) * cos + (+hitbox.width / 2) * sin));
        const sourcePos = this.entityManager.get(hitbox.sourceEntityId, CType.Position);
        const sourceDir = this.entityManager.get(hitbox.sourceEntityId, CType.Direction);
        const angle2 = (directionToDegrees(sourceDir.direction) * Math.PI) / 180;
        const cos2 = Math.cos(angle2);
        const sin2 = Math.sin(angle2);
        vertices[0] = new PositionComponent(sourcePos.x + (vertices[0].x * cos2 - vertices[0].y * sin2), sourcePos.y + (vertices[0].y * cos2 + vertices[0].x * sin2));
        vertices[1] = new PositionComponent(sourcePos.x + (vertices[1].x * cos2 - vertices[1].y * sin2), sourcePos.y + (vertices[1].y * cos2 + vertices[1].x * sin2));
        vertices[2] = new PositionComponent(sourcePos.x + (vertices[2].x * cos2 - vertices[2].y * sin2), sourcePos.y + (vertices[2].y * cos2 + vertices[2].x * sin2));
        vertices[3] = new PositionComponent(sourcePos.x + (vertices[3].x * cos2 - vertices[3].y * sin2), sourcePos.y + (vertices[3].y * cos2 + vertices[3].x * sin2));
        hitbox.vertices = vertices;
    }
    getAxes(shape) {
        const axes = new Array(shape.length);
        for (let vertex = 0; vertex < shape.length; vertex++) {
            const v1 = shape[vertex];
            const v2 = shape[vertex + 1 === shape.length ? 0 : vertex + 1];
            const normal = new PositionComponent(-(v1.y - v2.y), v1.x - v2.x);
            axes[vertex] = normal;
        }
        return axes;
    }
    projectVerticesOntoAxis(shape, axis) {
        const first = this.dot(shape[0], axis);
        const projection = { min: first, max: first };
        for (let i = 1; i < shape.length; i++) {
            const current = this.dot(shape[i], axis);
            if (current < projection.min) {
                projection.min = current;
            }
            else if (current > projection.max) {
                projection.max = current;
            }
        }
        return projection;
    }
    dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
}
//# sourceMappingURL=HitboxSystem.js.map