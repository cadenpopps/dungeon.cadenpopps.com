import { Component, CType } from "../Component.js";

export default class ControllerComponent extends Component {
    public up: boolean;
    public right: boolean;
    public down: boolean;
    public left: boolean;
    public interact: boolean;
    public roll: boolean;
    public sneak: boolean;
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
        this.sneak = false;
        this.zoom_in = false;
        this.zoom_out = false;
    }
}
