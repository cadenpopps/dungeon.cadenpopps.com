function Square(x, y, texture, solid, opaque) {
	this.components = [component_position, component_display, component_physical, component_light];
	this.position = new PositionComponent(x, y);
	this.display = new DisplayComponent(texture, 1, 1, opaque);
	this.physical = new PhysicalComponent(solid, 1);
	this.light = new LightComponent();
}

WallSquare.prototype = Object.create(Square.prototype);
function WallSquare(x, y, texture) {
	Square.call(this, x, y, texture, physical_solid, display_opaque);
}

FloorSquare.prototype = Object.create(Square.prototype);
function FloorSquare(x, y, texture) {
	Square.call(this, x, y, texture, physical_non_solid, display_transparent);
}

DoorSquare.prototype = Object.create(Square.prototype);
function DoorSquare(x, y, textures) {
	Square.call(this, x, y, textures[CLOSED], physical_solid, display_opaque);
	this.opened = false;
	this.textures = textures;
}
DoorSquare.prototype.open = function () {
	this.opened = true;
	this.physical.solid = false;
	this.display.texture = this.textures[OPEN];
	this.display.opaque = false;
}

LootSquare.prototype = Object.create(Square.prototype);
function LootSquare(x, y, textures) {
	Square.call(this, x, y, textures[CLOSED], physical_solid, display_transparent);
	this.opened = false;
	this.textures = textures;
}
LootSquare.prototype.open = function () {
	this.opened = true;
	this.display.texture = this.textures[OPEN];
}

StairUpSquare.prototype = Object.create(Square.prototype);
function StairUpSquare(x, y, texture) {
	Square.call(this, x, y, texture, physical_solid, display_transparent);
}

StairDownSquare.prototype = Object.create(Square.prototype);
function StairDownSquare(x, y, texture) {
	Square.call(this, x, y, texture, physical_solid, display_transparent);
}
