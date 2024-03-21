import { CType } from "../Component.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import InteractableComponent, {
    Interactable,
} from "../Components/InteractableComponent.js";
import LevelChangeComponent from "../Components/LevelChangeComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class InteractableSystem extends System {
    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Interactable, eventManager, entityManager, [
            CType.Interactable,
        ]);
    }

    public logic(): void {
        this.checkInteractions();
    }

    public handleEvent(): void {}

    private checkInteractions(): void {
        for (let entityId of this.entities) {
            if (
                this.entityManager.get<InteractableComponent>(
                    entityId,
                    CType.Interactable
                ).interactableType === Interactable.Player
            ) {
                if (
                    this.entityManager.get<ControllerComponent>(
                        entityId,
                        CType.Controller
                    ).interact
                ) {
                    this.checkOverlap(entityId);
                }
                return;
            }
        }
    }

    private checkOverlap(playerId: number): void {
        const playerPos = this.entityManager.get<PositionComponent>(
            playerId,
            CType.Position
        );
        for (let entityId of this.entities) {
            if (entityId !== playerId) {
                const interactablePos =
                    this.entityManager.get<PositionComponent>(
                        entityId,
                        CType.Position
                    );
                if (
                    playerPos.x === interactablePos.x &&
                    playerPos.y === interactablePos.y
                ) {
                    this.handleInteraction(playerId, entityId);
                    return;
                }
            }
        }
    }

    private handleInteraction(playerId: number, entityId: number): void {
        const interactableType = this.entityManager.get<InteractableComponent>(
            entityId,
            CType.Interactable
        ).interactableType;
        switch (interactableType) {
            case Interactable.LevelChange:
                this.entityManager.get<PlayerComponent>(
                    playerId,
                    CType.Player
                ).levelChangeId = this.entityManager.get<LevelChangeComponent>(
                    entityId,
                    CType.LevelChange
                ).id;
                this.eventManager.addEvent(Event.level_change);
                break;
        }
    }
}
