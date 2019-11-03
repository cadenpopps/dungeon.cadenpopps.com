class AISystem extends System {

	constructor() {
		super([component_ai]);

		this.player;
	}

	run(engine) {
		for(let entity of this.objects) {
			if(Utility.entityDistance(entity, this.player) < entity_active_range) {
				entity.actions.nextAction = this.determineAction(entity, this.player);
			}
		}
	}

	handleEvent(engine, eventID, data) { }

	addObject(object) {
		if(object instanceof Player) { this.player = object; }
		else{ super.addObject(object); }
	}

	determineAction(entity, player) {
		if(Utility.entityDistance(entity, player) <= entity.ai.attackRange) {
			return this.getAttackAction(entity, player);
		}
		else{
			return this.getMoveCloserAction(entity, player);
		}
	}

	getAttackAction(entity, player) {
		let dir = Utility.getDirectionToEntity(entity, player);
		entity.direction.direction = dir;
		return direction_to_attack[dir];
	}

	getMoveCloserAction(entity, player) {
		return direction_to_movement[Utility.getDirectionToEntity(entity, player)];
	}
}
