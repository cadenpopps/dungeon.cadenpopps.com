Player.prototype = Object.create(Entity.prototype);
function Player(x, y, hp, str, mag, int) {
	Entity.call(this, x, y, hp, str, mag, int);

	this.components.push(component_sprint);
	this.sprint = new SprintComponent(2);

	this.attack = function(board, mobs){
		let status = 0;
		for(let m in mobs){
			let mob = mobs[m];
			if(abs(this.x - mob.x) <= 1 && abs(this.y - mob.y) <= 1 && !(mob instanceof Player)){
				Entity.prototype.attack.call(this, mob);
				status = ACTION_ATTACK;
			}
		}
		return status;
	}

	let updateBoardSight = function (board, x, y) {
		for (var i = 0; i < CONFIG.DUNGEON_SIZE; i++) {
			for (var j = 0; j < CONFIG.DUNGEON_SIZE; j++) {
				board[i][j].visible = false;
			}
		}
		playerSight(board, x, y);
	}


	let updateMobSight = function (board, mobs) {
		for (let m in mobs) {
			let mob = mobs[m];
			mob.visible = board[mob.x][mob.y].visible;
		}
	}
}
