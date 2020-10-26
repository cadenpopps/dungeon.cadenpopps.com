class SprintSystem extends GameSystem {

	constructor(config) {
		super([component_sprint]);
		this.config = config;
	}

	init(engine) {
		for(let entity of this.objects) {
			this.resetSprintCounter(entity);
		}
	}

	run(engine) {
		// let currentTime = millis();
		for(let entity of this.objects) {
			if(entity.sprint.sprinting) {
				if(this.sprintTimerExpired(entity, this.config.SPRINT_RESET_TIME_SPRINTING)) {
					this.stopSprinting(engine, entity);
				}
			}
			else {
				if(this.sprintTimerExpired(entity, this.config.SPRINT_RESET_TIME_WALKING)) {
					this.resetSprintCounter(entity);
				}
			}
		}
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_successful_action:
				if(data.entity.components.includes(component_sprint)) {
					if(Utility.isMovementAction(data.action)) {
						if(data.entity.sprint.sprinting) {
							this.handleSprinting(engine, data.entity);
						}
						else {
							this.decrementSprintCounter(engine, data.entity, data.action);
						}
					}
					else {
						if(data.entity.sprint.sprinting) {
							this.stopSprinting(engine, data.entity);
						}
						else {
							this.resetSprintCounter(data.entity);
						}
					}
				}
				break;
			case event_up_level: case event_down_level:
				this.stopAllSprinting(engine);
				break;

		}
	}

	handleSprinting(engine, entity) {
		if(this.sprintTimerExpired(entity, this.config.SPRINT_RESET_TIME_SPRINTING)) {
			this.stopSprinting(engine, entity);
		}
		else {
			if(entity.actions.busy > entity.sprint.sprintSpeed) {
				entity.actions.busy = entity.sprint.sprintSpeed;
			}
			for(let a in entity.actions.actions) {
				if(entity.actions.actions[a].currentCooldown > entity.sprint.sprintSpeed) {
					entity.actions.actions[a].currentCooldown = entity.sprint.sprintSpeed + 1;
				}
			}
			entity.sprint.lastMoveTime = millis();
		}
	}

	startSprinting(engine, entity) {
		if(entity instanceof Player) {
			engine.sendEvent(event_player_start_sprinting);
		}
		entity.sprint.sprinting = true;
		this.resetSprintCounter(entity);
	}

	stopSprinting(engine, entity) {
		if(entity instanceof Player) {
			engine.sendEvent(event_player_stop_sprinting);
		}
		entity.sprint.sprinting = false;
		this.resetSprintCounter(entity);
	}

	decrementSprintCounter(engine, entity) {
		if(entity.sprint.sprinting) {
			entity.sprint.lastMoveTime = millis();
		}
		else if(entity.sprint.sprintCounter > 0) {
			if(this.sprintTimerExpired(entity, this.config.SPRINT_RESET_TIME_WALKING)) {
				this.resetSprintCounter(entity);
			}
			else {
				entity.sprint.sprintCounter--;
				entity.sprint.lastMoveTime = millis();
			}
		}
		else {
			this.startSprinting(engine, entity);
		}
	}

	resetSprintCounter(entity) {
		entity.sprint.sprintCounter = entity.sprint.movesBeforeSprinting;
		entity.sprint.lastMoveTime = millis();
	}

	sprintTimerExpired(entity, time) {
		return (millis() - entity.sprint.lastMoveTime > time);
	}

	stopAllSprinting(engine) {
		for(let entity of this.objects) {
			this.stopSprinting(engine, entity);
		}
	}
}
