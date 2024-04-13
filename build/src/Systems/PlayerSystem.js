import { CType } from "../Component.js";
import { System, SystemType } from "../System.js";
export default class PlayerSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Player, eventManager, entityManager, [CType.Player]);
    }
    logic() {
    }
}
//# sourceMappingURL=PlayerSystem.js.map