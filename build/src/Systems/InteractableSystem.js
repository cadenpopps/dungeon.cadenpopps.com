import { abs } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import { Interactable } from "../Components/InteractableComponent.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
export default class InteractableSystem extends System {
    controllerIds = new Array();
    constructor(eventManager, entityManager) {
        super(SystemType.Interactable, eventManager, entityManager, [CType.Interactable]);
        this.entityManager.subscribeToEntities([CType.Controller, CType.Health, CType.Position], this.controllerIds, this);
    }
    logic() {
        for (const entityId of this.entities) {
            const int = this.entityManager.get(entityId, CType.Interactable);
            int.visible = false;
            if (int.counter > 0) {
                int.counter--;
            }
            else {
                for (const controllerId of this.controllerIds) {
                    if (this.entityManager.get(controllerId, CType.Health).alive) {
                        if (this.interactableInRange(entityId, int, controllerId)) {
                            int.visible = true;
                            if (this.entityManager.get(controllerId, CType.Controller).interact) {
                                this.handleInteraction(entityId, controllerId);
                            }
                        }
                    }
                }
            }
        }
    }
    interactableInRange(entityId, int, controllerId) {
        const controllerPos = this.entityManager.get(controllerId, CType.Position);
        const intPos = this.entityManager.get(entityId, CType.Position);
        return abs(controllerPos.x - intPos.x) < int.range && abs(controllerPos.y - intPos.y) < int.range;
    }
    handleInteraction(entityId, controllerId) {
        const int = this.entityManager.get(entityId, CType.Interactable);
        int.counter = int.cooldown;
        int.visible = false;
        switch (int.interactableType) {
            case Interactable.LevelChange:
                if (this.entityManager.hasComponent(controllerId, CType.Player)) {
                    this.entityManager.get(controllerId, CType.Player).levelChangeId =
                        this.entityManager.get(entityId, CType.LevelChange).id;
                    this.entityManager.get(controllerId, CType.Controller).interact = false;
                    this.eventManager.addEvent(Event.level_change_begin);
                }
                break;
        }
    }
}
//# sourceMappingURL=InteractableSystem.js.map