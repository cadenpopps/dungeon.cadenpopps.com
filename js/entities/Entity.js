
const UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
const SLOW = 1, MEDIUM = 2, FAST = 3;
const IDLE = 4;
const NUMBER_MOVES = 4;
const FAIL = 0, SUCCESS = 1;

function Entity(pos, hp = 3, str = 1, mag = 1, int = 1, speed = MEDIUM, animations = undefined) {
    this.x = pos[0];
    this.y = pos[1];
    this.health = hp;
	this.currentHealth = hp;
	this.currentHealth -= 1;
    this.strength = str;
    this.magic = mag;
    this.intelligence = int;
    this.speed = speed;

    this.animations = animations;
	if (this.animations == undefined) {
		this.animations = CONFIG.DEFAULT_ANIMATIONS;
	}
	this.animationCounter = 0;
	this.animation = IDLE;
	this.sprite = this.animations[IDLE][this.animationCounter];
	this.busy = false;
}

Entity.prototype.update = function () {
	// this.toString();
}

Entity.prototype.move = function (dir, board, mobs) {
	let status = 0;
	switch (dir) {
		case UP:
			if (this.y > 0 && board[this.x][this.y - 1].walkable(mobs, this)) {
				delete mobs[getSquareCode(this.x, this.y)];
				this.y--;
				mobs[getSquareCode(this.x, this.y)] = this;
				status = SUCCESS;
			}
			break;
		case RIGHT:
			if (this.x < CONFIG.DUNGEON_SIZE && board[this.x + 1][this.y].walkable(mobs, this)) {
				delete mobs[getSquareCode(this.x, this.y)];
				this.x++;
				mobs[getSquareCode(this.x, this.y)] = this;
				status = SUCCESS;
			}
			break;
		case DOWN:
			if (this.y < CONFIG.DUNGEON_SIZE && board[this.x][this.y + 1].walkable(mobs, this)) {
				delete mobs[getSquareCode(this.x, this.y)];
				this.y++;
				mobs[getSquareCode(this.x, this.y)] = this;
				status = SUCCESS;
			}
			break;
		case LEFT:
			if (this.x > 0 && board[this.x - 1][this.y].walkable(mobs, this)) {
				delete mobs[getSquareCode(this.x, this.y)];
				this.x--;
				mobs[getSquareCode(this.x, this.y)] = this;
				status = SUCCESS;
			}
            break;
        default:
            console.log("No direction");
            break;
    }
    if (status != FAIL) {
        this.animation = dir;
        this.animationCounter = 0;
        this.busy = true;
    }
    return status;
}

Entity.prototype.updateMobs = function (mobs, dir) {
    switch (dir) {
		case UP:
			delete mobs[getSquareCode(this.x, this.y + 1)];
			break;
		case RIGHT:
			delete mobs[getSquareCode(this.x - 1, this.y)];
			break;
		case DOWN:
			delete mobs[getSquareCode(this.x, this.y - 1)];
			break;
		case LEFT:
			delete mobs[getSquareCode(this.x + 1, this.y)];
			break;
		default:
			console.log("No direction");
			break;
	}
}

Entity.prototype.healthPercent = function(){
	return floor(this.currentHealth/this.health * 100) / 100;
}

Entity.prototype.attack = function () {
	console.log("To implement");
}

Entity.prototype.animate = function (idleTimer) {
	if (this.animation == IDLE) {
		if (idleTimer == 0) {
			this.animationCounter++;
		}
	}
	else {
		this.animationCounter++;
	}
	if (this.animationCounter < this.animations[this.animation].length) {
		this.sprite = this.animations[this.animation][this.animationCounter];
	}
	else {
		this.animationCounter = 0;
        this.animation = IDLE;
        this.busy = false;
    }
}

Entity.prototype.toString = function EntityToString() {
    console.log("x: " + this.x);
    console.log("y: " + this.y);
    console.log("health: " + this.health);
    console.log("strength: " + this.strength);
    console.log("magic: " + this.magic);
    console.log("intelligence: " + this.intelligence);
}
