import { Component, CType } from "../Component.js";
export default class MovementComponent extends Component {
    speed;
    direction;
    moving;
    sneaking;
    rolling;
    rollLength;
    rollCounter;
    rollCooldownLength;
    rollCooldown;
    constructor(speed = 30, rollLength = 12, rollCooldownLength = 70) {
        super(CType.Movement);
        this.speed = speed;
        this.direction = Direction.NONE;
        this.moving = false;
        this.sneaking = false;
        this.rolling = false;
        this.rollLength = rollLength;
        this.rollCounter = 0;
        this.rollCooldownLength = rollCooldownLength;
        this.rollCooldown = 0;
    }
}
export var Direction;
(function (Direction) {
    Direction[Direction["NORTH"] = 0] = "NORTH";
    Direction[Direction["NORTHEAST"] = 1] = "NORTHEAST";
    Direction[Direction["EAST"] = 2] = "EAST";
    Direction[Direction["SOUTHEAST"] = 3] = "SOUTHEAST";
    Direction[Direction["SOUTH"] = 4] = "SOUTH";
    Direction[Direction["SOUTHWEST"] = 5] = "SOUTHWEST";
    Direction[Direction["WEST"] = 6] = "WEST";
    Direction[Direction["NORTHWEST"] = 7] = "NORTHWEST";
    Direction[Direction["NONE"] = 8] = "NONE";
})(Direction || (Direction = {}));
//# sourceMappingURL=MovementComponent.js.map