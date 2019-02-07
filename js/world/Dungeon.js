function Dungeon() {
    this.currentLevelIndex = 0;
    this.levels = [];

    let startTime = millis();

    this.levels.push(generateLevel(0));

    let endTime = millis()

    console.log(endTime - startTime);

    // findPath(this.currentBoard(), this.currentBoard()[this.currentStairUp().x][this.currentStairUp().y], this.currentBoard()[this.currentStairDown().x][this.currentStairDown().y]);


    // console.log(findPath(this.currentBoard(), this.currentBoard()[this.currentStairUp().x][this.currentStairUp().y], this.currentBoard()[this.currentStairUp().x + 2][this.currentStairUp().y + 2]));


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

Dungeon.prototype.currentMobs = function () {
    return this.levels[this.currentLevelIndex].mobs;
}

Dungeon.prototype.newLevel = function () {
    this.levels.push(generateLevel(this.currentLevelIndex + 1, this.currentStairDown()));
}

