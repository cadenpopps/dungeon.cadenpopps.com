import { Component, ComponentType } from "../Component.js";
export default class VisibleComponent extends Component {
    constructor(color, layer) {
        super(ComponentType.Visible);
        this.color = color || { r: 255, g: 255, b: 255, a: 255 };
        this.layer = layer || 0;
    }
}
//# sourceMappingURL=VisibleComponent.js.map