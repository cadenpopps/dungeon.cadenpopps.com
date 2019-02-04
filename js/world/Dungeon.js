function Dungeon() {
    this.currentLevelIndex = 0;
    this.levels = [];
    this.levels.push(generateLevel(0));
}

Dungeon.prototype.currentLevel = function () {
    return this.levels[this.currentLevelIndex];
}

Dungeon.prototype.currentBoard = function () {
    return this.levels[this.currentLevelIndex].board;
}

Dungeon.prototype.currentStairUp = function () {
    return this.levels[this.currentLevelIndex].stairUp;
}

Dungeon.prototype.currentStairDown = function () {
    return this.levels[this.currentLevelIndex].stairDown;
}

Dungeon.prototype.currentLevelMobs = function () {
    return this.levels[this.currentLevelIndex].mobs;
}

Dungeon.prototype.newLevel = function () {
    this.levels.push(generateLevel(this.currentLevelIndex + 1, this.currentStairDown()));
}

