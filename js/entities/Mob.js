Mob.prototype = Object.create(Entity.prototype);
function Mob(x, y, depth, config, actions, animations) {
	Entity.call(this, x, y, depth, config.health + depth, config.strength + depth, config.magic + depth, config.intelligence + depth, config.size, config.speed, actions, animations);

	if(config.solid) {
		this.components.push(component_collision);
		this.collision = new CollisionComponent(x, y, config.size);
	}
	this.components.push(component_ai);
	this.ai = new AIComponent(actions, config.attack_range, config.retreat_range);
}
