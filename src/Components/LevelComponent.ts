import { randomInt } from "../../lib/PoppsMath.js";
import { Component, CType } from "../Component.js";

export default class LevelComponent extends Component {
    public depth: number;
    public seed: number;
    public entities: Array<Map<CType, Component>>;
    public entityIds: Array<number>;

    constructor(depth: number) {
        super(CType.Level);
        this.depth = depth;
        this.seed = randomInt(65536);
        // this.seed = 35334;
        this.entities = new Array<Map<CType, Component>>();
        this.entityIds = new Array<number>();
    }
}
