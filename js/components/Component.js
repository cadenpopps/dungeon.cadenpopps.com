const component_position = 1, component_display = 2, component_test = -1;

function Component(){

}

function PositionComponent(x, y){
	this.x = x;
	this.y = y;
}

function DisplayComponent(texture, width, height){
	this.texture = texture;
	this.width = width;
	this.height = height;
}
