import { round } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import DirectionComponent from "../Components/DirectionComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import HitboxComponent from "../Components/HitboxComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import RotationComponent, { RotationDirectionMap } from "../Components/RotationComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import { getEntitiesInRange } from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
import PhysicsSystem from "./PhysicsSystem.js";

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
        const subGrid = PhysicsSystem.createSubGrid(healthEntitiesInRange, this.entityManager);
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
                this.hitboxCollision(entityId, hitbox, subGrid);
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
        rotation.degrees = RotationDirectionMap.get(sourceDir) || 0;
    }

    private hitboxCollision(
        entityId: number,
        hitbox: HitboxComponent,
        subGrid: Map<number, Map<number, Array<number>>>
    ): void {
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        const x = round(pos.x / PhysicsSystem.BIGGEST_ENTITY_SIZE);
        const y = round(pos.y / PhysicsSystem.BIGGEST_ENTITY_SIZE);
        const collisionIds = subGrid.get(x)?.get(y) as Array<number>;
        if (collisionIds !== undefined) {
            for (let collisionId of collisionIds) {
                if (collisionId !== hitbox.sourceId) {
                    const health = this.entityManager.get<HealthComponent>(collisionId, CType.Health);
                    health.currentHealth -= 1;

                    const pos = this.entityManager.get<PositionComponent>(collisionId, CType.Position);
                    const vel = this.entityManager.get<VelocityComponent>(collisionId, CType.Velocity);
                    const sourcePos = this.entityManager.get<PositionComponent>(hitbox.sourceId, CType.Position);
                    vel.x += (pos.x - sourcePos.x) / 25;
                    vel.y += (pos.y - sourcePos.y) / 25;
                }
            }
        }
        // double min = axis.dot(shape.vertices[0]);
        // double max = min;
        // for (int i = 1; i < shape.vertices.length; i++) {
        //   // NOTE: the axis must be normalized to get accurate projections
        //   double p = axis.dot(shape.vertices[i]);
        //   if (p < min) {
        //     min = p;
        //   } else if (p > max) {
        //     max = p;
        //   }
        // }

        // Axis[] axes = // get the axes to test;
        // // loop over the axes
        // for (int i = 0; i < axes.length; i++) {
        //   Axis axis = axes[i];
        //   // project both shapes onto the axis
        //   Projection p1 = shape1.project(axis);
        //   Projection p2 = shape2.project(axis);
        //   // do the projections overlap?
        //   if (!p1.overlap(p2)) {
        //     // then we can guarantee that the shapes do not overlap
        //     return false;
        //   }
        // }

        // Vector[] axes = new Vector[shape.vertices.length];
        // // loop over the vertices
        // for (int i = 0; i < shape.vertices.length; i++) {
        //   // get the current vertex
        //   Vector p1 = shape.vertices[i];
        //   // get the next vertex
        //   Vector p2 = shape.vertices[i + 1 == shape.vertices.length ? 0 : i + 1];
        //   // subtract the two to get the edge vector
        //   Vector edge = p1.subtract(p2);
        //   // get either perpendicular vector
        //   Vector normal = edge.perp();
        //   // the perp method is just (x, y) =&gt; (-y, x) or (y, -x)
        //   axes[i] = normal;
        // }
    }
}
