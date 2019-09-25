Player.prototype = Object.create(Entity.prototype);
function Player(x, y, initialHealth, initialStrength, initialMagic, initialIntelligence) {
	let playerSize = 1;
	let initialDepth = 0;
	Entity.call(this, x, y, initialDepth, initialHealth, initialStrength, initialMagic, initialIntelligence, playerSize, CONFIG.DEFAULT_ANIMATIONS);

	this.components.push(component_sprint);
	this.sprint = new SprintComponent(3);

	// this.components.push(component_experience);
	// this.level = new ExperienceComponent(0);
}
