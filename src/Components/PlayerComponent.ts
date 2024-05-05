import { Component, CType } from "../Component.js";

export default class PlayerComponent extends Component {
    public levelChangeId: number;

    constructor() {
        super(CType.Player);
        this.levelChangeId = -1;
    }
}
