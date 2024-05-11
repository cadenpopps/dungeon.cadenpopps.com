import { Component, CType } from "../Component.js";
export default class HealthComponent extends Component {
    maxHealth;
    currentHealth;
    invincibleCounter;
    constructor(maxHealth) {
        super(CType.Health);
        this.maxHealth = maxHealth;
        this.currentHealth = this.maxHealth;
        this.invincibleCounter = 0;
    }
}
//# sourceMappingURL=HealthComponent.js.map