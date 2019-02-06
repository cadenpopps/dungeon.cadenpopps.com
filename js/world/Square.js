
function Square(x, y, type) {
    this.x = x;
    this.y = y;
    this.squareType = type;
    this.squareCode = this.x + (this.y * CONFIG.DUNGEON_SIZE);

    this.visible = false;
    this.discovered = false;
}

Square.prototype.walkable = function (mobs) {
    return (!this.mobHere(mobs));
};

Square.prototype.mobHere = function (mobs) {
    return this.squareCode in mobs;
}


WallSquare.prototype = Object.create(Square.prototype);
function WallSquare(x, y) {
    Square.call(this, x, y, WALL);
    this.texture = TEXTURES[WALL];
}
WallSquare.prototype.walkable = function (mobs) {
    return false;
}



FloorSquare.prototype = Object.create(Square.prototype);
function FloorSquare(x, y, loot) {
    Square.call(this, x, y, FLOOR);
    this.texture = TEXTURES[FLOOR]
    this.loot = loot;
}
FloorSquare.prototype.walkable = function (mobs) {
    return Square.prototype.walkable.call(this, mobs) && !this.loot;
}



DoorSquare.prototype = Object.create(Square.prototype);
function DoorSquare(x, y) {
    Square.call(this, x, y, DOOR);
    this.texture = TEXTURES[DOOR][CLOSED]
    this.opened = false;
}
DoorSquare.prototype.walkable = function (mobs, type) {
    return (this.opened || (type instanceof Player)) && Square.prototype.walkable.call(this, mobs);
}
DoorSquare.prototype.open = function () {
    this.opened = true;
    this.texture = TEXTURES[DOOR][OPEN]
}



StairSquare.prototype = Object.create(Square.prototype);
function StairSquare(x, y, up) {
    if (up) {
        Square.call(this, x, y, STAIR_UP);
    }
    else {
        Square.call(this, x, y, STAIR_DOWN);
    }
    this.up = up;
    this.down = !up;
}
StairSquare.prototype.walkable = function (mobs, type) {
    return (type instanceof Player) && Square.prototype.walkable.call(this, mobs);
}