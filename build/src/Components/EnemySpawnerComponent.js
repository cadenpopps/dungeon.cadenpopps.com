import { Component, CType } from "../Component.js";
export default class EnemySpawnerComponent extends Component {
    pack;
    boss;
    constructor(pack = false, boss = true) {
        super(CType.EnemySpawner);
        this.pack = pack;
        this.boss = boss;
    }
}
//# sourceMappingURL=EnemySpawnerComponent.js.map