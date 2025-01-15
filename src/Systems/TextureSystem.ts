import { randomInt, round } from "../../lib/PoppsMath.js";
import { CType, Component } from "../Component.js";
import DirectionComponent from "../Components/DirectionComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import TextureComponent, {
    Texture,
    TextureDirectionMap,
    TextureMap,
    TextureMaps,
    TexturePosition,
    TexturePositionMap,
} from "../Components/TextureComponent.js";
import TileComponent, { Tile } from "../Components/TileComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class TextureSystem extends System {
    private tileEntityIds!: Array<number>;
    private directionalTextureIds!: Array<number>;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Texture, eventManager, entityManager, [CType.Texture]);
    }

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.level_loaded:
                this.setTextures();
                break;
        }
    }

    public logic(): void {
        if (this.directionalTextureIds === undefined) {
            return;
        }
        for (const entityId of this.directionalTextureIds) {
            const dir = this.entityManager.get<DirectionComponent>(entityId, CType.Direction);
            const textures = this.entityManager.get<TextureComponent>(entityId, CType.Texture);
            for (const texture of textures.textures) {
                if (dir.direction !== texture.direction) {
                    texture.direction = dir.direction;
                    const texturePos = TextureDirectionMap.get(texture.direction) as TexturePosition;
                    const textureMap = TexturePositionMap.get(texturePos) as PositionComponent;
                    texture.mapX = textureMap.x * texture.pixelWidth;
                    texture.mapY = textureMap.y * texture.pixelHeight;
                }
            }
        }
    }

    public getEntitiesHelper(): void {
        this.tileEntityIds = this.entityManager.getSystemEntities([CType.Tile]);
        this.directionalTextureIds = this.entityManager.getSystemEntities([CType.Direction, CType.Texture]);
    }

    private setTextures(): void {
        const tileMap = this.createTileMap();
        for (const entityId of this.tileEntityIds) {
            this.addTextures(entityId, tileMap);
        }
    }

    private createTileMap(): Map<number, Map<number, Map<CType, Component>>> {
        const map = new Map<number, Map<number, Map<CType, Component>>>();
        for (let entityId of this.tileEntityIds) {
            const entity = this.entityManager.getEntity(entityId);
            const pos = entity.get(CType.Position) as PositionComponent;
            const newX = round(pos.x);
            const newY = round(pos.y);
            if (!map.get(newX)) {
                map.set(newX, new Map<number, Map<CType, Component>>());
            }
            if (!map.get(newX)?.get(newY)) {
                map.get(newX)?.set(newY, new Map<CType, Component>());
            }
            map.get(newX)?.set(newY, entity);
        }
        return map;
    }

    private addTextures(entityId: number, tileMap: Map<number, Map<number, Map<CType, Component>>>): void {
        const entity = this.entityManager.getEntity(entityId);
        if (entity.has(CType.Tile)) {
            const tile = entity.get(CType.Tile) as TileComponent;
            switch (tile.tileType) {
                case Tile.Grass:
                    entity.set(CType.Texture, this.grassTexture());
                    break;
                case Tile.Wall:
                    const texturePos = this.getWallTexturePos(entity, tileMap);
                    entity.set(CType.Texture, this.wallTexture(texturePos));
                    break;
                case Tile.Path:
                    entity.set(CType.Texture, this.pathTexture());
                    break;
                case Tile.Door:
                    entity.set(CType.Texture, this.doorTexture());
                    break;
                case Tile.Floor:
                    entity.set(CType.Texture, this.dungeonFloorTexture());
                    break;
                case Tile.StairDown:
                    entity.set(CType.Texture, this.stairTexture(false));
                    break;
                case Tile.StairUp:
                    entity.set(CType.Texture, this.stairTexture(true));
                    break;
            }
        }
    }

    private getTileType(tile: Map<CType, Component> | undefined): Tile {
        if (tile !== undefined) {
            const type = (tile.get(CType.Tile) as TileComponent).tileType;
            if (type === Tile.Door) {
                return Tile.Wall;
            }
            return type;
        } else {
            return Tile.Wall;
        }
    }

    private getWallTexturePos(
        entity: Map<CType, Component>,
        map: Map<number, Map<number, Map<CType, Component>>>
    ): TexturePosition[] {
        const textures = [];
        const pos = entity.get(CType.Position) as PositionComponent;
        const top: Tile = this.getTileType(map.get(pos.x)?.get(pos.y - 1));
        const right: Tile = this.getTileType(map.get(pos.x + 1)?.get(pos.y));
        const bottom: Tile = this.getTileType(map.get(pos.x)?.get(pos.y + 1));
        const left: Tile = this.getTileType(map.get(pos.x - 1)?.get(pos.y));
        const topRight: Tile = this.getTileType(map.get(pos.x + 1)?.get(pos.y - 1));
        const topLeft: Tile = this.getTileType(map.get(pos.x - 1)?.get(pos.y - 1));
        const bottomRight: Tile = this.getTileType(map.get(pos.x + 1)?.get(pos.y + 1));
        const bottomLeft: Tile = this.getTileType(map.get(pos.x - 1)?.get(pos.y + 1));

        if (top === Tile.Wall && right == Tile.Wall && bottom === Tile.Wall && left === Tile.Wall) {
            textures.push(TexturePosition.All);
            if (
                topRight !== Tile.Wall &&
                bottomRight !== Tile.Wall &&
                topLeft !== Tile.Wall &&
                bottomLeft !== Tile.Wall
            ) {
                textures.push(TexturePosition.LeftT);
                textures.push(TexturePosition.RightT);
            } else if (topRight !== Tile.Wall && bottomRight !== Tile.Wall && topLeft !== Tile.Wall) {
                textures.push(TexturePosition.BottomRightInner);
                textures.push(TexturePosition.RightT);
            } else if (topRight !== Tile.Wall && bottomRight !== Tile.Wall && bottomLeft !== Tile.Wall) {
                textures.push(TexturePosition.TopRightInner);
                textures.push(TexturePosition.RightT);
            } else if (topRight !== Tile.Wall && topLeft !== Tile.Wall && bottomLeft !== Tile.Wall) {
                textures.push(TexturePosition.BottomLeftInner);
                textures.push(TexturePosition.LeftT);
            } else if (bottomRight !== Tile.Wall && topLeft !== Tile.Wall && bottomLeft !== Tile.Wall) {
                textures.push(TexturePosition.TopLeftInner);
                textures.push(TexturePosition.LeftT);
            } else if (topLeft !== Tile.Wall && topRight !== Tile.Wall) {
                textures.push(TexturePosition.BottomRightInner);
                textures.push(TexturePosition.BottomLeftInner);
            } else if (bottomRight !== Tile.Wall && topRight !== Tile.Wall) {
                textures.push(TexturePosition.RightT);
            } else if (bottomLeft !== Tile.Wall && bottomRight !== Tile.Wall) {
                textures.push(TexturePosition.TopRightInner);
                textures.push(TexturePosition.TopLeftInner);
            } else if (topLeft !== Tile.Wall && bottomLeft !== Tile.Wall) {
                textures.push(TexturePosition.LeftT);
            } else if (topLeft !== Tile.Wall && bottomRight !== Tile.Wall) {
                textures.push(TexturePosition.BottomRightInner);
                textures.push(TexturePosition.TopLeftInner);
            } else if (topRight !== Tile.Wall && bottomLeft !== Tile.Wall) {
                textures.push(TexturePosition.BottomLeftInner);
                textures.push(TexturePosition.TopRightInner);
            } else if (topLeft !== Tile.Wall) {
                textures.push(TexturePosition.BottomRightInner);
            } else if (bottomLeft !== Tile.Wall) {
                textures.push(TexturePosition.TopRightInner);
            } else if (topRight !== Tile.Wall) {
                textures.push(TexturePosition.BottomLeftInner);
            } else if (bottomRight !== Tile.Wall) {
                textures.push(TexturePosition.TopLeftInner);
            }
        } else if (top === Tile.Wall && bottom === Tile.Wall && right === Tile.Wall) {
            if (left !== Tile.Wall) {
                textures.push(TexturePosition.Left);
            }
            if (topRight !== Tile.Wall && bottomRight !== Tile.Wall) {
                textures.push(TexturePosition.RightT);
            } else if (topRight !== Tile.Wall) {
                textures.push(TexturePosition.BottomLeftInner);
            } else if (bottomRight !== Tile.Wall) {
                textures.push(TexturePosition.TopLeftInner);
            }
        } else if (top === Tile.Wall && bottom === Tile.Wall && left === Tile.Wall) {
            if (right !== Tile.Wall) {
                textures.push(TexturePosition.Right);
            }
            if (topLeft !== Tile.Wall && bottomLeft !== Tile.Wall) {
                textures.push(TexturePosition.LeftT);
            } else if (topLeft !== Tile.Wall) {
                textures.push(TexturePosition.BottomRightInner);
            } else if (bottomLeft !== Tile.Wall) {
                textures.push(TexturePosition.TopRightInner);
            }
        } else if (right === Tile.Wall && left === Tile.Wall && bottom === Tile.Wall) {
            if (top !== Tile.Wall) {
                if (bottomRight !== Tile.Wall && bottomLeft !== Tile.Wall) {
                    textures.push(TexturePosition.TopUBoth);
                } else if (bottomRight !== Tile.Wall) {
                    textures.push(TexturePosition.TopULeft);
                } else if (bottomLeft !== Tile.Wall) {
                    textures.push(TexturePosition.TopURight);
                } else {
                    textures.push(TexturePosition.Top);
                }
            } else {
                if (bottomRight !== Tile.Wall && bottomLeft !== Tile.Wall) {
                    textures.push(TexturePosition.TopUBoth);
                } else if (bottomRight !== Tile.Wall) {
                    textures.push(TexturePosition.TopLeftInner);
                } else if (bottomLeft !== Tile.Wall) {
                    textures.push(TexturePosition.TopRightInner);
                }
            }
        } else if (right === Tile.Wall && left === Tile.Wall && top === Tile.Wall) {
            if (bottom !== Tile.Wall) {
                if (topRight !== Tile.Wall && topLeft !== Tile.Wall) {
                    textures.push(TexturePosition.BottomUBoth);
                } else if (topRight !== Tile.Wall) {
                    textures.push(TexturePosition.BottomULeft);
                } else if (topLeft !== Tile.Wall) {
                    textures.push(TexturePosition.BottomURight);
                } else {
                    textures.push(TexturePosition.Bottom);
                }
            } else {
                if (topRight !== Tile.Wall && topLeft !== Tile.Wall) {
                    textures.push(TexturePosition.BottomUBoth);
                } else if (topRight !== Tile.Wall) {
                    textures.push(TexturePosition.BottomLeftInner);
                } else if (topLeft !== Tile.Wall) {
                    textures.push(TexturePosition.BottomRightInner);
                }
            }
        } else if (top === Tile.Wall && bottom === Tile.Wall) {
            textures.push(TexturePosition.Right);
            textures.push(TexturePosition.Left);
        } else if (right === Tile.Wall && left === Tile.Wall) {
            textures.push(TexturePosition.Top);
            textures.push(TexturePosition.Bottom);
        } else if (top === Tile.Wall && left === Tile.Wall) {
            if (topLeft === Tile.Wall) {
                textures.push(TexturePosition.BottomRightOuter);
            } else if (bottomRight === Tile.Wall) {
                textures.push(TexturePosition.BottomRightInner);
            } else {
                textures.push(TexturePosition.BottomRightBoth);
            }
        } else if (left === Tile.Wall && bottom === Tile.Wall) {
            if (bottomLeft === Tile.Wall) {
                textures.push(TexturePosition.TopRightOuter);
            } else if (topRight === Tile.Wall) {
                textures.push(TexturePosition.TopRightInner);
            } else {
                textures.push(TexturePosition.TopRightBoth);
            }
        } else if (bottom === Tile.Wall && right === Tile.Wall) {
            if (bottomRight === Tile.Wall) {
                textures.push(TexturePosition.TopLeftOuter);
            } else if (topLeft === Tile.Wall) {
                textures.push(TexturePosition.TopLeftInner);
            } else {
                textures.push(TexturePosition.TopLeftBoth);
            }
        } else if (right === Tile.Wall && top === Tile.Wall) {
            if (topRight === Tile.Wall) {
                textures.push(TexturePosition.BottomLeftOuter);
            } else if (bottomLeft === Tile.Wall) {
                textures.push(TexturePosition.BottomLeftInner);
            } else {
                textures.push(TexturePosition.BottomLeftBoth);
            }
        } else if (top === Tile.Wall) {
            textures.push(TexturePosition.BottomUNone);
        } else if (right === Tile.Wall) {
            textures.push(TexturePosition.Top);
        } else if (bottom === Tile.Wall) {
            textures.push(TexturePosition.TopUNone);
        } else if (left === Tile.Wall) {
            textures.push(TexturePosition.Top);
        }

        return textures;
    }

    private wallTexture(texturePos: TexturePosition[]): TextureComponent {
        const texArray = [];
        for (const tPos of texturePos) {
            const pos = TexturePositionMap.get(tPos) as PositionComponent;
            texArray.push(new Texture(TextureMaps.get(TextureMap.Wall), 16, 16, 0, 0, 16 * pos.x, 16 * pos.y));
        }
        return new TextureComponent(texArray);
    }

    private dungeonFloorTexture(): TextureComponent {
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

    private doorTexture(): TextureComponent {
        const pos = new PositionComponent(0, 1);
        return new TextureComponent([
            new Texture(TextureMaps.get(TextureMap.Door), 16, 16, 0, 0, 16 * pos.x, 16 * pos.y),
        ]);
    }

    private grassTexture(): TextureComponent {
        const pos = new PositionComponent(randomInt(4), randomInt(4));
        return new TextureComponent([
            new Texture(TextureMaps.get(TextureMap.Grass), 16, 16, 0, 0, 16 * pos.x, 16 * pos.y),
        ]);
    }

    private pathTexture(): TextureComponent {
        const pos = new PositionComponent(randomInt(4), 0);
        return new TextureComponent([
            new Texture(TextureMaps.get(TextureMap.Path), 16, 16, 0, 0, 16 * pos.x, 16 * pos.y),
        ]);
    }

    private stairTexture(up: boolean): TextureComponent {
        if (up) {
            return new TextureComponent([
                new Texture(TextureMaps.get(TextureMap.DungeonFloor), 16, 16, 0, 0, 0, 0, {
                    r: 186 + randomInt(50),
                    g: 95 + randomInt(10),
                    b: 90 + randomInt(25),
                    a: 0.2,
                }),
                new Texture(TextureMaps.get(TextureMap.Stair), 16, 16, 0, 0, 16, 0),
            ]);
        } else {
            return new TextureComponent([new Texture(TextureMaps.get(TextureMap.Stair), 16, 16, 0, 0, 0, 0)]);
        }
    }
}
