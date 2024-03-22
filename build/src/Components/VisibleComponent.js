import { Component, CType } from "../Component.js";
export default class VisibleComponent extends Component {
    color;
    layer;
    lightLevel;
    constructor(color, layer) {
        super(CType.Visible);
        this.color = color || { r: 0, g: 0, b: 0, a: 0 };
        this.layer = layer || 0;
        this.lightLevel = 0;
    }
}
//# sourceMappingURL=VisibleComponent.js.map