import { CType } from "../Component.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
export default class GameSystem extends System {
    playerId;
    levelChangeIds;
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
    getEntitiesHelper() {
        this.playerId = this.entityManager.getSystemEntities([CType.Player])[0];
        this.levelChangeIds = this.entityManager.getSystemEntities([CType.LevelChange]);
    }
    fixPlayerPos() {
        let exitId = -1;
        exitId = this.entityManager.get(this.playerId, CType.Player).levelChangeId;
        for (let entityId of this.levelChangeIds) {
            const entity = this.entityManager.getEntity(entityId);
            if (entity.has(CType.LevelChange)) {
                if (this.entityManager.get(entityId, CType.LevelChange).id === exitId) {
                    const destinationPos = this.entityManager.get(entityId, CType.Position);
                    const playerPos = this.entityManager.get(this.playerId, CType.Position);
                    const playerCamera = this.entityManager.get(this.playerId, CType.Camera);
                    playerPos.x = destinationPos.x + (destinationPos.z > playerPos.z ? 1 : -1);
                    playerPos.y = destinationPos.y;
                    playerPos.z = destinationPos.z;
                    playerCamera.x = playerPos.x;
                    playerCamera.y = playerPos.y;
                    playerCamera.z = playerPos.x;
                    return;
                }
            }
        }
    }
}
//# sourceMappingURL=GameSystem.js.map