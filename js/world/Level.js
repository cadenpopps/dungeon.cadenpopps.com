function Level(board, up, down, depth) {
	this.components = [component_level];
	this.level = new LevelComponent(board, up, down, depth);
	this.stairUp = new PositionComponent(up.x, up.y);
	this.stairDown = new PositionComponent(down.x, down.y);
}
