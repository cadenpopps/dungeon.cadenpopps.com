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

function DexterityComponent(initialDexterity){
	this.dexterity = initialDexterity;
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

function ActionsComponent(actions){
	this.busy = 0;
	this.actions = [];
	for(let a in actions) {
		this.actions[a] = new ActionComponent(actions[a].action, actions[a].actionName, actions[a].cooldown, actions[a].time);
	}
	this.nextAction = action_none;
	this.currentAction = action_none;
	this.lastAction = action_none;
	this.lastActionFailed = false;
}

function ActionComponent(actionID, actionName, actionCooldown, actionTime) {
	this.action = actionID;
	if(actionID == action_ability_one || actionID == action_ability_two || actionID == action_ability_three) {
		this.abilityID = ability_string_to_constant[actionName];
	}
	this.actionName = actionName;
	this.cooldown = actionCooldown;
	this.time = actionTime;
	this.currentCooldown = 0;
}

function SprintComponent(movesBeforeSprinting, sprintSpeed){
	this.movesBeforeSprinting = movesBeforeSprinting;
	this.lastMoveTime = 0;
	this.sprintCounter = 0;
	this.sprinting = false;
	this.sprintSpeed = sprintSpeed;
}

function MapComponent(map){
	this.map = map;
}

function DepthComponent(depth){
	this.depth = depth;
}

function AIComponent(attackRange){
	this.attackRange = attackRange;
	this.noticedPlayer = false;
	this.idleTimer = 0;
}
