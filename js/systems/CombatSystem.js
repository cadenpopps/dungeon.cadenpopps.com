CombatSystem.prototype = Object.create(System.prototype);
function CombatSystem (){
	System.call(this);

	this.componentRequirements = [component_combat];

	const COMBAT_TIMER = 30;

	let player;
	let inCombat = false;

	this.run = function(engine){
		for(let entity of this.objects){
			switch(entity.actions.currentAction){
				case action_melee_attack_up: case action_melee_attack_right: case action_melee_attack_down: case action_melee_attack_left: 
					meleeAttackFront(engine, entity, this.objects);
					break;
				case action_melee_attack_spin:
					meleeAttackCircle(engine, entity, this.objects);
					break;
			}
		}

		if(checkStillInCombat(player, this.objects)){
			beginCombat(engine);
		}
		else {
			endCombat(engine);
		}
	}

	let beginCombat = function(engine){
		if(!inCombat) {
			engine.sendEvent(event_begin_combat);
			inCombat = true;
		}
	}

	let endCombat = function(engine){
		if(inCombat) {
			engine.sendEvent(event_end_combat);
			inCombat = false;
		}
	}

	let checkStillInCombat = function(player, objects) {
		for(let o of objects) {
			if(o instanceof Mob && o.display.discovered && (o.display.visible || Utility.entityWithinRange(player, o, 10))) {
				return true;
			}
		}
		return false;
	}

	let meleeAttackFront = function(engine, entity, objects){
		for(let o of objects){
			let dir = entityInFront(entity, o);
			if(dir != -1){
				entity.direction.direction = dir;
				entity.actions.currentAction = direction_to_attack[dir];
				let healthLost = max(0, (entity.combat.meleeAttackPower * 1.5) - o.combat.meleeDefensePower);
				engine.sendEvent(event_entity_take_damage, { "object": o, "healthLost": healthLost });
				engine.sendEvent(event_successful_action, entity);
				beginCombat(engine);
				return;
			}
		}
	}

	let entityInFront = function(entity, otherEntity){
		if (entity.position.y == otherEntity.position.y + 1 && entity.position.x == otherEntity.position.x){
			return direction_up;
		}
		else if (entity.position.x == otherEntity.position.x - 1 && entity.position.y == otherEntity.position.y) {
			return direction_right;
		}
		else if (entity.position.y == otherEntity.position.y - 1 && entity.position.x == otherEntity.position.x) {
			return direction_down;
		}
		else if (entity.position.x == otherEntity.position.x + 1 && entity.position.y == otherEntity.position.y) {
			return direction_left;
		}
		else {
			return -1;
		}
	}

	let meleeAttackCircle = function(engine, entity, objects){
		let targets = [];
		for(let o of objects){
			if(entityAround(entity, o)){
				targets.push(o);
			}
		}
		if(targets.length > 0){
			for(let o of targets){
				let healthLost = max(0, entity.combat.meleeAttackPower - o.combat.meleeDefensePower);
				engine.sendEvent(event_entity_take_damage, { "object": o, "healthLost": healthLost });
			}
			engine.sendEvent(event_successful_action, entity);
			beginCombat(engine);
		}
	}

	let entityAround = function(entity, otherEntity){
		return entity != otherEntity && abs(entity.position.x - otherEntity.position.x) <= 1 && abs(entity.position.y - otherEntity.position.y) <= 1;
	}

	this.handleEvent = function(engine, eventID, data){
		switch(eventID){ }
	}

	this.addObject = function(object){
		if(object instanceof Player) { player = object; }
		System.prototype.addObject.call(this, object);
	}
}
