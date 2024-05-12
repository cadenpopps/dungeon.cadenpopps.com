import { Component, CType } from "../Component.js";
export default class AIComponent extends Component {
    behavior;
    noticedPlayer;
    waitTimer;
    hearingRange;
    constructor(hearingRange = 5) {
        super(CType.AI);
        this.behavior = Behavior.Wander;
        this.noticedPlayer = false;
        this.waitTimer = 0;
        this.hearingRange = hearingRange;
    }
}
export var Behavior;
(function (Behavior) {
    Behavior[Behavior["Stop"] = 0] = "Stop";
    Behavior[Behavior["Wander"] = 1] = "Wander";
    Behavior[Behavior["Walking"] = 2] = "Walking";
    Behavior[Behavior["MoveIntoCombatRange"] = 3] = "MoveIntoCombatRange";
    Behavior[Behavior["Attack"] = 4] = "Attack";
    Behavior[Behavior["Retreat"] = 5] = "Retreat";
    Behavior[Behavior["WindUp"] = 6] = "WindUp";
})(Behavior || (Behavior = {}));
export const BehaviorMap = new Map([
    [Behavior.Stop, "Stop"],
    [Behavior.Wander, "Wander"],
    [Behavior.Walking, "Walking"],
    [Behavior.MoveIntoCombatRange, "Move into range"],
    [Behavior.Attack, "Attack"],
    [Behavior.WindUp, "Wind Up"],
    [Behavior.Retreat, "Retreat"],
]);
//# sourceMappingURL=AIComponent.js.map