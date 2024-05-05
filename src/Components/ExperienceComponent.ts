import { CType, Component } from "../Component.js";

export default class ExperienceComponent extends Component {
    public level: number;
    public levelUpExp: number;
    public currentExp: number;

    constructor(level: number = 1) {
        super(CType.Experience);
        this.level = level;
        this.levelUpExp = level * 10;
        this.currentExp = 0;
    }
}
