class Torch {
	constructor(x, y, direction) {
		const SIZE = .2;

		this.components = [component_position, component_direction, component_display, component_light_emitter];
		this.position = new PositionComponent(x, y);
		this.direction = new DirectionComponent(direction);
		let xoff = .5;
		let yoff = .5;
		if(direction == direction_up) {
			yoff = 1;
		}
		else if(direction == direction_right) {
			xoff = 0;
		}
		else if(direction == direction_down) {
			yoff = 0;
		}
		else if(direction == direction_left) {
			xoff = 1;
		}
		this.display = new DisplayComponent(SIZE, SIZE, display_transparent, xoff, yoff);
		this.lightEmitter = new LightEmitterComponent(light_level_torch);
	}
}
