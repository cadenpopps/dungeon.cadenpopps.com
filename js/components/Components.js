function PositionComponent(x, y){
	this.x = x;
	this.y = y;
}

function HealthComponent(initialHealth){
	this.maxHealth = initialHealth;
	this.health = initialHealth;
}

function StrengthComponent(initialStrength){
	this.strength = initialStrength;
}

function IntelligenceComponent(initialIntelligence){
	this.intelligence = initialIntelligence;
}

function MagicComponent(initialMagic){
	this.magic = initialMagic;
}

function DirectionComponent(){
	this.direction = direction_down;
}

function PhysicalComponent(solid, blocking, size){
	this.solid = solid;
	this.blocking = blocking;
	this.size = size;
}

function MovementComponent(speed){
	this.speed = speed;
}

function DisplayComponent(texture, width, height){
	this.texture = texture;
	this.width = width;
	this.height = height;
	this.visible = false;
	this.discovered = 0;
}

function LightComponent(){
	this.lightLevel = 0;
}

function AnimationComponent(animations){
	this.offsetX = 0;
	this.offsetY = 0;
	this.stage = 0;
	this.sprite = undefined;
	this.animation = animation_idle;
	this.newAnimation = false;
	this.animations = animations;
}

function ActionComponent(actions){
	this.busy = 0;
	this.availible = actions;
	this.cooldowns = {};
	for(let a of actions){
		this.cooldowns[a] = 0;
	}
	this.nextAction = action_none;
	this.currentAction = action_none;
	this.lastAction = action_none;
}

function SprintComponent(movesBeforeSprinting){
	this.movesBeforeSprinting = movesBeforeSprinting;
	this.sprintCounter = 0;
	this.sprinting = false;
}

function MapComponent(map){
	this.map = map;
}

function DepthComponent(depth){
	this.depth = depth;
}

function StairComponent(x, y){
	this.x = x;
	this.y = y;
}
