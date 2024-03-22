import { Component, CType } from "../Component.js";
export default class LightSourceComponent extends Component {
    lightLevel;
    constructor(lightLevel) {
        super(CType.LightSource);
        this.lightLevel = lightLevel;
    }
}
//# sourceMappingURL=LightSourceComponent.js.map