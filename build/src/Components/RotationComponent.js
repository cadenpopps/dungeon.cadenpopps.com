import { Component, CType } from "../Component.js";
export default class RotationComponent extends Component {
    degrees;
    centerPoint;
    constructor(centerPoint, degrees = 0) {
        super(CType.Direction);
        this.centerPoint = centerPoint;
        this.degrees = degrees;
    }
}
//# sourceMappingURL=RotationComponent.js.map