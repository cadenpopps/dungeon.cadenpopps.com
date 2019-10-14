Mob.prototype = Object.create(Entity.prototype);
function Mob(x, y, depth, config, actions, animations) {
	Entity.call(this, x, y, depth, config.health, config.strength, config.magic, config.intelligence, config.size, config.speed, actions, animations);

	this.components.push(component_ai);
	this.ai = new AIComponent(actions, config.min_range, config.max_range);
}
