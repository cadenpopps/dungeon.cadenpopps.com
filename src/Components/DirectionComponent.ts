import { Component, CType } from "../Component.js";

export default class DirectionComponent extends Component {
    public direction: Direction;
    public cooldown: number;

    constructor(direction: Direction = Direction.South) {
        super(CType.Direction);
        this.direction = direction;
        this.cooldown = 0;
    }
}

export enum Direction {
    North,
    NorthEast,
    East,
    SouthEast,
    South,
    SouthWest,
    West,
    NorthWest,
}
