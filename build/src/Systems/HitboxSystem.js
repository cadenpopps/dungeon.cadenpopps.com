import { round } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import PositionComponent from "../Components/PositionComponent.js";
import { getEntitiesInRange } from "../Constants.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
import PhysicsSystem from "./PhysicsSystem.js";
export default class HitboxSystem extends System {
    healthEntityIds;
    constructor(eventManager, entityManager) {
        super(SystemType.Hitbox, eventManager, entityManager, [CType.Hitbox]);
    }
    logic() {
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        const healthEntitiesInRange = getEntitiesInRange(new PositionComponent(cam.x, cam.y), cam.visibleDistance, this.healthEntityIds, this.entityManager);
        const subGrid = PhysicsSystem.createSubGrid(healthEntitiesInRange, this.entityManager);
        const hitboxesInRange = getEntitiesInRange(new PositionComponent(cam.x, cam.y), cam.visibleDistance, this.entities, this.entityManager);
        for (let entityId of hitboxesInRange) {
            const hitbox = this.entityManager.get(entityId, CType.Hitbox);
            if (hitbox.framesActive === 0) {
                this.entityManager.removeEntity(entityId);
            }
            else {
                hitbox.framesActive--;
                this.hitboxCollision(entityId, hitbox, subGrid);
            }
        }
    }
    getEntitiesHelper() {
        this.healthEntityIds = this.entityManager.getSystemEntities([CType.Health]);
    }
    hitboxCollision(entityId, hitbox, subGrid) {
        const pos = this.entityManager.get(entityId, CType.Position);
        const x = round((pos.x + hitbox.x) / PhysicsSystem.BIGGEST_ENTITY_SIZE);
        const y = round((pos.y + hitbox.y) / PhysicsSystem.BIGGEST_ENTITY_SIZE);
        const collisionIds = subGrid.get(x)?.get(y);
        if (collisionIds !== undefined) {
            for (let collisionId of collisionIds) {
                if (collisionId !== hitbox.sourceId) {
                    const health = this.entityManager.get(collisionId, CType.Health);
                    health.currentHealth -= 1;
                    const pos = this.entityManager.get(collisionId, CType.Position);
                    const vel = this.entityManager.get(collisionId, CType.Velocity);
                    const sourcePos = this.entityManager.get(hitbox.sourceId, CType.Position);
                    vel.x += (pos.x - sourcePos.x) / 25;
                    vel.y += (pos.y - sourcePos.y) / 25;
                }
            }
        }
    }
}
//# sourceMappingURL=HitboxSystem.js.map