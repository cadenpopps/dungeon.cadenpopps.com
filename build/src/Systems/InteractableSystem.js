import { CType } from "../Component.js";
import { Interactable } from "../Components/InteractableComponent.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
export default class InteractableSystem extends System {
    playerId;
    constructor(eventManager, entityManager) {
        super(SystemType.Interactable, eventManager, entityManager, [CType.Interactable]);
    }
    logic() {
        this.checkInteractions();
    }
    refreshEntitiesHelper() {
        this.playerId = this.entityManager.getSystemEntities([CType.Player])[0];
    }
    checkInteractions() {
        if (this.entityManager.get(this.playerId, CType.Controller).interact) {
            this.checkOverlap(this.playerId);
        }
        return;
    }
    checkOverlap(playerId) {
        const playerPos = this.entityManager.get(playerId, CType.Position);
        for (let entityId of this.entities) {
            if (entityId !== playerId) {
                const interactablePos = this.entityManager.get(entityId, CType.Position);
                if (playerPos.x === interactablePos.x && playerPos.y === interactablePos.y) {
                    this.handleInteraction(playerId, entityId);
                    return;
                }
            }
        }
    }
    handleInteraction(playerId, entityId) {
        const interactableType = this.entityManager.get(entityId, CType.Interactable).interactableType;
        switch (interactableType) {
            case Interactable.LevelChange:
                this.entityManager.get(playerId, CType.Player).levelChangeId =
                    this.entityManager.get(entityId, CType.LevelChange).id;
                this.eventManager.addEvent(Event.level_change);
                break;
        }
    }
}
//# sourceMappingURL=InteractableSystem.js.map