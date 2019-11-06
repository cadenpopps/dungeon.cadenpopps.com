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

function CollisionComponent(x, y, w, h){
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

function MovementComponent(speed){
	this.speed = speed;
}

function DisplayComponent(width, height, opaque, offsetX = 0, offsetY = 0){
	this.width = width;
	this.height = height;
	this.visible = false;
	this.discovered = false;
	this.discoveredCounter = 0;
	this.opaque = opaque;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
}

function AnimationComponent(animations){
	this.offsetX = 0;
	this.offsetY = 0;
	this.stage = 0;
	this.sprite = undefined;
	this.animation = animation_idle;
	this.animations = animations;
}

function TextureComponent(type) {
	this.textureType = type;
	this.textureElements = [];
}

function TextureElementComponent(element = texture_default, xOff = 0, yOff = 0) {
	this.element = element;
	this.xOff = xOff;
	this.yOff = yOff;
}

function LightComponent(){
	this.level = 0;
}

function LightEmitterComponent(emitterLevel){
	this.level = emitterLevel;
}

function ActionComponent(actions, speed){
	this.busy = 0;
	this.speed = speed;
	this.availible = actions;
	this.nextAction = action_none;
	this.currentAction = action_none;
	this.lastAction = action_none;
	this.lastActionFailed = false;
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

function AIComponent(actions, attackRange, retreatRange){
	this.actions = actions;
	this.attackRange = attackRange;
	this.retreatRange = retreatRange;
}
