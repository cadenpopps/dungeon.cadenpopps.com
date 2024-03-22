import { CType } from "../Component.js";
import LevelChangeComponent from "../Components/LevelChangeComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class GameSystem extends System {
    private playerId!: number;
    private levelChangeIds!: Array<number>;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Game, eventManager, entityManager, []);
    }

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.level_loaded:
                this.fixPlayerPos();
                break;
        }
    }

    public refreshEntitiesHelper(): void {
        this.playerId = this.entityManager.getSystemEntities([CType.Player])[0];
        this.levelChangeIds = this.entityManager.getSystemEntities([CType.LevelChange]);
    }

    private fixPlayerPos(): void {
        let exitId = -1;
        exitId = this.entityManager.get<PlayerComponent>(this.playerId, CType.Player).levelChangeId;
        for (let entityId of this.levelChangeIds) {
            const entity = this.entityManager.getEntity(entityId);
            if (entity.has(CType.LevelChange)) {
                if (this.entityManager.get<LevelChangeComponent>(entityId, CType.LevelChange).id === exitId) {
                    const destinationPos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
                    const playerPos = this.entityManager.get<PositionComponent>(this.playerId, CType.Position);
                    playerPos.x = destinationPos.x + (destinationPos.z > playerPos.z ? 1 : -1);
                    playerPos.y = destinationPos.y;
                    playerPos.z = destinationPos.z;
                    return;
                }
            }
        }
    }
}
