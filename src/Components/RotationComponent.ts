import { Component, CType } from "../Component.js";
import { Direction } from "./DirectionComponent.js";
import PositionComponent from "./PositionComponent.js";

export default class RotationComponent extends Component {
    public degrees: number;
    public centerPoint: PositionComponent;

    constructor(centerPoint: PositionComponent, degrees: number = 0) {
        super(CType.Direction);
        this.centerPoint = centerPoint;
        this.degrees = degrees;
    }
}

export const RotationDirectionMap: Map<Direction, number> = new Map<Direction, number>([
    [Direction.North, 180],
    [Direction.NorthEast, 225],
    [Direction.East, 270],
    [Direction.SouthEast, 305],
    [Direction.South, 0],
    [Direction.SouthWest, 45],
    [Direction.West, 90],
    [Direction.NorthWest, 135],
]);
