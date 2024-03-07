import { Component, CType } from "../Component.js";
export default class PositionComponent extends Component {
    constructor(x, y, z) {
        super(CType.Position);
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
}
//# sourceMappingURL=PositionComponent.js.map