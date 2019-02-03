
function Square(x, y, type) {
    this.x = x;
    this.y = y;
    this.squareType = type;

    this.visible = false;
    this.discovered = false;
}

Square.prototype.walkable = function () {
    return (this.squareType == FLOOR || this.squareType == DOOR || this.squareType == STAIR_DOWN || this.squareType == STAIR_UP);
};

Square.prototype.currentlyWalkable = function () {
    return (!this.containsMob && (this.squareType == FLOOR || this.squareType == DOOR || this.squareType == STAIR_DOWN || this.squareType == STAIR_UP));
}; 