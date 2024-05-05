import { CType, Component } from "../Component.js";

export default class TileComponent extends Component {
    public tileType: Tile;
    public x: number;
    public y: number;

    constructor(tileType: Tile, x: number, y: number) {
        super(CType.Tile);
        this.tileType = tileType;
        this.x = x;
        this.y = y;
    }
}

export enum Tile {
    Floor,
    Wall,
    Door,
    Path,
    Grass,
    StairDown,
    StairUp,
    None,
    EnemySpawner,
    PackSpawner,
    BossSpawner,
    LootSpawn,
}
