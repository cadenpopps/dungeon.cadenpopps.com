class MovementSystem extends GameSystem {

	constructor() {
		super([component_position, component_collision, component_actions]);
	}

	init() {
		this.movementFrozen = true;
	}

	run(engine) {
		if(!this.movementFrozen) {
			for(let entity of this.objects) {
				switch(entity.actions.currentAction) {
					case action_move_up: case action_move_right: case action_move_down: case action_move_left:
						this.moveFromAction(engine, entity, this.objects);
						break;
				}
			}
		}
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_level_loaded:
				let player = engine.getPlayer();
				if(player.depth.depth <= engine.getDepth()) {
					this.fixPlayerPosition(player, data.stairUp);
				}
				else if(player.depth.depth > engine.getDepth()) {
					this.fixPlayerPosition(player, data.stairDown);
				}
				player.depth.depth = engine.getDepth();
				break;
			case event_up_level: case event_down_level:
				this.movementFrozen = true;
				break;
			case event_begin_level:
				this.movementFrozen = false;
				break;
		}
	}

	fixPlayerPosition(player, stair) {
		player.position.x = stair.x;
		player.position.y = stair.y;
		player.collision.top = stair.y;
		player.collision.right = stair.x + player.collision.width;
		player.collision.bottom = stair.y + player.collision.height;
		player.collision.left = stair.x;
	}

	move(engine, entity, objects, destination) {
		if(destination != undefined && MovementSystem.validMove(engine, entity, destination)) {
			entity.direction.direction = action_to_direction[entity.actions.currentAction];
			entity.position.x = destination.x;
			entity.position.y = destination.y;

			entity.collision.top = destination.y;
			entity.collision.right = destination.x + entity.collision.width;
			entity.collision.bottom = destination.y + entity.collision.height;
			entity.collision.left = destination.x;

			engine.sendEvent(event_successful_action, {'action': entity.actions.currentAction, 'entity': entity });
			return true;
		}
		else {
			entity.direction.direction = action_to_direction[entity.actions.currentAction];
			entity.actions.lastAction = entity.actions.currentAction;
			entity.actions.currentAction = action_none;
			return false;
		}
	}

	moveFromAction(engine, entity, objects) {
		let destination = MovementSystem.getDestination(entity, entity.actions.currentAction);
		if(this.move(engine, entity, objects, destination)) {
			if(entity instanceof Player) {
				this.playerWalkEvents(engine, entity);
			}
			else if(entity instanceof Mob) {
				engine.sendEvent(event_entity_moved);
			}
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
		for(let i = destination.x; i < destination.x + entity.collision.width; i++) {
			for(let j = destination.y; j < destination.y + entity.collision.height; j++) {
				if(!Utility.walkable(i, j, engine.getMap(), entity, engine.getEntities())) {
					validMove = false;
				}
			}
		}
		return validMove;
	}
}
