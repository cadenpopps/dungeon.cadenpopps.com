Mob.prototype = Object.create(Entity.prototype);
function Mob(x, y, depth, config, actions, animations) {
	Entity.call(this, x, y, depth, config.size, display_opaque, physical_solid, animations);

	this.components.push(component_direction, component_combat, component_actions, component_collision);

	this.health = new HealthComponent(config.health);
	this.direction = new DirectionComponent(direction_down);
	this.combat = new CombatComponent(initialStrength, initialDexterity, initialIntelligence);
	this.actions = new ActionsComponent(actions);

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
