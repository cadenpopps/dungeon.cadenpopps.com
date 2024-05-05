import { Component, CType } from "../Component.js";

export default class EnemySpawnerComponent extends Component {
    public pack: boolean;
    public boss: boolean;

    constructor(pack: boolean = false, boss: boolean = true) {
        super(CType.EnemySpawner);
        this.pack = pack;
        this.boss = boss;
    }
}
