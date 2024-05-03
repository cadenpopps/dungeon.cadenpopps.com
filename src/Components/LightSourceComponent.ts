import { CType, Component } from "../Component.js";
import { Color } from "../Constants.js";

export default class LightSourceComponent extends Component {
    public lightLevel: number;
    public flickerLength: number;
    public flickerTick: number;
    public flicker: number;
    public tint!: Color;

    constructor(lightLevel: number, flickerLength: number, tint?: Color) {
        super(CType.LightSource);
        this.lightLevel = lightLevel;
        this.flickerLength = flickerLength;
        this.flickerTick = 0;
        this.flicker = 1;
        if (tint) {
            this.tint = tint;
        }
    }
}
