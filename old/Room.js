function Room(centerx, centery, roomInfo) {

	this.width = roomInfo.width;
	this.height = roomInfo.height;
	this.topLeftx = centerx - Math.floor(this.width / 2);
	this.topLefty = centery - Math.floor(this.height / 2);
	if (this.topLeftx % 2 === 0) {
		this.topLeftx--;
	}
	if (this.topLefty % 2 === 0) {
		this.topLefty--;
	}

	this.childSquares = roomInfo.squares;
	this.roomType = 0;

	this.valid = function (tempRoom) {

		if (tempRoom.topLeftx > this.topLeftx + this.width || tempRoom.topLefty > this.topLefty + this.height) {
			return true;
		}

		if (tempRoom.topLeftx + tempRoom.width < this.topLeftx || tempRoom.topLefty + tempRoom.height < this.topLefty) {
			return true;
		}

		return false;

	};

	this.getEdges = function (board) {

		var edges = [];

		for (let s of this.childSquares) {
			if (s.x == this.x1 || s.y == this.y1 || s.x == this.x2 || s.y == this.y2) {
				edges.push(s);
			}
		}

		return edges;

	};
}
