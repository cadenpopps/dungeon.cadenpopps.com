class AISystem extends System {

	constructor(config) {
		super([component_ai]);
		this.config = config;
	}

	run(engine) {
		for(let entity of this.objects) {
			if(Utility.distance(entity.position, engine.getPlayer().position) < entity_active_range) {
				if(entity.ai.noticedPlayer) {
					this.handleActiveEntity(engine, entity, engine.getPlayer());
				}
				else {
					this.handleIdleEntity(engine, entity, engine.getPlayer());
				}
			}
		}
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_entity_attacked:
				if(data.attacker instanceof Player) {
					data.target.ai.noticedPlayer = true;
				}
				break;
		}
	}

	addObject(object) {
		super.addObject(object);
	}

	handleActiveEntity(engine, entity, player) {
		if(entity.actions.busy == 0) {
			entity.actions.nextAction = this.determineAction(engine, entity, player);
		}
	}

	determineAction(engine, entity, player) {
		if(Utility.entityDistance(entity, player) <= entity.ai.attackRange) {
			return this.getAttackAction(entity, player);
		}
		else{
			return this.getMoveCloserAction(engine, entity, player);
		}
	}

	getAttackAction(entity, player) {
		let dir = Utility.getDirectionToEntity(entity, player);
		entity.direction.direction = dir;
		return direction_to_attack[dir];
	}

	getMoveCloserAction(engine, entity, player) {
		// Utility.shortestPath(engine.getMap(), entity.position, player.position);
		return direction_to_movement[Utility.getDirectionToEntity(entity, player)];
	}

	handleIdleEntity(engine, entity, player) {
		if(entity.ai.idleTimer == 0) {
			entity.actions.nextAction = this.determineIdleAction(engine, entity);
			if(entity.display.visible) {
				entity.ai.noticedPlayer = this.checkNoticePlayer(entity, player);
				if(!entity.ai.noticedPlayer) {
					entity.ai.idleTimer = randomInt(this.config.MIN_IDLE_TIME, this.config.MAX_IDLE_TIME);
				}
			}
		}
		else {
			entity.ai.idleTimer--;
		}
	}

	checkNoticePlayer(entity, player) {
		switch(entity.direction.direction) {
			case direction_up:
				return entity.collision.top >= player.collision.bottom;
			case direction_right:
				return entity.collision.left <= player.collision.right;
			case direction_down:
				return entity.collision.bottom <= player.collision.top;
			case direction_left:
				return entity.collision.bottom >= player.collision.top;
			default:
				console.log("Cannot determine entity direction: " + entity.direction.direction);
				console.log(entity);
				return false;
		}
	}

	determineIdleAction(engine, entity) {
		let randomMoveAction = action_move + randomInt(1, 5);
		if(MovementSystem.validMove(engine, entity, MovementSystem.getDestination(entity, randomMoveAction))) {
			return randomMoveAction;
		}
		else {
			if(randomMoveAction == action_move_up) {
				return action_move_down;
			}
			else if(randomMoveAction == action_move_right) {
				return action_move_left;
			}
			else if(randomMoveAction == action_move_down) {
				return action_move_up;
			}
			else if(randomMoveAction == action_move_left) {
				return action_move_right;
			}
			return action_none;
		}
	}
}
