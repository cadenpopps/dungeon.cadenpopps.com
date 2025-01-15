import { Component, CType } from "../Component.js";
export default class HealthComponent extends Component {
    maxHealth;
    currentHealth;
    alive;
    invincibleCounter;
    constructor(maxHealth, alive = true) {
        super(CType.Health);
        this.maxHealth = maxHealth;
        this.currentHealth = this.maxHealth;
        this.alive = alive;
        this.invincibleCounter = 0;
    }
}
//# sourceMappingURL=HealthComponent.js.map