class Torch {
	constructor(x, y, direction, level) {
		this.components = [component_position, component_direction, component_display, component_light_emitter]	
		this.position = new PositionComponent(x, y);
		this.direction = new DirectionComponent(direction);
		this.display = new DisplayComponent(undefined, .3, .3, display_transparent, .5, .5);
		this.lightEmitter = new LightEmitterComponent(level);
	}
}
