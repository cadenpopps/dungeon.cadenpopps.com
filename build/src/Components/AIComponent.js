import { Component, CType } from "../Component.js";
export default class AIComponent extends Component {
    behavior;
    actionCountdown;
    actionCooldown;
    constructor() {
        super(CType.AI);
        this.behavior = Behavior.Wander;
        this.actionCountdown = 0;
        this.actionCooldown = 0;
    }
}
export var Behavior;
(function (Behavior) {
    Behavior[Behavior["None"] = 0] = "None";
    Behavior[Behavior["Wander"] = 1] = "Wander";
    Behavior[Behavior["MoveIntoCombatRange"] = 2] = "MoveIntoCombatRange";
})(Behavior || (Behavior = {}));
//# sourceMappingURL=AIComponent.js.map