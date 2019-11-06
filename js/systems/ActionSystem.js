class ActionSystem extends System {
	
	constructor() {
		super([component_actions]);
	}

	run(engine) {
		for(let entity of this.objects) {
			if(entity.actions.busy > 0) {
				entity.actions.busy -= entity.actions.speed;
			}
			else{
				this.setCurrentAction(entity, engine);
			}
		}
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_successful_action:
				this.handleSuccessfulAction(data.entity, engine);
				break;
			case event_failed_action:
				this.handleFailedAction(data.entity, engine);
				break;
		}
	}

	setCurrentAction(entity, engine) {
		entity.actions.currentAction = entity.actions.nextAction;
		entity.actions.nextAction = action_none;
	}

	handleSuccessfulAction(entity, engine) {
		entity.actions.busy = action_to_length[entity.actions.currentAction];

		if(entity.components.includes(component_sprint)) {
			this.handleSprinting(entity, engine);
		}

		entity.animation.animation = action_to_animation[entity.actions.currentAction];
		engine.sendEvent(event_new_animation, entity);

		entity.actions.lastActionFailed = false;
		entity.actions.lastAction = entity.actions.currentAction;
		entity.actions.currentAction = action_none;
	}

	handleFailedAction(entity, engine) {
		entity.actions.busy = 1;

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
