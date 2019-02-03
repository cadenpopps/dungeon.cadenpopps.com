function Level(board, up, down) {
    this.board = board;
    this.stairUp = up;
    this.stairDown = down;
    this.mobs = [];
    this.mobs.push(new Mob([10, 10]));
}