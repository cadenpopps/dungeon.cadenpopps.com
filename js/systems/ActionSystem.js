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

				for(let a in entity.actions.actions) {
					if(entity.actions.actions[a].currentCooldown > 0) {
						entity.actions.actions[a].currentCooldown--;
					}
				}

				if(entity.actions.busy > 0) {
					entity.actions.busy--;
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

	setCooldowns(entity, action) {
		entity.actions.busy = entity.actions.actions[action].time;
		entity.actions.actions[action].currentCooldown = entity.actions.actions[action].cooldown;
	}

	handleSuccessfulAction(engine, entity, action) {
		this.setCooldowns(entity, action);

		if(action_to_animation[action] !== undefined && entity.animation.animations[action_to_animation[action]] !== undefined) {
			entity.animation.animation = action_to_animation[action];
			engine.sendEvent(event_new_animation, entity);
		}

		entity.actions.lastActionFailed = false;
		entity.actions.lastAction = action;
		entity.actions.currentAction = action_none;
	}

	handleFailedAction(engine, entity) {
		this.setCooldowns(entity, action_none);

		// entity.animation.animation = action_to_animation[entity.actions.currentAction];
		// engine.sendEvent(event_new_animation, entity);

		entity.actions.lastActionFailed = true;
		entity.actions.lastAction = entity.actions.currentAction;
		entity.actions.currentAction = action_none;
	}
}
