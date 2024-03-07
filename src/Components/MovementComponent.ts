import { Component, CType, Direction } from "../Component.js";

export default class MovementComponent extends Component {
    public direction: Direction;
    public previousDirection: Direction;
    public cooldown: number;
    public speed: number;

    constructor(speed?: number, direction?: Direction) {
        super(CType.Movement);
        this.speed = speed || 30;
        this.direction = direction || Direction.NONE;
        this.previousDirection = Direction.NONE;
        this.cooldown = 0;
    }
}
