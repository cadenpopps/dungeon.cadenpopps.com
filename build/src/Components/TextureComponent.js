import { loadImage } from "../../lib/PoppsLoad.js";
import { Component, CType } from "../Component.js";
import PositionComponent from "./PositionComponent.js";
export default class TextureComponent extends Component {
    textures;
    constructor(textures) {
        super(CType.Texture);
        this.textures = textures;
    }
}
export class Texture {
    textureMap;
    pixelWidth;
    pixelHeight;
    x;
    y;
    mapX;
    mapY;
    tint;
    constructor(textureMap, pixelWidth = 16, pixelHeight = 16, x = 0, y = 0, mapX = 0, mapY = 0, tint) {
        if (textureMap === undefined) {
            this.textureMap = new HTMLImageElement();
        }
        else {
            this.textureMap = textureMap;
        }
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;
        this.x = x;
        this.y = y;
        this.mapX = mapX;
        this.mapY = mapY;
        if (tint) {
            this.tint = tint;
        }
    }
}
export var TextureMap;
(function (TextureMap) {
    TextureMap[TextureMap["Grass"] = 0] = "Grass";
    TextureMap[TextureMap["Path"] = 1] = "Path";
    TextureMap[TextureMap["Wall"] = 2] = "Wall";
    TextureMap[TextureMap["DungeonFloor"] = 3] = "DungeonFloor";
    TextureMap[TextureMap["Door"] = 4] = "Door";
})(TextureMap || (TextureMap = {}));
export const TextureMaps = new Map([
    [TextureMap.Grass, loadImage(`/assets/img/textureMaps/Grass.png`)],
    [TextureMap.Path, loadImage(`/assets/img/textureMaps/Path.png`)],
    [TextureMap.Wall, loadImage(`/assets/img/textureMaps/Wall.png`)],
    [TextureMap.Door, loadImage(`/assets/img/textureMaps/Door.png`)],
    [TextureMap.DungeonFloor, loadImage(`/assets/img/textureMaps/DungeonFloor.png`)],
]);
export var TexturePosition;
(function (TexturePosition) {
    TexturePosition[TexturePosition["Top"] = 0] = "Top";
    TexturePosition[TexturePosition["TopRightInner"] = 1] = "TopRightInner";
    TexturePosition[TexturePosition["TopRightOuter"] = 2] = "TopRightOuter";
    TexturePosition[TexturePosition["TopRightBoth"] = 3] = "TopRightBoth";
    TexturePosition[TexturePosition["Right"] = 4] = "Right";
    TexturePosition[TexturePosition["BottomRightInner"] = 5] = "BottomRightInner";
    TexturePosition[TexturePosition["BottomRightOuter"] = 6] = "BottomRightOuter";
    TexturePosition[TexturePosition["BottomRightBoth"] = 7] = "BottomRightBoth";
    TexturePosition[TexturePosition["Bottom"] = 8] = "Bottom";
    TexturePosition[TexturePosition["BottomLeftInner"] = 9] = "BottomLeftInner";
    TexturePosition[TexturePosition["BottomLeftOuter"] = 10] = "BottomLeftOuter";
    TexturePosition[TexturePosition["BottomLeftBoth"] = 11] = "BottomLeftBoth";
    TexturePosition[TexturePosition["Left"] = 12] = "Left";
    TexturePosition[TexturePosition["TopLeftInner"] = 13] = "TopLeftInner";
    TexturePosition[TexturePosition["TopLeftOuter"] = 14] = "TopLeftOuter";
    TexturePosition[TexturePosition["TopLeftBoth"] = 15] = "TopLeftBoth";
    TexturePosition[TexturePosition["TopUNone"] = 16] = "TopUNone";
    TexturePosition[TexturePosition["TopUBoth"] = 17] = "TopUBoth";
    TexturePosition[TexturePosition["TopULeft"] = 18] = "TopULeft";
    TexturePosition[TexturePosition["TopURight"] = 19] = "TopURight";
    TexturePosition[TexturePosition["RightU"] = 20] = "RightU";
    TexturePosition[TexturePosition["BottomUNone"] = 21] = "BottomUNone";
    TexturePosition[TexturePosition["BottomUBoth"] = 22] = "BottomUBoth";
    TexturePosition[TexturePosition["BottomULeft"] = 23] = "BottomULeft";
    TexturePosition[TexturePosition["BottomURight"] = 24] = "BottomURight";
    TexturePosition[TexturePosition["LeftU"] = 25] = "LeftU";
    TexturePosition[TexturePosition["TopT"] = 26] = "TopT";
    TexturePosition[TexturePosition["RightT"] = 27] = "RightT";
    TexturePosition[TexturePosition["BottomT"] = 28] = "BottomT";
    TexturePosition[TexturePosition["LeftT"] = 29] = "LeftT";
    TexturePosition[TexturePosition["All"] = 30] = "All";
})(TexturePosition || (TexturePosition = {}));
export const TexturePositionMap = new Map([
    [TexturePosition.Top, new PositionComponent(1, 0)],
    [TexturePosition.TopRightInner, new PositionComponent(2, 3)],
    [TexturePosition.TopRightOuter, new PositionComponent(2, 0)],
    [TexturePosition.TopRightBoth, new PositionComponent(5, 4)],
    [TexturePosition.Right, new PositionComponent(2, 1)],
    [TexturePosition.BottomRightInner, new PositionComponent(2, 5)],
    [TexturePosition.BottomRightOuter, new PositionComponent(2, 2)],
    [TexturePosition.BottomRightBoth, new PositionComponent(5, 5)],
    [TexturePosition.Bottom, new PositionComponent(1, 2)],
    [TexturePosition.BottomLeftInner, new PositionComponent(0, 5)],
    [TexturePosition.BottomLeftOuter, new PositionComponent(0, 2)],
    [TexturePosition.BottomLeftBoth, new PositionComponent(3, 5)],
    [TexturePosition.Left, new PositionComponent(0, 1)],
    [TexturePosition.TopLeftInner, new PositionComponent(0, 3)],
    [TexturePosition.TopLeftOuter, new PositionComponent(0, 0)],
    [TexturePosition.TopLeftBoth, new PositionComponent(3, 4)],
    [TexturePosition.TopUNone, new PositionComponent(3, 0)],
    [TexturePosition.TopULeft, new PositionComponent(3, 2)],
    [TexturePosition.TopUBoth, new PositionComponent(4, 2)],
    [TexturePosition.TopURight, new PositionComponent(5, 2)],
    [TexturePosition.BottomUNone, new PositionComponent(3, 1)],
    [TexturePosition.BottomULeft, new PositionComponent(3, 3)],
    [TexturePosition.BottomUBoth, new PositionComponent(4, 3)],
    [TexturePosition.BottomURight, new PositionComponent(5, 3)],
    [TexturePosition.TopT, new PositionComponent(4, 2)],
    [TexturePosition.RightT, new PositionComponent(4, 0)],
    [TexturePosition.BottomT, new PositionComponent(4, 3)],
    [TexturePosition.LeftT, new PositionComponent(4, 1)],
    [TexturePosition.All, new PositionComponent(1, 1)],
]);
//# sourceMappingURL=TextureComponent.js.map