
ActionSystem.prototype = Object.create(System.prototype);
function ActionSystem (){
	System.call(this);

	this.componentRequirements = [component_actions];
	this.acceptedEvents = [event_entity_moved, event_entity_sprinted, event_entity_rolled, event_entity_failed_roll];

	this.run = function(engine){
		for(let o of this.objects){
			for(let i = o.actions.cooldowns.length - 1; i >= 0; i--){
				if(o.actions.cooldowns[i].cooldown > 0){o.actions.cooldowns[i].cooldown--;}
				else {o.actions.cooldowns.splice(i,1);}
			}
			if(o.actions.busy > 0){
				o.actions.busy--;
			}
			else if(o.actions.nextAction != action_none){
				switch(o.actions.nextAction){
					case action_move_up: case action_move_right: case action_move_down: case action_move_left:
						moveCommand(engine, o, o.actions.nextAction);
						break;
					case action_roll:
						rollCommand(engine, o, direction_to_action[action_roll + o.direction.direction]);
						break;
				}
				o.actions.nextAction = action_none;
			}
		}
	}

	let moveCommand = function(engine, object, action){
		object.actions.lastAction = action;
		engine.sendCommand({commandID: command_move_entity, "entity": object, "direction": action});
	}

	let rollCommand = function(engine, object, action){
		object.actions.lastAction = action;
		engine.sendCommand({commandID: command_roll_entity, "entity": object, "direction": action});
	}

	this.handleEvent = function(engine, e){
		if(this.acceptedEvents.includes(e.eventID)){
			switch(e.eventID){
				case event_entity_moved:
					addCooldowns(action_move, e.entity);
					break;
				case event_entity_sprinted:
					addCooldowns(action_sprint, e.entity);
					break;
				case event_entity_rolled:
					addCooldowns(action_roll, e.entity);
					break;
				case event_entity_failed_roll:
					addCooldowns(action_failed_roll, e.entity);
					break;
			}
		}
	}

	let addCooldowns = function(action, entity){
		entity.actions.busy = action_length[action];
		entity.actions.cooldowns.push({"action": action, "cooldown": action_cooldown[action]});
	}
}
