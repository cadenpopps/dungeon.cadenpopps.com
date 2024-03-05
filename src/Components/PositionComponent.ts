import { Component, ComponentType } from "../Component.js";

export default class PositionComponent extends Component {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        super(ComponentType.Position);
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
}
