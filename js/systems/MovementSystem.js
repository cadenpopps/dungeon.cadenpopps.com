
MovementSystem.prototype = Object.create(System.prototype);
function MovementSystem(){
	System.call(this);

	this.componentRequirements = [component_position, component_physical, component_actions];

	this.acceptedCommands = [command_move_entity, command_roll_entity];

	let board;

	this.run = function(engine){}

	let moveEvent = function(engine, dir, object){
		let e = {
			eventID: event_entity_moved,
			data: [object, dir]
		}
		engine.sendEvent(e);
	}

	this.updateObjects = function(object){
		if(object instanceof Level){
			board = object.level.board;
		}
		System.prototype.updateObjects.call(this, object);
	}

	this.handleEvent = function(e){

	}

	this.handleCommand = function(engine, c){
		if(this.acceptedCommands.includes(c.commandID)){
			switch(c.commandID){
				case command_move_entity:
					move(engine, board, c.entity, c.direction, this.objects);
					break;
				case command_roll_entity:
					roll(engine, board, c.entity, this.objects);
					break;
			}
		}
	}

	let move = function(engine, board, entity, direction, objects){
		let target = {
			x: entity.position.x,
			y: entity.position.y
		}
		switch (direction) {
			case action_move_up:
				target.y--;
				break;
			case action_move_right:
				target.x++;
				break;
			case action_move_down:
				target.y++;
				break;
			case action_move_left:
				target.x--;
				break;
			default:
				console.log("No direction");
				break;
		}

		let allowed = walkable(engine, target, entity, board, objects);

		if (allowed) {
			entity.direction.direction = action_to_direction[direction];
			if(entity.components.includes(component_sprint) && !entity.sprint.sprinting) {
				if(entity.sprint.moveCounter == entity.sprint.moveThreshold){
					entity.sprint.sprinting = true;
					engine.sendEvent({"eventID": event_player_startSprint});
				}
				else{
					entity.sprint.moveCounter++;
				}
			}

			entity.position.x = target.x;
			entity.position.y = target.y;

			if(entity instanceof Player) {
				engine.sendEvent({"eventID": event_player_moved, "entity": entity});
			}

			let eventID = event_entity_moved;
			if(entity.sprint.sprinting){eventID = event_entity_sprinted;}

			engine.sendEvent({"eventID": eventID, "entity": entity, "direction": direction});

		}
	}

	let roll = function(engine, board, entity, objects){
		let t1 = {
			x: entity.position.x,
			y: entity.position.y
		}, t2 = {
			x: entity.position.x,
			y: entity.position.y
		}

		switch (entity.direction.direction) {
			case direction_up:
				t1.y -= 2;
				t2.y -= 1;
				break;
			case direction_right:
				t1.x += 2;
				t2.x += 1;
				break;
			case direction_down:
				t1.y += 2;
				t2.y += 1;
				break;
			case direction_left:
				t1.x -= 2;
				t2.x -= 1;
				break;
			default:
				console.log("No direction");
				break;
		}

		let t1Allowed = walkable(engine, t1, entity, board, objects);
		let t2Allowed = walkable(engine, t2, entity, board, objects);

		if (t2Allowed) {
			let eventID;
			if(t1Allowed){
				entity.position.x = t1.x;
				entity.position.y = t1.y;
				eventID = event_entity_rolled;	
			}
			else{
				entity.position.x = t2.x;
				entity.position.y = t2.y;
				eventID = event_entity_failed_roll;	
			}

			if(entity instanceof Player) {
				engine.sendEvent({"eventID": event_player_moved, "entity": entity});
			}

			engine.sendEvent({"eventID": eventID, "entity": entity, "direction": direction});

		}
		else {engine.sendEvent({"eventID": event_entity_failed_roll, "entity": entity, "direction": direction});}
	}

	let walkable = function(engine, target, entity, board, objects){
		if(target.x > 0 && target.x < CONFIG.DUNGEON_SIZE && target.y > 0 && target.y < CONFIG.DUNGEON_SIZE){
			let square = board[target.x][target.y];
			for(let o of objects){
				if(o.position.x == target.x && o.position.y == target.y && o.physical.solid){
					return false;
				}
			}
			if(square instanceof StairSquare && entity instanceof Player){
				if(square.up){
					engine.sendEvent('eventID: event_up_level');
					engine.sendCommand('commandID: command_update_level');
				}
				else{
					engine.sendCommand('commandID: command_generate_level');
					engine.sendEvent('eventID: event_down_level');
					engine.sendCommand('commandID: command_update_level');
				}
				return true;
			}
			if(square instanceof DoorSquare && (entity instanceof Player || square.opened)){
				square.open();
				return true;
			}
			else if(!square.physical.solid){
				return true;
			}
		}
		return false;
	}
}
