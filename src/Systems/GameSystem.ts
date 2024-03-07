import { CType } from "../Component.js";
import LevelEntryComponent from "../Components/LevelEntryComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class GameSystem extends System {
    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Game, eventManager, entityManager, []);
    }

    public logic(): void {}

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.level_loaded:
                this.movePlayerToLevelEntry();
                break;
        }
    }

    private movePlayerToLevelEntry(): void {
        let entryPos = new PositionComponent(0, 0, 0);
        let entryId = 0;
        let playerId = -1;
        for (let entityId of this.entities) {
            if (this.entityManager.getEntity(entityId).has(CType.LevelEntry)) {
                entryPos = this.entityManager.get<PositionComponent>(
                    entityId,
                    CType.Position
                );
                entryId = this.entityManager.get<LevelEntryComponent>(
                    entityId,
                    CType.LevelEntry
                ).id;
            }
            if (this.entityManager.getEntity(entityId).has(CType.Player)) {
                playerId = entityId;
            }
        }
        if (playerId !== -1) {
            const player = this.entityManager.getEntity(playerId);
            player.set(
                CType.Position,
                new PositionComponent(entryPos.x, entryPos.y, entryPos.z)
            );
            this.entityManager.get<PlayerComponent>(
                playerId,
                CType.Player
            ).levelEntryId = entryId;
        }
    }
}
