import { Component, CType } from "../Component.js";
export default class HealthComponent extends Component {
    maxHealth;
    currentHealth;
    alive;
    invincibleCounter;
    deathFadeoutCounter;
    constructor(maxHealth, alive = true, deathFadeoutTime = 30) {
        super(CType.Health);
        this.maxHealth = maxHealth;
        this.currentHealth = this.maxHealth;
        this.alive = alive;
        this.invincibleCounter = 0;
        this.deathFadeoutCounter = deathFadeoutTime;
    }
}
//# sourceMappingURL=HealthComponent.js.map