function Level(map, stairUp, stairDown, depth) {
	this.components = [component_map, component_stair, component_depth];
	this.map = new MapComponent(map);
	this.stairUp = new StairComponent(stairUp.x, stairUp.y);
	this.stairDown = new StairComponent(stairDown.x, stairDown.y);
	this.depth = new DepthComponent(depth)
}
