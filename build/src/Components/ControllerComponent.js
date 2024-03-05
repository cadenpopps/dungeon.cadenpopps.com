import { Component, ComponentType } from "../Component.js";
export default class ControllerComponent extends Component {
    constructor() {
        super(ComponentType.Controller);
        this.up = false;
        this.right = false;
        this.down = false;
        this.left = false;
        this.zoom_in = false;
        this.zoom_out = false;
    }
}
//# sourceMappingURL=ControllerComponent.js.map