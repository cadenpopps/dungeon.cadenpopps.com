import { Component, CType } from "../Component.js";

export default class HitboxComponent extends Component {
    public shape: HitboxShape;
    public xOffset: number;
    public yOffset: number;
    public width: number;
    public height: number;
    public frames: number;
    public sourceId: number;

    constructor(xOffset: number, yOffset: number, width: number, height: number, frames: number, sourceId: number) {
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

export class CircleHitboxComponent extends HitboxComponent {}

export enum HitboxShape {
    Rectangle,
    Circle,
}

export interface HitboxData {
    x: number;
    y: number;
    width: number;
    height: number;
    frames: number;
}
