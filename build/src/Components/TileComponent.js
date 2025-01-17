import { CType, Component } from "../Component.js";
export default class TileComponent extends Component {
    tileType;
    x;
    y;
    constructor(tileType, x, y) {
        super(CType.Tile);
        this.tileType = tileType;
        this.x = x;
        this.y = y;
    }
}
export var Tile;
(function (Tile) {
    Tile[Tile["Floor"] = 0] = "Floor";
    Tile[Tile["Wall"] = 1] = "Wall";
    Tile[Tile["Door"] = 2] = "Door";
    Tile[Tile["Path"] = 3] = "Path";
    Tile[Tile["Grass"] = 4] = "Grass";
    Tile[Tile["StairDown"] = 5] = "StairDown";
    Tile[Tile["StairUp"] = 6] = "StairUp";
    Tile[Tile["None"] = 7] = "None";
    Tile[Tile["EnemySpawner"] = 8] = "EnemySpawner";
    Tile[Tile["PackSpawner"] = 9] = "PackSpawner";
    Tile[Tile["BossSpawner"] = 10] = "BossSpawner";
    Tile[Tile["LootSpawn"] = 11] = "LootSpawn";
})(Tile || (Tile = {}));
//# sourceMappingURL=TileComponent.js.map