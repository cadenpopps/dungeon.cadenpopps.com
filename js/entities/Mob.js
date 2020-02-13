Mob.prototype = Object.create(Entity.prototype);
function Mob(x, y, depth, config, actions, animations) {
	Entity.call(this, x, y, depth, config.health + depth, config.strength + depth, config.dexterity + depth, config.intelligence + depth, config.size, actions, animations);

	if(config.solid) {
		this.components.push(component_collision);
		this.collision = new CollisionComponent(x, y, config.size, config.size);
	}
	if(config.sprint_threshhold !== undefined) {
		this.components.push(component_sprint);
		this.sprint = new SprintComponent(config.sprint_threshhold, config.sprint_speed);
	}
	this.components.push(component_ai);
	this.ai = new AIComponent(config.attack_range);
}
