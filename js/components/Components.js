
const component_position = 0, component_movement = 1, component_display = 2, component_animation = 3, component_actions = 4, component_physical = 5, component_sprint = 6, component_direction = 7, component_level = 8;

function PositionComponent(x, y){
	this.x = x;
	this.y = y;
}

function DirectionComponent(){
	this.direction = DOWN;
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

function AnimationComponent(animations, position){

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
