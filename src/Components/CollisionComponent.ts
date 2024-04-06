import { Component, CType } from "../Component.js";

export default class CollisionComponent extends Component {
    public collided: boolean;
    public collisionHandler: CollisionHandler;
    public correctionForces: Array<Force>;

    constructor(collisionHandler?: CollisionHandler) {
        super(CType.Collision);
        this.collisionHandler = collisionHandler || CollisionHandler.Stop;
        this.collided = false;
        this.correctionForces = new Array<Force>();
    }
}
export interface Force {
    x: number;
    y: number;
}

export enum CollisionHandler {
    Stop,
    Reflect,
    Explode,
}
