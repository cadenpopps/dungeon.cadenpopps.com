function Level(board, up, down) {
    this.board = board;
    this.stairUp = up;
    this.stairDown = down;
    this.mobs = new Object();
    this.mobs[(this.stairUp.x - 2) + ((this.stairUp.y - 2) * CONFIG.DUNGEON_SIZE)] = new Mob(this.stairUp.x - 2, this.stairUp.y - 2);
}