Torch.prototype = Object.create(Entity.prototype);
function Torch(x, y, direction, depth) {
	Entity.call(this, x, y, depth, .35, display_opaque, physical_non_solid, null);

	this.components.push(component_light_emitter, component_direction);
	this.direction = new DirectionComponent(direction);

	switch(direction) {
		case direction_up:
			this.display.offsetX = .5;
			this.display.offsetY = 1;
			break;
		case direction_right:
			this.display.offsetX = 0;
			this.display.offsetY = .5;
			break;
		case direction_down:
			this.display.offsetX = .5;
			this.display.offsetY = 0;
			break;
		case direction_left:
			this.display.offsetX = 1;
			this.display.offsetY = .5;
			break;
	}

	this.lightEmitter = new LightEmitterComponent(light_level_torch);
}
