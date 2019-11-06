class Square {
	constructor (x, y, textures, solid, opaque) {
		this.components = [component_position, component_display, component_texture, component_physical, component_light];
		this.position = new PositionComponent(x, y);
		this.display = new DisplayComponent(1, 1, opaque);
		this.textures = textures;
		this.physical = new PhysicalComponent(solid, 1);
		this.light = new LightComponent();
	}
}

class WallSquare extends Square {
	constructor(x, y) {
		let textures = [new TextureComponent(texture_wall)];
		super(x, y, textures, physical_solid, display_opaque);
	}
}

class FloorSquare extends Square {
	constructor(x, y) {
		let textures = [new TextureComponent(texture_floor)];
		super(x, y, textures, physical_non_solid, display_transparent);
	}
}

class DoorSquare extends Square {
	constructor(x, y) {
		let textures = [
			new TextureComponent(texture_floor),
			new TextureComponent(texture_door_closed)
		];
		super(x, y, textures, physical_solid, display_opaque);
		this.opened = false;
	}

	open() {
		this.opened = true;
		this.physical.solid = false;
		this.display.opaque = false;
		this.textures[1].textureType = texture_door_open;
	}
}

class LootSquare extends Square {
	constructor(x, y) {
		let textures = [
			new TextureComponent(texture_floor),
			new TextureComponent(texture_loot_closed)
		];
		super(x, y, textures, physical_solid, display_transparent);
		this.opened = false;
	}

	open() {
		this.opened = true;
		this.textures[1].textureType = texture_loot_open;
	}
}

class StairUpSquare extends Square {
	constructor(x, y) {
		let textures = [
			new TextureComponent(texture_floor),
			new TextureComponent(texture_stair_up)
		];
		super(x, y, textures, physical_solid, display_transparent);
	}
}

class StairDownSquare extends Square {
	constructor(x, y) {
		let textures = [
			new TextureComponent(texture_floor),
			new TextureComponent(texture_stair_down)
		];
		super(x, y, textures, physical_solid, display_transparent);
	}
}
