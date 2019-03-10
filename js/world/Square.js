
function Square(x, y, type) {
	this.x = x;
	this.y = y;
	this.squareType = type;
	this.squareCode = getSquareCode(this.x, this.y); 
	this.blocking = true;
	this.textures = [];

	this.visible = false;
	this.discovered = false;
}

Square.prototype.walkable = function (mobs) {
	return (!this.mobHere(mobs));
};

Square.prototype.mobHere = function (mobs) {
	return this.squareCode in mobs;
};

Square.prototype.draw = function (x, y, size){
	if(this.textures.length == 1){
		image(this.textures[0], x, y, size, size);
	}
	else{
		for(let t of this.textures){
			image(t, x, y, size, size);
		}
	}
}


WallSquare.prototype = Object.create(Square.prototype);
function WallSquare(x, y) {
	Square.call(this, x, y, WALL);
	this.textures.push(TEXTURES[WALL]);
}
WallSquare.prototype.walkable = function (mobs) {
	return false;
}



FloorSquare.prototype = Object.create(Square.prototype);
function FloorSquare(x, y, loot) {
	Square.call(this, x, y, FLOOR);
	this.blocking = false;
	this.textures.push(TEXTURES[FLOOR]);
	this.loot = loot;
	if(this.loot) this.textures.push(TEXTURES[LOOT][CLOSED]);
}
FloorSquare.prototype.walkable = function (mobs) {
    return Square.prototype.walkable.call(this, mobs) && !this.loot;
}



DoorSquare.prototype = Object.create(Square.prototype);
function DoorSquare(x, y) {
    Square.call(this, x, y, DOOR);
    this.textures.push(TEXTURES[DOOR][CLOSED]);
    this.opened = false;
}
DoorSquare.prototype.walkable = function (mobs, type) {
    return (this.opened || (type instanceof Player)) && Square.prototype.walkable.call(this, mobs);
}
DoorSquare.prototype.open = function () {
    this.opened = true;
	this.blocking = false;
	this.textures.unshift(TEXTURES[FLOOR]);
    this.textures[this.textures.indexOf(TEXTURES[DOOR][CLOSED])] = TEXTURES[DOOR][OPEN];
}



StairSquare.prototype = Object.create(Square.prototype);
function StairSquare(x, y, up) {
    if (up) {
        Square.call(this, x, y, STAIR_UP);
    }
    else {
        Square.call(this, x, y, STAIR_DOWN);
    }
	this.blocking = false;
    this.up = up;
    this.down = !up;
}
StairSquare.prototype.walkable = function (mobs, type) {
    return (type instanceof Player) && Square.prototype.walkable.call(this, mobs);
}
