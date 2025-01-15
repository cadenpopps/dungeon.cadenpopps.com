import { Component, CType } from "../Component.js";

export default class ControllerComponent extends Component {
    public up: boolean;
    public right: boolean;
    public down: boolean;
    public left: boolean;
    public interact: boolean;
    public roll: boolean;
    public primary: boolean;
    public secondary: boolean;
    public ultimate: boolean;
    public zoom_in: boolean;
    public zoom_out: boolean;

    constructor() {
        super(CType.Controller);
        this.up = false;
        this.right = false;
        this.down = false;
        this.left = false;
        this.interact = false;
        this.roll = false;
        this.primary = false;
        this.secondary = false;
        this.ultimate = false;
        this.zoom_in = false;
        this.zoom_out = false;
    }
}
