import { Component, CType } from "../Component.js";

export default class VisibleComponent extends Component {
    public layer: number;
    public lightLevel: number;
    public visible: boolean;
    public discovered: boolean;
    public inVisionRange: boolean;
    public blocking: boolean;

    constructor(blocking: boolean, layer: number = 0) {
        super(CType.Visible);
        this.blocking = blocking;
        this.layer = layer;
        this.lightLevel = 0;
        this.visible = false;
        this.discovered = false;
        this.inVisionRange = false;
    }
}
