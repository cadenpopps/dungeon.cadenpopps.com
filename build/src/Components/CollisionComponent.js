import { Component, CType } from "../Component.js";
export default class CollisionComponent extends Component {
    constructor(size) {
        super(CType.Collision);
        this.size = size || 1;
        this.collided = false;
    }
}
//# sourceMappingURL=CollisionComponent.js.map