import { Component, CType } from "../Component.js";
import { Direction } from "./DirectionComponent.js";
export default class RotationComponent extends Component {
    degrees;
    centerPoint;
    constructor(centerPoint, degrees = 0) {
        super(CType.Direction);
        this.centerPoint = centerPoint;
        this.degrees = degrees;
    }
}
export const RotationDirectionMap = new Map([
    [Direction.North, 180],
    [Direction.NorthEast, 225],
    [Direction.East, 270],
    [Direction.SouthEast, 305],
    [Direction.South, 0],
    [Direction.SouthWest, 45],
    [Direction.West, 90],
    [Direction.NorthWest, 135],
]);
//# sourceMappingURL=RotationComponent.js.map