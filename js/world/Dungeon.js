function Dungeon(engine) {
	this.currentLevelIndex = 0;
	this.levels = [];
	this.levels.push(generateLevel(engine, 0));
	engine.updateObjects(this.levels[0]);

	(function(engine, startPos){
		let px = startPos.x;
		let py = startPos.y;

		engine.updateObjects(new Player(px, py));
	})(engine, this.currentStairUp());
}

Dungeon.prototype.currentLevel = function () {
	return this.levels[this.currentLevelIndex];
}

Dungeon.prototype.currentBoard = function () {
	return this.levels[this.currentLevelIndex].board;
}

Dungeon.prototype.currentStairUp = function () {
	return this.levels[this.currentLevelIndex].stairUp;
}

Dungeon.prototype.currentStairDown = function () {
	return this.levels[this.currentLevelIndex].stairDown;
}

Dungeon.prototype.currentMobs = function () {
    return this.levels[this.currentLevelIndex].mobs;
}

Dungeon.prototype.newLevel = function () {
    this.levels.push(generateLevel(this.currentLevelIndex + 1, this.currentStairDown()));
}

