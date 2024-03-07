import { Component, CType } from "../Component.js";
export default class LevelExitComponent extends Component {
    constructor(id, nextLevel) {
        super(CType.LevelExit);
        this.id = id || 0;
        this.toLevel = nextLevel || undefined;
    }
}
//# sourceMappingURL=LevelExitComponent.js.map