function Square() {
	this.type = 0;

	this.texture = floor(random(3));

	this.display = function (i, j) {
		switch (this.type) {
			case FLOOR:
				image(floorTexture, i * squareSize, j * squareSize, squareSize, squareSize);
				break;
			case WALL:
				image(wallTexture, i * squareSize, j * squareSize, squareSize, squareSize);
				break;
			case DOOR:
				image(doorClosedTexture, i * squareSize, j * squareSize, squareSize, squareSize);
				break;
			case LOOT:
				image(lootClosedTexture, i * squareSize, j * squareSize, squareSize, squareSize);
				break;
		}
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