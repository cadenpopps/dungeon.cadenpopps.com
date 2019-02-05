
Mob.prototype = Object.create(Entity.prototype);

function Mob(pos, hp, str, mag, int) {
    Entity.call(this, pos, hp, str, mag, int);

    this.visible = false;
}

Mob.prototype.update = function (board, mobs) {
    this.move(randomInt(3), board, mobs);
}

