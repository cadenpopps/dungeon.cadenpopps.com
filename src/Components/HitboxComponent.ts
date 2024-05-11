import { Component, CType } from "../Component.js";

export default class HitboxComponent extends Component {
    public shape: HitboxShape;
    public xOffset: number;
    public yOffset: number;
    public degreesOffset: number;
    public width: number;
    public height: number;
    public frames: number;
    public sourceId: number;
    public ignoreIds: Array<number>;
    public damage: number;

    constructor(
        xOffset: number,
        yOffset: number,
        width: number,
        height: number,
        degreesOffset: number,
        frames: number,
        sourceId: number,
        damage: number
    ) {
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
    constructor(xOffset: number, yOffset: number, radius: number, frames: number, sourceId: number, damage: number) {
        super(xOffset, yOffset, radius, radius, 0, frames, sourceId, damage);
        this.shape = HitboxShape.Circle;
    }
}

export enum HitboxShape {
    Rectangle,
    Circle,
}

export interface HitboxData {
    damage: number;
    x: number;
    y: number;
    width: number;
    height: number;
    frames: number;
    degrees: number;
    circle: boolean;
}
