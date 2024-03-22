import { Component, CType } from "../Component.js";

export default class VisibleComponent extends Component {
    public color: Color;
    public layer: number;
    public lightLevel: number;

    constructor(color?: Color, layer?: number) {
        super(CType.Visible);
        this.color = color || { r: 0, g: 0, b: 0, a: 0 };
        this.layer = layer || 0;
        this.lightLevel = 0;
    }
}

export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}
