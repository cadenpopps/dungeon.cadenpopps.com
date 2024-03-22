import { Component, CType } from "../Component.js";
export default class VelocityComponent extends Component {
    x;
    y;
    constructor(x = 0, y = 0) {
        super(CType.Velocity);
        this.x = x;
        this.y = y;
    }
}
//# sourceMappingURL=VelocityComponent.js.map