import { randomInt } from "../../lib/PoppsMath.js";
import { Component, CType } from "../Component.js";

export default class LevelComponent extends Component {
    public depth: number;
    public seed: number;
    public entities: Array<Array<Component>>;
    public entityIds: Array<number>;
    public staircaseIds: Array<number>;

    constructor(depth: number) {
        super(CType.Level);
        this.depth = depth;
        this.seed = randomInt(65536);
        this.entities = new Array<Array<Component>>();
        this.entityIds = new Array<number>();
        this.staircaseIds = new Array<number>();
    }
}
