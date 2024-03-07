import { CType } from "../Component.js";
import { Interactable, } from "../Components/InteractableComponent.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
export default class InteractableSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Interactable, eventManager, entityManager, [
            CType.Interactable,
        ]);
    }
    logic() {
        this.checkInteractions();
    }
    handleEvent(event) {
        switch (event) {
            case Event.new_game:
                break;
            case Event.entity_created:
                break;
        }
    }
    checkInteractions() {
        for (let entityId of this.entities) {
            if (this.entityManager.get(entityId, CType.Interactable).interactableType === Interactable.Player) {
                this.checkOverlap(entityId);
            }
        }
    }
    checkOverlap(playerId) {
        const playerPos = this.entityManager.get(playerId, CType.Position);
        for (let entityId of this.entities) {
            if (entityId !== playerId) {
                const interactablePos = this.entityManager.get(entityId, CType.Position);
                if (playerPos.x === interactablePos.x &&
                    playerPos.y === interactablePos.y) {
                    this.handleInteraction(playerId, entityId);
                }
            }
        }
    }
    handleInteraction(playerId, entityId) {
        const interactableType = this.entityManager.get(entityId, CType.Interactable).interactableType;
        switch (interactableType) {
            case Interactable.LevelExit:
                const player = this.entityManager.get(playerId, CType.Player);
                const exit = this.entityManager.get(entityId, CType.LevelExit);
                player.levelExitId = exit.id;
                this.eventManager.addEvent(Event.level_change);
                break;
        }
    }
}
//# sourceMappingURL=InteractableSystem.js.map