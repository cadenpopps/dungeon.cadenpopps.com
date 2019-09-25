function Entity(x, y, initialDepth = 0, initialHealth = 3, initialStrength = 1, initialMagic = 1, initialIntelligence = 1, size = 1, animations) {
	// let size = 1;
	// let texture = undefined;
	this.components = [component_position, component_depth, component_health, component_strength, component_magic, component_intelligence, component_direction, component_physical, component_display, component_actions, component_animation];
	this.position = new PositionComponent(x, y);
	this.depth = new DepthComponent(initialDepth);
	this.direction = new DirectionComponent();
	this.physical = new PhysicalComponent(true, false, size);
	this.health = new HealthComponent(initialHealth);
	this.strength = new StrengthComponent(initialStrength);
	this.magic = new MagicComponent(initialMagic);
	this.intelligence = new IntelligenceComponent(initialIntelligence);
	this.display = new DisplayComponent(undefined, size, size);
	this.animation = new AnimationComponent(animations);
	let defaultActions = [action_move_up, action_move_right, action_move_down, action_move_left, action_foward_attack, action_spin_attack];
	this.actions = new ActionComponent(defaultActions);
}
