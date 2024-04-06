import { Component, CType } from "../Component.js";
export default class VisibleComponent extends Component {
    color;
    layer;
    lightLevel;
    visible;
    discovered;
    inVisionRange;
    blocking;
    constructor(color, blocking, layer) {
        super(CType.Visible);
        this.blocking = blocking;
        this.color = color;
        this.layer = layer || 0;
        this.lightLevel = 0;
        this.visible = false;
        this.discovered = false;
        this.inVisionRange = false;
    }
}
//# sourceMappingURL=VisibleComponent.js.map