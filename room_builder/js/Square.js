function Square() {
	this.type = 0;

	this.texture = floor(random(3));

	this.display = function (i, j) {
		let img = undefined;
		switch (this.type) {
			case FLOOR:
				img = textures[FLOOR];
				break;
			case WALL:
				img = textures[WALL];
				break;
			case DOOR:
				img = textures[DOOR];
				break;
			case LOOT:
				img = textures[LOOT];
				break;
		}
		image(img, i * squareSize + drawOffsetX, j * squareSize + drawOffsetY, squareSize, squareSize);
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
