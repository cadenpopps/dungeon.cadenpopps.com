CombatSystem.prototype = Object.create(System.prototype);
function CombatSystem (){
	System.call(this);

	this.componentRequirements = [component_combat];

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
	}

	let meleeAttackFront = function(engine, entity, objects){
		for(let o of objects){
			if(entityInFront(entity, o)){
				let healthLost = max(0, (entity.combat.meleeAttackPower * 1.5) - o.combat.meleeDefensePower);
				engine.sendEvent(event_entity_take_damage, { "object": o, "healthLost": healthLost });
				engine.sendEvent(event_successful_action, entity);
			}
		}
	}

	let entityInFront = function(entity, otherEntity){
		switch(entity.direction.direction){
			case direction_up:
				return (entity.position.y == otherEntity.position.y + 1 && entity.position.x == otherEntity.position.x);
			case direction_right:
				return (entity.position.x == otherEntity.position.x - 1 && entity.position.y == otherEntity.position.y);
			case direction_down:
				return (entity.position.y == otherEntity.position.y - 1 && entity.position.x == otherEntity.position.x);
			case direction_left:
				return (entity.position.x == otherEntity.position.x + 1 && entity.position.y == otherEntity.position.y);
			default:
				console.log("Cannot determine direction of " + entity);
				break;
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
		}
	}

	let entityAround = function(entity, otherEntity){
		return entity != otherEntity && abs(entity.position.x - otherEntity.position.x) <= 1 && abs(entity.position.y - otherEntity.position.y) <= 1;
	}

	this.handleEvent = function(engine, eventID, data){
		switch(eventID){ }
	}

	this.addObject = function(object){
		System.prototype.addObject.call(this, object);
	}
}
