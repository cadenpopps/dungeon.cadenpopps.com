function Level(map, stairUp, stairDown, depth) {
	this.components = [component_map, component_stair, component_depth];
	this.map = new MapComponent(map);
	this.stairUp = new PositionComponent(stairUp.x, stairUp.y);
	this.stairDown = new PositionComponent(stairDown.x, stairDown.y);
	this.depth = new DepthComponent(depth)
}
