import { Component, CType } from "../Component.js";

export default class CollisionComponent extends Component {
    public size: number;
    public collided: boolean;
    public collisionHandler: CollisionHandler;

    constructor(collisionHandler?: CollisionHandler, size?: number) {
        super(CType.Collision);
        this.collisionHandler = collisionHandler || CollisionHandler.Stop;
        this.size = size || 1;
        this.collided = false;
    }
}

export enum CollisionHandler {
    Stop,
    Reflect,
    Explode,
}
