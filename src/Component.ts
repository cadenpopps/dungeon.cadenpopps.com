export class Component {
    public type: CType;

    constructor(type: CType) {
        this.type = type;
    }
}

export enum CType {
    Game,
    Controller,
    Position,
    Velocity,
    Collision,
    Visible,
    Movement,
    Camera,
    Level,
    LevelChange,
    Player,
    Interactable,
    Tile,
    LightSource,
    Acceleration,
    Size,
    AI,
    UI,
    Health,
    Ability,
    Hitbox,
    Texture,
    EnemySpawner,
    Experience,
    Direction,
}

export const CTypeMap = new Map<CType, String>([
    [CType.Game, "Game"],
    [CType.Controller, "Controller"],
    [CType.Position, "Position"],
    [CType.Velocity, "Velocity"],
    [CType.Collision, "Collision"],
    [CType.Visible, "Visible"],
    [CType.Movement, "Movement"],
    [CType.Camera, "Camera"],
    [CType.Level, "Level"],
    [CType.LevelChange, "LevelChange"],
    [CType.Player, "Player"],
    [CType.Interactable, "Interactable"],
    [CType.Tile, "Tile"],
    [CType.LightSource, "LightSource"],
    [CType.Acceleration, "Acceleration"],
    [CType.Size, "Size"],
    [CType.AI, "AI"],
    [CType.UI, "UI"],
    [CType.Health, "Health"],
    [CType.Ability, "Ability"],
    [CType.Hitbox, "Hitbox"],
    [CType.Texture, "Texture"],
    [CType.EnemySpawner, "EnemySpawner"],
    [CType.Experience, "Experience"],
    [CType.Direction, "Direction"],
]);
