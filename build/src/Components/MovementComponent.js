import { Component, CType, Direction } from "../Component.js";
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
        this.direction = Direction.SOUTH;
        this.moving = false;
        this.sneaking = false;
        this.rolling = false;
        this.rollLength = rollLength;
        this.rollCounter = 0;
        this.rollCooldownLength = rollCooldownLength;
        this.rollCooldown = 0;
    }
}
//# sourceMappingURL=MovementComponent.js.map