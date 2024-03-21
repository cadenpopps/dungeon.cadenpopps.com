import { Component, CType } from "../Component.js";

export default class PositionComponent extends Component {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super(CType.Position);
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
