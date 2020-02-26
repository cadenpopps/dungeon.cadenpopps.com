Player.prototype = Object.create(Entity.prototype);
function Player(x, y, config, playerClass, actions, animations) {
	Entity.call(this, x, y, 0, 1, display_opaque, physical_solid, animations);

	this.components.push(component_direction, component_health, component_combat, component_actions, component_collision, component_sprint, component_light_emitter, component_abilities);

	this.direction = new DirectionComponent(direction_down);
	this.health = new HealthComponent(config.health);
	this.combat = new CombatComponent(config.attackDamage, config.magicDamage, config.armor);
	this.actions = new ActionsComponent(actions);
	this.sprint = new SprintComponent(config.sprint_threshhold, config.sprint_speed);
	this.lightEmitter = new LightEmitterComponent(light_level_player);
	this.abilities = new AbilitiesComponent(config.abilities);

	console.log(this);

	// this.components.push(component_experience);
	// this.level = new ExperienceComponent(0);
}
