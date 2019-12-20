class SprintSystem extends System {

	constructor() {
		super([component_sprint]);
	}

	init(engine) {
		this.sprintTimer = [];
		this.sprintTimerMax = 20;
		// this.combat = false;
	}

	run(engine) {
		for(let entity of this.objects) {
			// if(!this.combat) {
			this.decrementSprintCounter(entity);
			this.determineSprintState(engine, entity);
			// }
		}
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_successful_action:
				if(data.entity.components.includes(component_sprint)) {
					this.sprintHandler(engine, data.entity, data.action);
				}
				break;
				// case event_begin_combat:
				// 	this.combat = true;
				// 	this.stopAllSprinting(engine);
				// 	break;
				// case event_end_combat:
				// 	this.combat = false;
				// 	break;
		}
	}

	addObject(object) {
		if(object.components.includes(component_sprint)) {
			super.addObject(object);
			this.sprintTimer[object] = 0;
		}
	}

	sprintHandler(engine, entity, action) {
		if(Utility.isMovementAction(action)) {
			if(entity.sprint.sprintCounter < entity.sprint.movesBeforeSprinting) {
				entity.sprint.sprintCounter++;
			}
			this.resetSprintTimer(entity);
		}
		else {
			if(entity.sprint.sprintCounter > 0) {
				entity.sprint.sprintCounter--;
			}
		}
		this.determineSprintState(engine, entity);
	}

	determineSprintState(engine, entity) {
		if(entity.sprint.sprinting) {
			if(entity.sprint.sprintCounter < entity.sprint.movesBeforeSprinting) {
				this.stopSprinting(engine, entity);
			}
		}
		else if(!entity.sprint.sprinting && entity.sprint.sprintCounter == entity.sprint.movesBeforeSprinting) {
			this.startSprinting(engine, entity);
		}
	}

	startSprinting(engine, entity) {
		if(entity instanceof Player) {
			engine.sendEvent(event_player_start_sprinting);
		}
		entity.sprint.sprinting = true;
		this.resetSprintTimer(entity);
	}

	stopSprinting(engine, entity) {
		if(entity instanceof Player) {
			engine.sendEvent(event_player_stop_sprinting);
		}
		entity.sprint.sprinting = false;
		entity.sprint.sprintCounter = 0;
	}

	resetSprintTimer(entity) {
		this.sprintTimer[entity] = this.sprintTimerMax;
	}

	decrementSprintCounter(entity) {
		if(entity.sprint.sprintCounter > 0) {
			this.sprintTimer[entity]--;
			if(this.sprintTimer[entity] <= 0) {
				entity.sprint.sprintCounter--;
				this.resetSprintTimer(entity);
			}
		}
	}

	stopAllSprinting(engine) {
		for(let entity of this.objects) {
			this.stopSprinting(engine, entity);
		}
	}
}
