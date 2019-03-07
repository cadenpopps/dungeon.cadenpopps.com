Mob.prototype = Object.create(Entity.prototype);

function Mob(pos, hp, str, mag, int) {
	Entity.call(this, pos, hp, str, mag, int);
	this.visible = false;
}

Mob.prototype.update = function (board, mobs, player) {
	Entity.prototype.update.call(this, board, mobs);
	//let path = findPath(board, board[this.x][this.y], board[player.y][player.y]);
	if(abs(player.x - this.x) > 1 || abs(player.y - this.y) > 1){
		let dir = direction([this.x, this.y], [player.x, player.y]);
		this.move(dir, board, mobs);
	}
}
