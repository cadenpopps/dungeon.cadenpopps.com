import { CType, Component } from "../Component.js";
export default class ExperienceComponent extends Component {
    level;
    levelUpExp;
    currentExp;
    constructor(level = 1) {
        super(CType.Experience);
        this.level = level;
        this.levelUpExp = level * 10;
        this.currentExp = 0;
    }
}
//# sourceMappingURL=ExperienceComponent.js.map