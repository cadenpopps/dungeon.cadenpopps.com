
function PositionComponent(x, y){
	this.x = x;
	this.y = y;
}

function HealthComponent(h){
	this.maxHealth = h;
	this.health = h;
	this.healthPercent = 1;

	this.changeHealth = function(h){
		this.health = h;
		this.healthPercent = this.health / this.maxHealth;
	}

	this.changeMaxHealth = function(h){
		this.maxHealth = h;
		this.healthPercent = this.health / this.maxHealth;
	}
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
	this.animations = animations;
}

function ActionComponent(actions){
	this.busy = 0;
	this.cooldowns = [];
	this.availible = actions;
	this.nextAction = action_none;
	this.lastAction = action_none;
}

function SprintComponent(moveThreshold){
	this.moveThreshold = moveThreshold;
	this.moveCounter = 0;
	this.sprinting = false;
}

function LevelComponent(board, stairUp, stairDown, depth){
	this.board = board;
	this.stairUp = stairUp;
	this.stairDown = stairDown;
	this.depth = depth;
}
