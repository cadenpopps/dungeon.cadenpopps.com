import { CType } from "../Component.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import UIComponent, { UIGameOverScreen, UILifecycleState } from "../Components/UIComponent.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class HealthSystem extends System {
    public static HEALTH_REGEN_RATE: number = 0.01;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Health, eventManager, entityManager, [CType.Health]);
    }

    public logic(): void {
        for (let entityId of this.entities) {
            const health = this.entityManager.get<HealthComponent>(entityId, CType.Health);
            if (this.entityAlive(entityId, health)) {
                if (health.currentHealth < health.maxHealth) {
                    health.currentHealth += HealthSystem.HEALTH_REGEN_RATE;
                }
                if (health.invincibleCounter > 0) {
                    health.invincibleCounter--;
                }
            } else if (health.deathFadeoutCounter > 0) {
                health.deathFadeoutCounter--;
            } else {
                this.entityDeath(entityId);
            }
        }
    }

    private entityAlive(entityId: number, health: HealthComponent): boolean {
        if (health.alive) {
            if (health.currentHealth <= 0) {
                this.entityFadeout(entityId, health);
                return false;
            }
            return true;
        }
        return false;
    }

    private entityFadeout(entityId: number, health: HealthComponent): void {
        health.alive = false;
        health.invincibleCounter = 1;
        this.entityManager.removeComponents(entityId, [CType.Controller, CType.Collision]);
        const uiElements = this.entityManager.get<UIComponent>(entityId, CType.UI).elements;
        for (const element of uiElements) {
            element.state = UILifecycleState.BeginFadeOut;
        }
    }

    private entityDeath(entityId: number): void {
        if (this.entityManager.hasComponent(entityId, CType.Player)) {
            this.playerDeath(entityId);
        }
        this.entityManager.removeComponents(entityId, [CType.AI, CType.Health]);
    }

    private playerDeath(entityId: number): void {
        this.entityManager.addEntity([new UIComponent([new UIGameOverScreen()]), new ControllerComponent()]);
        this.entityManager.removeComponents(entityId, [CType.Acceleration, CType.Velocity, CType.Movement]);
    }
}
