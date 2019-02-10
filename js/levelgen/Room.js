function Room(template, x, y) {

    this.width = template.width - 2;
    this.height = template.height - 2;
    this.left = x + 1;
    this.top = y + 1;
    this.right = x + this.width + 1;
    this.bottom = y + this.height + 1;

    this.maxDoors = template.maxDoors;

    this.squares = template.squares;

    this.roomType = 0;

    this.connected = false;
    this.region = undefined;

    this.doors = [];

    this.overlaps = function (otherRoom) {
        if (otherRoom.left > this.right || otherRoom.top > this.bottom) {
            return false;
        }
        if (otherRoom.right < this.left || otherRoom.bottom < this.top) {
            return false;
        }
        return true;
    };

    this.doorSquares = (function (squares, width, height) {

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
        // for (let i = 0; i < this.height + 2; i++) {
        //     if (this.squares[0][i] == DOOR) {
        //         doorSquares.push(this.squares[0][i]);
        //     }
        //     doorSquares.push(this.squares[this.width + 1][i]);
        // }
        // for (let i = 1; i < this.width + 1; i++) {
        //     doorSquares.push(this.squares[i][0]);
        //     doorSquares.push(this.squares[i][this.height - 1]);
        // }

        return doorSquares;

    })(this.squares, this.width + 2, this.height + 2);

}