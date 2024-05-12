import { Component, CType } from "../Component.js";

export default class AIComponent extends Component {
    public behavior: Behavior;
    public noticedPlayer: boolean;
    public waitTimer: number;
    public hearingRange: number;

    constructor(hearingRange: number = 5) {
        super(CType.AI);
        this.behavior = Behavior.Wander;
        this.noticedPlayer = false;
        this.waitTimer = 0;
        this.hearingRange = hearingRange;
    }
}

export enum Behavior {
    Stop,
    Wander,
    Walking,
    MoveIntoCombatRange,
    Attack,
    Retreat,
    WindUp,
}

export const BehaviorMap: Map<Behavior, string> = new Map<Behavior, string>([
    [Behavior.Stop, "Stop"],
    [Behavior.Wander, "Wander"],
    [Behavior.Walking, "Walking"],
    [Behavior.MoveIntoCombatRange, "Move into range"],
    [Behavior.Attack, "Attack"],
    [Behavior.WindUp, "Wind Up"],
    [Behavior.Retreat, "Retreat"],
]);
