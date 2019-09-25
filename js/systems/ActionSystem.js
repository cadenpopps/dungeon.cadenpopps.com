ActionSystem.prototype = Object.create(System.prototype);
function ActionSystem (){
	System.call(this);

	this.componentRequirements = [component_actions];

	this.run = function(engine){
		for(let object of this.objects){
			if(object.actions.busy > 0){
				object.actions.busy--;
			}
			else{
				setCurrentAction(object, engine);
			}
		}
	}

	let setCurrentAction = function(object, engine){
		object.actions.currentAction = object.actions.nextAction;
		object.actions.nextAction = action_none;
		if(object.components.includes(component_sprint)){
			handleSprinting(object, engine);
		}
		addCooldowns(object, object.actions.currentAction);
	}

	let handleSprinting = function(object, engine){
		if(!object.sprint.sprinting && Utility.isMovementAction(object.actions.currentAction)){
			object.sprint.sprintCounter++;
			if(object.sprint.sprintCounter == object.sprint.movesBeforeSprinting){
				object.sprint.sprinting = true;	
				object.sprint.sprintCounter = 0;
				if(object instanceof Player){
					engine.sendEvent(event_player_start_sprinting);
				}
			}
		}
		else if(object.sprint.sprinting && !Utility.isMovementAction(object.actions.currentAction)){
			object.sprint.sprinting = false;	
			if(object instanceof Player){
				engine.sendEvent(event_player_stop_sprinting);
			}
		}
		else if(object.sprint.sprinting && Utility.isMovementAction(object.actions.currentAction)){
			Utility.convertMovementToSprint(object);
		}
	}

	let addCooldowns = function(object, action){
		object.actions.busy = action_cooldown[action];
		// object.actions.cooldowns[action] = action_cooldown[action];
	}

	this.handleEvent = function(engine, eventID){
		// switch(eventID){
		// 	case event_entity_moved:
		// 		addCooldowns(action_move, e.entity);
		// 		break;
		// 	case event_entity_sprinted:
		// 		addCooldowns(action_sprint, e.entity);
		// 		break;
		// 	case event_entity_rolled:
		// 		addCooldowns(action_roll, e.entity);
		// 		break;
		// 	case event_entity_failed_roll:
		// 		addCooldowns(action_failed_roll, e.entity);
		// 		break;
		// }
	}
}
