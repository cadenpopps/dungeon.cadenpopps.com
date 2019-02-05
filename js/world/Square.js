
function Square(x, y, type) {
    this.x = x;
    this.y = y;
    this.squareType = type;
    this.squareCode = this.x + (this.y * CONFIG.DUNGEON_SIZE);

    this.visible = false;
    this.discovered = false;
}

Square.prototype.walkable = function (mobs) {
    return (!((this.squareCode) in mobs));
};

Square.prototype.currentlyWalkable = function () {
    return (!this.containsMob && (this.squareType == FLOOR || this.squareType == DOOR || this.squareType == STAIR_DOWN || this.squareType == STAIR_UP));
};

WallSquare.prototype = Object.create(Square.prototype);
function WallSquare(x, y) {
    Square.call(this, x, y, WALL);
}
WallSquare.prototype.walkable = function (mobs) {
    return false;
}

FloorSquare.prototype = Object.create(Square.prototype);
function FloorSquare(x, y, loot) {
    Square.call(this, x, y, FLOOR);
    this.loot = loot;
}
FloorSquare.prototype.walkable = function (mobs) {
    return Square.prototype.walkable.call(this, mobs) && !this.loot;
}

DoorSquare.prototype = Object.create(Square.prototype);
function DoorSquare(x, y) {
    Square.call(this, x, y, DOOR);
    this.open = false;
}
DoorSquare.prototype.walkable = function (mobs) {
    return Square.prototype.walkable.call(this, mobs);
}