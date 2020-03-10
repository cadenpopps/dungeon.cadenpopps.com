Mob.prototype = Object.create(Entity.prototype);
function Mob(x, y, depth, config, actions, animations) {
	Entity.call(this, x, y, depth, config.size, display_opaque, physical_solid, animations);

	this.components.push(component_health, component_direction, component_combat, component_actions, component_collision, component_ai);

	this.health = new HealthComponent(config.health);
	this.direction = new DirectionComponent(direction_down);
	this.combat = new CombatComponent(config.attackDamage, config.magicDamage, config.armor);
	this.actions = new ActionsComponent(actions);
	this.ai = new AIComponent(config.attack_range);

	if(config.sprint_threshhold !== undefined) {
		this.components.push(component_sprint);
		this.sprint = new SprintComponent(config.sprint_threshhold, config.sprint_speed);
	}
}
