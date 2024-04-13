import { Component, CType } from "../Component.js";
export default class HitboxComponent extends Component {
    x;
    y;
    width;
    height;
    framesActive;
    sourceId;
    active;
    constructor(x, y, width, height, framesActive, sourceId, active = true) {
        super(CType.Hitbox);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.framesActive = framesActive;
        this.sourceId = sourceId;
        this.active = active;
    }
}
//# sourceMappingURL=HitboxComponent.js.map