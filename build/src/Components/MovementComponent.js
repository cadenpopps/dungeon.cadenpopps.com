import { Component, ComponentType, Direction } from "../Component.js";
export default class MovementComponent extends Component {
    constructor(direction) {
        super(ComponentType.Movement);
        this.direction = direction || Direction.NONE;
        this.previousDirection = Direction.NONE;
        this.cooldown = 0;
    }
}
//# sourceMappingURL=MovementComponent.js.map