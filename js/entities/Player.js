// Player.prototype = Object.create(Entity.prototype);
// function Player(x, y, config, playerClass, actions, animations) {
// 	Entity.call(this, x, y, 0, 1, display_opaque, physical_solid, animations);
// 	this.components.push(component_health, component_direction, component_combat, component_actions, component_collision, component_sprint, component_light_emitter, component_abilities);

// 	this.health = new HealthComponent(config.health);
// 	this.direction = new DirectionComponent(direction_down);
// 	this.combat = new CombatComponent(config.attackDamage, config.magicDamage, config.armor);
// 	this.actions = new ActionsComponent(actions);
// 	this.sprint = new SprintComponent(config.sprint_threshhold, config.sprint_speed);
// 	this.lightEmitter = new LightEmitterComponent(light_level_player);
// 	this.abilities = new AbilitiesComponent(config.abilities);

// 	this.components.push(component_experience);
// 	this.level = new ExperienceComponent(0);
// }

function Player(ID, components) {
	this.id = ID;
	this.components = {}
	for(let component in components) {
		this.components[component] = components[component];
	}
	// this.components = {
	// 	component_health = new HealthComponent(config.health);
	// 	component_direction = new DirectionComponent(direction_down);
	// 	component_combat = new CombatComponent(config.attackDamage, config.magicDamage, config.armor);
	// 	component_actions = new ActionsComponent(actions);
	// 	component_sprint = new SprintComponent(config.sprint_threshhold, config.sprint_speed);
	// 	component_lightEmitter = new LightEmitterComponent(light_level_player);
	// 	component_abilities = new AbilitiesComponent(config.abilities);
	// };
}
