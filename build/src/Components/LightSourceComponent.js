import { randomIntInRange } from "../../lib/PoppsMath.js";
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
        if (!flickerLength) {
            flickerLength = randomIntInRange(180, 240);
        }
        this.flickerLength = flickerLength;
        this.flickerTick = 0;
        this.flicker = 1;
        if (tint) {
            this.tint = tint;
        }
    }
}
//# sourceMappingURL=LightSourceComponent.js.map