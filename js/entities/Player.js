Player.prototype = Object.create(Entity.prototype);
function Player(x, y, config, playerClass, actions, animations) {
	Entity.call(this, x, y, 0, playerClass.health, playerClass.strength, playerClass.dexterity, playerClass.intelligence, config.size, config.speed, actions, animations);

	this.components.push(component_collision);
	this.collision = new CollisionComponent(x, y, config.size);
	this.components.push(component_sprint);
	this.sprint = new SprintComponent(config.sprint_threshhold);

	this.components.push(component_light_emitter);
	this.lightEmitter = new LightEmitterComponent(light_level_player);

	this.display.discovered = true;

	// this.components.push(component_experience);
	// this.level = new ExperienceComponent(0);
}
