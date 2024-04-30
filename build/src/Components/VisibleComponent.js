import { Component, CType } from "../Component.js";
import { LIGHT_LEVEL_FILL, SHADOW_FILL } from "../Constants.js";
export default class VisibleComponent extends Component {
    layer;
    light;
    shadow;
    visible;
    discovered;
    inVisionRange;
    blocking;
    constructor(blocking, layer = 0) {
        super(CType.Visible);
        this.blocking = blocking;
        this.layer = layer;
        this.light = LIGHT_LEVEL_FILL[0];
        this.shadow = SHADOW_FILL[0];
        this.visible = false;
        this.discovered = false;
        this.inVisionRange = false;
    }
}
//# sourceMappingURL=VisibleComponent.js.map