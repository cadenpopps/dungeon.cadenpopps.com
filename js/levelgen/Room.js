function Room(template, x, y) {

    this.width = template.width;
    this.height = template.height;
    this.left = x;
    this.top = y;
    this.right = x + this.width;
    this.bottom = y + this.height;

    this.squares = template.squares;
    this.roomType = 0;

    this.overlaps = function (otherRoom) {
        if (otherRoom.left > this.right || otherRoom.top > this.bottom) {
            return false;
        }
        if (otherRoom.right < this.left || otherRoom.bottom < this.top) {
            return false;
        }
        return true;
    };

    this.edges = function () {

        let edges = [];

        for (let i = 0; i < this.height; i++) {
            edges.push(this.squares[0][i]);
            edges.push(this.squares[this.width - 1][i]);
        }
        for (let i = 1; i < this.width - 1; i++) {
            edges.push(this.squares[i][0]);
            edges.push(this.squares[i][this.height - 1]);
        }

        return edges;

    };

}