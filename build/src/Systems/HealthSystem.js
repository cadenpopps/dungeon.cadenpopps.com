import { CType } from "../Component.js";
import UIComponent, { UIButton, UIGameOverScreen } from "../Components/UIComponent.js";
import { System, SystemType } from "../System.js";
export default class HealthSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Health, eventManager, entityManager, [CType.Health]);
    }
    logic() {
        for (let entityId of this.entities) {
            const health = this.entityManager.get(entityId, CType.Health);
            if (health.invincibleCounter > 0) {
                health.invincibleCounter--;
            }
            if (health.alive) {
                if (health.currentHealth <= 0) {
                    health.alive = false;
                    this.entityDeath(entityId);
                    if (this.entityManager.hasComponent(entityId, CType.Player)) {
                        this.playerDeath(entityId);
                    }
                }
            }
        }
    }
    entityDeath(entityId) {
        this.entityManager.removeComponents(entityId, [CType.AI, CType.Hitbox, CType.Ability, CType.Controller]);
    }
    playerDeath(entityId) {
        console.log(`player death
            `);
        this.entityManager.addEntity(new Map([[CType.UI, new UIComponent([new UIGameOverScreen(), new UIButton("Respawn")])]]));
    }
}
//# sourceMappingURL=HealthSystem.js.map