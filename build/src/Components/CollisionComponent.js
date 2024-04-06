import { Component, CType } from "../Component.js";
export default class CollisionComponent extends Component {
    collided;
    collisionHandler;
    correctionForces;
    constructor(collisionHandler) {
        super(CType.Collision);
        this.collisionHandler = collisionHandler || CollisionHandler.Stop;
        this.collided = false;
        this.correctionForces = new Array();
    }
}
export var CollisionHandler;
(function (CollisionHandler) {
    CollisionHandler[CollisionHandler["Stop"] = 0] = "Stop";
    CollisionHandler[CollisionHandler["Reflect"] = 1] = "Reflect";
    CollisionHandler[CollisionHandler["Explode"] = 2] = "Explode";
})(CollisionHandler || (CollisionHandler = {}));
//# sourceMappingURL=CollisionComponent.js.map