import { Component, CType } from "../Component.js";

export default class CollisionComponent extends Component {
    public size: number;
    public collided: boolean;

    constructor(size?: number) {
        super(CType.Collision);
        this.size = size || 1;
        this.collided = false;
    }
}
