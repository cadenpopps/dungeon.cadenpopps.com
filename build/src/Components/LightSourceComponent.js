import { CType, Component } from "../Component.js";
export default class LightSourceComponent extends Component {
    lightLevel;
    flickerLength;
    flickerTick;
    flicker;
    tint;
    constructor(lightLevel, flickerLength, tint) {
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
//# sourceMappingURL=LightSourceComponent.js.map