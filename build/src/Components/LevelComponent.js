import { randomInt } from "../../lib/PoppsMath.js";
import { Component, ComponentType } from "../Component.js";
export default class LevelComponent extends Component {
    constructor(depth) {
        super(ComponentType.Level);
        this.depth = depth;
        this.seed = randomInt(65536);
        this.entities = new Array();
        this.entityIds = new Array();
    }
}
//# sourceMappingURL=LevelComponent.js.map