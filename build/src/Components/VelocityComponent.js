import { Component, CType } from "../Component.js";
export default class VelocityComponent extends Component {
    x;
    y;
    friction;
    constructor(x = 0, y = 0, friction = true) {
        super(CType.Velocity);
        this.x = x;
        this.y = y;
        this.friction = friction;
    }
}
//# sourceMappingURL=VelocityComponent.js.map