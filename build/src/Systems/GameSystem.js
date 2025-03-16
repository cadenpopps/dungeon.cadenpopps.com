import { System, SystemType } from "../System.js";
export default class GameSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Game, eventManager, entityManager, []);
    }
}
//# sourceMappingURL=GameSystem.js.map