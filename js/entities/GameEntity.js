function GameEntity(ID, components) {
	this.ID = ID;
	console.log(components);
	this.components = {}
	for(let componentID in components) {
		this.components[componentID] = components[componentID];
	}
}

// function GameEntity(x, y, initialDepth, size, visible, solid, animations) {
// 	this.components = [component_position, component_depth, component_display];

// 	this.position = new PositionComponent(x, y);
// 	this.depth = new DepthComponent(initialDepth);
// 	this.display = new DisplayComponent(size, size, visible);

// 	if(solid) {
// 		this.components.push(component_collision);
// 		this.collision = new CollisionComponent(x, y, size, size);
// 	}
// 	if(animations !== null) {
// 		this.components.push(component_animation);
// 		this.animation = new AnimationComponent(animations);
// 	}

// }
