import { Component, CType, Direction } from "../Component.js";
export default class MovementComponent extends Component {
    direction;
    previousDirection;
    cooldown;
    speed;
    constructor(speed = 30, direction = Direction.NONE) {
        super(CType.Movement);
        this.speed = speed;
        this.direction = direction || Direction.NONE;
        this.previousDirection = Direction.NONE;
        this.cooldown = 0;
    }
}
//# sourceMappingURL=MovementComponent.js.map