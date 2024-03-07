import { CType } from "../Component.js";
import InteractableComponent, {
    Interactable,
} from "../Components/InteractableComponent.js";
import LevelExitComponent from "../Components/LevelExitComponent.js";
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

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.new_game:
                break;
            case Event.entity_created:
                break;
        }
    }

    private checkInteractions(): void {
        for (let entityId of this.entities) {
            if (
                this.entityManager.get<InteractableComponent>(
                    entityId,
                    CType.Interactable
                ).interactableType === Interactable.Player
            ) {
                this.checkOverlap(entityId);
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
            case Interactable.LevelExit:
                const player = this.entityManager.get<PlayerComponent>(
                    playerId,
                    CType.Player
                );
                const exit = this.entityManager.get<LevelExitComponent>(
                    entityId,
                    CType.LevelExit
                );
                player.levelExitId = exit.id;
                this.eventManager.addEvent(Event.level_change);
                break;
        }
    }
}
