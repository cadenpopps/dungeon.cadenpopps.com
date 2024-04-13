import { Component, CType } from "../Component.js";

export default class HealthComponent extends Component {
    public maxHealth: number;
    public currentHealth: number;

    constructor(maxHealth: number) {
        super(CType.Health);
        this.maxHealth = maxHealth;
        this.currentHealth = this.maxHealth;
    }
}
