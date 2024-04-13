import { abs } from "../../lib/PoppsMath.js";
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
        const possibleInteractions = this.getInteractablesInRange();
        this.checkInteractions(possibleInteractions);
    }
    getEntitiesHelper() {
        this.playerId = this.entityManager.getSystemEntities([CType.Player])[0];
    }
    getInteractablesInRange() {
        const interactablesInRange = new Array();
        const playerPos = this.entityManager.get(this.playerId, CType.Position);
        for (let entityId of this.entities) {
            if (entityId !== this.playerId) {
                const interactable = this.entityManager.getEntity(entityId);
                const pos = interactable.get(CType.Position);
                const int = interactable.get(CType.Interactable);
                if (abs(playerPos.x - pos.x) < int.range && abs(playerPos.y - pos.y) < int.range) {
                    interactablesInRange.push(entityId);
                    int.active = true;
                }
                else {
                    int.active = false;
                }
            }
        }
        return interactablesInRange;
    }
    checkInteractions(possibleInteractions) {
        if (this.entityManager.get(this.playerId, CType.Controller).interact) {
            for (let entityId of possibleInteractions) {
                this.handleInteraction(entityId);
            }
        }
        return;
    }
    handleInteraction(entityId) {
        const interactableType = this.entityManager.get(entityId, CType.Interactable).interactableType;
        switch (interactableType) {
            case Interactable.LevelChange:
                this.entityManager.get(this.playerId, CType.Player).levelChangeId =
                    this.entityManager.get(entityId, CType.LevelChange).id;
                this.eventManager.addEvent(Event.level_change);
                break;
        }
    }
}
//# sourceMappingURL=InteractableSystem.js.map