class AISystem extends GameSystem {

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
			// case event_entity_attacked:
			// 	if(data.attacker instanceof Player) {
			// 		let target = data.target;
			// 		let self = this;
			// 		target.ai.idleTimer = 100;
			// 		setTimeout(function() {
			// 			target.ai.noticedPlayer = true;
			// 		}, this.config.MOB_REACTION_TIME);
			// 	}
			// 	break;
			case event_successful_action:
				let entity = data.entity;
				if(entity instanceof Mob && !entity.ai.noticedPlayer && entity.display.visible) {
					let self = this;
					setTimeout(function() {
						entity.ai.noticedPlayer = self.checkNoticePlayer(engine, entity, engine.getPlayer());
					}, this.config.MOB_REACTION_TIME);
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
		return randomInt(11, 14);
		// if(Utility.entityDistance(entity, player) <= entity.ai.attackRange) {
		// 	return this.getAttackAction(entity, player);
		// }
		// else{
		// 	return this.getMoveCloserAction(engine, entity, player);
		// }
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
			entity.ai.idleTimer = randomInt(this.config.MIN_IDLE_TIME, this.config.MAX_IDLE_TIME);
		}
		else {
			entity.ai.idleTimer--;
		}
	}

	checkNoticePlayer(engine, entity, player) {
		switch(entity.direction.direction) {
			case direction_up:
				if(entity.collision.top + 1 >= player.collision.bottom) {
					return VisionSystem.lineOfSight(engine, entity.position, player.position);
				}
				break;
			case direction_right:
				if(entity.collision.right - 1 <= player.collision.left) {
					return VisionSystem.lineOfSight(engine, entity.position, player.position);
				}
				break;
			case direction_down:
				if(entity.collision.bottom - 1 <= player.collision.top) {
					return VisionSystem.lineOfSight(engine, entity.position, player.position);
				}
				break;
			case direction_left:
				if(entity.collision.left + 1 >= player.collision.right) {
					return VisionSystem.lineOfSight(engine, entity.position, player.position);
				}
				break;
			default:
				console.log("Cannot determine entity direction: " + entity.direction.direction);
				return false;
		}
		return false;
	}

	determineIdleAction(engine, entity) {
		let randomMoveAction = action_move + randomInt(1, 5);
		if(MovementSystem.validMove(engine, entity, MovementSystem.getDestination(entity, randomMoveAction))) {
			return randomMoveAction;
		}
		else {
			// console.log("test");
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
