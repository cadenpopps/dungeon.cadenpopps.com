function Level(board, up, down) {
    this.board = board;
    this.stairUp = up;
    this.stairDown = down;
    this.mobs = new Object();
    this.mobs[getSquareCode((this.stairUp.x - 2), (this.stairUp.y - 2))] = new Mob([this.stairUp.x - 2, this.stairUp.y - 2]);
}