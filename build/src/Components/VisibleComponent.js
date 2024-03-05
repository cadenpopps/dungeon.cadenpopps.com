import { Component, ComponentType } from "../Component.js";
export default class VisibleComponent extends Component {
    constructor(color, layer) {
        super(ComponentType.Visible);
        this.r = color[0] || 0;
        this.g = color[1] || 0;
        this.b = color[2] || 0;
        this.a = color[3] || 255;
        this.layer = layer || 0;
    }
}
//# sourceMappingURL=VisibleComponent.js.map