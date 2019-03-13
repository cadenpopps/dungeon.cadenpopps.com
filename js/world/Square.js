
function Square(x, y, type) {
	this.components = [component_position, component_display];
	this.position = new PositionComponent(x, y);
	this.display = new DisplayComponent(undefined, 1, 1);


	this.squareType = type;
	this.squareCode = getSquareCode(this.x, this.y); 
	this.blocking = true;

	this.visible = false;
	this.discovered = false;
}

Square.prototype.walkable = function (mobs) {
	return (!this.mobHere(mobs));
};

Square.prototype.mobHere = function (mobs) {
	return this.squareCode in mobs;
};


WallSquare.prototype = Object.create(Square.prototype);
function WallSquare(x, y) {
	Square.call(this, x, y, WALL);
	this.display.texture = TEXTURES[WALL];
}
WallSquare.prototype.walkable = function (mobs) {
	return false;
}



FloorSquare.prototype = Object.create(Square.prototype);
function FloorSquare(x, y, loot) {
	Square.call(this, x, y, FLOOR);
	this.blocking = false;
	this.display.texture = TEXTURES[FLOOR];
	//this.loot = loot;
	//if(this.loot) this.display.texture = TEXTURES[LOOT][CLOSED];
}
FloorSquare.prototype.walkable = function (mobs) {
    return Square.prototype.walkable.call(this, mobs) && !this.loot;
}



DoorSquare.prototype = Object.create(Square.prototype);
function DoorSquare(x, y) {
	Square.call(this, x, y, DOOR);
	this.display.texture = TEXTURES[DOOR][CLOSED];
	this.opened = false;
}
DoorSquare.prototype.walkable = function (mobs, type) {
	return (this.opened || (type instanceof Player)) && Square.prototype.walkable.call(this, mobs);
}
DoorSquare.prototype.open = function () {
	this.opened = true;
	this.blocking = false;
	this.display.texture = TEXTURES[DOOR][OPEN];
}



StairSquare.prototype = Object.create(Square.prototype);
function StairSquare(x, y, up) {
	if (up) {
		Square.call(this, x, y, STAIR_UP);
		this.display.texture = TEXTURES[STAIR][UP];
	}
	else {
		Square.call(this, x, y, STAIR_DOWN);
		this.display.texture = TEXTURES[STAIR][DOWN];
	}
	this.blocking = false;
	this.up = up;
	this.down = !up;
}
StairSquare.prototype.walkable = function (mobs, type) {
	return (type instanceof Player) && Square.prototype.walkable.call(this, mobs);
}
