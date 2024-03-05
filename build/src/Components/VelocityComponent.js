import { Component, ComponentType } from "../Component.js";
export default class VelocityComponent extends Component {
    constructor(x, y) {
        super(ComponentType.Velocity);
        this.x = x || 0;
        this.y = y || 0;
    }
}
//# sourceMappingURL=VelocityComponent.js.map