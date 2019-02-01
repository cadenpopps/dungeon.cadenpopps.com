
Mob.prototype = Object.create(Entity.prototype);

function Mob(pos, hp, str, mag, int) {
    Entity.call(this, pos, hp, str, mag, int);
}

