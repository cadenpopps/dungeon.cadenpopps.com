import { Component, CType } from "../Component.js";
export default class PlayerComponent extends Component {
    levelChangeId;
    constructor() {
        super(CType.Player);
        this.levelChangeId = -1;
    }
}
//# sourceMappingURL=PlayerComponent.js.map