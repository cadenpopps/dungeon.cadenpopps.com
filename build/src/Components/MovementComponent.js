import { Component, CType } from "../Component.js";
export default class MovementComponent extends Component {
    speed;
    walking;
    sneaking;
    rolling;
    rollLength;
    rollCounter;
    rollCooldownLength;
    rollCooldown;
    constructor(speed = 30, rollLength = 12, rollCooldownLength = 70) {
        super(CType.Movement);
        this.speed = speed;
        this.walking = false;
        this.sneaking = false;
        this.rolling = false;
        this.rollLength = rollLength;
        this.rollCounter = 0;
        this.rollCooldownLength = rollCooldownLength;
        this.rollCooldown = 0;
    }
}
//# sourceMappingURL=MovementComponent.js.map