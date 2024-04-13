import { CType } from "../Component.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class PlayerSystem extends System {
    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Player, eventManager, entityManager, [CType.Player]);
    }

    public logic(): void {
        // for (let entityId of this.entities) {
        // }
    }
}
