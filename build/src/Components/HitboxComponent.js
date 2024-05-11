import { Component, CType } from "../Component.js";
export default class HitboxComponent extends Component {
    shape;
    xOffset;
    yOffset;
    degreesOffset;
    width;
    height;
    frames;
    sourceId;
    ignoreIds;
    damage;
    constructor(xOffset, yOffset, width, height, degreesOffset, frames, sourceId, damage) {
        super(CType.Hitbox);
        this.shape = HitboxShape.Rectangle;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.width = width;
        this.height = height;
        this.degreesOffset = degreesOffset;
        this.frames = frames;
        this.sourceId = sourceId;
        this.ignoreIds = [sourceId];
        this.damage = damage;
    }
}
export class CircleHitboxComponent extends HitboxComponent {
    constructor(xOffset, yOffset, radius, frames, sourceId, damage) {
        super(xOffset, yOffset, radius, radius, 0, frames, sourceId, damage);
        this.shape = HitboxShape.Circle;
    }
}
export var HitboxShape;
(function (HitboxShape) {
    HitboxShape[HitboxShape["Rectangle"] = 0] = "Rectangle";
    HitboxShape[HitboxShape["Circle"] = 1] = "Circle";
})(HitboxShape || (HitboxShape = {}));
//# sourceMappingURL=HitboxComponent.js.map