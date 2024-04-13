import { Component, CType } from "../Component.js";
import HitboxComponent from "./HitboxComponent.js";
export default class AbilityComponent extends Component {
    primary;
    secondary;
    ultimate;
    constructor(primary = new None(), secondary = new None(), ultimate = new None()) {
        super(CType.Ability);
        this.primary = primary;
        this.secondary = secondary;
        this.ultimate = ultimate;
    }
}
export var AbilityType;
(function (AbilityType) {
    AbilityType[AbilityType["None"] = 0] = "None";
    AbilityType[AbilityType["SpinAttack"] = 1] = "SpinAttack";
    AbilityType[AbilityType["SlashAttack"] = 2] = "SlashAttack";
})(AbilityType || (AbilityType = {}));
export class None {
    type;
    frames;
    duration;
    currentTick;
    cooldownLength;
    cooldown;
    constructor() {
        this.type = AbilityType.SpinAttack;
        this.frames = new Array();
        this.duration = 0;
        this.currentTick = 0;
        this.cooldownLength = 0;
        this.cooldown = 0;
    }
}
export class SpinAttack {
    type;
    frames;
    duration;
    currentTick;
    cooldownLength;
    cooldown;
    constructor(cooldownLength) {
        this.type = AbilityType.SpinAttack;
        this.frames = [
            new HitboxComponent(0, 0, 0, 0, 3, 0, false),
            new HitboxComponent(0, -1, 1, 1, 3, 0, true),
            new HitboxComponent(1, -1, 1, 1, 3, 0, true),
            new HitboxComponent(1, 0, 1, 1, 3, 0, true),
            new HitboxComponent(1, 1, 1, 1, 3, 0, true),
            new HitboxComponent(0, 1, 1, 1, 3, 0, true),
            new HitboxComponent(-1, 1, 1, 1, 3, 0, true),
            new HitboxComponent(-1, 0, 1, 1, 3, 0, true),
            new HitboxComponent(-1, -1, 1, 1, 3, 0, true),
            new HitboxComponent(0, -1, 1, 1, 3, 0, true),
            new HitboxComponent(0, 0, 0, 0, 3, 0, false),
        ];
        this.duration = this.frames.length - 1;
        this.currentTick = 0;
        this.cooldownLength = cooldownLength;
        this.cooldown = 0;
    }
}
export class SlashAttack {
    type;
    frames;
    duration;
    currentTick;
    cooldownLength;
    cooldown;
    constructor(cooldownLength) {
        this.type = AbilityType.SlashAttack;
        this.frames = [
            new HitboxComponent(0, 0, 0, 0, 3, 0, false),
            new HitboxComponent(0, -1, 1, 1, 3, 0, true),
            new HitboxComponent(0, -1, 1, 1, 3, 0, true),
            new HitboxComponent(0, -1, 1, 1, 3, 0, true),
            new HitboxComponent(0, -1, 1, 1, 3, 0, true),
            new HitboxComponent(0, -1, 1, 1, 3, 0, true),
            new HitboxComponent(0, 0, 0, 0, 3, 0, false),
        ];
        this.duration = this.frames.length - 1;
        this.currentTick = 0;
        this.cooldownLength = cooldownLength;
        this.cooldown = 0;
    }
}
//# sourceMappingURL=AbilityComponent.js.map