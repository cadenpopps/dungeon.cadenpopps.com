import { Component, CType } from "../Component.js";

export default class HitboxComponent extends Component {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public framesActive: number;
    public sourceId: number;
    public active: boolean;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        framesActive: number,
        sourceId: number,
        active: boolean = true
    ) {
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
