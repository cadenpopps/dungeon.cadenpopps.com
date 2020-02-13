Player.prototype = Object.create(Entity.prototype);
function Player(x, y, config, playerClass, actions, animations) {
	Entity.call(this, x, y, 0, playerClass.health, 10, 10, 10, 1, actions, animations);

	this.components.push(component_collision);
	this.collision = new CollisionComponent(x, y, 1);
	this.components.push(component_sprint);
	this.sprint = new SprintComponent(config.sprint_threshhold, config.sprint_speed);

	this.components.push(component_light_emitter);
	this.lightEmitter = new LightEmitterComponent(light_level_player);

	this.display.discovered = true;

	// this.components.push(component_experience);
	// this.level = new ExperienceComponent(0);
}
