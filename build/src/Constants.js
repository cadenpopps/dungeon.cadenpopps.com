import { abs, floor, max, randomInt, randomIntInRange, round } from "../lib/PoppsMath.js";
import { CType } from "./Component.js";
import CollisionComponent from "./Components/CollisionComponent.js";
import InteractableComponent, { Interactable } from "./Components/InteractableComponent.js";
import LevelChangeComponent from "./Components/LevelChangeComponent.js";
import LightSourceComponent from "./Components/LightSourceComponent.js";
import PositionComponent from "./Components/PositionComponent.js";
import SizeComponent from "./Components/SizeComponent.js";
import TextureComponent, { Texture, TextureMap, TextureMaps, TexturePositionMap, } from "./Components/TextureComponent.js";
import TileComponent, { Tile } from "./Components/TileComponent.js";
import UIComponent, { UIInteractablePrompt } from "./Components/UIComponent.js";
import VisibleComponent from "./Components/VisibleComponent.js";
import LightSystem from "./Systems/LightSystem.js";
export const xxTransform = [1, 0, 0, -1, -1, 0, 0, 1];
export const xyTransform = [0, 1, -1, 0, 0, -1, 1, 0];
export const yxTransform = [0, 1, 1, 0, 0, -1, -1, 0];
export const yyTransform = [1, 0, 0, 1, -1, 0, 0, -1];
export const xxRotation = [0, 0.71, 0, -0.71, -1, -0.71, 0, 0.71];
export const xyRotation = [0.71, 1, 0.71, 0, 0, -1, 1, 0];
export const yxRotation = [1, 0.71, 0, -1, -1, 0, 0, 1];
export const yyRotation = [1, 1, -1, 0, 0, -1, 1, 0];
export const LIGHT_LEVEL_FILL = new Array();
export const SHADOW_FILL = new Array();
for (let i = 0; i <= LightSystem.LIGHT_MAX; i++) {
    const light_level = LightSystem.LIGHT_MAX - i - 1;
    const shadow_level = i;
    LIGHT_LEVEL_FILL.push({
        r: floor(LightSystem.light_red - (LightSystem.light_red / (LightSystem.LIGHT_MAX - 1)) * light_level),
        g: floor(LightSystem.light_green - (LightSystem.light_green / (LightSystem.LIGHT_MAX - 1)) * light_level),
        b: floor(LightSystem.light_blue - (LightSystem.light_blue / (LightSystem.LIGHT_MAX - 1)) * light_level),
        a: round(100 *
            max(LightSystem.light_intensity -
                (LightSystem.light_intensity / (LightSystem.LIGHT_MAX - 1)) * light_level, LightSystem.light_intensity_min)) / 100,
    });
    if (shadow_level > LightSystem.shadow_stop) {
        SHADOW_FILL.push({ r: 0, g: 0, b: 0, a: 0 });
    }
    else {
        SHADOW_FILL.push({
            r: floor(LightSystem.shadow_red - (LightSystem.shadow_red / LightSystem.shadow_stop) * shadow_level),
            g: floor(LightSystem.shadow_green - (LightSystem.shadow_green / LightSystem.shadow_stop) * shadow_level),
            b: floor(LightSystem.shadow_blue - (LightSystem.shadow_blue / LightSystem.shadow_stop) * shadow_level),
            a: round(100 *
                (LightSystem.shadow_intensity -
                    (LightSystem.shadow_intensity / LightSystem.shadow_stop) * shadow_level)) / 100,
        });
    }
}
export function convertTile(value) {
    switch (value.tileType) {
        case Tile.Floor:
            return newDungeonFloor(value.x, value.y);
        case Tile.Wall:
            return newWall(value.x, value.y);
        case Tile.Door:
            return newDoor(value.x, value.y);
        case Tile.Path:
            return newPath(value.x, value.y);
        case Tile.Grass:
            return newGrass(value.x, value.y);
        case Tile.StairUp:
            return newEntry(value.x, value.y);
        case Tile.StairDown:
            return newExit(value.x, value.y);
        case Tile.EnemySpawn:
            return newEnemySpawn(value.x, value.y);
    }
    return new Map();
}
export function getEntitiesInRange(centerPos, maxDistance, entities, entityManager) {
    const entitiesInRange = new Array();
    for (let entityId of entities) {
        const ePos = entityManager.get(entityId, CType.Position);
        if (abs(centerPos.x - ePos.x) < maxDistance && abs(centerPos.y - ePos.y) < maxDistance) {
            entitiesInRange.push(entityId);
        }
    }
    return entitiesInRange;
}
export function newEnemySpawn(x, y) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.EnemySpawn, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Visible, new VisibleComponent(false)],
    ]);
}
export function newDungeonFloor(x, y) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.Floor, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Visible, new VisibleComponent(false)],
    ]);
}
export function dungeonFloorTexture() {
    const pos = new PositionComponent(randomInt(4), 0);
    return new TextureComponent([
        new Texture(TextureMaps.get(TextureMap.DungeonFloor), 16, 16, 0, 0, 16 * pos.x, 16 * pos.y, {
            r: 186 + randomInt(50),
            g: 95 + randomInt(10),
            b: 90 + randomInt(25),
            a: 0.2,
        }),
    ]);
}
export function newWall(x, y) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.Wall, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Collision, new CollisionComponent()],
        [CType.Visible, new VisibleComponent(true)],
    ]);
}
export function wallTexture(texturePos) {
    const pos = TexturePositionMap.get(texturePos);
    return new TextureComponent([new Texture(TextureMaps.get(TextureMap.Wall), 16, 16, 0, 0, 16 * pos.x, 16 * pos.y)]);
}
export function wallTextures(texturePos) {
    const texArray = [];
    for (const tPos of texturePos) {
        const pos = TexturePositionMap.get(tPos);
        texArray.push(new Texture(TextureMaps.get(TextureMap.Wall), 16, 16, 0, 0, 16 * pos.x, 16 * pos.y));
    }
    return new TextureComponent(texArray);
}
export function newDoor(x, y) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.Door, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Interactable, new InteractableComponent(Interactable.Door)],
        [CType.Visible, new VisibleComponent(false)],
    ]);
}
export function doorTexture() {
    const pos = new PositionComponent(0, 1);
    return new TextureComponent([new Texture(TextureMaps.get(TextureMap.Door), 16, 16, 0, 0, 16 * pos.x, 16 * pos.y)]);
}
export function newGrass(x, y) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.Grass, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Visible, new VisibleComponent(false)],
    ]);
}
export function grassTexture() {
    const pos = new PositionComponent(randomInt(4), randomInt(4));
    return new TextureComponent([new Texture(TextureMaps.get(TextureMap.Grass), 16, 16, 0, 0, 16 * pos.x, 16 * pos.y)]);
}
export function newPath(x, y) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.Path, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Visible, new VisibleComponent(false)],
    ]);
}
export function pathTexture() {
    const pos = new PositionComponent(randomInt(4), 0);
    return new TextureComponent([new Texture(TextureMaps.get(TextureMap.Path), 16, 16, 0, 0, 16 * pos.x, 16 * pos.y)]);
}
export function newEntry(x, y, id) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.StairUp, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.LevelChange, new LevelChangeComponent(id || 0)],
        [CType.Interactable, new InteractableComponent(Interactable.LevelChange)],
        [CType.Visible, new VisibleComponent(false)],
        [CType.UI, new UIComponent([new UIInteractablePrompt("to enter previous level")])],
    ]);
}
export function newExit(x, y, id) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.StairDown, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.LevelChange, new LevelChangeComponent(id || 0)],
        [CType.Interactable, new InteractableComponent(Interactable.LevelChange)],
        [CType.Visible, new VisibleComponent(false)],
        [CType.UI, new UIComponent([new UIInteractablePrompt("to enter next level")])],
    ]);
}
export function newTorch(x, y) {
    return new Map([
        [CType.Size, new SizeComponent(0.2)],
        [CType.Visible, new VisibleComponent(false, 2)],
        [CType.Position, new PositionComponent(x, y)],
        [
            CType.LightSource,
            new LightSourceComponent(LightSystem.LIGHT_MAX - randomIntInRange(5, 7), randomIntInRange(180, 300), {
                r: randomInt(30),
                g: randomInt(30),
                b: randomInt(30),
                a: 0,
            }),
        ],
    ]);
}
//# sourceMappingURL=Constants.js.map