function Square(x, y, texture, solid, opaque) {
	this.components = [component_position, component_display, component_physical, component_light];
	this.position = new PositionComponent(x, y);
	this.display = new DisplayComponent(texture, 1, 1, opaque);
	this.physical = new PhysicalComponent(solid, 1);
	this.light = new LightComponent();
}

WallSquare.prototype = Object.create(Square.prototype);
function WallSquare(x, y) {
	Square.call(this, x, y, TEXTURE_WALL, physical_solid, display_opaque);
}

FloorSquare.prototype = Object.create(Square.prototype);
function FloorSquare(x, y) {
	Square.call(this, x, y, TEXTURE_FLOOR, physical_non_solid, display_transparent);
}

DoorSquare.prototype = Object.create(Square.prototype);
function DoorSquare(x, y) {
	Square.call(this, x, y, TEXTURE_DOOR_CLOSED, physical_solid, display_opaque);
	this.opened = false;
}
DoorSquare.prototype.open = function () {
	this.opened = true;
	this.physical.solid = false;
	this.display.texture = TEXTURE_DOOR_OPEN;
	this.display.opaque = false;
}

LootSquare.prototype = Object.create(Square.prototype);
function LootSquare(x, y) {
	Square.call(this, x, y, TEXTURE_LOOT_CLOSED, physical_solid, display_transparent);
	this.opened = false;
}
LootSquare.prototype.open = function () {
	this.opened = true;
}

StairUpSquare.prototype = Object.create(Square.prototype);
function StairUpSquare(x, y) {
	Square.call(this, x, y, TEXTURE_STAIR_UP, physical_solid, display_transparent);
}

StairDownSquare.prototype = Object.create(Square.prototype);
function StairDownSquare(x, y) {
	Square.call(this, x, y, TEXTURE_STAIR_DOWN, physical_solid, display_transparent);
}
