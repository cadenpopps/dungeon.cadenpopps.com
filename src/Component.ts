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
