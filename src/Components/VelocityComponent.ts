import { Component, CType } from "../Component.js";

export default class VelocityComponent extends Component {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        super(CType.Velocity);
        this.x = x || 0;
        this.y = y || 0;
    }
}
