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
}

export enum Direction {
    NORTH,
    NORTHEAST,
    EAST,
    SOUTHEAST,
    SOUTH,
    SOUTHWEST,
    WEST,
    NORTHWEST,
    NONE,
}

// function HealthComponent(initialHealth) {
//     this.maxHealth = initialHealth;
//     this.health = initialHealth;
// }

// function StrengthComponent(initialStrength) {
//     this.strength = initialStrength;
// }

// function IntelligenceComponent(initialIntelligence) {
//     this.intelligence = initialIntelligence;
// }

// function DexterityComponent(initialDexterity) {
//     this.dexterity = initialDexterity;
// }

// function CombatComponent(attackDamage, magicDamage, armor) {
//     this.attackDamage = attackDamage;
//     this.magicDamage = magicDamage;
//     this.armor = armor;
// }

// function DirectionComponent(direction) {
// }

// function PhysicalComponent(solid, size) {
//     this.solid = solid;
//     this.size = size;
// }

// function CollisionComponent(x, y, w, h) {
//     if (h === undefined) {
//         h = w;
//     }
//     this.top = y;
//     this.right = x + w;
//     this.bottom = y + h;
//     this.left = x;
//     this.width = w;
//     this.height = h;
// }

// function MovementComponent(speed) {
//     this.speed = speed;
// }

// function DisplayComponent(width, height, opaque, offsetX = 0, offsetY = 0) {
//     this.width = width;
//     this.height = height;
//     this.visible = false;
//     this.discovered = false;
//     this.discoveredCounter = 0;
//     this.opaque = opaque;
//     this.offsetX = offsetX;
//     this.offsetY = offsetY;
// }

// function AnimationComponent(animations) {
//     this.offsetX = 0;
//     this.offsetY = 0;
//     this.stage = 0;
//     this.sprite = undefined;
//     this.animation = animation_idle;
//     this.animations = animations;
// }

// function TextureComponent(type) {
//     this.textureType = type;
//     this.textureElements = [];
// }

// function TextureElementComponent(
//     element = texture_default,
//     xOff = 0,
//     yOff = 0
// ) {
//     this.element = element;
//     this.xOff = xOff;
//     this.yOff = yOff;
// }

// function LightComponent() {
//     this.level = 0;
// }

// function LightEmitterComponent(emitterLevel) {
//     this.level = emitterLevel;
// }

// function ActionsComponent(actions) {
//     this.busy = 0;
//     this.actions = [];
//     for (let a in actions) {
//         this.actions[a] = new ActionComponent(
//             actions[a].action,
//             actions[a].cooldown,
//             actions[a].time
//         );
//     }
//     this.nextAction = action_none;
//     this.currentAction = action_none;
//     this.lastAction = action_none;
//     this.lastActionFailed = false;
// }

// function ActionComponent(actionID, actionCooldown, actionTime) {
//     this.action = actionID;
//     this.cooldown = actionCooldown;
//     this.time = actionTime;
//     this.currentCooldown = 0;
// }

// function SprintComponent(movesBeforeSprinting, sprintSpeed) {
//     this.movesBeforeSprinting = movesBeforeSprinting;
//     this.lastMoveTime = 0;
//     this.sprintCounter = 0;
//     this.sprinting = false;
//     this.sprintSpeed = sprintSpeed;
// }

// function MapComponent(map) {
//     this.map = map;
// }

// function DepthComponent(depth) {
//     this.depth = depth;
// }

// function AIComponent(attackRange) {
//     this.attackRange = attackRange;
//     this.noticedPlayer = false;
//     this.idleTimer = 0;
// }

// function AbilitiesComponent(abilities) {
//     this.abilities = [];
//     for (let a of abilities) {
//         this.abilities.push(new AbilityComponent(a));
//     }
// }

// function AbilityComponent(ability) {
//     for (let prop in ability) {
//         this[prop] = ability[prop];
//     }
//     // this.name = ability.abilityName;
//     // this.type = ability.abilityType;
//     // this.cooldown = ability.cooldown;
//     // this.time = ability.time;
// }
