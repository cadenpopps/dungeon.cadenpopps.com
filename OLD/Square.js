class Square {
	constructor (x, y, textures, solid, opaque) {
		this.components = [component_position, component_display, component_texture, component_light];
		this.position = new PositionComponent(x, y);
		this.display = new DisplayComponent(1, 1, opaque);
		if(solid) {
			this.components.push(component_collision);
			this.collision = new CollisionComponent(x, y, 1, 1);
		}
		this.textures = textures;
		this.light = new LightComponent();
	}
}

class BlankSquare extends Square {
	constructor(x, y) {
		super(x, y, [], physical_solid, display_transparent);
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

class DoorSquare extends WallSquare {
	constructor(x, y) {
		super(x, y, [], physical_solid, display_opaque);
		let textures = [
			new TextureComponent(texture_floor),
			new TextureComponent(texture_door_closed)
		];
		this.textures = textures;
		this.opened = false;
	}

	open() {
		this.components.splice(this.components.indexOf(component_collision), 1);
		this.opened = true;
		// this.collision = undefined;
		// this.collision.solid = false;
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

class StairUpSquare extends FloorSquare {
	constructor(x, y) {
		super(x, y, [], physical_solid, display_transparent);
		let textures = [
			new TextureComponent(texture_floor),
			new TextureComponent(texture_stair_up)
		];
		this.textures = textures;
	}
}

class StairDownSquare extends FloorSquare {
	constructor(x, y) {
		super(x, y, [], physical_solid, display_transparent);
		let textures = [
			new TextureComponent(texture_floor),
			new TextureComponent(texture_stair_down)
		];
		this.textures = textures;
	}
}
