import { Component, CType } from "../Component.js";

export default class HealthComponent extends Component {
    public maxHealth: number;
    public currentHealth: number;
    public alive: boolean;
    public invincibleCounter: number;
    public deathFadeoutCounter: number;

    constructor(maxHealth: number, alive: boolean = true, deathFadeoutTime: number = 30) {
        super(CType.Health);
        this.maxHealth = maxHealth;
        this.currentHealth = this.maxHealth;
        this.alive = alive;
        this.invincibleCounter = 0;
        this.deathFadeoutCounter = deathFadeoutTime;
    }
}
