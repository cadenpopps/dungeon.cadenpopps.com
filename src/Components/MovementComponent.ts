import { Component, ComponentType, Direction } from "../Component.js";

export default class MovementComponent extends Component {
    public direction: Direction;
    public previousDirection: Direction;
    public cooldown: number;

    constructor(direction?: Direction) {
        super(ComponentType.Movement);
        this.direction = direction || Direction.NONE;
        this.previousDirection = Direction.NONE;
        this.cooldown = 0;
    }
}
