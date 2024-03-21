import { Component, CType } from "../Component.js";
export default class PositionComponent extends Component {
    constructor(x = 0, y = 0, z = 0) {
        super(CType.Position);
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
//# sourceMappingURL=PositionComponent.js.map