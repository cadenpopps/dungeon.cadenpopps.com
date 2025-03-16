import { abs } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import InteractableComponent, { Interactable } from "../Components/InteractableComponent.js";
import LevelChangeComponent from "../Components/LevelChangeComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class InteractableSystem extends System {
    private controllerIds: Array<number> = new Array<number>();

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Interactable, eventManager, entityManager, [CType.Interactable]);
        this.entityManager.subscribeToEntities(
            [CType.Controller, CType.Health, CType.Position],
            this.controllerIds,
            this
        );
    }

    public logic(): void {
        for (const entityId of this.entities) {
            const int = this.entityManager.get<InteractableComponent>(entityId, CType.Interactable);
            int.visible = false;
            if (int.counter > 0) {
                int.counter--;
            } else {
                for (const controllerId of this.controllerIds) {
                    if (this.entityManager.get<HealthComponent>(controllerId, CType.Health).alive) {
                        if (this.interactableInRange(entityId, int, controllerId)) {
                            int.visible = true;
                            if (this.entityManager.get<ControllerComponent>(controllerId, CType.Controller).interact) {
                                this.handleInteraction(entityId, controllerId);
                            }
                        }
                    }
                }
            }
        }
    }

    private interactableInRange(entityId: number, int: InteractableComponent, controllerId: number): boolean {
        const controllerPos = this.entityManager.get<PositionComponent>(controllerId, CType.Position);
        const intPos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        return abs(controllerPos.x - intPos.x) < int.range && abs(controllerPos.y - intPos.y) < int.range;
    }

    private handleInteraction(entityId: number, controllerId: number): void {
        const int = this.entityManager.get<InteractableComponent>(entityId, CType.Interactable);
        int.counter = int.cooldown;
        int.visible = false;
        switch (int.interactableType) {
            case Interactable.LevelChange:
                if (this.entityManager.hasComponent(controllerId, CType.Player)) {
                    this.entityManager.get<PlayerComponent>(controllerId, CType.Player).levelChangeId =
                        this.entityManager.get<LevelChangeComponent>(entityId, CType.LevelChange).id;
                    this.entityManager.get<ControllerComponent>(controllerId, CType.Controller).interact = false;
                    this.eventManager.addEvent(Event.level_change_begin);
                }
                break;
        }
    }
}
