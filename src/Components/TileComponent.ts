import { CType, Component } from "../Component.js";
import { Tile } from "../Constants.js";

export default class TileComponent extends Component {
    public tileType: Tile;
    public x: number;
    public y: number;

    constructor(tileType: Tile, x?: number, y?: number) {
        super(CType.Tile);
        this.tileType = tileType;
        this.x = x || -1;
        this.y = y || -1;
    }
}
