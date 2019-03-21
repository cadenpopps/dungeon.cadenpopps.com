function Level(board, up, down, depth) {
	this.components = [component_level];
	this.level = new LevelComponent(board, up, down, depth);
}
