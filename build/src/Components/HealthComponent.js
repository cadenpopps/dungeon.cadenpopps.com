import { Component, CType } from "../Component.js";
export default class HealthComponent extends Component {
    maxHealth;
    currentHealth;
    constructor(maxHealth) {
        super(CType.Health);
        this.maxHealth = maxHealth;
        this.currentHealth = this.maxHealth;
    }
}
//# sourceMappingURL=HealthComponent.js.map