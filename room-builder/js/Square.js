function Square() {
	this.type = FLOOR;

	this.texture = floor(random(3));

	this.display = function (x, y, size) {
		let tex = undefined;
		switch (this.type) {
			case FLOOR:
				tex = floorTexture;
				break;
			case WALL:
				tex = wallTexture;
				break;
			case DOOR:
				tex = doorClosedTexture;
				break;
			case LOOT:
				image(floorTexture, xoff + (x * size), yoff + (y * size), size, size);
				tex = lootClosedTexture;
				break;
		}
		image(tex, xoff + (x * size), yoff + (y * size), size, size);
		stroke(30);
		strokeWeight(2);
		fill(0,0,0,0);
		rect( xoff + (x * size), yoff + (y * size), size, size);
	};

	this.changeToType = function (t) {
		this.type = t;
	};

	this.change = function () {
		if (this.type == WALL) {
			this.type = FLOOR;
		}
		else if (this.type == FLOOR) {
			this.type = DOOR;
		}
		else if (this.type == DOOR) {
			this.type = LOOT;
		}
		else if (this.type == LOOT) {
			this.type = WALL;
		}
	};

	this.changeBack = function () {
		if (this.type == WALL) {
			this.type = LOOT;
		}
		else if (this.type == FLOOR) {
			this.type = WALL;
		}
		else if (this.type == DOOR) {
			this.type = FLOOR;
		}
		else if (this.type == LOOT) {
			this.type = DOOR;
		}
	};
}
