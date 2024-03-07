import { CType } from "../Component.js";
import PositionComponent from "../Components/PositionComponent.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
export default class GameSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Game, eventManager, entityManager, []);
    }
    logic() { }
    handleEvent(event) {
        switch (event) {
            case Event.level_loaded:
                this.movePlayerToLevelEntry();
                break;
        }
    }
    movePlayerToLevelEntry() {
        let entryPos = new PositionComponent(0, 0, 0);
        let entryId = 0;
        let playerId = -1;
        for (let entityId of this.entities) {
            if (this.entityManager.getEntity(entityId).has(CType.LevelEntry)) {
                entryPos = this.entityManager.get(entityId, CType.Position);
                entryId = this.entityManager.get(entityId, CType.LevelEntry).id;
            }
            if (this.entityManager.getEntity(entityId).has(CType.Player)) {
                playerId = entityId;
            }
        }
        if (playerId !== -1) {
            const player = this.entityManager.getEntity(playerId);
            player.set(CType.Position, new PositionComponent(entryPos.x, entryPos.y, entryPos.z));
            this.entityManager.get(playerId, CType.Player).levelEntryId = entryId;
        }
    }
}
//# sourceMappingURL=GameSystem.js.map