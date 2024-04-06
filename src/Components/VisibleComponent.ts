import { Component, CType } from "../Component.js";

export default class VisibleComponent extends Component {
    public color: Color;
    public layer: number;
    public lightLevel: number;
    public visible: boolean;
    public discovered: boolean;
    public inVisionRange: boolean;
    public blocking: boolean;

    constructor(color: Color, blocking: boolean, layer?: number) {
        super(CType.Visible);
        this.blocking = blocking;
        this.color = color;
        this.layer = layer || 0;
        this.lightLevel = 0;
        this.visible = false;
        this.discovered = false;
        this.inVisionRange = false;
    }
}

export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}
