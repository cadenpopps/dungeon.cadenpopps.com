function Level(map, rooms, stairUp, stairDown, depth, torches) {
	this.components = [component_map, component_stair, component_depth];
	this.map = new MapComponent(map);
	this.rooms = rooms;
	this.stairUp = new PositionComponent(stairUp.x, stairUp.y);
	this.stairDown = new PositionComponent(stairDown.x, stairDown.y);
	this.depth = new DepthComponent(depth);
	this.torches = torches;
}
