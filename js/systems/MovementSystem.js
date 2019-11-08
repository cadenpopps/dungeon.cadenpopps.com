class MovementSystem extends System {

	constructor() {
		super([component_position, component_physical, component_actions]);
		this.map;
		this.depth = 0;
	}

	run(engine) {
		for(let o of this.objects) {
			switch(o.actions.currentAction) {
				case action_move_up: case action_move_right: case action_move_down: case action_move_left:
					this.move(engine, this.map, o, this.objects);
					break;
			}
		}
	}

	handleEvent(engine, eventID) {
		switch(eventID) {
			case event_up_level:
				this.depth--;
				break;
			case event_down_level:
				this.depth++;
				break;
		}
	}

	addObject(object) {
		if(object instanceof Level) {
			this.map = object.map.map;
		}
		else {
			super.addObject(object);
		}
	}

	static move(entity, position) {
		entity.position.x = position.x;
		entity.position.y = position.y;
		entity.collision.top = position.y;
		entity.collision.right = position.x + entity.collision.width;
		entity.collision.bottom = position.y + entity.collision.height;
		entity.collision.left = position.x;
	}

	move(engine, map, entity, objects) {
		let target = new PositionComponent(entity.position.x, entity.position.y);

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
				console.log('No direction');
				break;
		}

		entity.direction.direction = action_to_direction[entity.actions.currentAction];

		let walkable = true;

		for(let i = target.x; i < target.x + entity.physical.size; i++) {
			for(let j = target.y; j < target.y + entity.physical.size; j++) {
				if(!Utility.walkable(i, j, map, entity, objects)) {
					walkable = false;
				}
			}
		}

		// if(entity instanceof Player) {
		// 	console.log(map[target.x][target.y]);
		// }

		if(walkable) {
			MovementSystem.move(entity, target);

			if(entity instanceof Player) {
				this.playerWalkEvents(engine, entity, map[target.x][target.y]);
			}

			engine.sendEvent(event_successful_action, { 'action': entity.actions.currentAction, 'entity': entity });

		}
		else{
			entity.actions.lastAction = entity.actions.currentAction;
			entity.actions.currentAction = action_none;
			//handle
		}
	}

	playerWalkEvents(engine, player, square) {
		if(square instanceof StairUpSquare && this.depth > 0) {
			engine.sendEvent(event_up_level);
		}
		else if(square instanceof StairDownSquare) {
			engine.sendEvent(event_down_level);
		}
		else {
			if(square instanceof DoorSquare) {
				square.open();
			}
			engine.sendEvent(event_player_moved);
		}
	}
}
