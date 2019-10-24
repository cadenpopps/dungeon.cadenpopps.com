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

function CombatComponent(strength, magic, intelligence){

	this.meleeAttackPower = strength;
	this.meleeDefensePower = floor((strength) / 5);

	this.magicAttackPower = (magic * intelligence) / 2;
	this.magicDefensePower = (strength * magic) / 8;
}

function DirectionComponent(direction){
	this.direction = direction;
}

function PhysicalComponent(solid, size){
	this.solid = solid;
	this.size = size;
}

function CollisionComponent(x, y, size){
	this.topLeft = [x, y];
	this.botRight = [x + size, y + size];
}

function MovementComponent(speed){
	this.speed = speed;
}

function DisplayComponent(texture, width, height, opaque){
	this.texture = texture;
	this.width = width;
	this.height = height;
	this.visible = false;
	this.discovered = 0;
	this.opaque = opaque;
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
	this.animations = animations;
}

function ActionComponent(actions, speed){
	this.busy = 0;
	this.speed = speed;
	this.availible = actions;
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

function AIComponent(actions, minRange, maxRange){
	this.actions = actions;
	this.minRange = minRange;
	this.maxRange = maxRange;
}
