class MovementSystem extends System {

	constructor() {
		super([component_position, component_physical, component_actions]);
	}

	run(engine) {
		for(let entity of this.objects) {
			switch(entity.actions.currentAction) {
				case action_move_up: case action_move_right: case action_move_down: case action_move_left:
					this.move(engine, entity, this.objects);
					break;
			}
		}
	}

	handleEvent(engine, eventID) {
		// switch(eventID) { }
	}

	addObject(object) {
		super.addObject(object);
	}

	move(engine, entity, objects) {
		let destination = MovementSystem.getDestination(entity, entity.actions.currentAction);
		if(destination != undefined && MovementSystem.validMove(engine, entity, destination)) {
			entity.direction.direction = action_to_direction[entity.actions.currentAction];
			entity.position.x = destination.x;
			entity.position.y = destination.y;

			entity.collision.top = destination.y;
			entity.collision.right = destination.x + entity.physical.size;
			entity.collision.bottom = destination.y + entity.physical.size;
			entity.collision.left = destination.x;

			if(entity instanceof Player) {
				this.playerWalkEvents(engine, entity);
			}
			else if(entity instanceof Mob) {
				engine.sendEvent(event_entity_moved);
			}

			engine.sendEvent(event_successful_action, {'action': entity.actions.currentAction, 'entity': entity });

		}
		else {
			entity.actions.lastAction = entity.actions.currentAction;
			entity.actions.currentAction = action_none;
		}
	}

	playerWalkEvents(engine, player) {
		let square = engine.getMap()[player.position.x][player.position.y];
		if(square instanceof StairUpSquare && engine.getDepth() > 0) {
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

	static getDestination(entity, movement) {
		switch (movement) {
			case action_move_up:
				return new PositionComponent(entity.position.x, entity.position.y - 1);
			case action_move_right:
				return new PositionComponent(entity.position.x + 1, entity.position.y);
			case action_move_down:
				return new PositionComponent(entity.position.x, entity.position.y + 1);
			case action_move_left:
				return new PositionComponent(entity.position.x - 1, entity.position.y);
			default:
				console.log('No direction');
				return undefined;
		}
	}

	static validMove(engine, entity, destination) {
		let validMove = true;
		for(let i = destination.x; i < destination.x + entity.physical.size; i++) {
			for(let j = destination.y; j < destination.y + entity.physical.size; j++) {
				if(!Utility.walkable(i, j, engine.getMap(), entity, engine.getEntities())) {
					validMove = false;
				}
			}
		}
		return validMove;
	}
}
