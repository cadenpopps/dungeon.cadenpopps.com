import { Component, CType } from "../Component.js";
export default class AccelerationComponent extends Component {
    x;
    y;
    constructor(x = 0, y = 0) {
        super(CType.Acceleration);
        this.x = x;
        this.y = y;
    }
}
//# sourceMappingURL=AccelerationComponent.js.map