import { Component, CType } from "../Component.js";

export default class AccelerationComponent extends Component {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        super(CType.Acceleration);
        this.x = x;
        this.y = y;
    }
}
