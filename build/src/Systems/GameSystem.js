import { CType } from "../Component.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
export default class GameSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Game, eventManager, entityManager, []);
    }
    handleEvent(event) {
        switch (event) {
            case Event.level_loaded:
                this.fixPlayerPos();
                break;
        }
    }
    fixPlayerPos() {
        let playerId = -1;
        let exitId = -1;
        for (let entityId of this.entities) {
            if (this.entityManager.getEntity(entityId).has(CType.Player)) {
                playerId = entityId;
                exitId = this.entityManager.get(playerId, CType.Player).levelChangeId;
            }
        }
        for (let entityId of this.entities) {
            const entity = this.entityManager.getEntity(entityId);
            if (entity.has(CType.LevelChange)) {
                if (this.entityManager.get(entityId, CType.LevelChange).id === exitId) {
                    const destinationPos = this.entityManager.get(entityId, CType.Position);
                    const playerPos = this.entityManager.get(playerId, CType.Position);
                    playerPos.x = destinationPos.x + (destinationPos.z > playerPos.z ? 1 : -1);
                    playerPos.y = destinationPos.y;
                    playerPos.z = destinationPos.z;
                    return;
                }
            }
        }
    }
}
//# sourceMappingURL=GameSystem.js.map