function Entity(x, y, initialDepth, initialHealth, initialStrength, initialDexterity, initialIntelligence, size, speed, actions, animations) {
	this.components = [component_position, component_depth, component_health, component_strength, component_dexterity, component_magic, component_direction, component_physical, component_display, component_actions, component_animation, component_combat];

	this.position = new PositionComponent(x, y);
	this.depth = new DepthComponent(initialDepth);
	this.direction = new DirectionComponent(direction_down);

	this.physical = new PhysicalComponent(physical_solid, size);

	this.health = new HealthComponent(initialHealth);
	this.strength = new StrengthComponent(initialStrength);
	this.dexterity = new DexterityComponent(initialDexterity);
	this.intelligence = new IntelligenceComponent(initialIntelligence);
	this.combat = new CombatComponent(initialStrength, initialDexterity, initialIntelligence);

	this.display = new DisplayComponent(size, size, display_transparent);
	this.animation = new AnimationComponent(animations);

	this.actions = new ActionComponent(actions, speed);
}
