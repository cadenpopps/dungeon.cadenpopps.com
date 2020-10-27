function PlayerTemplate(x = 0, y = 0, depth = 0, size = DEFAULT_PLAYER_SIZE, health = DEFAULT_PLAYER_HEALTH, attackDamage = DEFAULT_PLAYER_ATTACK_DAMAGE, magicDamage = DEFAULT_PLAYER_MAGIC_DAMAGE, armor = DEFAULT_PLAYER_ARMOR, abilities, animations = -1) {
	return {
		component_position: new PositionComponent(x, y),
		component_depth: new DepthComponent(depth),
		component_display: new DisplayComponent(size, size),
		component_collision: new CollisionComponent(x, y, size, size),
		component_direction: new DirectionComponent(direction_down),
		component_health: new HealthComponent(health),
		component_combat: new CombatComponent(attackDamage, magicDamage, armor),
		component_actions: new ActionsComponent(DEFAULT_PLAYER_ACTIONS),
		component_controller: new ControllerComponent(DEFAULT_CONTROLLER_LAYOUT),
		component_abilities: new AbilitiesComponent(abilities),
		component_animation: new AnimationComponent(animations)

		// component_sprint: new SprintComponent(DEFAULT_SPRIN, config.sprint_speed),
		// component_lightEmitter: new LightEmitterComponent(light_level_player),
	}
}

function EnemyTemplate(x = 0, y = 0, size = DEFAULT_ENEMY_SIZE, direction = randomInt(0, 3), health = DEFAULT_ENEMY_HEALTH, attackDamage = DEFAULT_ENEMY_ATTACK_DAMAGE, magicDamage = DEFAULT_ENEMY_MAGIC_DAMAGE, armor = DEFAULT_ENEMY_ARMOR, actions = DEFAULT_ENEMY_ACTIONS, abilities, animations = -1) {
	return {
		component_position: new PositionComponent(x, y),
		component_display: new DisplayComponent(size, size),
		component_collision: new CollisionComponent(x, y, size, size),
		component_direction: new DirectionComponent(direction),
		component_health: new HealthComponent(health),
		component_combat: new CombatComponent(attackDamage, magicDamage, armor),
		component_actions: new ActionsComponent(actions),
		component_abilities: new AbilitiesComponent(abilities),
		component_animation: new AnimationComponent(animations)
	}
}

function SquareTemplate(x, y, type) {
	if(type == square_wall) {
		return {
			component_position: new PositionComponent(x, y),
			component_display: new DisplayComponent(1, 1),
			component_texture: new TextureComponent(texture_wall),
			component_collision: new CollisionComponent(x, y, 1, 1)
		}
	}
	else if(type == square_floor) {
		return {
			component_position: new PositionComponent(x, y),
			component_display: new DisplayComponent(1, 1),
			component_texture: new TextureComponent(texture_floor)
		}
	}
	else if(type == square_door) {
		return {
			component_position: new PositionComponent(x, y),
			component_display: new DisplayComponent(1, 1),
			component_texture: new TextureComponent(texture_door_closed),
			component_collision: new CollisionComponent(x, y, 1, 1),
			component_interactable: new TextureComponent(interactable_door)
		}
	}
	else if(type == square_stair) {
		return {
			component_position: new PositionComponent(x, y),
			component_display: new DisplayComponent(1, 1),
			component_texture: new TextureComponent(texture_stair),
			component_interactable: new TextureComponent(interactable_stair)
		}
	}
	else if(type == square_level_origin) {
		return {
			component_position: new PositionComponent(x, y),
			component_display: new DisplayComponent(1, 1),
			component_texture: new TextureComponent(texture_level_origin)
		}
	}
}

function TorchTemplate(x = 0, y = 0, size = 1, direction = randomInt(0, 3)) {
	return {
		component_position: new PositionComponent(x, y),
		component_display: new DisplayComponent(size, size),
		component_direction: new DirectionComponent(direction),
		component_texture: new TextureComponent(texture_torch)
		// component_animation: new AnimationComponent(animations),
	}
}
