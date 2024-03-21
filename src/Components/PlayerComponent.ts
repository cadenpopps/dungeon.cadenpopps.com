import { Component, CType } from "../Component.js";

export default class PlayerComponent extends Component {
    public level: number;
    public levelChangeId: number;

    constructor() {
        super(CType.Player);
        this.level = 1;
        this.levelChangeId = -1;
    }
}
