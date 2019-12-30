class ActionSystem extends System {

	constructor() {
		super([component_actions]);
	}

	init(engine) {
		this.hitstunTimer = 0;
	}

	run(engine) {
		if(this.hitstunTimer == 0) {
			for(let entity of this.objects) {
				if(entity.actions.busy > 0) {
					entity.actions.busy -= entity.actions.speed;
				}
				else{
					this.setCurrentAction(entity, engine);
				}
			}
		}
		else {
			this.hitstunTimer--;
		}
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_successful_action:
				this.handleSuccessfulAction(engine, data.entity, data.action);
				break;
			case event_failed_action:
				this.handleFailedAction(engine, data.entity);
				break;
			case event_hitstun:
				this.hitstunTimer = data.ticks;
				break;
		}
	}

	setCurrentAction(entity, engine) {
		entity.actions.currentAction = entity.actions.nextAction;
		entity.actions.nextAction = action_none;
	}

	handleSuccessfulAction(engine, entity, action) {
		entity.actions.busy = action_to_length[action];

		if(entity.components.includes(component_sprint) && Utility.isMovementAction(action)) {
			this.handleSprinting(entity, engine);
		}

		entity.animation.animation = action_to_animation[action];
		engine.sendEvent(event_new_animation, entity);

		entity.actions.lastActionFailed = false;
		entity.actions.lastAction = action;
		entity.actions.currentAction = action_none;
	}

	handleFailedAction(engine, entity) {
		entity.actions.busy = 3;

		// entity.animation.animation = action_to_animation[entity.actions.currentAction];
		// engine.sendEvent(event_new_animation, entity);

		entity.actions.lastActionFailed = true;
		entity.actions.lastAction = entity.actions.currentAction;
		entity.actions.currentAction = action_none;
	}

	handleSprinting(entity, engine) {
		if(entity.sprint.sprinting) {
			entity.actions.busy = action_to_length[action_sprint];
		}
	}
}
