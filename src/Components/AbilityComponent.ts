import { loadJSON } from "../../lib/PoppsLoad.js";
import { Component, CType } from "../Component.js";
import { HitboxData } from "./HitboxComponent.js";

export default class AbilityComponent extends Component {
    public primary: Ability;
    public secondary: Ability;
    public ultimate: Ability;

    constructor(primary: Ability = new None(), secondary: Ability = new None(), ultimate: Ability = new None()) {
        super(CType.Ability);
        this.primary = primary;
        this.secondary = secondary;
        this.ultimate = ultimate;
    }
}
export interface Ability {
    type: AbilityType;
    frames: Array<HitboxData | null>;
    cooldownLength: number;
    cooldown: number;
    duration: number;
    currentTick: number;
}

export enum AbilityType {
    None,
    LungeAttack,
    SpinAttack,
    SlashAttack,
}
export interface AbilityData {
    type: AbilityType;
    frames: Array<HitboxData | null>;
}

export class None implements Ability {
    public type: number;
    public frames: Array<HitboxData | null>;
    public duration: number;
    public currentTick: number;
    public cooldownLength: number;
    public cooldown: number;

    constructor() {
        this.type = AbilityType.None;
        this.frames = [];
        this.duration = -1;
        this.currentTick = -1;
        this.cooldownLength = -1;
        this.cooldown = -1;
    }
}

export class LungeAttack implements Ability {
    public type: AbilityType;
    public frames: Array<HitboxData | null>;
    public duration: number;
    public currentTick: number;
    public cooldownLength: number;
    public cooldown: number;

    constructor(cooldownLength: number) {
        this.type = AbilityType.SpinAttack;
        this.frames = (PlayerAbilityData.get(AbilityType.LungeAttack) as AbilityData).frames;
        this.duration = this.frames.length - 1;
        this.currentTick = -1;
        this.cooldownLength = cooldownLength;
        this.cooldown = 0;
    }
}

export class SpinAttack implements Ability {
    public type: AbilityType;
    public frames: Array<HitboxData | null>;
    public duration: number;
    public currentTick: number;
    public cooldownLength: number;
    public cooldown: number;

    constructor(cooldownLength: number) {
        this.type = AbilityType.SpinAttack;
        this.frames = (PlayerAbilityData.get(AbilityType.SpinAttack) as AbilityData).frames;
        this.duration = this.frames.length - 1;
        this.currentTick = -1;
        this.cooldownLength = cooldownLength;
        this.cooldown = 0;
    }
}

export class SlashAttack implements Ability {
    public type: AbilityType;
    public frames: Array<HitboxData | null>;
    public duration: number;
    public currentTick: number;
    public cooldownLength: number;
    public cooldown: number;

    constructor(cooldownLength: number) {
        this.type = AbilityType.SlashAttack;
        this.frames = (PlayerAbilityData.get(AbilityType.SlashAttack) as AbilityData).frames;
        this.duration = this.frames.length - 1;
        this.currentTick = -1;
        this.cooldownLength = cooldownLength;
        this.cooldown = 0;
    }
}

function convertAbilityData(AbilityData: any): Map<AbilityType, AbilityData> {
    const AbilityDataMap: Map<AbilityType, AbilityData> = new Map();
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
