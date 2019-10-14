Player.prototype = Object.create(Entity.prototype);
function Player(x, y, config, playerClass, actions, animations) {
	Entity.call(this, x, y, 0, playerClass.health, playerClass.strength, playerClass.magic, playerClass.intelligence, config.size, config.speed, actions, animations);

	this.components.push(component_sprint);
	this.sprint = new SprintComponent(config.sprint_threshhold);

	// this.components.push(component_experience);
	// this.level = new ExperienceComponent(0);
}
