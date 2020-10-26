function PlayerTemplate(x = 0, y = 0, depth = 0, size = DEFAULT_PLAYER_SIZE, health = DEFAULT_PLAYER_HEALTH, attackDamage = DEFAULT_PLAYER_ATTACK_DAMAGE, magicDamage = DEFAULT_PLAYER_MAGIC_DAMAGE, armor = DEFAULT_PLAYER_ARMOR) {
	return {
		component_position: new PositionComponent(x, y),
		component_depth: new DepthComponent(depth),
		component_display: new DisplayComponent(size, size, visible),
		component_collision: new CollisionComponent(x, y, size, size),
		component_health: new HealthComponent(health),
		component_direction: new DirectionComponent(direction_down),
		component_combat: new CombatComponent(attackDamage, magicDamage, armor),
		component_actions: new ActionsComponent(actions),
		component_sprint: new SprintComponent(config.sprint_threshhold, config.sprint_speed),
		component_lightEmitter: new LightEmitterComponent(light_level_player),
		component_abilities: new AbilitiesComponent(config.abilities);
	}
	// if(animations !== null) {
	// 	this.components.push(component_animation);
	// 	this.animation = new AnimationComponent(animations);
	// }
}
