
const component_position = 0, component_movement = 1, component_display = 2, component_animation = 3;

function PositionComponent(x, y){
	this.x = x;
	this.y = y;
}

function MovementComponent(speed){
	this.speed = speed;
}

function DisplayComponent(texture, width, height){
	this.texture = texture;
	this.width = width;
	this.height = height;
	this.visible = false;
}

function AnimationComponent(animations){

}
