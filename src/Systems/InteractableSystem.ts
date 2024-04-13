import { abs } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import InteractableComponent, { Interactable } from "../Components/InteractableComponent.js";
import LevelChangeComponent from "../Components/LevelChangeComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class InteractableSystem extends System {
    private playerId!: number;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Interactable, eventManager, entityManager, [CType.Interactable]);
    }

    public logic(): void {
        const possibleInteractions = this.getInteractablesInRange();
        this.checkInteractions(possibleInteractions);
    }

    public getEntitiesHelper(): void {
        this.playerId = this.entityManager.getSystemEntities([CType.Player])[0];
    }

    private getInteractablesInRange(): Array<number> {
        const interactablesInRange = new Array<number>();
        const playerPos = this.entityManager.get<PositionComponent>(this.playerId, CType.Position);
        for (let entityId of this.entities) {
            if (entityId !== this.playerId) {
                const interactable = this.entityManager.getEntity(entityId);
                const pos = interactable.get(CType.Position) as PositionComponent;
                const int = interactable.get(CType.Interactable) as InteractableComponent;
                if (abs(playerPos.x - pos.x) < int.range && abs(playerPos.y - pos.y) < int.range) {
                    interactablesInRange.push(entityId);
                    int.active = true;
                } else {
                    int.active = false;
                }
            }
        }
        return interactablesInRange;
    }

    private checkInteractions(possibleInteractions: Array<number>): void {
        if (this.entityManager.get<ControllerComponent>(this.playerId, CType.Controller).interact) {
            for (let entityId of possibleInteractions) {
                this.handleInteraction(entityId);
            }
        }
        return;
    }

    private handleInteraction(entityId: number): void {
        const interactableType = this.entityManager.get<InteractableComponent>(
            entityId,
            CType.Interactable
        ).interactableType;
        switch (interactableType) {
            case Interactable.LevelChange:
                this.entityManager.get<PlayerComponent>(this.playerId, CType.Player).levelChangeId =
                    this.entityManager.get<LevelChangeComponent>(entityId, CType.LevelChange).id;
                this.eventManager.addEvent(Event.level_change);
                break;
        }
    }
}
