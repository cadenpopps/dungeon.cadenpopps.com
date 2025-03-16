import { CType } from "../Component.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import UIComponent, { UIGameOverScreen, UILifecycleState } from "../Components/UIComponent.js";
import { System, SystemType } from "../System.js";
export default class HealthSystem extends System {
    static HEALTH_REGEN_RATE = 0.01;
    constructor(eventManager, entityManager) {
        super(SystemType.Health, eventManager, entityManager, [CType.Health]);
    }
    logic() {
        for (let entityId of this.entities) {
            const health = this.entityManager.get(entityId, CType.Health);
            if (this.entityAlive(entityId, health)) {
                if (health.currentHealth < health.maxHealth) {
                    health.currentHealth += HealthSystem.HEALTH_REGEN_RATE;
                }
                if (health.invincibleCounter > 0) {
                    health.invincibleCounter--;
                }
            }
            else if (health.deathFadeoutCounter > 0) {
                health.deathFadeoutCounter--;
            }
            else {
                this.entityDeath(entityId);
            }
        }
    }
    entityAlive(entityId, health) {
        if (health.alive) {
            if (health.currentHealth <= 0) {
                this.entityFadeout(entityId, health);
                return false;
            }
            return true;
        }
        return false;
    }
    entityFadeout(entityId, health) {
        health.alive = false;
        health.invincibleCounter = 1;
        this.entityManager.removeComponents(entityId, [CType.Controller, CType.Collision]);
        const uiElements = this.entityManager.get(entityId, CType.UI).elements;
        for (const element of uiElements) {
            element.state = UILifecycleState.BeginFadeOut;
        }
    }
    entityDeath(entityId) {
        if (this.entityManager.hasComponent(entityId, CType.Player)) {
            this.playerDeath(entityId);
        }
        this.entityManager.removeComponents(entityId, [CType.AI, CType.Health]);
    }
    playerDeath(entityId) {
        this.entityManager.addEntity([new UIComponent([new UIGameOverScreen()]), new ControllerComponent()]);
        this.entityManager.removeComponents(entityId, [CType.Acceleration, CType.Velocity, CType.Movement]);
    }
}
//# sourceMappingURL=HealthSystem.js.map