import { loadJSON } from "../../lib/PoppsLoad.js";
import { Component, CType } from "../Component.js";
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
    AbilityType[AbilityType["LungeAttack"] = 1] = "LungeAttack";
    AbilityType[AbilityType["SpinAttack"] = 2] = "SpinAttack";
    AbilityType[AbilityType["SlashAttack"] = 3] = "SlashAttack";
})(AbilityType || (AbilityType = {}));
export class None {
    type;
    frames;
    duration;
    currentTick;
    cooldownLength;
    cooldown;
    constructor() {
        this.type = AbilityType.None;
        this.frames = [];
        this.duration = -1;
        this.currentTick = -1;
        this.cooldownLength = -1;
        this.cooldown = -1;
    }
}
export class LungeAttack {
    type;
    frames;
    duration;
    currentTick;
    cooldownLength;
    cooldown;
    constructor(cooldownLength) {
        this.type = AbilityType.SpinAttack;
        this.frames = PlayerAbilityData.get(AbilityType.LungeAttack).frames;
        this.duration = this.frames.length - 1;
        this.currentTick = -1;
        this.cooldownLength = cooldownLength;
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
        this.frames = PlayerAbilityData.get(AbilityType.SpinAttack).frames;
        this.duration = this.frames.length - 1;
        this.currentTick = -1;
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
        this.frames = PlayerAbilityData.get(AbilityType.SlashAttack).frames;
        this.duration = this.frames.length - 1;
        this.currentTick = -1;
        this.cooldownLength = cooldownLength;
        this.cooldown = 0;
    }
}
function convertAbilityData(AbilityData) {
    const AbilityDataMap = new Map();
    for (const abilityName in AbilityData) {
        switch (abilityName) {
            case "LungeAttack":
                AbilityDataMap.set(AbilityType.LungeAttack, AbilityData[abilityName]);
                break;
            case "SpinAttack":
                AbilityDataMap.set(AbilityType.SpinAttack, AbilityData[abilityName]);
                break;
            case "SlashAttack":
                AbilityDataMap.set(AbilityType.SlashAttack, AbilityData[abilityName]);
                break;
        }
    }
    return AbilityDataMap;
}
const PlayerAbilityData = convertAbilityData(loadJSON("/content/abilities/PlayerAbilities.json"));
//# sourceMappingURL=AbilityComponent.js.map