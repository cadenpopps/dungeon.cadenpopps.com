import { Component, CType } from "../Component.js";

export default class HealthComponent extends Component {
    public maxHealth: number;
    public currentHealth: number;
    public alive: boolean;
    public invincibleCounter: number;

    constructor(maxHealth: number, alive: boolean = true) {
        super(CType.Health);
        this.maxHealth = maxHealth;
        this.currentHealth = this.maxHealth;
        this.alive = alive;
        this.invincibleCounter = 0;
    }
}
