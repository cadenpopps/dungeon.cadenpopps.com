import { Component, CType } from "../Component.js";
export default class CollisionComponent extends Component {
    size;
    collided;
    collisionHandler;
    constructor(collisionHandler, size) {
        super(CType.Collision);
        this.collisionHandler = collisionHandler || CollisionHandler.Stop;
        this.size = size || 1;
        this.collided = false;
    }
}
export var CollisionHandler;
(function (CollisionHandler) {
    CollisionHandler[CollisionHandler["Stop"] = 0] = "Stop";
    CollisionHandler[CollisionHandler["Reflect"] = 1] = "Reflect";
    CollisionHandler[CollisionHandler["Explode"] = 2] = "Explode";
})(CollisionHandler || (CollisionHandler = {}));
//# sourceMappingURL=CollisionComponent.js.map