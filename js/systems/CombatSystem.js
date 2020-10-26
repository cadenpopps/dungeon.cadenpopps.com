class CombatSystem extends GameSystem {

	constructor(config) {
		super([component_combat]);
		this.config = config;
	}

	init(engine) {
		this.inCombat = false;
		this.combatTimer = 0;
	}

	run(engine) {
		if(this.combatTimer > 0) {
			this.combatTimer--;
			if(this.combatTimer == 0) {
				engine.sendEvent(event_end_combat);
			}
		}
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_melee_ability:
				this.meleeAttack(engine, data.entity, data.target, data.ability);
				this.resetCombatTimer(engine);
				break;
			case event_melee_ability:
				this.meleeAttack(engine, data.entity, data.target, data.ability);
				this.resetCombatTimer(engine);
				break;
		}
	}

	resetCombatTimer(engine) {
		if(this.combatTimer == 0) {
			engine.sendEvent(event_begin_combat);
		}
		this.combatTimer = this.config.COMBAT_TIMER;
	}

	determineAttackDirection(entity, objects) {
		for(let o of objects) {
			let dir = Utility.entityAdjacent(entity, o);
			if(dir !== -1) {
				return dir;
			}
		}
		return -1;
	}

	meleeAttack(engine, entity, target, ability) {
		let healthLost = max(0, entity.combat.attackDamage - target.combat.armor);
		engine.sendEvent(event_entity_take_damage, {'entity': target, 'healthLost': healthLost });
		// this.beginCombat(engine);
		return;
	}

	spinAttack(engine, entity, objects) {
		let targets = [];
		for(let o of objects) {
			if(entity != o && this.entityAround(entity, o)) {
				targets.push(o);
			}
		}
		if(targets.length > 0) {
			if(entity instanceof Player) {
				engine.sendEvent(event_player_spin_attack);
			}
			for(let o of targets) {
				let healthLost = max(0, entity.combat.meleeAttackPower - o.combat.meleeDefensePower);
				engine.sendEvent(event_entity_attacked, { 'attacker': entity, 'target': o, 'healthLost': healthLost });
			}
			engine.sendEvent(event_successful_action, { 'action': entity.actions.currentAction, 'entity': entity });
			this.beginCombat(engine);
		}
	}

	entityAround(entity, otherEntity) {
		return Utility.collision(new CollisionComponent(entity.position.x - 1, entity.position.y - 1, 3), otherEntity.collision);
	}

	static validMeleeAttack(engine, entity) {
		for(let o of engine.getEntities()) {
			if(entity != o) {
				if(Utility.entityAdjacent(entity, o) != -1) {
					return true;
				}
			}
		}
		return false;
	}
}
