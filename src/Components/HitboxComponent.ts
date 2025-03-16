import { Component, CType } from "../Component.js";
import PositionComponent from "./PositionComponent.js";

export default class HitboxComponent extends Component {
    public shape: HitboxShape;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public rotation: number;
    public duration: number;
    public sourceEntityId: number;
    public damage: number;
    public vertices: Array<PositionComponent>;

    constructor(
        shape: HitboxShape,
        x: number,
        y: number,
        width: number,
        height: number,
        rotation: number,
        duration: number,
        sourceEntityId: number,
        damage: number
    ) {
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
        this.vertices = new Array<PositionComponent>();
    }
}

export enum HitboxShape {
    Rectangle,
    Circle,
    SemiCircle,
    QuarterCircle,
}

export interface HitboxData {
    shape: HitboxShape;
    damage: number;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    duration: number;
}
