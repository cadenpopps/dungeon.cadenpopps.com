MovementSystem.prototype = Object.create(System.prototype);
function MovementSystem(){
	System.call(this);

	this.componentRequirements = [component_position, component_physical, component_actions];
	let map;
	let currentLevel = 0;

	this.run = function(engine){
		for(let o of this.objects){
			switch(o.actions.currentAction){
				case action_move_up: case action_move_right: case action_move_down: case action_move_left: case action_sprint_up: case action_sprint_right: case action_sprint_down: case action_sprint_left:
					move(engine, map, o, this.objects);
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
			map = object.map.map;
		}
		System.prototype.addObject.call(this, object);
	}

	let move = function(engine, map, entity, objects){
		let targetX = entity.position.x;
		let targetY = entity.position.y;

		switch (entity.actions.currentAction) {
			case action_move_up: case action_sprint_up:
				targetY--;
				break;
			case action_move_right: case action_sprint_right:
				targetX++;
				break;
			case action_move_down: case action_sprint_down:
				targetY++;
				break;
			case action_move_left: case action_sprint_left:
				targetX--;
				break;
			default:
				console.log("No direction");
				break;
		}

		entity.direction.direction = action_to_direction[entity.actions.currentAction];

		let walkable = true;

		for(let i = targetX; i < targetX + entity.physical.size; i++) {
			for(let j = targetY; j < targetY + entity.physical.size; j++) {
				walkable = Utility.walkable(i, j, map, entity, objects);
			}
		}

		if(walkable) {

			entity.position.x = targetX;
			entity.position.y = targetY;

			if(entity instanceof Player) {
				playerWalkEvents(engine, entity, map[targetX][targetY]);
			}

			engine.sendEvent(event_successful_action, entity);

		}
		else{
			entity.actions.lastAction = entity.actions.currentAction;
			entity.actions.currentAction = action_none;
			//handle
		}
	}

	let playerWalkEvents = function(engine, player, square){
		if(square instanceof StairUpSquare && currentLevel > 0){
			engine.sendEvent(event_up_level); 
		}
		else if(square instanceof StairDownSquare) {
			engine.sendEvent(event_down_level); 
		}
		else if(square instanceof DoorSquare){
			square.open();
		}
		engine.sendEvent(event_player_moved);
	}
}
