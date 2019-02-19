function Room(template, x, y) {

    this.width = template.width - 2;
    this.height = template.height - 2;
    this.left = x + 1;
    this.top = y + 1;
    this.right = x + this.width + 1;
    this.bottom = y + this.height + 1;
	this.centerX = this.left + floor(this.width/2);
	this.centerY = this.top + floor(this.height/2);

    this.maxDoors = template.maxDoors;

    this.squares = template.squares;

    this.roomType = 0;

    this.connected = false;
    this.region = undefined;
    this.topDoor, this.rightDoor, this.leftDoor, this.bottomDoor = false;


    this.doors = [];

    this.doorSquares = this.getDoorSquares(this.squares, this.width + 2, this.height + 2);
}

Room.prototype.overlaps = function (otherRoom) {
    if (otherRoom.left > this.right || otherRoom.top > this.bottom) {
        return false;
    }
    if (otherRoom.right < this.left || otherRoom.bottom < this.top) {
        return false;
    }
    return true;
};

Room.prototype.getDoorSquares = function (squares, width, height) {

    let doorSquares = [];

    for (let x = 0; x < width; x++) {
        if (squares[x][0] == DOOR) {
            doorSquares.push({ x: x, y: 0 });
        }
        if (squares[x][height - 1] == DOOR) {
            doorSquares.push({ x: x, y: height - 1 });
        }
    }

    for (let y = 1; y < height - 1; y++) {
        if (squares[0][y] == DOOR) {
            doorSquares.push({ x: 0, y: y });
        }
        if (squares[width - 1][y] == DOOR) {
            doorSquares.push({ x: width - 1, y: y });
        }
    }

    return doorSquares;
}

Room.prototype.canBeDoor = function (door) {
    if (this.doors.length < this.maxDoors) {
        if (door.y < this.top && !this.topDoor) {
            return true;
        }
        else if (door.x < this.left && !this.leftDoor) {
            return true;
        }
        else if (door.y == this.bottom && !this.bottomDoor) {
            return true;
        }
        else if (door.x == this.right && !this.rightDoor) {
            return true;
        }
    }
    return false;
}

Room.prototype.addDoor = function (door) {
    door.region = this.region;
    if (door.y < this.top && !this.topDoor) {
        this.topDoor = true;
    }
    else if (door.x < this.left && !this.leftDoor) {
        this.leftDoor = true;
    }
    else if (door.y == this.bottom && !this.bottomDoor) {
        this.bottomDoor = true;
    }
    else if (door.x == this.right && !this.rightDoor) {
        this.rightDoor = true;
    }
}

Room.prototype.changeRegion = function (region) {
    this.region = region;
    for (let d of this.doors) {
        this.door.region = region;
    }
}
