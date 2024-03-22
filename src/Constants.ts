import { randomInt } from "../lib/PoppsMath.js";
import { CType, Component } from "./Component.js";
import CollisionComponent from "./Components/CollisionComponent.js";
import InteractableComponent, { Interactable } from "./Components/InteractableComponent.js";
import LevelChangeComponent from "./Components/LevelChangeComponent.js";
import PositionComponent from "./Components/PositionComponent.js";
import TileComponent from "./Components/TileComponent.js";
import VisibleComponent from "./Components/VisibleComponent.js";

export enum Tile {
    Floor,
    Wall,
    Door,
    Path,
    Grass,
    StairDown,
    StairUp,
}

export function newWall(x: number, y: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.Wall, x, y)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Collision, new CollisionComponent()],
        [CType.Visible, new VisibleComponent({ r: 33, g: 27, b: 20, a: 255 })],
    ]);
}

export function newGrass(x: number, y: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.Grass, x, y)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Visible, new VisibleComponent({ r: 30 + randomInt(10), g: 92 + randomInt(25), b: 0, a: 255 })],
    ]);
}

export function newPath(x: number, y: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.Path, x, y)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Visible, new VisibleComponent({ r: 140 + randomInt(20), g: 120 + randomInt(20), b: 50, a: 255 })],
    ]);
}

export function newDoor(x: number, y: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.Door, x, y)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Interactable, new InteractableComponent(Interactable.Door)],
        [CType.Visible, new VisibleComponent({ r: 102, g: 60, b: 41, a: 255 })],
    ]);
}

export function newDungeonFloor(x: number, y: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.Floor, x, y)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.Visible, new VisibleComponent({ r: 80, g: 100 + randomInt(10), b: 180 + randomInt(15), a: 255 })],
    ]);
}

export function newEntry(x: number, y: number, id?: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.StairUp, x, y)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.LevelChange, new LevelChangeComponent(id || 0)],
        [CType.Interactable, new InteractableComponent(Interactable.LevelChange)],
        [CType.Visible, new VisibleComponent({ r: 100, g: 200, b: 50, a: 255 })],
    ]);
}

export function newExit(x: number, y: number, id?: number): Map<CType, Component> {
    return new Map<CType, Component>([
        [CType.Tile, new TileComponent(Tile.StairDown, x, y)],
        [CType.Position, new PositionComponent(x, y, 0)],
        [CType.LevelChange, new LevelChangeComponent(id || 0)],
        [CType.Interactable, new InteractableComponent(Interactable.LevelChange)],
        [CType.Visible, new VisibleComponent({ r: 200, g: 100, b: 50, a: 255 })],
    ]);
}
