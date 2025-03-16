import { randomInt } from "../../lib/PoppsMath.js";
import { Component, CType } from "../Component.js";
export default class LevelComponent extends Component {
    depth;
    seed;
    entities;
    entityIds;
    staircaseIds;
    constructor(depth) {
        super(CType.Level);
        this.depth = depth;
        this.seed = randomInt(65536);
        this.entities = new Array();
        this.entityIds = new Array();
        this.staircaseIds = new Array();
    }
}
//# sourceMappingURL=LevelComponent.js.map