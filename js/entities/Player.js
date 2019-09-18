Player.prototype = Object.create(Entity.prototype);
function Player(x, y, hp, str, mag, int) {

	Entity.call(this, x, y, hp, str, mag, int, CONFIG.DEFAULT_ANIMATIONS);

	this.components.push(component_sprint);
	this.sprint = new SprintComponent(2);
}
