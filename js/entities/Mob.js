Mob.prototype = Object.create(Entity.prototype);
function Mob(x, y, depth, health, strength, magic, intelligence, size, depth) {
	Entity.call(this, x, y, depth, health, strength, magic, intelligence, size, CONFIG.DEFAULT_ANIMATIONS);
}
