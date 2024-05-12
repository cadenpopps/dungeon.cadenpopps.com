import { loadImage } from "../../lib/PoppsLoad.js";
import { Component, CType } from "../Component.js";
import { Direction } from "./DirectionComponent.js";
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
    direction;
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
        this.direction = Direction.South;
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
    TextureMap[TextureMap["Stair"] = 5] = "Stair";
    TextureMap[TextureMap["Skeleton"] = 6] = "Skeleton";
})(TextureMap || (TextureMap = {}));
export const TextureMaps = new Map([
    [TextureMap.Grass, loadImage(`/assets/img/textureMaps/Grass.png`)],
    [TextureMap.Path, loadImage(`/assets/img/textureMaps/Path.png`)],
    [TextureMap.Wall, loadImage(`/assets/img/textureMaps/Wall.png`)],
    [TextureMap.Door, loadImage(`/assets/img/textureMaps/Door.png`)],
    [TextureMap.DungeonFloor, loadImage(`/assets/img/textureMaps/DungeonFloor.png`)],
    [TextureMap.Stair, loadImage(`/assets/img/textureMaps/Stair.png`)],
    [TextureMap.Skeleton, loadImage(`/assets/img/sprites/Skeleton.png`)],
]);
export var TexturePosition;
(function (TexturePosition) {
    TexturePosition[TexturePosition["North"] = 0] = "North";
    TexturePosition[TexturePosition["NorthEast"] = 1] = "NorthEast";
    TexturePosition[TexturePosition["East"] = 2] = "East";
    TexturePosition[TexturePosition["SouthEast"] = 3] = "SouthEast";
    TexturePosition[TexturePosition["South"] = 4] = "South";
    TexturePosition[TexturePosition["SouthWest"] = 5] = "SouthWest";
    TexturePosition[TexturePosition["West"] = 6] = "West";
    TexturePosition[TexturePosition["NorthWest"] = 7] = "NorthWest";
    TexturePosition[TexturePosition["Top"] = 8] = "Top";
    TexturePosition[TexturePosition["TopRightInner"] = 9] = "TopRightInner";
    TexturePosition[TexturePosition["TopRightOuter"] = 10] = "TopRightOuter";
    TexturePosition[TexturePosition["TopRightBoth"] = 11] = "TopRightBoth";
    TexturePosition[TexturePosition["Right"] = 12] = "Right";
    TexturePosition[TexturePosition["BottomRightInner"] = 13] = "BottomRightInner";
    TexturePosition[TexturePosition["BottomRightOuter"] = 14] = "BottomRightOuter";
    TexturePosition[TexturePosition["BottomRightBoth"] = 15] = "BottomRightBoth";
    TexturePosition[TexturePosition["Bottom"] = 16] = "Bottom";
    TexturePosition[TexturePosition["BottomLeftInner"] = 17] = "BottomLeftInner";
    TexturePosition[TexturePosition["BottomLeftOuter"] = 18] = "BottomLeftOuter";
    TexturePosition[TexturePosition["BottomLeftBoth"] = 19] = "BottomLeftBoth";
    TexturePosition[TexturePosition["Left"] = 20] = "Left";
    TexturePosition[TexturePosition["TopLeftInner"] = 21] = "TopLeftInner";
    TexturePosition[TexturePosition["TopLeftOuter"] = 22] = "TopLeftOuter";
    TexturePosition[TexturePosition["TopLeftBoth"] = 23] = "TopLeftBoth";
    TexturePosition[TexturePosition["TopUNone"] = 24] = "TopUNone";
    TexturePosition[TexturePosition["TopUBoth"] = 25] = "TopUBoth";
    TexturePosition[TexturePosition["TopULeft"] = 26] = "TopULeft";
    TexturePosition[TexturePosition["TopURight"] = 27] = "TopURight";
    TexturePosition[TexturePosition["RightU"] = 28] = "RightU";
    TexturePosition[TexturePosition["BottomUNone"] = 29] = "BottomUNone";
    TexturePosition[TexturePosition["BottomUBoth"] = 30] = "BottomUBoth";
    TexturePosition[TexturePosition["BottomULeft"] = 31] = "BottomULeft";
    TexturePosition[TexturePosition["BottomURight"] = 32] = "BottomURight";
    TexturePosition[TexturePosition["LeftU"] = 33] = "LeftU";
    TexturePosition[TexturePosition["TopT"] = 34] = "TopT";
    TexturePosition[TexturePosition["RightT"] = 35] = "RightT";
    TexturePosition[TexturePosition["BottomT"] = 36] = "BottomT";
    TexturePosition[TexturePosition["LeftT"] = 37] = "LeftT";
    TexturePosition[TexturePosition["All"] = 38] = "All";
})(TexturePosition || (TexturePosition = {}));
export const TextureDirectionMap = new Map([
    [Direction.North, TexturePosition.North],
    [Direction.NorthEast, TexturePosition.NorthEast],
    [Direction.East, TexturePosition.East],
    [Direction.SouthEast, TexturePosition.SouthEast],
    [Direction.South, TexturePosition.South],
    [Direction.SouthWest, TexturePosition.SouthWest],
    [Direction.West, TexturePosition.West],
    [Direction.NorthWest, TexturePosition.NorthWest],
]);
export const TexturePositionMap = new Map([
    [TexturePosition.North, new PositionComponent(3, 0)],
    [TexturePosition.NorthEast, new PositionComponent(2, 1)],
    [TexturePosition.East, new PositionComponent(2, 0)],
    [TexturePosition.SouthEast, new PositionComponent(2, 0)],
    [TexturePosition.South, new PositionComponent(0, 0)],
    [TexturePosition.SouthWest, new PositionComponent(1, 0)],
    [TexturePosition.West, new PositionComponent(1, 0)],
    [TexturePosition.NorthWest, new PositionComponent(1, 1)],
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