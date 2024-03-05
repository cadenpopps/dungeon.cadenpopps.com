import { Component, ComponentType } from "./Component.js";
export default class PositionComponent extends Component {
    constructor(x, y, z) {
        super(ComponentType.Position);
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
}
//# sourceMappingURL=ObjectComponent.js.map