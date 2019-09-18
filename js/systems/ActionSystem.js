
ActionSystem.prototype = Object.create(System.prototype);
function ActionSystem (){
	System.call(this);

	this.componentRequirements = [component_actions];

	this.run = function(engine){
		for(let object of this.objects){
			let actions = object.actions;
			for(let c in actions.cooldowns){
				if(actions.cooldowns[c] > 0) actions.cooldowns[c]--;
			}
			if(actions.busy > 0){
				actions.busy--;
			}
			else if(actions.nextAction != action_none){
				if(actions.cooldowns[actions.nextAction] == 0){
					setCurrentAction(object);
				}
			}
		}
	}

	let setCurrentAction = function(object){
		object.actions.currentAction = object.actions.nextAction;
		object.actions.nextAction = action_none;
		addCooldowns(object, object.actions.currentAction);
	}

	let addCooldowns = function(object, action){
		object.actions.busy = action_cooldown[action];
		object.actions.cooldowns[action] = action_cooldown[action];
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
