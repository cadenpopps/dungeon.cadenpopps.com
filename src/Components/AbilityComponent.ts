import { Component, CType } from "../Component.js";
import HitboxComponent from "./HitboxComponent.js";

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

export enum AbilityType {
    None,
    SpinAttack,
    SlashAttack,
}

export interface Ability {
    type: AbilityType;
    frames: Array<HitboxComponent>;
    cooldownLength: number;
    cooldown: number;
    duration: number;
    currentTick: number;
}

export class None implements Ability {
    public type: number;
    public frames: Array<HitboxComponent>;
    public duration: number;
    public currentTick: number;
    public cooldownLength: number;
    public cooldown: number;

    constructor() {
        this.type = AbilityType.SpinAttack;
        this.frames = new Array<HitboxComponent>();
        this.duration = 0;
        this.currentTick = 0;
        this.cooldownLength = 0;
        this.cooldown = 0;
    }
}

export class SpinAttack implements Ability {
    public type: number;
    public frames: Array<HitboxComponent>;
    public duration: number;
    public currentTick: number;
    public cooldownLength: number;
    public cooldown: number;

    constructor(cooldownLength: number) {
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

export class SlashAttack implements Ability {
    public type: number;
    public frames: Array<HitboxComponent>;
    public duration: number;
    public currentTick: number;
    public cooldownLength: number;
    public cooldown: number;

    constructor(cooldownLength: number) {
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
