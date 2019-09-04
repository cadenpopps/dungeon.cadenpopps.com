function Dungeon(engine) {
	this.currentLevelIndex = 0;
	this.levels = [];
	this.levels.push(generateLevel(CONFIG.DUNGEON_SIZE, 0));
	engine.updateObjects(this.levels[0]);

	(function(engine, startPos){
		let px = startPos.x;
		let py = startPos.y;

		engine.updateObjects(new Player(px, py));
	})(engine, this.currentStairUp());
}
