import { Component, CType } from "../Component.js";
export default class VisibleComponent extends Component {
    layer;
    lightLevel;
    visible;
    discovered;
    inVisionRange;
    blocking;
    constructor(blocking, layer = 0) {
        super(CType.Visible);
        this.blocking = blocking;
        this.layer = layer;
        this.lightLevel = 0;
        this.visible = false;
        this.discovered = false;
        this.inVisionRange = false;
    }
}
//# sourceMappingURL=VisibleComponent.js.map