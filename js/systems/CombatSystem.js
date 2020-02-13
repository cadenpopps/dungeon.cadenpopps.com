class CombatSystem extends System {

	constructor() {
		super([component_combat]);
	}

	init(engine) {
		this.inCombat = false;
		this.combatTimer = 0;
		this.combatTimerMax = 30;
	}

	run(engine) {
		for(let entity of this.objects) {
			switch(entity.actions.currentAction) {
				// case action_melee_attack:
				// 	this.fixAttackDirection(entity, this.objects);
				// 	this.meleeAttack(engine, entity, this.objects);
				// 	break;
				// case action_melee_attack_up: case action_melee_attack_right: case action_melee_attack_down: case action_melee_attack_left:
				// 	this.meleeAttack(engine, entity, this.objects);
				// 	break;
				// case action_spin_attack:
				// 	this.spinAttack(engine, entity, this.objects);
				// 	break;
			}
		}

		if(this.inCombat) {
			if(!this.checkInCombat(engine.getPlayer(), this.objects)) {
				this.combatTimer--;
				if(this.combatTimer == 0) {
					this.endCombat(engine);
				}
			}
			else {
				this.resetCombatTimer();
			}
		}
		else {
			if(this.checkInCombat(engine.getPlayer(), this.objects)) {
				this.beginCombat(engine);
			}
		}
	}

	handleEvent(engine, eventID, data) { }

	addObject(object) {
		super.addObject(object);
	}

	resetCombatTimer() {
		this.combatTimer = this.combatTimerMax;
	}

	beginCombat(engine) {
		if(!this.inCombat) {
			engine.sendEvent(event_begin_combat);
			this.resetCombatTimer();
			this.inCombat = true;
		}
	}

	endCombat(engine) {
		if(this.inCombat) {
			engine.sendEvent(event_end_combat);
			this.inCombat = false;
		}
	}

	checkInCombat(player, objects) {
		for(let o of objects) {
			if(o instanceof Mob && o.ai.noticedPlayer && o.display.visible) {
				return true;
			}
		}
		return false;
	}

	fixAttackDirection(entity, objects) {
		for(let o of objects) {
			let dir = Utility.entityAdjacent(entity, o);
			if(dir !== -1) {
				return dir;
			}
		}
		return -1;
	}

	meleeAttack(engine, entity, objects) {
		for(let o of objects) {
			if(entity != o) {
				if(Utility.collision(Utility.getCollisionInFrontOf(entity), o.collision)) {
					let healthLost = max(0, (entity.combat.meleeAttackPower * 1.5) - o.combat.meleeDefensePower);
					if(entity instanceof Player) {
						engine.sendEvent(event_player_melee_attack);
					}
					engine.sendEvent(event_entity_attacked, { 'attacker': entity, 'target': o, 'healthLost': healthLost });
					engine.sendEvent(event_successful_action, { 'action': entity.actions.currentAction, 'entity': entity });
					this.beginCombat(engine);
					return;
				}
			}
		}
		engine.sendEvent(event_failed_action, { 'action': entity.actions.currentAction, 'entity': entity });
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
