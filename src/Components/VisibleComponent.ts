import { Component, ComponentType } from "../Component.js";

export default class VisibleComponent extends Component {
    public color: { r: number; g: number; b: number; a?: number };
    public layer: number;

    constructor(
        color: { r: number; g: number; b: number; a?: number },
        layer?: number
    ) {
        super(ComponentType.Visible);
        this.color = color || { r: 255, g: 255, b: 255, a: 255 };
        this.layer = layer || 0;
    }
}
