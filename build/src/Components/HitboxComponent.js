import { Component, CType } from "../Component.js";
export default class HitboxComponent extends Component {
    shape;
    x;
    y;
    width;
    height;
    rotation;
    duration;
    sourceEntityId;
    damage;
    vertices;
    constructor(shape, x, y, width, height, rotation, duration, sourceEntityId, damage) {
        super(CType.Hitbox);
        this.shape = shape;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.duration = duration;
        this.sourceEntityId = sourceEntityId;
        this.damage = damage;
        this.vertices = new Array();
    }
}
export var HitboxShape;
(function (HitboxShape) {
    HitboxShape[HitboxShape["Rectangle"] = 0] = "Rectangle";
    HitboxShape[HitboxShape["Circle"] = 1] = "Circle";
    HitboxShape[HitboxShape["SemiCircle"] = 2] = "SemiCircle";
    HitboxShape[HitboxShape["QuarterCircle"] = 3] = "QuarterCircle";
})(HitboxShape || (HitboxShape = {}));
//# sourceMappingURL=HitboxComponent.js.map