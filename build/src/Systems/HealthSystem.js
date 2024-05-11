import { CType } from "../Component.js";
import { System, SystemType } from "../System.js";
export default class HealthSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Health, eventManager, entityManager, [CType.Health]);
    }
    logic() {
        for (let entityId of this.entities) {
            const health = this.entityManager.get(entityId, CType.Health);
            if (health.currentHealth <= 0) {
                this.entityManager.removeEntity(entityId);
            }
            if (health.invincibleCounter > 0) {
                health.invincibleCounter--;
            }
        }
    }
}
//# sourceMappingURL=HealthSystem.js.map