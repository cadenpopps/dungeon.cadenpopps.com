function PlayerTemplate(x = 0, y = 0, depth = 0, size = DEFAULT_PLAYER_SIZE, health = DEFAULT_PLAYER_HEALTH, attackDamage = DEFAULT_PLAYER_ATTACK_DAMAGE, magicDamage = DEFAULT_PLAYER_MAGIC_DAMAGE, armor = DEFAULT_PLAYER_ARMOR, abilities, animations = -1) {
	let components = [];
	components[component_position] = new PositionComponent(x, y);
	components[component_depth] = new DepthComponent(depth);
	components[component_display] = new DisplayComponent(size, size);
	components[component_camera] = new CameraComponent(x, y);
	components[component_collision] = new CollisionComponent(x, y, size, size);
	components[component_direction] = new DirectionComponent(direction_down);
	components[component_health] = new HealthComponent(health);
	components[component_combat] = new CombatComponent(attackDamage, magicDamage, armor);
	components[component_actions] = new ActionsComponent(DEFAULT_PLAYER_ACTIONS);
	components[component_controller] = new ControllerComponent(DEFAULT_CONTROLLER_LAYOUT);
	components[component_abilities] = new AbilitiesComponent(abilities);
	components[component_animation] = new AnimationComponent(animations);
	// component_sprint: new SprintComponent(DEFAULT_SPRIN, config.sprint_speed),
	// component_lightEmitter: new LightEmitterComponent(light_level_player),
	return components;
}

function EnemyTemplate(x = 0, y = 0, size = DEFAULT_ENEMY_SIZE, direction = randomInt(0, 3), health = DEFAULT_ENEMY_HEALTH, attackDamage = DEFAULT_ENEMY_ATTACK_DAMAGE, magicDamage = DEFAULT_ENEMY_MAGIC_DAMAGE, armor = DEFAULT_ENEMY_ARMOR, actions = DEFAULT_ENEMY_ACTIONS, abilities, animations = -1) {
	let components = [];
	components[component_position] = new PositionComponent(x, y);
	components[component_display] = new DisplayComponent(size, size);
	components[component_collision] = new CollisionComponent(x, y, size, size);
	components[component_direction] = new DirectionComponent(direction);
	components[component_health] = new HealthComponent(health);
	components[component_combat] = new CombatComponent(attackDamage, magicDamage, armor);
	components[component_actions] = new ActionsComponent(actions);
	components[component_abilities] = new AbilitiesComponent(abilities);
	components[component_animation] = new AnimationComponent(animations);
	return components;
}

function SquareTemplate(x, y, type) {
	let components = [];
	if(type == square_wall) {
		components[component_position] = new PositionComponent(x, y);
		components[component_display] = new DisplayComponent(1, 1);
		components[component_texture] = new TextureComponent(texture_wall);
		components[component_collision] = new CollisionComponent(x, y, 1, 1);
	}
	else if(type == square_floor) {
		components[component_position] = new PositionComponent(x, y);
		components[component_display] = new DisplayComponent(1, 1);
		components[component_texture] = new TextureComponent(texture_floor);
	}
	else if(type == square_door) {
		components[component_position] = new PositionComponent(x, y);
		components[component_display] = new DisplayComponent(1, 1);
		components[component_texture] = new TextureComponent(texture_door_closed);
		components[component_collision] = new CollisionComponent(x, y, 1, 1);
		components[component_interactable] = new InteractableComponent(interactable_door);
	}
	else if(type == square_stair) {
		components[component_position] = new PositionComponent(x, y);
		components[component_display] = new DisplayComponent(1, 1);
		components[component_texture] = new TextureComponent(texture_stair);
		components[component_interactable] = new InteractableComponent(interactable_stair);
	}
	else if(type == square_level_origin) {
		components[component_position] = new PositionComponent(x, y);
		components[component_display] = new DisplayComponent(1, 1);
		components[component_texture] = new TextureComponent(texture_level_origin);
	}
	return components;
}

function TorchTemplate(x = 0, y = 0, size = 1, direction = randomInt(0, 3)) {
	let components = [];
	components[component_position] = new PositionComponent(x, y);
	components[component_display] = new DisplayComponent(size, size);
	components[component_direction] = new DirectionComponent(direction);
	components[component_texture] = new TextureComponent(texture_torch);
	return components;
}
