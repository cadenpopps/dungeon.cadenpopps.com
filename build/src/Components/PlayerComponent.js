import { Component, CType } from "../Component.js";
export default class PlayerComponent extends Component {
    level;
    levelChangeId;
    constructor() {
        super(CType.Player);
        this.level = 1;
        this.levelChangeId = -1;
    }
}
//# sourceMappingURL=PlayerComponent.js.map