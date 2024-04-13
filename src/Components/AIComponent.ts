import { Component, CType } from "../Component.js";

export default class AIComponent extends Component {
    public behavior: Behavior;
    public actionCountdown: number;
    public actionCooldown: number;

    constructor() {
        super(CType.AI);
        this.behavior = Behavior.Wander;
        this.actionCountdown = 0;
        this.actionCooldown = 0;
    }
}

export enum Behavior {
    None,
    Wander,
    MoveIntoCombatRange,
}
