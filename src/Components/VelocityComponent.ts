import { Component, CType } from "../Component.js";

export default class VelocityComponent extends Component {
    public x: number;
    public y: number;
    public friction: boolean;

    constructor(x: number = 0, y: number = 0, friction = true) {
        super(CType.Velocity);
        this.x = x;
        this.y = y;
        this.friction = friction;
    }
}
