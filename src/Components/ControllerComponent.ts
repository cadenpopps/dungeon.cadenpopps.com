import { Component, ComponentType } from "../Component.js";

export default class ControllerComponent extends Component {
    public up: boolean;
    public right: boolean;
    public down: boolean;
    public left: boolean;
    public zoom_in: boolean;
    public zoom_out: boolean;

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
