import { CType } from "../Component.js";
import HealthComponent from "../Components/HealthComponent.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class HealthSystem extends System {
    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Health, eventManager, entityManager, [CType.Health]);
    }

    public logic(): void {
        for (let entityId of this.entities) {
            const health = this.entityManager.get<HealthComponent>(entityId, CType.Health);
            if (health.currentHealth <= 0) {
                this.entityManager.removeEntity(entityId);
            }
            if (health.invincibleCounter > 0) {
                health.invincibleCounter--;
            }
        }
    }
}
