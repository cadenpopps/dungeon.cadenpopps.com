import { Component, ComponentType } from "./Component.js";
export default class AccelerationComponent extends Component {
    constructor(x, y) {
        super(ComponentType.Acceleration);
        this.x = x || 0;
        this.y = y || 0;
    }
}
//# sourceMappingURL=AccelerationComponent.js.map