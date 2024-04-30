import { loadImage } from "../../lib/PoppsLoad.js";
import { Component, CType } from "../Component.js";
import { Color } from "../Constants.js";
import PositionComponent from "./PositionComponent.js";

export default class TextureComponent extends Component {
    public textures: Array<Texture>;

    constructor(textures: Array<Texture>) {
        super(CType.Texture);
        this.textures = textures;
    }
}

export class Texture {
    public textureMap: HTMLImageElement;
    public pixelWidth: number;
    public pixelHeight: number;
    public x: number;
    public y: number;
    public mapX: number;
    public mapY: number;
    public tint!: Color;

    constructor(
        textureMap: HTMLImageElement | undefined,
        pixelWidth: number = 16,
        pixelHeight: number = 16,
        x: number = 0,
        y: number = 0,
        mapX: number = 0,
        mapY: number = 0,
        tint?: Color
    ) {
        if (textureMap === undefined) {
            this.textureMap = new HTMLImageElement();
        } else {
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

export enum TextureMap {
    Grass,
    Path,
    Wall,
    DungeonFloor,
    Door,
}

export const TextureMaps: Map<TextureMap, HTMLImageElement> = new Map<TextureMap, HTMLImageElement>([
    [TextureMap.Grass, loadImage(`/assets/img/textureMaps/Grass.png`)],
    [TextureMap.Path, loadImage(`/assets/img/textureMaps/Path.png`)],
    [TextureMap.Wall, loadImage(`/assets/img/textureMaps/Wall.png`)],
    [TextureMap.Door, loadImage(`/assets/img/textureMaps/Door.png`)],
    [TextureMap.DungeonFloor, loadImage(`/assets/img/textureMaps/DungeonFloor.png`)],
]);

export enum TexturePosition {
    Top,
    TopRightInner,
    TopRightOuter,
    TopRightBoth,
    Right,
    BottomRightInner,
    BottomRightOuter,
    BottomRightBoth,
    Bottom,
    BottomLeftInner,
    BottomLeftOuter,
    BottomLeftBoth,
    Left,
    TopLeftInner,
    TopLeftOuter,
    TopLeftBoth,
    TopUNone,
    TopUBoth,
    TopULeft,
    TopURight,
    RightU,
    BottomUNone,
    BottomUBoth,
    BottomULeft,
    BottomURight,
    LeftU,
    TopT,
    RightT,
    BottomT,
    LeftT,
    All,
}

export const TexturePositionMap: Map<TexturePosition, PositionComponent> = new Map<TexturePosition, PositionComponent>([
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
