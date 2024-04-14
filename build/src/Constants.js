import { abs, floor, max, randomInt, round } from "../lib/PoppsMath.js";
import { CType } from "./Component.js";
import CollisionComponent from "./Components/CollisionComponent.js";
import InteractableComponent, { Interactable } from "./Components/InteractableComponent.js";
import LevelChangeComponent from "./Components/LevelChangeComponent.js";
import LightSourceComponent from "./Components/LightSourceComponent.js";
import PositionComponent from "./Components/PositionComponent.js";
import SizeComponent from "./Components/SizeComponent.js";
import TileComponent, { Tile } from "./Components/TileComponent.js";
import UIComponent, { UIInteractablePrompt } from "./Components/UIComponent.js";
import VisibleComponent from "./Components/VisibleComponent.js";
import LightSystem from "./Systems/LightSystem.js";
export const xxTransform = [1, 0, 0, -1, -1, 0, 0, 1];
export const xyTransform = [0, 1, -1, 0, 0, -1, 1, 0];
export const yxTransform = [0, 1, 1, 0, 0, -1, -1, 0];
export const yyTransform = [1, 0, 0, 1, -1, 0, 0, -1];
export const xxRotation = [0, 0.71, 0, -0.071, -1, -0.71, 0, 0.71];
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
        [CType.Visible, new VisibleComponent({ r: 180 + randomInt(20), g: 150 + randomInt(20), b: 70, a: 1 }, false)],
    ]);
}
export function newDungeonFloor(x, y) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.Floor, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [
            CType.Visible,
            new VisibleComponent({ r: 146 + randomInt(50), g: 127 + randomInt(5), b: 102 + randomInt(5), a: 1 }, false),
        ],
    ]);
}
export function newWall(x, y) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.Wall, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Collision, new CollisionComponent()],
        [
            CType.Visible,
            new VisibleComponent({ r: 0 + randomInt(4), g: 0 + randomInt(4), b: 25 + randomInt(4), a: 1 }, true),
        ],
    ]);
}
export function newDoor(x, y) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.Door, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Interactable, new InteractableComponent(Interactable.Door)],
        [CType.Visible, new VisibleComponent({ r: 102, g: 60, b: 41, a: 1 }, false)],
    ]);
}
export function newGrass(x, y) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.Grass, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Visible, new VisibleComponent({ r: 30 + randomInt(10), g: 92 + randomInt(25), b: 0, a: 1 }, false)],
    ]);
}
export function newPath(x, y) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.Path, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Visible, new VisibleComponent({ r: 140 + randomInt(20), g: 120 + randomInt(20), b: 50, a: 1 }, false)],
    ]);
}
export function newEntry(x, y, id) {
    return new Map([
        [CType.Tile, new TileComponent(Tile.StairUp, x, y)],
        [CType.Size, new SizeComponent(1)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.LevelChange, new LevelChangeComponent(id || 0)],
        [CType.Interactable, new InteractableComponent(Interactable.LevelChange)],
        [CType.Visible, new VisibleComponent({ r: 100, g: 200, b: 50, a: 1 }, false)],
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
        [CType.Visible, new VisibleComponent({ r: 200, g: 100, b: 50, a: 1 }, false)],
        [CType.UI, new UIComponent([new UIInteractablePrompt("to enter next level")])],
    ]);
}
export function newTorch(x, y) {
    return new Map([
        [CType.Size, new SizeComponent(0.2)],
        [CType.Visible, new VisibleComponent({ r: 200, g: 200, b: 0, a: 0.5 }, false, 2)],
        [CType.Position, new PositionComponent(x, y)],
        [CType.LightSource, new LightSourceComponent(LightSystem.LIGHT_MAX - 5)],
    ]);
}
//# sourceMappingURL=Constants.js.map