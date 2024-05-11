import { Component, CType } from "../Component.js";
export default class HitboxComponent extends Component {
    shape;
    xOffset;
    yOffset;
    width;
    height;
    frames;
    sourceId;
    constructor(xOffset, yOffset, width, height, frames, sourceId) {
        super(CType.Hitbox);
        this.shape = HitboxShape.Rectangle;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.width = width;
        this.height = height;
        this.frames = frames;
        this.sourceId = sourceId;
    }
}
export class CircleHitboxComponent extends HitboxComponent {
}
export var HitboxShape;
(function (HitboxShape) {
    HitboxShape[HitboxShape["Rectangle"] = 0] = "Rectangle";
    HitboxShape[HitboxShape["Circle"] = 1] = "Circle";
})(HitboxShape || (HitboxShape = {}));
//# sourceMappingURL=HitboxComponent.js.map