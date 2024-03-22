import { CType, Component } from "../Component.js";
export default class TileComponent extends Component {
    tileType;
    x;
    y;
    constructor(tileType, x, y) {
        super(CType.Tile);
        this.tileType = tileType;
        this.x = x || -1;
        this.y = y || -1;
    }
}
//# sourceMappingURL=TileComponent.js.map