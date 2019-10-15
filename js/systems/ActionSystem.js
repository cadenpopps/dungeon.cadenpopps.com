ActionSystem.prototype = Object.create(System.prototype);
function ActionSystem (){
	System.call(this);

	this.componentRequirements = [component_actions];

	this.run = function(engine){
		for(let object of this.objects){
			if(object.actions.busy > 0){
				object.actions.busy -= object.actions.speed;
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
	}

	let handleSprinting = function(object, engine){
		if(!object.sprint.sprinting && Utility.isMovementAction(object.actions.currentAction)){
			object.sprint.sprintCounter++;
			if(object.sprint.sprintCounter == object.sprint.movesBeforeSprinting){
				if(object instanceof Player) {
					engine.sendEvent(event_player_start_sprinting);
				}
				object.sprint.sprinting = true;	
				object.sprint.sprintCounter = 0;
			}
		}
		else if(object.sprint.sprinting && !Utility.isMovementAction(object.actions.currentAction)){
			if(object instanceof Player) {
				engine.sendEvent(event_player_stop_sprinting);
			}
			object.sprint.sprinting = false;	
		}
		else if(object.sprint.sprinting && Utility.isMovementAction(object.actions.currentAction)){
			object.actions.currentAction = movement_to_sprint[object.actions.currentAction];
		}
	}

	this.handleEvent = function(engine, eventID, data){
		switch(eventID){
			case event_successful_action:
				handleSuccessfulAction(data, engine);
				break;
		}
	}

	let handleSuccessfulAction = function(object, engine){
		object.actions.busy = action_length[object.actions.currentAction];

		object.animation.animation = action_to_animation[object.actions.currentAction];
		engine.sendEvent(event_new_animation, object);

		object.actions.lastAction = object.actions.currentAction;
		object.actions.currentAction = action_none;
	}
}
