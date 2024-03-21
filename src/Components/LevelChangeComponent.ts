import { Component, CType } from "../Component.js";

export default class LevelChangeComponent extends Component {
    public id: number;

    constructor(id: number = -1) {
        super(CType.LevelChange);
        this.id = id;
    }
}
