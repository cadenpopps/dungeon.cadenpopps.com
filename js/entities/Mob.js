Mob.prototype = Object.create(Entity.prototype);
function Mob(x, y, depth, health, strength, magic, intelligence, size, animations) {
	Entity.call(this, x, y, depth, health, strength, magic, intelligence, size, animations);
}
