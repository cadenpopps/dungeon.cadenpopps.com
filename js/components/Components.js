function PositionComponent(x, y) {
	this.x = x;
	this.y = y;
}

function HealthComponent(initialHealth) {
	this.maxHealth = initialHealth;
	this.currentHealth = initialHealth;
}

function StrengthComponent(initialStrength) {
	this.strength = initialStrength;
}

function IntelligenceComponent(initialIntelligence) {
	this.intelligence = initialIntelligence;
}

function DexterityComponent(initialDexterity) {
	this.dexterity = initialDexterity;
}

function CombatComponent(attackDamage, magicDamage, armor) {
	this.attackDamage = attackDamage;
	this.magicDamage = magicDamage;
	this.armor = armor;
}

function DirectionComponent(direction) {
	this.direction = direction;
}

function PhysicalComponent(solid, size) {
	this.solid = solid;
	this.size = size;
}

function CollisionComponent(x, y, w, h) {
	if(h === undefined) {
		h = w;
	}
	this.top = y;
	this.right = x + w;
	this.bottom = y + h;
	this.left = x;
	this.width = w;
	this.height = h;
}

function MovementComponent(speed) {
	this.speed = speed;
	this.currentCooldown = 0;
}

function DisplayComponent(width, height, offsetX = 0, offsetY = 0, z = 0) {
	this.width = width;
	this.height = height;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.z = z;
	this.lightLevel = 0;
}

function SquareComponent(type) {
	this.type = type;
	this.visible = false;
	this.discovered = false;
	this.discoveredCounter = 0;
	this.opaque = opaque;
}

function AnimationComponent(animations) {
	if(animations == -1) {
		this.animation = animation_no_animations_yet;
	}
	else {
		this.offsetX = 0;
		this.offsetY = 0;
		this.stage = 0;
		this.sprite = undefined;
		this.animation = animation_idle;
		this.animations = animations;
	}
}

function TextureComponent(type, subtype = texture_default) {
	this.type = type;
	this.subtype = texture_default;
	// this.textureElements = [];
}

function TextureElementComponent(element = texture_default, xOff = 0, yOff = 0) {
	this.element = element;
	this.xOff = xOff;
	this.yOff = yOff;
}

function LightComponent() {
	this.level = 0;
}

function LightEmitterComponent(emitterLevel) {
	this.level = emitterLevel;
}

function ActionsComponent(actions) {
	this.busy = 0;
	this.actions = actions
	for(let a in actions) {
		this.actions[a] = new ActionComponent(actions[a].action, actions[a].cooldown, actions[a].time);
	}
	this.nextAction = action_none;
	this.currentAction = action_none;
	this.lastAction = action_none;
	this.lastActionFailed = false;
}

function ActionComponent(actionID, actionCooldown, actionTime) {
	this.action = actionID;
	this.cooldown = actionCooldown;
	this.time = actionTime;
	this.currentCooldown = 0;
}

function SprintComponent(movesBeforeSprinting, sprintSpeed) {
	this.movesBeforeSprinting = movesBeforeSprinting;
	this.lastMoveTime = 0;
	this.sprintCounter = 0;
	this.sprinting = false;
	this.sprintSpeed = sprintSpeed;
}

function MapComponent(map) {
	this.map = map;
}

function DepthComponent(depth) {
	this.depth = depth;
}

function AIComponent(attackRange) {
	this.attackRange = attackRange;
	this.noticedPlayer = false;
	this.idleTimer = 0;
}

function AbilitiesComponent(abilities) {
	this.abilities = [];
	for(let a of abilities) {
		this.abilities.push(new AbilityComponent(a));
	}
}

function AbilityComponent(ability) {
	for(let prop in ability) {
		this[prop] = ability[prop];
	}
	this.currentCooldown = 0;
}

function ControllerComponent(controls) {
	this.inputs = controls
}

function CameraComponent(position) {
	this.ready = false;
	this.smoothFrames = 4;
	this.cameraX = position.x;
	this.cameraY = position.y;
	this.shakeOffsetX = 0;
	this.shakeOffsetY = 0;
	// this.combat = false;
	// this.sprinting = false;
	this.zoom = 1;
}

function InteractableComponent(type) {
	this.type = type;
}
