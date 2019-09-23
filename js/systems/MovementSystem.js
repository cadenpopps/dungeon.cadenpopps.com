
MovementSystem.prototype = Object.create(System.prototype);
function MovementSystem(){
	System.call(this);

	this.componentRequirements = [component_position, component_physical, component_actions];
	let currentLevel = 0;
	let board;

	this.run = function(engine){
		for(let o of this.objects){
			switch(o.actions.currentAction){
				case action_move_up: case action_move_right: case action_move_down: case action_move_left:
					move(engine, board, o, this.objects);
					break;
			}
		}
	}

	this.handleEvent = function(engine, eventID){
		switch(eventID){
			case event_up_level:
				currentLevel--;
				break;
			case event_down_level:
				currentLevel++;
				break;
		}
	}

	this.addObject = function(object){
		if(object instanceof Level){
			board = object.level.board;
		}
		System.prototype.addObject.call(this, object);
	}

	let move = function(engine, board, entity, objects){
		let target = {
			x: entity.position.x,
			y: entity.position.y
		}
		switch (entity.actions.currentAction) {
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

		let allowed = currentlyWalkable(board[target.x][target.y], entity, objects);

		if (allowed) {
			entity.direction.direction = action_to_direction[direction];
			if(entity.components.includes(component_sprint) && !entity.sprint.sprinting) {
				if(entity.sprint.moveCounter == entity.sprint.moveThreshold){
					entity.sprint.sprinting = true;
				}
				else{
					entity.sprint.moveCounter++;
				}
			}

			entity.position.x = target.x;
			entity.position.y = target.y;

			entity.animation.newAnimation = true;
			entity.animation.animation = action_to_animation[entity.actions.currentAction];
			if(entity instanceof Player) {
				playerWalkEvents(engine, board[target.x][target.y]);
			}
		}
		else{
			entity.actions.busy = 0;
			entity.actions.cooldowns[entity.actions.currentAction] = 0;
		}
		entity.actions.lastAction = entity.actions.currentAction;
		entity.actions.currentAction = action_none;
	}

	let roll = function(engine, board, entity, direction, objects){
		let t1 = {
			x: entity.position.x,
			y: entity.position.y
		}, t2 = {
			x: entity.position.x,
			y: entity.position.y
		}

		switch (direction) {
			case action_roll_up:
				t1.y -= 2;
				t2.y -= 1;
				break;
			case action_roll_right:
				t1.x += 2;
				t2.x += 1;
				break;
			case action_roll_down:
				t1.y += 2;
				t2.y += 1;
				break;
			case action_roll_left:
				t1.x -= 2;
				t2.x -= 1;
				break;
			default:
				console.log("No direction");
				break;
		}

		let t1Allowed = currentlyWalkable(board[t1.x][t1.y], entity, objects);
		let t2Allowed = currentlyWalkable(board[t2.x][t2.y], entity, objects);

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
				playerWalkEvents(engine, board[t1.x][t1.y]);
				playerWalkEvents(engine, board[t2.x][t2.y]);
				// engine.sendEvent({"eventID": event_player_moved, "entity": entity});
			}

			// engine.sendEvent({"eventID": eventID, "entity": entity, "direction": direction});

		}
		else {
			engine.sendEvent({"eventID": event_entity_failed_roll, "entity": entity, "direction": direction});
		}
	}

	let currentlyWalkable = function(square, entity, objects){
		return squareInBounds(square) && squareIsWalkable(square, entity) && !squareIsOccupied(square, objects);
	}

	let squareInBounds = function(square){
		return square.position.x >= 0 && square.position.x < CONFIG.DUNGEON_SIZE && square.position.y >= 0 && square.position.y < CONFIG.DUNGEON_SIZE;
	}

	let squareIsWalkable = function(square, entity){
		return (entity instanceof Player) ? playerWalkable(square) : mobWalkable(square);
	}

	let playerWalkable = function(square){
		return (!square.physical.solid || square instanceof DoorSquare || square instanceof StairSquare);
	}

	let mobWalkable = function(square){
		return !(square.physical.solid);
	}

	let squareIsOccupied = function(square, objects){
		for(let o of objects){
			if(o.position.x == square.position.x && o.position.y == square.position.y && o.physical.solid){
				return true;
			}
		}
		return false;
	}

	let playerWalkEvents = function(engine, square){
		if(square instanceof StairSquare){
			if(square.up && currentLevel > 0){ 
				engine.clearObjects();
				engine.sendEvent(event_up_level); 
			}
			else if(!square.up) {
				engine.clearObjects();
				engine.sendEvent(event_down_level); 
			}
		}
		else if(square instanceof DoorSquare){
			square.open();
		}
		engine.sendEvent(event_player_moved);
	}
}
