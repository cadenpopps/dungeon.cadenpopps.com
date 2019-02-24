
Mob.prototype = Object.create(Entity.prototype);

function Mob(pos, hp, str, mag, int) {
    Entity.call(this, pos, hp, str, mag, int);
    this.visible = false;
}

Mob.prototype.update = function (board, mobs, player) {
	let path = findPath(board, board[this.x][this.y], board[player.y][player.y]);
    this.move(dirToSquare(board[this.x][this.y], board[player.x][player.y]), board, mobs);
}

