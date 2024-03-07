import { Component, CType } from "../Component.js";

export default class LevelEntryComponent extends Component {
    public id: number;

    constructor(id: number) {
        super(CType.LevelEntry);
        this.id = id || 0;
    }
}
