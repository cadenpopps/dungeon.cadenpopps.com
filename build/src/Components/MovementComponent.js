import { Component, CType, Direction } from "../Component.js";
export default class MovementComponent extends Component {
    constructor(speed, direction) {
        super(CType.Movement);
        this.speed = speed || 30;
        this.direction = direction || Direction.NONE;
        this.previousDirection = Direction.NONE;
        this.cooldown = 0;
    }
}
//# sourceMappingURL=MovementComponent.js.map