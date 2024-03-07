import { Component, CType } from "../Component.js";
import LevelComponent from "./LevelComponent.js";

export default class LevelExitComponent extends Component {
    public id: number;
    public toLevel: LevelComponent | undefined;

    constructor(id: number, nextLevel?: LevelComponent) {
        super(CType.LevelExit);
        this.id = id || 0;
        this.toLevel = nextLevel || undefined;
    }
}
