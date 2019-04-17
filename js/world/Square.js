
function Square(x, y, type, texture, solid, blocking) {
	this.components = [component_position, component_display, component_physical];
	this.position = new PositionComponent(x, y);
	this.display = new DisplayComponent(texture, 1, 1);
	this.physical = new PhysicalComponent(solid, blocking, 1);
}

Square.prototype.walkable = function (mobs) {
	return (!this.mobHere(mobs));
};

Square.prototype.mobHere = function (mobs) {
	return this.squareCode in mobs;
};


WallSquare.prototype = Object.create(Square.prototype);
function WallSquare(x, y) {
	Square.call(this, x, y, WALL, TEXTURES[WALL], true, true);
	this.walkable = function(mobs){return false;}
}

FloorSquare.prototype = Object.create(Square.prototype);
function FloorSquare(x, y) {
	Square.call(this, x, y, FLOOR, TEXTURES[FLOOR], false, false);
}

DoorSquare.prototype = Object.create(Square.prototype);
function DoorSquare(x, y) {
	Square.call(this, x, y, DOOR, TEXTURES[DOOR][CLOSED], true, true);
	this.opened = false;
}
DoorSquare.prototype.open = function () {
	this.opened = true;
	this.physical.solid = false;
	this.physical.blocking = false;
	this.display.texture = TEXTURES[DOOR][OPEN];
}

StairSquare.prototype = Object.create(Square.prototype);
function StairSquare(x, y, up) {
	if (up) {
		Square.call(this, x, y, STAIR_UP, TEXTURES[STAIR][UP], true, true);
	}
	else {
		Square.call(this, x, y, STAIR_UP, TEXTURES[STAIR][DOWN], true, true);
	}
	this.up = up;
}
