import { Component, CType } from "../Component.js";
import { Color, LIGHT_LEVEL_FILL, SHADOW_FILL } from "../Constants.js";

export default class VisibleComponent extends Component {
    public layer: number;
    public light: Color;
    public shadow: Color;
    public visible: boolean;
    public discovered: boolean;
    public inVisionRange: boolean;
    public blocking: boolean;

    constructor(blocking: boolean, layer: number = 0) {
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
