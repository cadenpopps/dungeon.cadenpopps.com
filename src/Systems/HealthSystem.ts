import { Component, CType } from "../Component.js";
import HealthComponent from "../Components/HealthComponent.js";
import UIComponent, { UIButton, UIGameOverScreen } from "../Components/UIComponent.js";
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

    private entityDeath(entityId: number): void {
        this.entityManager.removeComponents(entityId, [CType.AI, CType.Hitbox, CType.Ability, CType.Controller]);
    }

    private playerDeath(entityId: number): void {
        console.log(`player death
            `);
        this.entityManager.addEntity(
            new Map<CType, Component>([[CType.UI, new UIComponent([new UIGameOverScreen(), new UIButton("Respawn")])]])
        );
    }
}
