import { Component, CType } from "../Component.js";
export default class ControllerComponent extends Component {
    constructor() {
        super(CType.Controller);
        this.up = false;
        this.right = false;
        this.down = false;
        this.left = false;
        this.interact = false;
        this.zoom_in = false;
        this.zoom_out = false;
    }
}
//# sourceMappingURL=ControllerComponent.js.map