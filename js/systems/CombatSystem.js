class CombatSystem extends System {

	constructor() {
		super([component_combat]);

		this.player;
		this.inCombat = false;
		this.combatTimer = 0;
		this.combatTimerMax = 30;
	}

	run(engine) {
		for(let entity of this.objects) {
			switch(entity.actions.currentAction) {
				case action_melee_attack:
					this.determineAttackDirection(entity, this.objects);
					this.meleeAttack(engine, entity, this.objects);
					break;
				case action_melee_attack_up: case action_melee_attack_right: case action_melee_attack_down: case action_melee_attack_left:
					this.meleeAttack(engine, entity, this.objects);
					break;
				case action_spin_attack:
					this.spinAttack(engine, entity, this.objects);
					break;
			}
		}

		if(this.inCombat) {
			if(!this.checkInCombat(this.player, this.objects)) {
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
			if(this.checkInCombat(this.player, this.objects)) {
				this.beginCombat(engine);
			}
		}
	}

	handleEvent(engine, eventID, data) { }

	addObject(object) {
		if(object instanceof Player) { this.player = object; }
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
			if(o instanceof Mob && o.display.visible) {
				return true;
			}
		}
		return false;
	}

	determineAttackDirection(entity, objects) {
		for(let o of objects) {
			let dir = Utility.entityAdjacent(entity, o);
			if(dir != -1) {
				entity.direction.direction = dir;
				entity.actions.currentAction = direction_to_attack[dir];
			}
		}
	}

	meleeAttack(engine, entity, objects) {
		for(let o of objects) {
			if(entity != o) {
				let target = Utility.getPositionInFrontOf(entity);
				if(Utility.collision(new CollisionComponent(target.x, target.y, entity.physical.size), o.collision)) {
					let healthLost = max(0, (entity.combat.meleeAttackPower * 1.5) - o.combat.meleeDefensePower);
					if(entity instanceof Player) {
						engine.sendEvent(event_player_melee_attack);
					}
					engine.sendEvent(event_entity_take_damage, { 'object': o, 'healthLost': healthLost });
					engine.sendEvent(event_successful_action, { 'action': entity.actions.currentAction, 'entity': entity });
					this.beginCombat(engine);
					return;
				}
			}
		}
	}

	spinAttack(engine, entity, objects) {
		let targets = [];
		for(let o of objects) {
			if(entity != o && this.entityAround(entity, o)) {
				targets.push(o);
			}
		}
		if(targets.length > 0) {
			for(let o of targets) {
				let healthLost = max(0, entity.combat.meleeAttackPower - o.combat.meleeDefensePower);
				engine.sendEvent(event_entity_take_damage, { 'object': o, 'healthLost': healthLost });
			}
			if(entity instanceof Player) {
				engine.sendEvent(event_player_spin_attack);
			}
			engine.sendEvent(event_successful_action, { 'action': entity.actions.currentAction, 'entity': entity });
			this.beginCombat(engine);
		}
	}

	entityAround(entity, otherEntity) {
		return Utility.collision(new CollisionComponent(entity.position.x - 1, entity.position.y - 1, 3), otherEntity.collision);
	}
}
