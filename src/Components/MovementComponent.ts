import { Component, CType, Direction } from "../Component.js";

export default class MovementComponent extends Component {
    public direction: Direction;
    public previousDirection: Direction;
    public cooldown: number;
    public speed: number;

    constructor(speed: number = 30, direction: Direction = Direction.NONE) {
        super(CType.Movement);
        this.speed = speed;
        this.direction = direction || Direction.NONE;
        this.previousDirection = Direction.NONE;
        this.cooldown = 0;
    }
}
